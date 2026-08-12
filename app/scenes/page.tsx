import { SCENES } from "@/lib/data";
import PageHeader from "@/components/PageHeader";

export default function ScenesPage() {
  return (
    <div className="flex flex-col gap-5">
      <PageHeader eyebrow="Scenario" title="智能场景" accent="场景" sub="12 个预置中文场景覆盖日常起居，并支持 AI 根据自然语言需求新建场景。" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SCENES.map((s) => (
          <div key={s.id} className="card card-pad-lg flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold" style={{ color: "var(--text)" }}>{s.name}</h3>
              {s.autoAllowed && <span className="chip chip-energy">可自动</span>}
            </div>
            <dl className="text-sm flex flex-col gap-1" style={{ color: "var(--text-dim)" }}>
              <Row k="适用成员" v={s.members.join("、")} />
              <Row k="触发条件" v={s.trigger} />
              <Row k="涉及空间" v={s.spaces.join("、")} />
              <Row k="家具响应" v={s.furniture} />
              <Row k="灯光响应" v={s.light} />
              <Row k="空气环境" v={s.air} />
              <Row k="安全措施" v={s.safety} />
              <Row k="能源策略" v={s.energy} />
            </dl>
          </div>
        ))}
      </div>

      <div className="card card-pad-lg" style={{ borderColor: "var(--ai-soft)", background: "var(--ai-soft)" }}>
        <h3 className="font-semibold mb-1" style={{ color: "var(--ai)" }}>AI 创建新场景</h3>
        <p className="text-sm" style={{ color: "var(--text-dim)" }}>
          输入需求（如「周末晚上全家在客厅看电影并调暗灯光、关闭窗帘」），AI 将解析成员、空间、灯光、空气、安全与能源约束，生成场景方案供你调整保存。
        </p>
        <button className="btn btn-soft btn-sm mt-3">＋ 新建场景</button>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt style={{ color: "var(--text-faint)", whiteSpace: "nowrap" }}>{k}</dt>
      <dd style={{ color: "var(--text)", textAlign: "right" }}>{v}</dd>
    </div>
  );
}
