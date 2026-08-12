# -*- coding: utf-8 -*-
"""
解析「去重后的构件库」全部 BIMBase 参数化构件脚本，
抽取元数据（编号/名称/房间/运行环境/完整参数表），
并生成带真实参数支撑的详细介绍，输出为 Next.js 可用的 TS 数据文件。
"""
import os, re, json, io

SRC = r"D:\ASUS\Downloads\去重后的构件库 - 副本\去重后的构件库 - 副本"
OUT_TS = r"D:\WorkBuddy\zhijuhuinao\lib\component-library.ts"

# ---------- 工具：平衡括号 ----------
def balanced(text, start):
    """从 text[start] 处的 '(' 开始，返回匹配的右括号索引。"""
    assert text[start] == '('
    depth = 0
    i = start
    while i < len(text):
        if text[i] == '(':
            depth += 1
        elif text[i] == ')':
            depth -= 1
            if depth == 0:
                return i
        i += 1
    return -1

def split_top(text):
    """按顶层逗号切分（忽略括号内逗号），返回片段列表。"""
    parts, depth, cur = [], 0, []
    for ch in text:
        if ch in '([{':
            depth += 1; cur.append(ch)
        elif ch in ')]}':
            depth -= 1; cur.append(ch)
        elif ch == ',' and depth == 0:
            parts.append(''.join(cur).strip()); cur = []
        else:
            cur.append(ch)
    if ''.join(cur).strip():
        parts.append(''.join(cur).strip())
    return parts

def first_str(token):
    m = re.search(r"""['"]([^'"]*)['"]""", token)
    return m.group(1) if m else ''

def fmt_val(token):
    t = token.strip()
    if t.startswith('"') or t.startswith("'"):
        return t[1:-1]
    if t in ('True', 'False', 'None'):
        return {'True': '是', 'False': '否', 'None': '—'}[t]
    return t

def fmt_list(token):
    t = token.strip()
    if not (t.startswith('[') and t.endswith(']')):
        return []
    inner = t[1:-1].strip()
    if not inner:
        return []
    return [fmt_val(x) for x in split_top(inner)]

# ---------- 关键字黑名单（非用户可调参数） ----------
BLACK = {
    '构件编号', '构件名称', 'Device_ID', 'Category', 'Room_ID', 'Material',
    'BIM_Category', 'Elemment_ID', 'Element_ID', '模型', '茶杯', '客厅综合主中枢',
    'MOVIE_MODE', 'SLEEP_MODE', 'PARTY_MODE', 'Scent_Mode', 'Light_Mode',
    'Working_Status', 'BIM_Category', '构件ID', '构件编码', 'Component_ID',
}
CJK_RE = re.compile(r'[一-鿿]')
# 个别英文但确为真实可调的参数（放行）
ALLOW_ENGLISH = {'Liquid_Level'}
def is_real_param(name, default):
    if name in BLACK:
        return False
    if '_ID' in name or name.endswith('ID'):
        return False
    if '接口' in name:
        return False
    if default == '—':  # None → 几何输出占位
        return False
    # 仅保留含中文的参数（真实可调参数均为中文）；IIoT 接口/遥测字段多为纯英文，剔除
    if not CJK_RE.search(name) and name not in ALLOW_ENGLISH:
        return False
    return True

