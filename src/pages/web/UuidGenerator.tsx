
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, RefreshCw, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ToolLayout from "@/components/ToolLayout";

const UuidGenerator = () => {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(1);
  const { toast } = useToast();

  const generateUUIDs = (num: number) => {
    const newUuids = Array.from({ length: num }, () => crypto.randomUUID());
    setUuids(newUuids);
    toast({
      title: "Success",
      description: `Generated ${num} UUID${num > 1 ? 's' : ''}!`
    });
  };

  const copyToClipboard = (uuid: string) => {
    navigator.clipboard.writeText(uuid);
    toast({
      title: "Copied",
      description: "UUID copied to clipboard"
    });
  };

  const copyAllUUIDs = () => {
    const allUuids = uuids.join('\n');
    navigator.clipboard.writeText(allUuids);
    toast({
      title: "Copied",
      description: `All ${uuids.length} UUIDs copied to clipboard`
    });
  };

  return (
    <ToolLayout
      title="🌐 UUID Generator"
      description="Generate universally unique identifiers (UUIDs) for your applications."
    >
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium">Count:</label>
            <select 
              value={count} 
              onChange={(e) => setCount(Number(e.target.value))}
              className="px-3 py-1 border rounded"
            >
              {[1, 5, 10, 25, 50, 100].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
          
          <Button onClick={() => generateUUIDs(count)}>
            <Zap className="w-4 h-4 mr-2" />
            Generate {count > 1 ? `${count} UUIDs` : 'UUID'}
          </Button>

          {uuids.length > 0 && (
            <Button onClick={() => generateUUIDs(count)} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Regenerate
            </Button>
          )}
        </div>

        {uuids.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Generated UUIDs</CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">{uuids.length} UUIDs</Badge>
                {uuids.length > 1 && (
                  <Button onClick={copyAllUUIDs} size="sm" variant="outline">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy All
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {uuids.map((uuid, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded border">
                    <code className="text-sm font-mono">{uuid}</code>
                    <Button
                      onClick={() => copyToClipboard(uuid)}
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
            <CardTitle className="text-sm">💡 About UUIDs</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>• UUIDs are 128-bit numbers used to uniquely identify information</p>
            <p>• Version 4 UUIDs are randomly generated with extremely low collision probability</p>
            <p>• Perfect for database primary keys, session IDs, and unique identifiers</p>
            <p>• Format: 8-4-4-4-12 hexadecimal digits (e.g., 550e8400-e29b-41d4-a716-446655440000)</p>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default UuidGenerator;
