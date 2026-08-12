// 生成 lib/data.ts —— 91 件构件，11 分类，24 件智能标记。
// 每件构件含：长描述 / 技术亮点 / 使用场景 / 安装说明 / 标签 / 关联构件。
// 运行：node scripts/gen-data.mjs
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "lib", "data.ts");

// 分类元信息（含视觉原型 device）
const categories = [
  { key: "living",  label: "客厅",   prefix: "LV", icon: "🛋️", device: "panel",
    desc: "会客、影音与家庭中枢的核心空间。",
    hl: ["磁吸快装，零开槽部署","参数化尺寸，适配 2.6–3.2m 层高","铝合金骨架，承重与质感兼顾","与中枢联动，场景一键触发","模块可单独更换，维护 ≤15min"],
    uc: ["朋友聚会环绕声场自动开启","观影模式联动窗帘与灯光","离家一键断电与布防","清晨自然光唤醒"],
    tags: ["会客","影音","家庭中枢"],
    inst: "客厅构件以装配式墙体与吊顶龙骨为基准面，磁吸快装、即插即用，无需现场开槽。" },
  { key: "bath",    label: "卫生间", prefix: "BA", icon: "🚿", device: "appliance",
    desc: "干湿分离与洁净健康的私密空间。",
    hl: ["IPX4 以上防水等级","防雾与恒温双保障","水电分离安全结构","易洁釉面与快拆滤网","与新风联动除湿"],
    uc: ["沐浴前预热与除雾","如厕久坐健康提醒","夜间起夜柔光引导","湿度超标自动换气"],
    tags: ["洁净","健康","干湿分离"],
    inst: "卫浴构件进场前完成水电点位预留，采用防水快装卡扣，干区湿区分别布线。" },
  { key: "kitchen", label: "厨房",   prefix: "KT", icon: "🍳", device: "appliance",
    desc: "高效烹饪与食材管理的操作空间。",
    hl: ["能效 1 级，长效节能","模块化嵌入，无缝台面","油烟与燃气安全联动","食材保鲜与净饮一体","自清洁与故障自检"],
    uc: ["炒菜自动强排 + 关火提醒","漏水/燃气泄漏自动关阀","食材临期提醒","备餐模式补光"],
    tags: ["高效","安全","嵌入"],
    inst: "厨房电器按 800/900mm 标准模数嵌入，燃气管线与电路分槽，预留中枢联动接口。" },
  { key: "bedroom", label: "主卧",   prefix: "BR", icon: "🛏️", device: "furniture",
    desc: "睡眠、收纳与放松的私享空间。",
    hl: ["睡眠节律自适应","遮光与隔音协同","零重力舒适结构","起夜无感柔光","与空调地暖联动"],
    uc: ["睡眠监测与鼾声干预","起床模式渐亮灯光","伴侣分区温控","夜间安防静默布防"],
    tags: ["睡眠","收纳","放松"],
    inst: "卧室以静音与遮光为优先，构件采用软包减振与磁吸遮光轨道，夜间联动柔光。" },
  { key: "wall",    label: "墙体",   prefix: "WT", icon: "🧱", device: "structure",
    desc: "装配式结构与布线一体的空间骨架。",
    hl: ["管线分离，零开槽","磁吸布线，即插即用","可拆改，复用率 92%","隔声 RW 45dB","与调光玻璃/声学模块组合"],
    uc: ["旧房快改零粉尘","智能化升级随插随用","声学房间隔断","展示墙集成照明"],
    tags: ["装配式","布线","可复用"],
    inst: "墙体系统在工厂预制饰面板与设备腔，现场干法拼装，管线分离，支持后期无损升级。" },
  { key: "dining",  label: "餐厅",   prefix: "DR", icon: "🍽️", device: "furniture",
    desc: "用餐与社交的温馨空间。",
    hl: ["伸缩结构，节地扩容","餐边集成水吧与收纳","氛围光随餐叙调节","易洁岩板台面","与厨房动线联动"],
    uc: ["聚餐模式暖光+背景乐","生日/节日场景一键","备餐补光","远程可视门铃提醒"],
    tags: ["用餐","社交","扩容"],
    inst: "餐厅家具以标准模数伸缩，餐边柜预留净饮与照明点位，与厨房中枢联动。" },
  { key: "kids",    label: "儿童房", prefix: "CR", icon: "🧸", device: "furniture",
    desc: "陪伴成长的弹性空间。",
    hl: ["成长型可调结构","护眼无频闪照明","圆角安全防撞","空气质量守护","家长远程看护"],
    uc: ["学习模式护眼补光","就寝故事+夜灯","空气质量超标提醒","玩耍区安全围栏"],
    tags: ["成长","护眼","安全"],
    inst: "儿童房优先圆角与环保材质，照明无频闪，传感节点低功耗，家长可在 App 远程看护。" },
  { key: "entry",   label: "玄关",   prefix: "ET", icon: "🚪", device: "panel",
    desc: "归家第一站的收纳与安防。",
    hl: ["多模开锁，异常推送","鞋柜杀菌除臭","换鞋坐憩一体化","全身镜集成补光","归家/离家场景触发"],
    uc: ["回家自动撤防+开灯","快递临时密钥","出门一键布防","鞋柜除臭定时"],
    tags: ["归家","安防","收纳"],
    inst: "玄关以门锁为安防入口，集成除臭与镜柜补光，归家/离家场景由中枢自动编排。" },
  { key: "study",   label: "书房",   prefix: "ST", icon: "📚", device: "furniture",
    desc: "专注工作与阅读的空间。",
    hl: ["坐站交替护脊","无频闪阅读光","书墙模块收纳","白噪屏蔽干扰","会议模式补光"],
    uc: ["专注模式静音+暖光","视频会议补光","阅读护眼节律","收纳一键归位"],
    tags: ["专注","阅读","护脊"],
    inst: "书房以人体工学与照明节律为核心，升降桌与阅读灯接入中枢，支持专注/会议场景。" },
  { key: "energy",  label: "阳台能源", prefix: "EN", icon: "☀️", device: "green",
    desc: "光伏储能与微气候的调节空间。",
    hl: ["光伏自发自用","储能削峰填谷","微气候监测","灌溉/晾衣自动化","并网与离网双模"],
    uc: ["峰谷电价自动储能","阳台微气候调节","定时/感应灌溉","雨天自动收衣"],
    tags: ["光伏","储能","微气候"],
    inst: "阳台能源构件集成光伏与储能，预留并网接口，环境监测站驱动灌溉与晾衣自动化。" },
  { key: "hub",     label: "中枢",   prefix: "HB", icon: "🧠", device: "server",
    desc: "全屋智能的算力与联动核心。",
    hl: ["本地算力，隐私优先","多协议接入","断网本地自治","场景编排引擎","边缘 AI 推理"],
    uc: ["全屋设备统一接入","跨空间场景编排","断网仍可本地运行","边缘 AI 户型理解"],
    tags: ["中枢","算力","隐私"],
    inst: "中枢主机置于弱电箱或机架，统一接入各协议设备，负责场景编排与本地推理，断网亦可自治。" },
];