# ---------- 分类 ----------
def classify(name):
    n = name
    rules = [
        ('智能中枢', ['中枢', '网关', '边缘']),
        ('传感探测', ['传感器', '探测器', '存在', '水浸', '烟', '光传感']),
        ('照明灯具', ['灯', '灯具', '照明', '吊灯', '吸顶灯', '落地灯', '台灯', '氛围灯']),
        ('门窗幕墙', ['窗', '门', '墙', '移门', '推拉门', '折叠']),
        ('能源设备', ['光伏', '储能', '充电桩', '能源', '热泵', '能源区']),
        ('厨卫设备', ['厨房', '马桶', '水槽', '洗碗机', '冰箱', '微波', '洗衣机', '淋浴', '洗手台', '地漏', '热水器', '燃气灶', '油烟机', '岛台', '升降岛台', '晾衣', '扫地', '饮水', '机器人']),
        ('环境控制', ['空调', '窗帘', '净化', '新风', '排风', '暖风']),
        ('家具软装', ['沙发', '床', '椅', '桌', '柜', '茶几', '衣柜', '边柜', '地毯', '梳妆', '书桌', '工作站', '吧台']),
        ('景观庭院', ['竹', '树', '草', '亭', '桥', '花坛', '池塘', '草坪', '景观', '藤编', '庭院', '休闲', '假山', '菜畦']),
        ('娱乐休闲', ['游戏机', '麻将', '音箱', '电视', '茶几']),
        ('装饰摆件', ['玩偶', '茶杯', '绿植', '香薰', '熊', '企鹅', '猫']),
        ('楼梯结构', ['楼梯', '外墙', '夹层']),
    ]
    for cat, kws in rules:
        for kw in kws:
            if kw in n:
                return cat
    return '其他构件'

RULE_ORDER = ['智能中枢','传感探测','照明灯具','门窗幕墙','能源设备','厨卫设备',
              '环境控制','家具软装','景观庭院','娱乐休闲','装饰摆件','楼梯结构','其他构件']

# ---------- 房间推断 ----------
def infer_space(name, declared):
    if declared:
        return declared
    n = name
    if '主卧' in n: return '主卧'
    if '书房' in n: return '书房'
    if '厨房' in n: return '厨房'
    if '卫生' in n or '沐浴' in n or '淋浴' in n or '马桶' in n: return '卫生间'
    if '客厅' in n or '餐厅' in n or 'LDK' in n: return '客厅/餐厅'
    if '玄关' in n: return '玄关'
    if '阳台' in n or '家政' in n: return '家政/阳台'
    if '庭院' in n or '户外' in n or '景观' in n or '园' in n: return '庭院景观'
    if '中枢' in n or '网关' in n: return '全屋'
    if '窗' in n or '门' in n: return '通用空间'
    if '传感器' in n or '探测' in n: return '全屋'
    if '光伏' in n or '储能' in n or '充电' in n: return '能源区'
    return '全屋'

# ---------- 能力点（关键词→亮点） ----------
FEATURE_KW = [
    ('多页可视化主屏', ['显示页面', '总览', '场景页']),
    ('环境数据监测', ['温度', '湿度', 'PM', 'CO2', '空气质量', 'TVOC']),
    ('场景联动', ['场景', 'SCENE', '联动', '回家', '离家', '观影', '睡眠']),
    ('安防告警', ['烟', '感烟', '水浸', '漏水', '布防', '报警', '燃气']),
    ('人体存在感知', ['存在', '有人', '移动', '静止']),
    ('照明与色温调节', ['色温', '亮度', '照明', '灯光']),
    ('遮阳与通风', ['窗帘', '开窗', '通风', '移门']),
    ('能源与储能管理', ['光伏', '储能', '功率', '用电', '充电', '热泵']),
    ('家政与晾衣', ['晾衣', '洗衣', '烘干', '衣物']),
    ('参数化可调外观', ['宽度', '高度', '直径', '长度', '厚度', '颜色', '配色']),
    ('中枢接口对接', ['Device_ID', 'Room_ID', '接口']),
]

def features_from(params):
    names = ' '.join(p['name'] for p in params)
    out = []
    for label, kws in FEATURE_KW:
        if any(k in names for k in kws):
            out.append(label)
    return out

# ---------- 介绍生成 ----------
def build_summary(name, code, space, category, nparam):
    return f"{name}（编号 {code}）是{category}，面向{space}空间，是智居慧脑参数化构件库中的标准 BIMBase 构件。"

