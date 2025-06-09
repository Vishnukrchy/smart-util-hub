
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Copy, Shuffle, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ToolLayout from "@/components/ToolLayout";

const GradientGenerator = () => {
  const [color1, setColor1] = useState("#ff6b6b");
  const [color2, setColor2] = useState("#4ecdc4");
  const [direction, setDirection] = useState("to right");
  const [angle, setAngle] = useState([45]);
  const { toast } = useToast();

  const directionOptions = [
    { value: "to right", label: "To Right" },
    { value: "to left", label: "To Left" },
    { value: "to bottom", label: "To Bottom" },
    { value: "to top", label: "To Top" },
    { value: "to bottom right", label: "To Bottom Right" },
    { value: "to bottom left", label: "To Bottom Left" },
    { value: "to top right", label: "To Top Right" },
    { value: "to top left", label: "To Top Left" },
    { value: "custom", label: "Custom Angle" }
  ];

  const getGradientCSS = () => {
    const dir = direction === "custom" ? `${angle[0]}deg` : direction;
    return `linear-gradient(${dir}, ${color1}, ${color2})`;
  };

  const copyCSS = () => {
    const css = `background: ${getGradientCSS()};`;
    navigator.clipboard.writeText(css);
    toast({
      title: "Copied",
      description: "CSS gradient copied to clipboard"
    });
  };

  const randomizeColors = () => {
    const getRandomColor = () => {
      const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'];
      return colors[Math.floor(Math.random() * colors.length)];
    };
    
    setColor1(getRandomColor());
    setColor2(getRandomColor());
    setDirection(directionOptions[Math.floor(Math.random() * directionOptions.length)].value);
    
    toast({
      title: "Randomized",
      description: "New gradient generated!"
    });
  };

  const presetGradients = [
    { name: "Sunset", colors: ["#ff7e5f", "#feb47b"] },
    { name: "Ocean", colors: ["#2196F3", "#21CBF3"] },
    { name: "Forest", colors: ["#134E5E", "#71B280"] },
    { name: "Purple Haze", colors: ["#667eea", "#764ba2"] },
    { name: "Peach", colors: ["#FDBB2D", "#22C1C3"] },
    { name: "Cool Blue", colors: ["#2193b0", "#6dd5ed"] }
  ];

  const applyPreset = (preset: { colors: string[] }) => {
    setColor1(preset.colors[0]);
    setColor2(preset.colors[1]);
  };

  return (
    <ToolLayout
      title="🎨 Gradient Generator"
      description="Create beautiful CSS gradients with live preview and copy-ready code."
    >
      <div className="space-y-6">
        {/* Live Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="w-full h-48 rounded-lg border"
              style={{ background: getGradientCSS() }}
            />
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Colors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Color 1</label>
                <div className="flex space-x-2">
                  <Input
                    type="color"
                    value={color1}
                    onChange={(e) => setColor1(e.target.value)}
                    className="w-16 h-10 p-1 rounded"
                  />
                  <Input
                    type="text"
                    value={color1}
                    onChange={(e) => setColor1(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Color 2</label>
                <div className="flex space-x-2">
                  <Input
                    type="color"
                    value={color2}
                    onChange={(e) => setColor2(e.target.value)}
                    className="w-16 h-10 p-1 rounded"
                  />
                  <Input
                    type="text"
                    value={color2}
                    onChange={(e) => setColor2(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Direction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Gradient Direction</label>
                <Select value={direction} onValueChange={setDirection}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {directionOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {direction === "custom" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Angle: {angle[0]}°</label>
                  <Slider
                    value={angle}
                    onValueChange={setAngle}
                    max={360}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Preset Gradients */}
        <Card>
          <CardHeader>
            <CardTitle>Preset Gradients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {presetGradients.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => applyPreset(preset)}
                  className="group relative h-16 rounded-lg border-2 border-transparent hover:border-primary transition-all overflow-hidden"
                  style={{ 
                    background: `linear-gradient(to right, ${preset.colors[0]}, ${preset.colors[1]})` 
                  }}
                >
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
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
          <Button onClick={randomizeColors} variant="outline">
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
                background: {getGradientCSS()};
              </code>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default GradientGenerator;