// 每类：名称列表 + 智能索引(0-based)
const data = {
  living: {
    names: [
      "模块化沙发系统","电动升降茶几","智能影音电视柜","氛围灯带系统","智能窗帘轨道","落地智能音箱",
      "温控辐射地暖模块","全屋WiFi6路由","语音中控面板","空气净化一体机","人体存在传感器","光照传感器",
      "S06光电感烟探测器","电动休闲椅","隐形收纳墙柜","岩板茶几","模块化书墙","智能投影仪",
      "背景音乐主机","智能新风风口","触控边几","客厅主吊灯","地毯模块","装饰隔断","智能门口摄像机",
      "电动移门","香氛扩散器","折叠健身器材","模块地台",
    ],
    smart: [4, 8, 10, 11, 12],
  },
  bath: {
    names: [
      "智能坐便器","智能洗衣机V1.3","恒温淋浴系统","智能浴镜","电热毛巾架","壁挂智能净饮机",
      "人体感应夜灯","防雾排气扇","智能体脂秤","壁龛收纳模块","防滑地垫模块","镜柜除雾模块",
    ],
    smart: [0, 1, 2],
  },
  kitchen: {
    names: [
      "智能烟机灶具","嵌入式蒸烤箱","洗碗机模块","垃圾处理器","智能净水系统","冷藏抽屉",
      "升降调料架","岛台集成模块",
    ],
    smart: [0, 1, 4],
  },
  bedroom: {
    names: [
      "智能床架系统","电动遮光窗帘","睡眠监测带","氛围主灯","衣柜感应灯","温控被褥",
      "床头智能屏","折叠梳妆台",
    ],
    smart: [0, 2, 6],
  },
  wall: {
    names: [
      "装配式墙体系统","声学吸音墙","磁吸布线墙","防撞护墙板","绿植垂直墙","洞洞板收纳墙","智能调光玻璃墙",
    ],
    smart: [0],
  },
  dining: {
    names: [
      "伸缩餐桌","餐边智能柜","酒柜恒温模块","吊灯组合","餐椅模块","岛台小吃台","氛围灯带",
    ],
    smart: [1],
  },
  kids: {
    names: [
      "成长型儿童床","护眼智能台灯","空气净化小精灵","安全围栏模块","玩具收纳墙","夜灯陪伴熊",
    ],
    smart: [1, 2],
  },
  entry: {
    names: ["智能门锁","鞋柜除臭模块","换鞋凳收纳","全身智能镜"],
    smart: [0],
  },
  study: {
    names: ["升降书桌","护眼阅读灯","书墙收纳","背景白噪机"],
    smart: [0],
  },
  energy: {
    names: ["光伏阳台组件","储能电池柜","智能灌溉系统","晾衣机器人","环境监测站"],
    smart: [0, 1, 3],
  },
  hub: {
    names: ["智居中枢主机"],
    smart: [0],
  },
};

