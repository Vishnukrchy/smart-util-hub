
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Copy, Code } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ToolLayout from "@/components/ToolLayout";
import { mockJsonData } from "@/data/mockData";

const JsonFormatter = () => {
  const [input, setInput] = useState("");
  const [formatted, setFormatted] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const formatJson = () => {
    if (!input.trim()) {
      toast({
        title: "Error",
        description: "Please enter JSON to format",
        variant: "destructive"
      });
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const prettified = JSON.stringify(parsed, null, 2);
      setFormatted(prettified);
      setIsValid(true);
      setError("");
      toast({
        title: "Success",
        description: "JSON formatted successfully!"
      });
    } catch (err) {
      setIsValid(false);
      setError(err instanceof Error ? err.message : "Invalid JSON");
      setFormatted("");
      toast({
        title: "Error",
        description: "Invalid JSON format",
        variant: "destructive"
      });
    }
  };

  const minifyJson = () => {
    if (!input.trim()) return;

    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setFormatted(minified);
      setIsValid(true);
      setError("");
      toast({
        title: "Success",
        description: "JSON minified successfully!"
      });
    } catch (err) {
      setIsValid(false);
      setError(err instanceof Error ? err.message : "Invalid JSON");
    }
  };

  const loadExample = () => {
    const example = JSON.stringify(mockJsonData, null, 2);
    setInput(example);
    setFormatted(example);
    setIsValid(true);
    setError("");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "JSON copied to clipboard"
    });
  };

  return (
    <ToolLayout
      title="🌐 JSON Formatter & Validator"
      description="Format, validate, and beautify your JSON data with syntax highlighting."
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <Button onClick={formatJson}>
              <Code className="w-4 h-4 mr-2" />
              Format
            </Button>
            <Button onClick={minifyJson} variant="outline">
              Minify
            </Button>
            <Button onClick={loadExample} variant="outline">
              Load Example
            </Button>
          </div>
          
          {isValid !== null && (
            <Badge variant={isValid ? "default" : "destructive"}>
              {isValid ? (
                <>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Valid JSON
                </>
              ) : (
                <>
                  <XCircle className="w-3 h-3 mr-1" />
                  Invalid JSON
                </>
              )}
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Input JSON</label>
            <Textarea
              placeholder="Paste your JSON here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[400px] font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Formatted Output</label>
              {formatted && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(formatted)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              )}
            </div>
            
            {error ? (
              <Card className="bg-red-50 border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-700 text-sm">JSON Error</CardTitle>
                </CardHeader>
                <CardContent>
                  <code className="text-red-600 text-sm">{error}</code>
                </CardContent>
              </Card>
            ) : (
              <Textarea
                value={formatted}
                readOnly
                className="min-h-[400px] font-mono text-sm bg-muted"
              />
            )}
          </div>
        </div>

        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-sm">💡 JSON Tips</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>• Use double quotes for strings and property names</p>
            <p>• Numbers don't need quotes: {"{"}"age": 25{"}"}</p>
            <p>• Boolean values: true/false (lowercase, no quotes)</p>
            <p>• Arrays use square brackets: [1, 2, 3]</p>
            <p>• Objects use curly braces: {"{"}"key": "value"{"}"}</p>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default JsonFormatter;
