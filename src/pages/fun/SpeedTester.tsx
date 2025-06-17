
import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Wifi, Download, Upload, Clock } from "lucide-react";
import { toast } from "sonner";

interface SpeedTestResult {
  downloadSpeed: number;
  uploadSpeed: number;
  ping: number;
}

const SpeedTester = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<SpeedTestResult | null>(null);
  const [currentTest, setCurrentTest] = useState<string>("");

  const simulateSpeedTest = async () => {
    setIsTesting(true);
    setProgress(0);
    setResults(null);
    
    try {
      // Simulate ping test
      setCurrentTest("Testing Ping...");
      setProgress(10);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const pingStart = performance.now();
      await fetch('https://www.google.com/favicon.ico', { mode: 'no-cors' });
      const ping = Math.round(performance.now() - pingStart);
      
      setProgress(30);
      
      // Simulate download test
      setCurrentTest("Testing Download Speed...");
      const downloadStart = performance.now();
      const downloadResponse = await fetch('https://httpbin.org/bytes/1000000'); // 1MB
      const downloadEnd = performance.now();
      const downloadTime = (downloadEnd - downloadStart) / 1000; // seconds
      const downloadSpeed = Math.round((1 / downloadTime) * 8); // Mbps (rough estimation)
      
      setProgress(70);
      
      // Simulate upload test (using a smaller payload for demo)
      setCurrentTest("Testing Upload Speed...");
      const uploadStart = performance.now();
      await fetch('https://httpbin.org/post', {
        method: 'POST',
        body: new Blob([new ArrayBuffer(100000)]) // 100KB
      });
      const uploadEnd = performance.now();
      const uploadTime = (uploadEnd - uploadStart) / 1000;
      const uploadSpeed = Math.round((0.1 / uploadTime) * 8 * 10); // Mbps (rough estimation)
      
      setProgress(100);
      setCurrentTest("Test Complete!");
      
      setResults({
        downloadSpeed: Math.max(1, downloadSpeed),
        uploadSpeed: Math.max(1, uploadSpeed),
        ping: Math.max(1, ping)
      });
      
      toast.success("Speed test completed!");
    } catch (error) {
      console.error('Speed test error:', error);
      toast.error("Speed test failed. Please try again.");
    } finally {
      setIsTesting(false);
      setCurrentTest("");
    }
  };

  return (
    <ToolLayout
      title="🌐 Internet Speed Tester"
      description="Test your internet connection speed."
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wifi className="w-6 h-6 text-blue-500" />
              <span>Speed Test</span>
            </CardTitle>
            <CardDescription>
              Test your internet download speed, upload speed, and ping
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isTesting && !results && (
              <div className="text-center">
                <Button onClick={simulateSpeedTest} size="lg">
                  <Wifi className="w-5 h-5 mr-2" />
                  Start Speed Test
                </Button>
              </div>
            )}

            {isTesting && (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-lg font-semibold">{currentTest}</p>
                </div>
                <Progress value={progress} className="w-full" />
                <p className="text-center text-sm text-muted-foreground">
                  {progress}% Complete
                </p>
              </div>
            )}

            {results && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-center">Test Results</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <Download className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold">{results.downloadSpeed}</p>
                      <p className="text-sm text-muted-foreground">Mbps Download</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold">{results.uploadSpeed}</p>
                      <p className="text-sm text-muted-foreground">Mbps Upload</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <Clock className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold">{results.ping}</p>
                      <p className="text-sm text-muted-foreground">ms Ping</p>
                    </CardContent>
                  </Card>
                </div>
                <div className="text-center">
                  <Button onClick={simulateSpeedTest} variant="outline">
                    Test Again
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default SpeedTester;
