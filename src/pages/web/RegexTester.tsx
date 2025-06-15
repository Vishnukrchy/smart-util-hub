
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Search, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ToolLayout from "@/components/ToolLayout";

const RegexTester = () => {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [testString, setTestString] = useState("");
  const [matches, setMatches] = useState<RegExpMatchArray[]>([]);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    testRegex();
  }, [pattern, flags, testString]);

  const testRegex = () => {
    if (!pattern.trim()) {
      setMatches([]);
      setIsValid(null);
      setError("");
      return;
    }

    try {
      const regex = new RegExp(pattern, flags);
      setIsValid(true);
      setError("");

      if (!testString.trim()) {
        setMatches([]);
        return;
      }

      const allMatches: RegExpMatchArray[] = [];
      let match;

      if (flags.includes('g')) {
        while ((match = regex.exec(testString)) !== null) {
          allMatches.push(match);
          if (match.index === regex.lastIndex) {
            break; // Prevent infinite loop
          }
        }
      } else {
        match = regex.exec(testString);
        if (match) {
          allMatches.push(match);
        }
      }

      setMatches(allMatches);

      if (allMatches.length > 0) {
        toast({
          title: "Success",
          description: `Found ${allMatches.length} match${allMatches.length > 1 ? 'es' : ''}!`
        });
      }
    } catch (err) {
      setIsValid(false);
      setError(err instanceof Error ? err.message : "Invalid regex pattern");
      setMatches([]);
      toast({
        title: "Error",
        description: "Invalid regex pattern",
        variant: "destructive"
      });
    }
  };

  const loadExample = () => {
    setPattern("\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b");
    setFlags("gi");
    setTestString("Contact us at support@example.com or sales@company.org for more information. You can also reach admin@test.co.uk");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Copied to clipboard"
    });
  };

  const highlightMatches = (text: string) => {
    if (matches.length === 0) return text;

    let lastIndex = 0;
    const parts = [];

    matches.forEach((match, index) => {
      if (match.index !== undefined) {
        // Add text before match
        if (match.index > lastIndex) {
          parts.push(
            <span key={`text-${index}`}>
              {text.substring(lastIndex, match.index)}
            </span>
          );
        }

        // Add highlighted match
        parts.push(
          <span key={`match-${index}`} className="bg-yellow-200 text-yellow-900 px-1 rounded">
            {match[0]}
          </span>
        );

        lastIndex = match.index + match[0].length;
      }
    });

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(
        <span key="text-end">
          {text.substring(lastIndex)}
        </span>
      );
    }

    return parts;
  };

  return (
    <ToolLayout
      title="🌐 Regex Tester"
      description="Test and validate regular expressions with real-time matching and highlighting."
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <Button onClick={testRegex}>
              <Search className="w-4 h-4 mr-2" />
              Test Regex
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
                  Valid Pattern
                </>
              ) : (
                <>
                  <XCircle className="w-3 h-3 mr-1" />
                  Invalid Pattern
                </>
              )}
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Regular Expression</label>
            <Input
              placeholder="Enter regex pattern..."
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              className="font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Flags</label>
            <Input
              placeholder="g, i, m, s, u, y"
              value={flags}
              onChange={(e) => setFlags(e.target.value)}
              className="font-mono text-sm"
            />
          </div>
        </div>

        {error && (
          <Card className="bg-red-50 border-red-200">
            <CardHeader>
              <CardTitle className="text-red-700 text-sm">Regex Error</CardTitle>
            </CardHeader>
            <CardContent>
              <code className="text-red-600 text-sm">{error}</code>
            </CardContent>
          </Card>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Test String</label>
            {matches.length > 0 && (
              <Badge variant="outline">
                {matches.length} match{matches.length > 1 ? 'es' : ''}
              </Badge>
            )}
          </div>
          <Textarea
            placeholder="Enter text to test against the regex..."
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            className="min-h-[150px] text-sm"
          />
        </div>

        {testString && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Test Result (Highlighted Matches)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm whitespace-pre-wrap break-words p-3 bg-muted rounded min-h-[100px]">
                {highlightMatches(testString)}
              </div>
            </CardContent>
          </Card>
        )}

        {matches.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Match Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {matches.map((match, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded">
                    <div className="space-y-1">
                      <div className="font-mono text-sm font-semibold">{match[0]}</div>
                      <div className="text-xs text-muted-foreground">
                        Position: {match.index} - {match.index! + match[0].length - 1}
                        {match.length > 1 && (
                          <span className="ml-2">
                            Groups: {match.slice(1).join(', ')}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(match[0])}
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
            <CardTitle className="text-sm">🔧 Regex Flags Reference</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><code>g</code> - Global (find all matches)</p>
                <p><code>i</code> - Case insensitive</p>
                <p><code>m</code> - Multiline</p>
              </div>
              <div>
                <p><code>s</code> - Dot matches newlines</p>
                <p><code>u</code> - Unicode</p>
                <p><code>y</code> - Sticky</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default RegexTester;
