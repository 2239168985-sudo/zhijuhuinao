import Reveal from "@/components/Reveal";

export default function PageHeader({
  eyebrow,
  title,
  sub,
  accent,
}: {
  eyebrow: string;
  title: string;
  sub: string;
  /** 标题中需要渐变高亮的片段，可选 */
  accent?: string;
}) {
  let head: React.ReactNode = title;
  if (accent && title.includes(accent)) {
    const [before, after] = title.split(accent);
    head = (
      <>
        {before}
        <span className="gradient-text">{accent}</span>
        {after}
      </>
    );
  }

  return (
    <Reveal>
      <div className="page-head">
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="section-title">{head}</h1>
        <p className="section-sub">{sub}</p>
      </div>
    </Reveal>
  );
}