def build_description(name, code, space, category, params):
    n = len(params)
    # 能力句
    cap = []
    names = ' '.join(p['name'] for p in params)
    if any(k in names for k in ['温度','湿度','PM','CO2','空气质量']):
        cap.append('实时汇总室内温湿度、空气质量与环境舒适度')
    if any(k in names for k in ['场景','联动','回家','离家','观影','睡眠','SCENE']):
        cap.append('支持家庭场景一键联动与人工切换演示')
    if any(k in names for k in ['烟','水浸','漏水','布防','报警','燃气']):
        cap.append('内置安防与健康类状态监测，可触发告警级别')
    if any(k in names for k in ['色温','亮度','照明','灯光']):
        cap.append('对照明亮度、色温与照明场景进行参数化调节')
    if any(k in names for k in ['窗帘','开窗','移门','通风']):
        cap.append('可驱动遮阳、通风与开合类执行部件')
    if any(k in names for k in ['光伏','储能','功率','充电','热泵','用电']):
        cap.append('参与全屋能源与储能策略的可视化与调度')
    if any(k in names for k in ['洗衣','烘干','晾衣','衣物']):
        cap.append('对接阳台家政设备，联动洗烘与晾衣流程')
    if not cap:
        cap.append('在 BIMBase 中按属性驱动几何与状态外观')
    cap_s = '；'.join(cap) + '。'

    # 参数句
    show = [p['name'] for p in params][:8]
    param_s = f"构件共内置 {n} 项可调参数，覆盖几何尺寸、安装方式、外观配色与智能联动，典型如：{'、'.join(show)} 等，均可在 BIMBase 属性面板中实时调整。"
    return f"{name}（编号 {code}）是面向{space}的{category}构件。{cap_s}{param_s}所有参数均由属性（Attr）驱动，几何算法保持参数化一致，适用于方案比选、户型布置与智能场景演示。"

