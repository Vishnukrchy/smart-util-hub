
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Shuffle, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ToolLayout from "@/components/ToolLayout";

const BoxShadowGenerator = () => {
  const [offsetX, setOffsetX] = useState([0]);
  const [offsetY, setOffsetY] = useState([4]);
  const [blurRadius, setBlurRadius] = useState([8]);
  const [spreadRadius, setSpreadRadius] = useState([0]);
  const [shadowColor, setShadowColor] = useState("#000000");
  const [opacity, setOpacity] = useState([25]);
  const [inset, setInset] = useState(false);
  const { toast } = useToast();

  const getShadowCSS = () => {
    const rgba = hexToRgba(shadowColor, opacity[0] / 100);
    const insetText = inset ? "inset " : "";
    return `${insetText}${offsetX[0]}px ${offsetY[0]}px ${blurRadius[0]}px ${spreadRadius[0]}px ${rgba}`;
  };

  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const copyCSS = () => {
    const css = `box-shadow: ${getShadowCSS()};`;
    navigator.clipboard.writeText(css);
    toast({
      title: "Copied",
      description: "CSS box-shadow copied to clipboard"
    });
  };

  const randomizeShadow = () => {
    setOffsetX([Math.floor(Math.random() * 21) - 10]);
    setOffsetY([Math.floor(Math.random() * 21) - 10]);
    setBlurRadius([Math.floor(Math.random() * 30)]);
    setSpreadRadius([Math.floor(Math.random() * 21) - 10]);
    setOpacity([Math.floor(Math.random() * 50) + 10]);
    
    const colors = ['#000000', '#333333', '#666666', '#999999', '#ff0000', '#00ff00', '#0000ff'];
    setShadowColor(colors[Math.floor(Math.random() * colors.length)]);
    
    toast({
      title: "Randomized",
      description: "Shadow properties randomized!"
    });
  };

  const presetShadows = [
    { name: "Subtle", values: { x: 0, y: 1, blur: 3, spread: 0, opacity: 12, color: "#000000" } },
    { name: "Card", values: { x: 0, y: 4, blur: 6, spread: -1, opacity: 10, color: "#000000" } },
    { name: "Elevated", values: { x: 0, y: 10, blur: 15, spread: -3, opacity: 15, color: "#000000" } },
    { name: "Soft", values: { x: 0, y: 2, blur: 8, spread: 0, opacity: 8, color: "#000000" } },
    { name: "Sharp", values: { x: 2, y: 2, blur: 0, spread: 0, opacity: 50, color: "#000000" } },
    { name: "Glow", values: { x: 0, y: 0, blur: 10, spread: 2, opacity: 30, color: "#3b82f6" } }
  ];

  const applyPreset = (preset: any) => {
    setOffsetX([preset.values.x]);
    setOffsetY([preset.values.y]);
    setBlurRadius([preset.values.blur]);
    setSpreadRadius([preset.values.spread]);
    setOpacity([preset.values.opacity]);
    setShadowColor(preset.values.color);
  };

  return (
    <ToolLayout
      title="🎨 Box Shadow Generator"
      description="Create beautiful CSS box shadows with live preview and copy-ready code."
    >
      <div className="space-y-6">
        {/* Live Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center min-h-[200px] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div 
              className="w-32 h-32 bg-white dark:bg-gray-800 rounded-lg border"
              style={{ boxShadow: getShadowCSS() }}
            />
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Position & Size</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Horizontal Offset: {offsetX[0]}px</label>
                <Slider
                  value={offsetX}
                  onValueChange={setOffsetX}
                  max={50}
                  min={-50}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Vertical Offset: {offsetY[0]}px</label>
                <Slider
                  value={offsetY}
                  onValueChange={setOffsetY}
                  max={50}
                  min={-50}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Blur Radius: {blurRadius[0]}px</label>
                <Slider
                  value={blurRadius}
                  onValueChange={setBlurRadius}
                  max={100}
                  min={0}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Spread Radius: {spreadRadius[0]}px</label>
                <Slider
                  value={spreadRadius}
                  onValueChange={setSpreadRadius}
                  max={50}
                  min={-50}
                  step={1}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Color & Style</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Shadow Color</label>
                <div className="flex space-x-2">
                  <Input
                    type="color"
                    value={shadowColor}
                    onChange={(e) => setShadowColor(e.target.value)}
                    className="w-16 h-10 p-1 rounded"
                  />
                  <Input
                    type="text"
                    value={shadowColor}
                    onChange={(e) => setShadowColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Opacity: {opacity[0]}%</label>
                <Slider
                  value={opacity}
                  onValueChange={setOpacity}
                  max={100}
                  min={0}
                  step={1}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="inset"
                  checked={inset}
                  onChange={(e) => setInset(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="inset" className="text-sm font-medium">
                  Inset Shadow
                </label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preset Shadows */}
        <Card>
          <CardHeader>
            <CardTitle>Preset Shadows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {presetShadows.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => applyPreset(preset)}
                  className="group relative h-16 bg-white dark:bg-gray-800 rounded-lg border-2 border-transparent hover:border-primary transition-all"
                  style={{ 
                    boxShadow: `${preset.values.x}px ${preset.values.y}px ${preset.values.blur}px ${preset.values.spread}px ${hexToRgba(preset.values.color, preset.values.opacity / 100)}` 
                  }}
                >
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                    <span className="text-white text-xs font-medium">{preset.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex space-x-3">
          <Button onClick={copyCSS} className="flex-1">
            <Copy className="w-4 h-4 mr-2" />
            Copy CSS
          </Button>
          <Button onClick={randomizeShadow} variant="outline">
            <Shuffle className="w-4 h-4 mr-2" />
            Randomize
          </Button>
        </div>

        {/* CSS Output */}
        <Card>
          <CardHeader>
            <CardTitle>CSS Code</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg">
              <code className="text-sm">
                box-shadow: {getShadowCSS()};
              </code>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default BoxShadowGenerator;