// 重点构件覆盖（真实深度内容 + 配图）
const overrides = {
  "LV-13": {
    id: "S06",
    name: "S06光电感烟探测器",
    featured: true,
    image: "/images/key-smoke.png",
    tagline: "三态自判 · 误报率 < 0.3%",
    description:
      "采用光电散射原理与多传感器融合算法，能对烟雾浓度进行「无/预警/报警」三态自判，结合温湿度补偿显著降低厨房蒸汽等场景的误报。支持本地声光报警与中枢联动推送，断电后电池可续航 72 小时。",
    long:
      "S06 光电感烟探测器是家庭消防安全的首道防线。它在传统光电散射探测基础上引入温湿度与颗粒特征融合，将报警决策拆分为「无—预警—报警」三态：当烟雾浓度缓升超过 0.1dB/m 先进入预警态并推送 App，确认持续上升才升级为报警态并触发本地 85dB 声光。整机通过 Zigbee 3.0 与中枢联动，可一键联动新风关停、摄像头取证与住户推送，断电后电池仍可续航 72 小时，真正做到 7×24 守护。",
    highlights: [
      "三态自判：无/预警/报警分级决策，厨房蒸汽等干扰误报率 < 0.3%",
      "多传感融合：光电 + 温湿度 + 颗粒特征，抗干扰能力强",
      "本地声光 85dB@3m，并联动中枢推送与摄像头取证",
      "Zigbee 3.0 低功耗，电池备份续航 72h",
      "自检与低电量提醒，维护零负担",
    ],
    useCases: [
      "夜间卧室阴燃早期预警，避免睡梦中错过火情",
      "厨房蒸汽误报自动降级为预警，不扰民",
      "离家布防后全屋探测器统一监控",
      "与新风/燃气阀联动，火情时自动切断并排烟",
    ],
    tags: ["消防","安全","传感融合"],
    install:
      "吸顶安装于客厅/卧室/厨房顶部避开风口，Zigbee 入网后由中枢统一编排；建议每层至少 1 个，厨房独立布点。",
    params: [
      { label: "探测原理", value: "光电散射 + 温度补偿" },
      { label: "报警阈值", value: "0.1 / 0.3 / 0.5 dB/m 三档" },
      { label: "供电", value: "DC 12V / 电池 72h 备份" },
      { label: "通信", value: "Zigbee 3.0 → 中枢" },
      { label: "报警音量", value: "85dB@3m" },
    ],
  },
  "BA-02": {
    name: "智能洗衣机V1.3",
    featured: true,
    image: "/images/key-washer.png",
    tagline: "投放自判 · 远程托管",
    description:
      "V1.3 在 V1.2 基础上新增投放量自判与筒自洁提醒，内置称重与浊度传感，根据衣物重量与水质自动匹配水位与洗涤剂用量。支持 App 远程启停、能耗可视化与故障自检上报中枢。",
    long:
      "智能洗衣机 V1.3 是阳台能源场景的能耗与护理中枢。它在上代基础上加入浊度 + 重量双反馈闭环，投放量自判使洗涤剂节省约 18%，并依水质硬度自动调节软化剂量。筒自洁提醒与高温筒风干抑制霉变，App 可远程启停、查看单次能耗曲线，异常振动或漏水即时上报中枢联动关阀。整机新国标 1 级能效、525mm 大筒直驱，安静且护衣。",
    highlights: [
      "投放自判：浊度 + 重量双反馈，洗涤剂节省约 18%",
      "筒自洁提醒 + 高温风干，抑制霉变异味",
      "能耗可视化，远程启停与预约",
      "异常振动/漏水自检，上报中枢联动",
      "新国标 1 级能效，525mm 大筒直驱护衣",
    ],
    useCases: [
      "外出时远程启动，回家即晾",
      "峰谷电价时段自动预约洗涤",
      "婴幼儿衣物专效洗护",
      "漏水即时关阀并推送告警",
    ],
    tags: ["洗护","节能","远程"],
    install:
      "进水/排水/电源点位按标准模数预留，接入阳台能源中枢；建议与储能联动，优先使用光伏余电。",
    params: [
      { label: "容量", value: "10kg 变频直驱" },
      { label: "自判", value: "浊度 + 重量双反馈" },
      { label: "能效", value: "新国标 1 级" },
      { label: "通信", value: "Wi-Fi + 中枢联动" },
      { label: "筒径", value: "525mm 大筒" },
    ],
  },
  "LV-12": {
    name: "光照传感器",
    featured: true,
    image: "/images/key-light.png",
    tagline: "0-65535 Lux · 节律联动",
    description:
      "高精度数字光照传感器，量程 0–65535 Lux，采样周期可配，向中枢实时上报照度。驱动窗帘、主灯与氛围灯带按「自然光节律」自动调节，实现无感护眼与节能。",
    long:
      "光照传感器是全屋光环境的「眼睛」。它采用数字感光元件，量程 0–65535 Lux、全量程精度 ±4%，以 1s 可配周期向中枢上报照度。中枢据此驱动窗帘开合、主灯与氛围灯带按「自然光节律」无感调节——清晨渐亮、正午补光、傍晚转暖，既护眼又节能。纽扣电池可续航约 2 年，Zigbee 3.0 低功耗入网，是智能调光与节律照明的基础节点。",
    highlights: [
      "量程 0–65535 Lux，全量程精度 ±4%",
      "1s 可配采样，实时照度上报中枢",
      "驱动窗帘/主灯/灯带按自然光节律联动",
      "纽扣电池续航约 2 年，Zigbee 3.0 入网",
      "无感护眼 + 节能，节律照明基础节点",
    ],
    useCases: [
      "清晨渐亮唤醒，替代刺眼闹钟",
      "阅读/观影自动补光到舒适照度",
      "无人区域自动熄灯节能",
      "与遮阳联动抑制眩光",
    ],
    tags: ["传感","照明","节律"],
    install:
      "安装于距窗 1–2m、避开直射的墙面或吊顶，Zigbee 入网；多个节点可分区校准，构建全屋照度地图。",
    params: [
      { label: "量程", value: "0 – 65535 Lux" },
      { label: "精度", value: "±4% @ 全量程" },
      { label: "采样", value: "1s / 可配" },
      { label: "通信", value: "Zigbee 3.0" },
      { label: "供电", value: "纽扣电池 2 年" },
    ],
  },
  "WT-01": {
    name: "装配式墙体系统",
    featured: true,
    image: "/images/key-wall.png",
    tagline: "干法快装 · 磁吸布线",
    description:
      "工厂预制、现场干法快装的轻钢龙骨 + 饰面板墙体系统，内部预留磁吸布线槽与设备腔，管线分离、即插即用。可与传感器、调光玻璃、声学模块自由组合，是「真落地」的空间骨架。",
    long:
      "装配式墙体系统是智居慧脑「真落地」的空间骨架。它在工厂预制轻钢龙骨与饰面板，现场干法拼装、零开槽，内部预留磁吸布线槽与设备腔，使管线分离、即插即用。墙体可与传感器、调光玻璃、声学模块自由组合，旧房改造零粉尘、新房部署极快，可拆卸回收率高达 92%，让智能设备的部署像搭积木一样简单。",
    highlights: [
      "管线分离 + 磁吸布线，智能部署零开槽",
      "干法快装，旧房改造零粉尘",
      "可与调光玻璃/声学/传感模块自由组合",
      "可拆卸回收率 92%，绿色可复用",
      "隔声 RW 45dB，100/120mm 厚度可选",
    ],
    useCases: [
      "旧房智能化升级，无损快改",
      "开放式布局灵活隔断",
      "声学房间隔音降噪",
      "展示墙集成照明与插座",
    ],
    tags: ["装配式","布线","可复用"],
    install:
      "工厂按户型参数预制，现场干法拼装；磁吸线槽与设备腔预留，智能模块随插随用，支持后期无损升级。",
    params: [
      { label: "结构", value: "轻钢龙骨 + 饰面板" },
      { label: "厚度", value: "100 / 120mm 可选" },
      { label: "布线", value: "磁吸线槽 + 设备腔" },
      { label: "隔声", value: "RW 45dB" },
      { label: "复用", value: "可拆卸回收率 92%" },
    ],
  },
  "HB-01": {
    name: "智居中枢主机",
    featured: true,
    image: "/images/key-hub.png",
    tagline: "本地算力 · 隐私优先",
    description:
      "全屋智能的算力与联动核心，内置本地推理能力，负责设备接入、场景编排与隐私数据处理。支持 Zigbee / Matter / Wi-Fi 多协议，断网仍可本地自治，是 AI 选型与构件联动的「大脑」。",
    long:
      "智居中枢主机是全屋智能的「大脑」。它内置 4TOPS 边缘 NPU，支持 Zigbee / Matter / Wi-Fi 多协议接入，负责设备纳管、场景编排与隐私数据处理。采用本地优先架构——敏感数据不出户，AI 推理可在边缘完成，断网时本地场景依旧自治运行。64GB 本地存储可缓存户型与习惯模型，1U 标准机架形态便于隐藏部署，是智居慧脑 AI 能力与构件联动的中枢。",
    highlights: [
      "4TOPS 边缘 NPU，本地推理不依赖云",
      "Zigbee / Matter / Wi-Fi 多协议统一接入",
      "本地优先：敏感数据不出户",
      "断网仍可本地场景自治",
      "1U 机架形态，隐藏部署",
    ],
    useCases: [
      "全屋设备统一接入与纳管",
      "跨空间场景编排（回家/离家/睡眠）",
      "边缘 AI 户型理解与选型",
      "断网时本地安防与联动不失效",
    ],
    tags: ["中枢","算力","隐私"],
    install:
      "置于弱电箱或标准机架，接通网络与供电；首次上电引导各协议设备入网，场景与习惯模型在本地训练与存储。",
    params: [
      { label: "算力", value: "4TOPS 边缘 NPU" },
      { label: "协议", value: "Zigbee / Matter / Wi-Fi" },
      { label: "存储", value: "64GB 本地" },
      { label: "自治", value: "断网本地场景可用" },
      { label: "尺寸", value: "1U 标准机架" },
    ],
  },
};