# ---------- 解析单文件 ----------
def parse_file(path, fname):
    with open(path, 'r', encoding='utf-8', errors='ignore') as f:
        text = f.read()
    if 'Component' not in text or ('Attr' not in text and '_set_parameter' not in text):
        return None

    def clean_name_field(raw):
        if not raw:
            return ''
        segs = re.split(r'[｜|]', raw)
        cands = [s.strip() for s in segs
                 if s.strip() and 'BIMBase' not in s
                 and '构件库' not in s and '参数化构件库' not in s]
        return cands[-1] if cands else segs[-1].strip()

    # 元信息：构件编号
    code = ''
    m = re.search(r'构件编号[：:]\s*([A-Za-z0-9\-_]+)', text)
    if not m:
        m = re.search(r'构件编码[：:]\s*([A-Za-z0-9\-_]+)', text)
    if not m:
        m = re.search(r'self\[\s*["\']构件编号["\']\s*\]\s*=\s*Attr\(\s*["\']([A-Za-z0-9\-_]+)', text)
    if not m:
        # 文件名前缀：C03-1_小熊玩偶 / A1智能香薰氛围灯
        pm = re.match(r'^([A-Za-z0-9][A-Za-z0-9.\-]*\d[_\-])', os.path.splitext(fname)[0])
        if pm:
            code = pm.group(1).rstrip('_-')
    if m: code = m.group(1)

    # 名称：构件名称字段 → 类定义（去版本号，排除库说明）→ 文档首行 → 文件名
    def clean_class(cn):
        cn = re.sub(r'[Vv]\d+(\.\d+)*$', '', cn).strip()
        cn = cn.replace('_', '')
        return cn

    name = ''
    m = re.search(r'构件名称[：:]\s*([^\n]+)', text)
    if not m:
        m = re.search(r'self\[\s*["\']构件名称["\']\s*\]\s*=\s*Attr\(\s*["\']([^"\']+)', text)
    if m:
        name = clean_name_field(m.group(1))
    if not name:
        dm = re.search(r'class\s+([A-Za-z0-9一-龥]+)\s*\(\s*Component\s*\)', text)
        if dm:
            cn = clean_class(dm.group(1))
            # 排除「库说明 / BIMBase」这类通用标题
            if '构件库' not in cn and 'BIMBase' not in cn:
                name = cn
    if not name:
        sm = re.search(r'"""(.*?)"""', text, re.S)
        if sm:
            first = sm.group(1).strip().splitlines()[0].strip() if sm.group(1).strip() else ''
            if '构件库' not in first and 'BIMBase' not in first:
                cm = re.match(r'^([A-Za-z]+\d[\w.\-]*)\s+', first)
                if cm:
                    if not code:
                        code = cm.group(1)
                    first = first[cm.end():].strip()
                first = re.sub(r'\s*[Vv]\d+(\.\d+)*\s*$', '', first).strip()
                first = re.sub(r'[（(][^）)]*[）)]\s*$', '', first).strip()
                if first:
                    name = first
    if not name:
        base = os.path.splitext(fname)[0]
        name = re.sub(r'^[A-Za-z0-9\-]+[_\-]', '', base) or base

    room = ''
    m = re.search(r'房间[：:]\s*([^\n|｜]+)', text)
    if m:
        room = m.group(1).strip().strip('｜|').strip()

    runtime = ''
    m = re.search(r'(?:运行环境|适用环境)[：:]\s*([^\n]+)', text)
    if m: runtime = m.group(1).strip()

    params = []
    seen = set()

    # 模式 A: self['X'] = Attr(...)
    for mm in re.finditer(r"self\[\s*['\"]([^'\"]+)['\"]\s*\]\s*=\s*Attr\s*\(", text):
        pname = mm.group(1)
        lp = balanced(text, mm.end() - 1)
        if lp < 0: continue
        body = text[mm.end():lp]
        args = split_top(body)
        if not args: continue
        default = fmt_val(args[0])
        # obvious ?
        obvious = True
        om = re.search(r'obvious\s*=\s*(True|False)', body)
        if om: obvious = (om.group(1) == 'True')
        if not obvious: continue
        if not is_real_param(pname, default): continue
        if pname in seen: continue
        seen.add(pname)
        group = ''
        gm = re.search(r"""group\s*=\s*['"]([^'"]*)['"]""", body)
        if gm: group = gm.group(1)
        combo = []
        cm = re.search(r'combo\s*=\s*(\[.*?\])', body)
        if cm: combo = fmt_list(cm.group(1))
        desc = ''
        dm = re.search(r'description\s*=\s*["\']([^"\']*)["\']', body)
        if dm: desc = dm.group(1)
        params.append({'name': pname, 'default': default, 'options': combo,
                       'group': group, 'desc': desc})

    # 模式 B: _set_parameter(self, "X", default, group, obvious, combo, desc)
    for mm in re.finditer(r'_set_parameter\s*\(', text):
        lp = balanced(text, mm.end() - 1)
        if lp < 0: continue
        body = text[mm.end():lp]
        args = split_top(body)
        if len(args) < 2: continue
        pname = first_str(args[1])
        if not pname: continue
        default = fmt_val(args[2]) if len(args) > 2 else '—'
        # 关键字覆盖
        om = re.search(r'obvious\s*=\s*(True|False)', body)
        obvious = (om.group(1) == 'True') if om else True
        if not obvious: continue
        if not is_real_param(pname, default): continue
        if pname in seen: continue
        seen.add(pname)
        group = first_str(args[3]) if len(args) > 3 else ''
        combo = []
        cm = re.search(r'combo\s*=\s*(\[.*?\])', body)
        if cm: combo = fmt_list(cm.group(1))
        desc = ''
        dm = re.search(r'description\s*=\s*["\']([^"\']*)["\']', body)
        if dm: desc = dm.group(1)
        params.append({'name': pname, 'default': default, 'options': combo,
                       'group': group, 'desc': desc})

    space = infer_space(name, room)
    category = classify(name)
    return {
        'code': code, 'name': name, 'space': space, 'category': category,
        'runtime': runtime, 'params': params,
        'summary': build_summary(name, code, space, category, len(params)),
        'description': build_description(name, code, space, category, params),
        'features': features_from(params),
    }

