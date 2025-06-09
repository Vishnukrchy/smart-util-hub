
import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Download, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import QRCode from "qrcode";

const QrCodeGenerator = () => {
  const [text, setText] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [size, setSize] = useState("256");
  const [errorLevel, setErrorLevel] = useState("M");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateQRCode = async () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter text or URL to generate QR code",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const url = await QRCode.toDataURL(text, {
        width: parseInt(size),
        errorCorrectionLevel: errorLevel as any,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF"
        }
      });
      setQrCodeUrl(url);
      toast({
        title: "Success",
        description: "QR Code generated successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate QR code",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) return;
    
    const link = document.createElement("a");
    link.download = "qrcode.png";
    link.href = qrCodeUrl;
    link.click();
    
    toast({
      title: "Downloaded",
      description: "QR Code saved to your downloads",
    });
  };

  const copyToClipboard = async () => {
    if (!qrCodeUrl) return;
    
    try {
      // Convert data URL to blob
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob })
      ]);
      
      toast({
        title: "Copied",
        description: "QR Code copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy QR code",
        variant: "destructive",
      });
    }
  };

  return (
    <ToolLayout
      title="🌐 QR Code Generator"
      description="Generate QR codes from text, URLs, or any data."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="text-input">Text or URL</Label>
              <Textarea
                id="text-input"
                placeholder="Enter text, URL, or any data to generate QR code..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="size">Size (px)</Label>
                <Select value={size} onValueChange={setSize}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="128">128x128</SelectItem>
                    <SelectItem value="256">256x256</SelectItem>
                    <SelectItem value="512">512x512</SelectItem>
                    <SelectItem value="1024">1024x1024</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="error-level">Error Correction</Label>
                <Select value={errorLevel} onValueChange={setErrorLevel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L">Low (7%)</SelectItem>
                    <SelectItem value="M">Medium (15%)</SelectItem>
                    <SelectItem value="Q">Quartile (25%)</SelectItem>
                    <SelectItem value="H">High (30%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={generateQRCode} 
              className="w-full"
              disabled={isGenerating}
            >
              {isGenerating ? "Generating..." : "Generate QR Code"}
            </Button>
          </div>

          {/* Preview Section */}
          <div className="space-y-4">
            <Label>QR Code Preview</Label>
            <Card>
              <CardContent className="p-6 flex items-center justify-center min-h-[300px]">
                {qrCodeUrl ? (
                  <div className="text-center space-y-4">
                    <img 
                      src={qrCodeUrl} 
                      alt="Generated QR Code"
                      className="mx-auto border rounded-lg shadow-sm"
                      style={{ maxWidth: "100%", height: "auto" }}
                    />
                    <div className="flex gap-2 justify-center">
                      <Button onClick={downloadQRCode} size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button onClick={copyToClipboard} variant="outline" size="sm">
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
                      <span className="text-3xl">📱</span>
                    </div>
                    <p>QR code will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Info Section */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">How to use:</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Enter any text, URL, email, phone number, or data</li>
              <li>• Choose the size and error correction level</li>
              <li>• Click "Generate QR Code" to create your QR code</li>
              <li>• Download or copy the generated QR code</li>
              <li>• Higher error correction allows the QR code to be read even if partially damaged</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default QrCodeGenerator;
