import { useRef, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";

const FaviconGenerator = () => {
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    if (!image) return;
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = new window.Image();
    img.onload = () => {
      ctx.clearRect(0, 0, 32, 32);
      ctx.drawImage(img, 0, 0, 32, 32);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "favicon.png"; // .ico is not natively supported by canvas, so .png is used
        a.click();
        URL.revokeObjectURL(url);
      }, "image/png");
    };
    img.src = image;
  };

  return (
    <ToolLayout
      title="🎨 Favicon Generator"
      description="Generate favicons from images. Upload an image and download a 32x32 favicon."
    >
      <div className="max-w-md mx-auto space-y-6">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        <Button onClick={() => fileInputRef.current?.click()}>Upload Image</Button>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {image && (
          <div className="flex flex-col items-center space-y-4">
            <div className="border rounded shadow p-2 bg-white dark:bg-zinc-900">
              <img src={image} alt="Preview" width={64} height={64} className="mx-auto" style={{ imageRendering: 'pixelated' }} />
              <div className="text-xs text-muted-foreground mt-1">Preview (scaled up)</div>
            </div>
            <Button onClick={handleDownload} variant="outline">Download 32x32 Favicon</Button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default FaviconGenerator;