# ---------- 主流程 ----------
def main():
    files = [f for f in os.listdir(SRC) if f != '整理说明.txt']
    items = []
    for f in sorted(files):
        p = os.path.join(SRC, f)
        if not os.path.isfile(p): continue
        with open(p, 'r', encoding='utf-8', errors='ignore') as fh:
            text = fh.read()
        if 'Component' not in text: continue
        r = parse_file(p, f)
        if r: items.append(r)

    # 唯一 id
    used = {}
    for it in items:
        base = re.sub(r'[^A-Za-z0-9一-龥]', '', it['name'])[:12] or it['code'] or 'comp'
        if base in used:
            used[base] += 1
            base = f"{base}{used[base]}"
        else:
            used[base] = 0
        it['id'] = base

    # 缺失编号：按类别生成稳定目录编号，保证每个构件都有编号
    CAT_ABBR = {
        '智能中枢': 'HUB', '传感探测': 'SEN', '照明灯具': 'LIT',
        '门窗幕墙': 'DOF', '能源设备': 'NRG', '厨卫设备': 'KIT',
        '环境控制': 'ENV', '家具软装': 'FUR', '景观庭院': 'LND',
        '娱乐休闲': 'ENT', '装饰摆件': 'DEC', '楼梯结构': 'STR',
        '其他构件': 'MISC',
    }
    cnt = {}
    for it in items:
        if not it['code']:
            ab = CAT_ABBR.get(it['category'], 'X')
            cnt[ab] = cnt.get(ab, 0) + 1
            it['code'] = f"{ab}-{cnt[ab]:02d}"

    # 类别统计
    cats = {}
    for it in items:
        cats[it['category']] = cats.get(it['category'], 0) + 1
    cat_list = [c for c in RULE_ORDER if c in cats] + [c for c in cats if c not in RULE_ORDER]

    print(f"解析到构件数：{len(items)}")
    print("类别分布：", cats)
    no_param = [it['name'] for it in items if not it['params']]
    print("无参数构件：", no_param)
    print("其他构件明细：", [it['name'] for it in items if it['category'] == '其他构件'])
    print("合成编号数：", sum(1 for it in items if it['code'].startswith(tuple(CAT_ABBR.values()))))

    # 写 TS
    buf = io.StringIO()
    buf.write("// 本文件由 scripts/parse_components.py 自动生成，请勿手改。\n")
    buf.write("// 数据源：去重后的构件库（113 个 BIMBase 参数化构件）\n\n")
    buf.write("export interface LibParam {\n")
    buf.write("  name: string;\n  default: string;\n  options: string[];\n  group: string;\n  desc: string;\n}\n\n")
    buf.write("export interface LibComponent {\n")
    buf.write("  id: string;\n  code: string;\n  name: string;\n  category: string;\n  space: string;\n  runtime: string;\n  summary: string;\n  description: string;\n  features: string[];\n  paramCount: number;\n  params: LibParam[];\n}\n\n")
    buf.write("export const LIBRARY_CATEGORIES = " + json.dumps(cat_list, ensure_ascii=False) + " as const;\n\n")
    buf.write("export const COMPONENT_LIBRARY: LibComponent[] = [\n")
    for it in items:
        obj = {
            'id': it['id'], 'code': it['code'], 'name': it['name'],
            'category': it['category'], 'space': it['space'],
            'runtime': it['runtime'], 'summary': it['summary'],
            'description': it['description'], 'features': it['features'],
            'paramCount': len(it['params']), 'params': it['params'],
        }
        buf.write("  " + json.dumps(obj, ensure_ascii=False, indent=None) + ",\n")
    buf.write("];\n")

    with open(OUT_TS, 'w', encoding='utf-8') as f:
        f.write(buf.getvalue())
    print(f"\n已写出：{OUT_TS}")
    print(f"TS 文件大小：{os.path.getsize(OUT_TS)/1024:.1f} KB")

if __name__ == '__main__':
    main()
