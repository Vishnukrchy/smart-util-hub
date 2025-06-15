
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Copy, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ToolLayout from "@/components/ToolLayout";

const TimestampConverter = () => {
  const [timestamp, setTimestamp] = useState("");
  const [humanDate, setHumanDate] = useState("");
  const [convertedResults, setConvertedResults] = useState<any>(null);
  const { toast } = useToast();

  const convertTimestamp = () => {
    if (!timestamp.trim()) {
      toast({
        title: "Error",
        description: "Please enter a timestamp",
        variant: "destructive"
      });
      return;
    }

    try {
      const ts = parseInt(timestamp);
      const date = new Date(ts * 1000); // Convert to milliseconds
      
      setConvertedResults({
        unix: ts,
        iso: date.toISOString(),
        local: date.toLocaleString(),
        utc: date.toUTCString(),
        date: date.toDateString(),
        time: date.toTimeString(),
      });

      toast({
        title: "Success",
        description: "Timestamp converted successfully!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid timestamp format",
        variant: "destructive"
      });
    }
  };

  const convertHumanDate = () => {
    if (!humanDate.trim()) {
      toast({
        title: "Error",
        description: "Please enter a date",
        variant: "destructive"
      });
      return;
    }

    try {
      const date = new Date(humanDate);
      const timestamp = Math.floor(date.getTime() / 1000);
      
      setConvertedResults({
        unix: timestamp,
        iso: date.toISOString(),
        local: date.toLocaleString(),
        utc: date.toUTCString(),
        date: date.toDateString(),
        time: date.toTimeString(),
      });

      toast({
        title: "Success",
        description: "Date converted successfully!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid date format",
        variant: "destructive"
      });
    }
  };

  const getCurrentTimestamp = () => {
    const now = Math.floor(Date.now() / 1000);
    setTimestamp(now.toString());
    convertTimestamp();
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: `${label} copied to clipboard`
    });
  };

  return (
    <ToolLayout
      title="🌐 Timestamp Converter"
      description="Convert between Unix timestamps and human-readable dates."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Unix Timestamp
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="1703980800"
                  value={timestamp}
                  onChange={(e) => setTimestamp(e.target.value)}
                />
                <div className="flex space-x-2">
                  <Button onClick={convertTimestamp} className="flex-1">
                    Convert
                  </Button>
                  <Button onClick={getCurrentTimestamp} variant="outline">
                    Current
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Human Date
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="datetime-local"
                  value={humanDate}
                  onChange={(e) => setHumanDate(e.target.value)}
                />
                <Button onClick={convertHumanDate} className="w-full">
                  Convert to Timestamp
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {convertedResults && (
          <Card>
            <CardHeader>
              <CardTitle>Conversion Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { label: "Unix Timestamp", value: convertedResults.unix, key: "unix" },
                  { label: "ISO 8601", value: convertedResults.iso, key: "iso" },
                  { label: "Local Time", value: convertedResults.local, key: "local" },
                  { label: "UTC", value: convertedResults.utc, key: "utc" },
                  { label: "Date Only", value: convertedResults.date, key: "date" },
                  { label: "Time Only", value: convertedResults.time, key: "time" },
                ].map(({ label, value, key }) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-muted rounded">
                    <div>
                      <Badge variant="outline" className="mb-1">{label}</Badge>
                      <div className="font-mono text-sm">{value}</div>
                    </div>
                    <Button
                      onClick={() => copyToClipboard(value.toString(), label)}
                      size="sm"
                      variant="ghost"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-sm">💡 Timestamp Tips</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>• Unix timestamp is seconds since January 1, 1970 UTC</p>
            <p>• Use current timestamp for "now" reference</p>
            <p>• ISO 8601 format is standard for APIs and databases</p>
            <p>• Local time shows in your system timezone</p>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default TimestampConverter;