// 部分构件的人工补充（提升真实感），key 为原始 id
const extra = {
  "LV-06": { hl: ["360° 环绕声场","离线语音唤醒","与影音场景联动","多房间分组播放"], uc: ["聚会背景乐","观影环绕声","晨起轻音乐"], tags: ["影音","语音"] },
  "LV-08": { hl: ["Wi-Fi 6 全屋覆盖","Mesh 无缝漫游","与中枢一体纳管","访客网络隔离"], uc: ["大户型无死角覆盖","IoT 设备专网","访客临时网络"], tags: ["网络","覆盖"] },
  "LV-09": { hl: ["本地语音指令","场景一键触发","老人易用大按键","与中枢直连"], uc: ["一句话控全屋","睡前一键关灯","起床模式"], tags: ["语音","控制"] },
  "LV-11": { hl: ["毫米波存在感知","无人自动节能","入侵/跌倒预警","隐私不摄像"], uc: ["无人区域自动熄灯","起夜柔光引导","独居老人看护"], tags: ["存在感知","安防"] },
  "BA-01": { hl: ["即热冲洗","座温/水温可调","离座自动冲水","抗菌釉面"], uc: ["如厕健康提醒","夜间柔光","离座自洁"], tags: ["洁净","舒适"] },
  "BA-03": { hl: ["恒温 ±0.5℃","多路出水记忆","防烫安全","与浴镜联动"], uc: ["沐浴预热","儿童安全水温","除雾同步"], tags: ["恒温","舒适"] },
  "KT-01": { hl: ["自动强排","燃气泄漏联动关阀","挥手控烟","油污自检"], uc: ["炒菜强排","忘关火提醒","安全联动"], tags: ["安全","烹饪"] },
  "KT-02": { hl: ["蒸汽嫩烤","APP 菜谱","多层同烤","自清洁"], uc: ["烘焙","发酵","远程菜谱"], tags: ["烘焙","嵌入"] },
  "BR-01": { hl: ["零重力姿态","分区软硬","打鼾干预","起夜柔光"], uc: ["睡眠节律","伴侣分区","鼾声干预"], tags: ["睡眠","舒适"] },
  "BR-03": { hl: ["非穿戴监测","心率/呼吸趋势","鼾声识别","异常提醒"], uc: ["睡眠质量报告","健康趋势","异常告警"], tags: ["健康","睡眠"] },
  "ET-01": { hl: ["指纹/密码/密钥","异常开锁推送","临时访客密钥","防撬报警"], uc: ["无感归家","快递临时密钥","离家布防"], tags: ["安防","开锁"] },
  "ST-01": { hl: ["坐站交替","记忆高度","久坐提醒","静音升降"], uc: ["专注办公","护脊","视频会议"], tags: ["人体工学","护脊"] },
  "EN-01": { hl: ["单晶高效组件","弱光发电","BIPV 美观","并网余电上网"], uc: ["阳台自发自用","余电上网","遮阳隔热"], tags: ["光伏","发电"] },
  "EN-02": { hl: ["磷酸铁锂","峰谷削峰填谷","断电备用","APP 续航"], uc: ["谷电储能","断电应急","光伏消纳"], tags: ["储能","备用"] },
  "EN-05": { hl: ["温湿/PM2.5/CO₂","微气候地图","联动新风/灌溉","低功耗"], uc: ["空气质量看板","自动换气","联动灌溉"], tags: ["监测","微气候"] },
};

