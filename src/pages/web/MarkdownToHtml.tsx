
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Eye, Code, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ToolLayout from "@/components/ToolLayout";
import { marked } from "marked";

const MarkdownToHtml = () => {
  const [markdown, setMarkdown] = useState("");
  const [html, setHtml] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  const convertToHtml = async () => {
    if (!markdown.trim()) {
      toast({
        title: "Error",
        description: "Please enter markdown text",
        variant: "destructive"
      });
      return;
    }

    try {
      const htmlOutput = await marked(markdown);
      setHtml(htmlOutput);
      toast({
        title: "Success",
        description: "Markdown converted to HTML!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to convert markdown",
        variant: "destructive"
      });
    }
  };

  const copyHtml = () => {
    navigator.clipboard.writeText(html);
    toast({
      title: "Copied",
      description: "HTML copied to clipboard"
    });
  };

  const downloadHtml = () => {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted.html";
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded",
      description: "HTML file downloaded"
    });
  };

  const loadExample = () => {
    const exampleMarkdown = `# Welcome to Markdown

This is a **bold** text and this is *italic*.

## Features
- Easy to write
- Easy to read
- Converts to HTML

### Code Example
\`\`\`javascript
function hello() {
    console.log("Hello, World!");
}
\`\`\`

{"> This is a blockquote"}

[Visit OpenAI](https://openai.com)`;

    setMarkdown(exampleMarkdown);
  };

  return (
    <ToolLayout
      title="🌐 Markdown to HTML"
      description="Convert Markdown text to clean HTML with live preview."
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <Button onClick={convertToHtml}>
              <Code className="w-4 h-4 mr-2" />
              Convert to HTML
            </Button>
            <Button onClick={loadExample} variant="outline">
              Load Example
            </Button>
          </div>
          
          {html && (
            <div className="flex space-x-2">
              <Button
                onClick={() => setShowPreview(!showPreview)}
                variant="outline"
                size="sm"
              >
                <Eye className="w-4 h-4 mr-2" />
                {showPreview ? "Show HTML" : "Preview"}
              </Button>
              <Button onClick={copyHtml} size="sm">
                <Copy className="w-4 h-4 mr-2" />
                Copy HTML
              </Button>
              <Button onClick={downloadHtml} size="sm" variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Markdown Input</label>
            <Textarea
              placeholder="Enter your markdown here..."
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="min-h-[400px] font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              {showPreview ? "HTML Preview" : "HTML Output"}
            </label>
            
            {html ? (
              showPreview ? (
                <div 
                  className="min-h-[400px] p-4 border rounded bg-background prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              ) : (
                <Textarea
                  value={html}
                  readOnly
                  className="min-h-[400px] font-mono text-sm bg-muted"
                />
              )
            ) : (
              <div className="min-h-[400px] border rounded bg-muted/50 flex items-center justify-center">
                <p className="text-muted-foreground">HTML output will appear here</p>
              </div>
            )}
          </div>
        </div>

        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-sm">📝 Markdown Syntax Guide</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><code># Heading 1</code> → H1</p>
                <p><code>## Heading 2</code> → H2</p>
                <p><code>**bold**</code> → <strong>bold</strong></p>
                <p><code>*italic*</code> → <em>italic</em></p>
              </div>
              <div>
                <p><code>- List item</code> → Bullet list</p>
                <p><code>[link](url)</code> → Hyperlink</p>
                <p><code>`code`</code> → Inline code</p>
                <p><code>{">"} Quote</code> → Blockquote</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default MarkdownToHtml;
