import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ToolLayout from "@/components/ToolLayout";
import { geminiChatCompletion } from "@/lib/gemini";
import ReactMarkdown from "react-markdown";


const PromptEnhancer = () => {
  const [inputPrompt, setInputPrompt] = useState("");
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const enhancePrompt = async () => {
    if (!inputPrompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt to enhance",
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);
    setEnhancedPrompt("");
    try {
      const result = await geminiChatCompletion(
        `Improve and expand this prompt for better AI results: ${inputPrompt}`,
        "You are a prompt engineering assistant. Enhance the user's prompt for clarity, detail, and effectiveness."
      );
      setEnhancedPrompt(result);
      toast({
        title: "Success",
        description: "Prompt enhanced successfully!"
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to enhance prompt",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Prompt copied to clipboard"
    });
  };

  return (
    <ToolLayout
      title="🧠 Prompt Enhancer"
      description="Transform your basic prompts into detailed, effective instructions for better AI responses."
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Original Prompt</label>
          <Textarea
            placeholder="Enter your prompt here..."
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            className="min-h-[120px]"
          />
        </div>

        <Button 
          onClick={enhancePrompt} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            "Enhancing..."
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Enhance Prompt
            </>
          )}
        </Button>

        {enhancedPrompt && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Enhanced Prompt
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(enhancedPrompt)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm dark:prose-invert">
                <ReactMarkdown>{enhancedPrompt}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-sm">💡 Tips for Better Prompts</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>• Be specific about what you want</p>
            <p>• Include context and examples</p>
            <p>• Specify the format of the response</p>
            <p>• Add constraints or requirements</p>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default PromptEnhancer;
