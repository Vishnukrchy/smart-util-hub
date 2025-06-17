
import { useState, useRef } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Download, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

const ImageResizer = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [resizedUrl, setResizedUrl] = useState<string>("");
  const [width, setWidth] = useState<number>(800);
  const [height, setHeight] = useState<number>(600);
  const [format, setFormat] = useState<string>("jpeg");
  const [quality, setQuality] = useState<number>(90);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file");
        return;
      }
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setResizedUrl("");
      
      // Load image to get original dimensions
      const img = new Image();
      img.onload = () => {
        setWidth(img.naturalWidth);
        setHeight(img.naturalHeight);
      };
      img.src = url;
    }
  };

  const resizeImage = () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = width;
      canvas.height = height;
      
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        
        const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
        const qualityValue = format === 'png' ? 1 : quality / 100;
        
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setResizedUrl(url);
            toast.success("Image resized successfully!");
          }
          setIsProcessing(false);
        }, mimeType, qualityValue);
      }
    };

    img.src = previewUrl;
  };

  const downloadResized = () => {
    if (!resizedUrl) return;
    
    const link = document.createElement('a');
    link.href = resizedUrl;
    link.download = `resized-image.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Image downloaded!");
  };

  return (
    <ToolLayout
      title="🎨 Image Resizer"
      description="Resize images while maintaining quality and aspect ratio."
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ImageIcon className="w-6 h-6 text-purple-500" />
              <span>Upload Image</span>
            </CardTitle>
            <CardDescription>
              Select an image to resize and adjust the dimensions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              {!selectedFile ? (
                <div>
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">Choose an image to resize</p>
                  <p className="text-gray-500 mb-4">Supports JPEG, PNG, and other image formats</p>
                  <Button onClick={() => fileInputRef.current?.click()}>
                    Select Image
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="max-w-full max-h-64 mx-auto rounded-lg shadow-md"
                  />
                  <p className="text-sm text-gray-600">{selectedFile.name}</p>
                  <Button 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Choose Different Image
                  </Button>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </CardContent>
        </Card>

        {selectedFile && (
          <Card>
            <CardHeader>
              <CardTitle>Resize Settings</CardTitle>
              <CardDescription>
                Adjust the dimensions and format for your resized image
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="width">Width (px)</Label>
                  <Input
                    id="width"
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    min="1"
                    max="5000"
                  />
                </div>
                <div>
                  <Label htmlFor="height">Height (px)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    min="1"
                    max="5000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="format">Output Format</Label>
                  <Select value={format} onValueChange={setFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jpeg">JPEG</SelectItem>
                      <SelectItem value="png">PNG</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {format === 'jpeg' && (
                  <div>
                    <Label htmlFor="quality">Quality ({quality}%)</Label>
                    <Input
                      id="quality"
                      type="range"
                      min="10"
                      max="100"
                      step="10"
                      value={quality}
                      onChange={(e) => setQuality(Number(e.target.value))}
                      className="mt-2"
                    />
                  </div>
                )}
              </div>

              <Button 
                onClick={resizeImage} 
                disabled={isProcessing}
                className="w-full"
              >
                {isProcessing ? "Processing..." : "Resize Image"}
              </Button>
            </CardContent>
          </Card>
        )}

        {resizedUrl && (
          <Card>
            <CardHeader>
              <CardTitle>Resized Image</CardTitle>
              <CardDescription>
                Your resized image is ready for download
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <img 
                  src={resizedUrl} 
                  alt="Resized" 
                  className="max-w-full max-h-64 mx-auto rounded-lg shadow-md mb-4"
                />
                <p className="text-sm text-gray-600 mb-4">
                  Dimensions: {width} × {height}px
                </p>
                <Button onClick={downloadResized}>
                  <Download className="w-4 h-4 mr-2" />
                  Download Resized Image
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ToolLayout>
  );
};

export default ImageResizer;
