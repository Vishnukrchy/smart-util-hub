import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { geminiChatCompletion } from "@/lib/gemini";
import ReactMarkdown from "react-markdown";

const EmailAssistant = () => {
  const [mode, setMode] = useState<'compose' | 'reply'>('compose');
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [replyTo, setReplyTo] = useState("");
  const [aiEmail, setAiEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    setAiEmail("");
    let prompt = "";
    if (mode === 'compose') {
      prompt = `Compose a professional email with the subject: "${subject}" and the following message: ${body}`;
    } else {
      prompt = `Reply to the following email:\n---\n${replyTo}\n---\nYour reply should be professional and relevant. Subject: ${subject}. Message: ${body}`;
    }
    try {
      const result = await geminiChatCompletion(prompt, "You are an expert email assistant. Write clear, concise, and professional emails.");
      setAiEmail(result);
    } catch (e: any) {
      setAiEmail(e.message || "Error from Gemini API.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ToolLayout
      title="📧 Email Assistant"
      description="Compose or reply to emails with Gemini AI."
    >
      <div className="max-w-xl mx-auto space-y-6">
        <div className="flex gap-4 mb-2">
          <Button variant={mode === 'compose' ? 'default' : 'outline'} onClick={() => setMode('compose')}>Compose</Button>
          <Button variant={mode === 'reply' ? 'default' : 'outline'} onClick={() => setMode('reply')}>Reply</Button>
        </div>
        <div className="space-y-3">
          <input
            type="text"
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="Subject"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            disabled={isLoading}
          />
          {mode === 'reply' && (
            <Textarea
              placeholder="Paste the email you want to reply to..."
              value={replyTo}
              onChange={e => setReplyTo(e.target.value)}
              className="min-h-[60px]"
              disabled={isLoading}
            />
          )}
          <Textarea
            placeholder={mode === 'compose' ? "What do you want to say?" : "What do you want to say in your reply?"}
            value={body}
            onChange={e => setBody(e.target.value)}
            className="min-h-[80px]"
            disabled={isLoading}
          />
          <Button onClick={handleGenerate} disabled={isLoading || !subject || !body || (mode === 'reply' && !replyTo)} className="w-full">
            {isLoading ? "Generating..." : mode === 'compose' ? "Compose Email" : "Generate Reply"}
          </Button>
        </div>
        {aiEmail && (
          <div className="mt-6 p-4 border rounded bg-muted/50">
            <div className="font-semibold mb-2">AI Suggested {mode === 'compose' ? 'Email' : 'Reply'}:</div>
            <div className="prose prose-sm dark:prose-invert">
              <ReactMarkdown>{aiEmail}</ReactMarkdown>
            </div>
            <Button className="mt-4" disabled>Send (Mock)</Button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default EmailAssistant; 