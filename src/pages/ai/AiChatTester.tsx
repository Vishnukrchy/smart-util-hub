import { useState, useRef, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { geminiChatCompletion } from "@/lib/gemini";

const CHAR_LIMIT = 300;

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
}

const AiChatTester = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading || input.length > CHAR_LIMIT) return;
    const userMsg: Message = {
      id: Date.now() + "-user",
      sender: "user",
      text: input.trim(),
    };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    setIsLoading(true);
    try {
      const aiText = await geminiChatCompletion(
        userMsg.text,
        "You are a helpful AI assistant. Respond conversationally."
      );
      const aiMsg: Message = {
        id: Date.now() + "-ai",
        sender: "ai",
        text: aiText,
      };
      setMessages((msgs) => [...msgs, aiMsg]);
    } catch (e: any) {
      setMessages((msgs) => [
        ...msgs,
        {
          id: Date.now() + "-ai-error",
          sender: "ai",
          text: e.message || "Error from Gemini API.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const charsLeft = CHAR_LIMIT - input.length;
  const overLimit = input.length > CHAR_LIMIT;

  return (
    <ToolLayout
      title="🧠 AI Chat Tester"
      description="Test AI conversations with Gemini API responses."
    >
      <div className="max-w-lg mx-auto flex flex-col h-[60vh] border rounded-lg bg-background shadow p-4">
        <div className="flex-1 overflow-y-auto space-y-2 mb-2">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground mt-10">Start the conversation!</div>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`rounded-lg px-4 py-2 max-w-[80%] text-sm shadow-sm ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-lg px-4 py-2 max-w-[80%] text-sm shadow-sm bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 opacity-70">
                Gemini is typing...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        <div className="flex gap-2 mt-2 items-end">
          <div className="flex-1">
            <Textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="min-h-[40px] max-h-[100px]"
              disabled={isLoading}
              maxLength={CHAR_LIMIT + 1}
            />
            <div className={`text-xs mt-1 text-right ${overLimit ? "text-red-500" : "text-muted-foreground"}`}>
              {overLimit ? `Limit exceeded by ${-charsLeft} characters` : `${charsLeft} characters left`}
            </div>
          </div>
          <Button onClick={sendMessage} className="h-fit px-4 py-2" disabled={!input.trim() || isLoading || overLimit}>
            {isLoading ? "..." : "Send"}
          </Button>
        </div>
      </div>
    </ToolLayout>
  );
};

export default AiChatTester;
