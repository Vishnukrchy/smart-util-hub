
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Play, Clock, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ToolLayout from "@/components/ToolLayout";

const YoutubeDownloader = () => {
  const [url, setUrl] = useState("");
  const [videoInfo, setVideoInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const extractVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const fetchVideoInfo = async () => {
    if (!url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a YouTube URL",
        variant: "destructive"
      });
      return;
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      toast({
        title: "Error",
        description: "Invalid YouTube URL format",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call with mock data
    setTimeout(() => {
      const mockVideoInfo = {
        id: videoId,
        title: "Sample Video Title - How to Build Amazing Apps",
        duration: "15:32",
        views: "1,234,567",
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        channel: "Tech Channel",
        uploadDate: "2024-01-15",
        description: "This is a sample video description showing how this YouTube downloader would work in a real implementation.",
        quality: ["1080p", "720p", "480p", "360p"],
        formats: ["MP4", "WEBM", "MP3"]
      };

      setVideoInfo(mockVideoInfo);
      setIsLoading(false);
      
      toast({
        title: "Success",
        description: "Video information loaded!"
      });
    }, 2000);
  };

  const handleDownload = (quality: string, format: string) => {
    toast({
      title: "Demo Mode",
      description: `This would download ${videoInfo.title} in ${quality} ${format} format. Backend integration required for actual downloads.`,
      variant: "default"
    });
  };

  const loadExample = () => {
    setUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  };

  return (
    <ToolLayout
      title="🌐 YouTube Downloader"
      description="Download YouTube videos in various formats and qualities (Demo Mode)."
    >
      <div className="space-y-6">
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-amber-700">
              <Badge variant="secondary">Demo Mode</Badge>
              <span className="text-sm">
                This is a frontend demonstration. Backend integration required for actual downloads.
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="flex space-x-2">
          <Input
            placeholder="https://www.youtube.com/watch?v=..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1"
          />
          <Button onClick={fetchVideoInfo} disabled={isLoading}>
            {isLoading ? "Loading..." : "Get Info"}
          </Button>
          <Button onClick={loadExample} variant="outline">
            Example
          </Button>
        </div>

        {videoInfo && (
          <Card>
            <CardHeader>
              <CardTitle>Video Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={videoInfo.thumbnail}
                    alt={videoInfo.title}
                    className="w-full rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">{videoInfo.title}</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Play className="w-4 h-4" />
                      <span>Channel: {videoInfo.channel}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>Duration: {videoInfo.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Eye className="w-4 h-4" />
                      <span>Views: {videoInfo.views}</span>
                    </div>
                    <div>
                      <span>Uploaded: {videoInfo.uploadDate}</span>
                    </div>
                  </div>
                  <p className="text-sm">{videoInfo.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {videoInfo && (
          <Card>
            <CardHeader>
              <CardTitle>Download Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">Video Downloads</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {videoInfo.quality.map((quality: string) => (
                      <Button
                        key={quality}
                        variant="outline"
                        onClick={() => handleDownload(quality, "MP4")}
                        className="flex items-center space-x-2"
                      >
                        <Download className="w-4 h-4" />
                        <span>{quality} MP4</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Audio Only</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Button
                      variant="outline"
                      onClick={() => handleDownload("High Quality", "MP3")}
                      className="flex items-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>MP3 Audio</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleDownload("High Quality", "WAV")}
                      className="flex items-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>WAV Audio</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleDownload("High Quality", "FLAC")}
                      className="flex items-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>FLAC Audio</span>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-sm">⚠️ Important Notes</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>• This is a demonstration of the UI only</p>
            <p>• Actual downloading requires backend integration with YouTube API</p>
            <p>• Always respect copyright and YouTube's terms of service</p>
            <p>• Consider using official YouTube Premium for offline viewing</p>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default YoutubeDownloader;
