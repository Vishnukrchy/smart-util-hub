
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link2, Copy, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ToolLayout from "@/components/ToolLayout";

const UrlShortener = () => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [urlHistory, setUrlHistory] = useState<Array<{original: string, shortened: string}>>([]);
  const { toast } = useToast();

  const shortenUrl = async () => {
    if (!originalUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a URL to shorten",
        variant: "destructive"
      });
      return;
    }

    // Basic URL validation
    try {
      new URL(originalUrl);
    } catch {
      toast({
        title: "Error",
        description: "Please enter a valid URL",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockShortUrl = `https://smrtl.ink/${Math.random().toString(36).substr(2, 8)}`;
      setShortenedUrl(mockShortUrl);
      setUrlHistory(prev => [...prev, { original: originalUrl, shortened: mockShortUrl }]);
      setIsLoading(false);
      toast({
        title: "Success",
        description: "URL shortened successfully!"
      });
    }, 1500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "URL copied to clipboard"
    });
  };

  return (
    <ToolLayout
      title="🌐 URL Shortener"
      description="Create short, shareable links from long URLs. Perfect for social media and clean sharing."
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Original URL</label>
            <Input
              type="url"
              placeholder="https://example.com/very-long-url-here"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
            />
          </div>

          <Button 
            onClick={shortenUrl} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              "Shortening..."
            ) : (
              <>
                <Link2 className="w-4 h-4 mr-2" />
                Shorten URL
              </>
            )}
          </Button>
        </div>

        {shortenedUrl && (
          <Card className="bg-green-50 dark:bg-green-950/20 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-700 dark:text-green-300">Shortened URL</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2 p-3 bg-background rounded border">
                <code className="flex-1 text-sm">{shortenedUrl}</code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(shortenedUrl)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(originalUrl, '_blank')}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {urlHistory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent URLs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {urlHistory.slice(-5).reverse().map((item, index) => (
                  <div key={index} className="p-3 border rounded space-y-2">
                    <div className="text-xs text-muted-foreground">Original:</div>
                    <div className="text-sm break-all">{item.original}</div>
                    <div className="text-xs text-muted-foreground">Shortened:</div>
                    <div className="flex items-center justify-between">
                      <code className="text-sm text-blue-600">{item.shortened}</code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(item.shortened)}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ToolLayout>
  );
};

export default UrlShortener;