const smartTaglines = ["AI 联动 · 一键掌控", "传感融合 · 自判联动", "远程可控 · 节能自适应"];
const baseTaglines = ["模块化 · 即装即用", "干法快装 · 可复用", "参数化 · 适配多户型"];

function pick(arr, n, seed) {
  const out = [];
  const a = [...arr];
  let s = seed;
  while (a.length && out.length < n) {
    s = (s * 9301 + 49297) % 233280;
    const i = Math.floor((s / 233280) * a.length);
    out.push(a.splice(i, 1)[0]);
  }
  return out;
}

const raw = [];
for (const c of categories) {
  const d = data[c.key];
  d.names.forEach((name, i) => {
    const smart = d.smart.includes(i);
    const id = `${c.prefix}-${String(i + 1).padStart(2, "0")}`;
    const ov = overrides[id] || {};
    const ex = extra[id] || {};
    const finalId = ov.id || id;
    const finalName = ov.name || name;
    const tagline = ov.tagline || (smart ? smartTaglines[i % smartTaglines.length] : baseTaglines[i % baseTaglines.length]);

    const long =
      ov.long ||
      `${finalName}是${c.label}场景中的关键构件，采用参数化与模块化设计，可无缝接入智居慧脑中枢。${
        smart
          ? "它内置传感与边缘推理能力，能够感知环境与用户习惯，自动触发联动并提供远程托管，是 AI 落地方案的重要节点。"
          : "它以干法快装与高复用率为设计核心，无需现场开槽即可部署，并可在后期随需求灵活组合与升级。"
      }整体兼顾美学表达与可维护性，适配多种户型与风格。`;

    const highlights =
      ov.highlights ||
      pick([...c.hl, ex.hl ? ex.hl[0] : null].filter(Boolean), smart ? 5 : 4, i + 3);

    const useCases = ov.useCases || pick(c.uc, 3, i + 7);
    const tags = ov.tags || pick([...c.tags, name.slice(0, 2)], 3, i + 11);
    const install = ov.install || c.inst;

    const params = ov.params || (() => {
      const base = [
        { label: "材质", value: smart ? "铝合金 + 阻燃 PC" : "E0 级环保板材" },
        { label: "安装", value: smart ? "磁吸快装 + 无线" : "干法快装" },
        { label: "适配", value: "参数化多户型" },
        { label: "维护", value: "模块更换 ≤ 15min" },
      ];
      if (smart) base.push({ label: "通信", value: "Zigbee 3.0 / Wi-Fi" });
      return base;
    })();

    raw.push({
      id: finalId,
      name: finalName,
      category: c.key,
      categoryLabel: c.label,
      smart,
      featured: ov.featured || false,
      icon: c.icon,
      device: c.device,
      tagline,
      description: ov.description || long,
      long,
      highlights,
      useCases,
      install,
      tags,
      params,
      highlight: ov.highlight,
      image: ov.image,
    });
  });
}

