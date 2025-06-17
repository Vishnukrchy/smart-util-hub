import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";

function hexToRgb(hex: string) {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c[0]+c[0]+c[1]+c[1]+c[2]+c[2];
  const num = parseInt(c, 16);
  return [
    (num >> 16) & 255,
    (num >> 8) & 255,
    num & 255
  ];
}

function luminance([r, g, b]: number[]) {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

function contrastRatio(l1: number, l2: number) {
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

function getWcagLevel(ratio: number) {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "AA Large";
  return "Fail";
}

const ColorContrast = () => {
  const [color1, setColor1] = useState("#000000");
  const [color2, setColor2] = useState("#ffffff");
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  const lum1 = luminance(rgb1);
  const lum2 = luminance(rgb2);
  const ratio = contrastRatio(lum1, lum2);
  const wcag = getWcagLevel(ratio);

  return (
    <ToolLayout
      title="🎨 Color Contrast Checker"
      description="Check color contrast ratios for accessibility."
    >
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex gap-4 items-center">
          <div>
            <label className="block text-xs mb-1">Color 1</label>
            <input type="color" value={color1} onChange={e => setColor1(e.target.value)} className="w-10 h-10 p-0 border-none bg-transparent" />
            <input type="text" value={color1} onChange={e => setColor1(e.target.value)} className="ml-2 w-24 border rounded px-2 py-1 text-sm" />
          </div>
          <div>
            <label className="block text-xs mb-1">Color 2</label>
            <input type="color" value={color2} onChange={e => setColor2(e.target.value)} className="w-10 h-10 p-0 border-none bg-transparent" />
            <input type="text" value={color2} onChange={e => setColor2(e.target.value)} className="ml-2 w-24 border rounded px-2 py-1 text-sm" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-40 h-16 flex items-center justify-center rounded border" style={{ background: color2 }}>
            <span style={{ color: color1, fontWeight: 600, fontSize: 18 }}>Aa</span>
          </div>
          <div className="w-40 h-16 flex items-center justify-center rounded border" style={{ background: color1 }}>
            <span style={{ color: color2, fontWeight: 600, fontSize: 18 }}>Aa</span>
          </div>
        </div>
        <div className="text-center mt-4">
          <div className="text-lg font-semibold">Contrast Ratio: {ratio.toFixed(2)} : 1</div>
          <div className={`text-sm font-bold mt-1 ${wcag === "Fail" ? "text-red-500" : wcag === "AA" ? "text-yellow-600" : "text-green-600"}`}>WCAG: {wcag}</div>
          <div className="text-xs text-muted-foreground mt-2">
            AA: 4.5+ | AAA: 7+ | AA Large: 3+
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

export default ColorContrast;
