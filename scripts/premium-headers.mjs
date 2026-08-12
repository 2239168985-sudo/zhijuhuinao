import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const map = {
  members: { eyebrow: "Family Profile", accent: "成员" },
  spaces: { eyebrow: "Space & Device", accent: "设备" },
  scenes: { eyebrow: "Scenario", accent: "场景" },
  safety: { eyebrow: "Safety & Health", accent: "健康" },
  energy: { eyebrow: "Energy", accent: "能源" },
  components: { eyebrow: "Component Library", accent: "构件" },
  settings: { eyebrow: "Settings", accent: "设置" },
};

const RE = /<div>\s*<h1 className="section-title">([^<]+)<\/h1>\s*<p className="section-sub">([^<]+)<\/p>\s*<\/div>/;

for (const [dir, cfg] of Object.entries(map)) {
  const file = path.join(root, "app", dir, "page.tsx");
  let src = fs.readFileSync(file, "utf8");
  const m = src.match(RE);
  if (!m) {
    console.log("SKIP (no match):", dir);
    continue;
  }
  const title = m[1].trim();
  const sub = m[2].trim();
  const accent = title.includes(cfg.accent) ? ` accent="${cfg.accent}"` : "";
  const replacement = `<PageHeader eyebrow="${cfg.eyebrow}" title="${title}"${accent} sub="${sub}" />`;
  src = src.replace(RE, replacement);

  if (!src.includes('components/PageHeader')) {
    const imports = [...src.matchAll(/^import .*$/gm)];
    if (imports.length) {
      const last = imports[imports.length - 1];
      const idx = last.index + last[0].length;
      src = src.slice(0, idx) + '\nimport PageHeader from "@/components/PageHeader";' + src.slice(idx);
    } else {
      src = 'import PageHeader from "@/components/PageHeader";\n' + src;
    }
  }
  fs.writeFileSync(file, src, "utf8");
  console.log("OK:", dir, "->", title);
}