// 关联构件：同类 2-3 个 + (非中枢则)中枢
const hubId = "HB-01";
const byCat = {};
raw.forEach((c) => { (byCat[c.category] ||= []).push(c); });
const components = raw.map((c) => {
  const same = (byCat[c.category] || []).filter((x) => x.id !== c.id);
  const related = [];
  let s = c.id.length + c.name.length;
  while (same.length && related.length < 3) {
    s = (s * 9301 + 49297) % 233280;
    const i = Math.floor((s / 233280) * same.length);
    const pick = same.splice(i, 1)[0];
    related.push(pick.id);
  }
  if (c.category !== "hub") related.push(hubId);
  return { ...c, related: related.slice(0, 4) };
});

// 校验计数
const counts = {};
for (const comp of components) counts[comp.categoryLabel] = (counts[comp.categoryLabel] || 0) + 1;
const totalSmart = components.filter((c) => c.smart).length;

const ts = `// 由 scripts/gen-data.mjs 自动生成，请勿手改。共 ${components.length} 件构件，${totalSmart} 件智能标记。
import type { CategoryMeta, ComponentItem } from "./types";

export const categories: CategoryMeta[] = ${JSON.stringify(
  categories.map(({ key, label, prefix, icon, desc, device }) => ({ key, label, prefix, icon, desc, device })),
  null,
  2
)};

export const components: ComponentItem[] = ${JSON.stringify(components, null, 2)};

export const stats = {
  total: ${components.length},
  spaces: ${categories.length},
  smart: ${totalSmart},
};

export function getComponent(id: string): ComponentItem | undefined {
  return components.find((c) => c.id === id);
}

export function componentsByCategory(key: string): ComponentItem[] {
  return components.filter((c) => c.category === key);
}
`;

writeFileSync(OUT, ts, "utf8");
console.log("written:", OUT);
console.log("total:", components.length, "smart:", totalSmart);
console.log("counts:", JSON.stringify(counts));
