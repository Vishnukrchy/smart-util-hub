
import { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, Quote } from "lucide-react";
import { toast } from "sonner";

interface QuoteData {
  content: string;
  author: string;
  tags: string[];
}

// Fallback quotes when API fails
const fallbackQuotes: QuoteData[] = [
  {
    content: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    tags: ["motivation", "work", "passion"]
  },
  {
    content: "Life is what happens to you while you're busy making other plans.",
    author: "John Lennon",
    tags: ["life", "wisdom"]
  },
  {
    content: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    tags: ["dreams", "future", "inspiration"]
  },
  {
    content: "It is during our darkest moments that we must focus to see the light.",
    author: "Aristotle",
    tags: ["hope", "wisdom", "perseverance"]
  },
  {
    content: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    tags: ["success", "courage", "perseverance"]
  }
];

const QuoteOfDay = () => {
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuote = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Try the API first
      const response = await fetch('https://api.quotable.io/random');
      if (!response.ok) {
        throw new Error('API unavailable');
      }
      const data = await response.json();
      setQuote({
        content: data.content,
        author: data.author,
        tags: data.tags || []
      });
      toast.success("New quote loaded!");
    } catch (err) {
      // Fallback to local quotes
      console.log('API failed, using fallback quotes');
      const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
      setQuote(randomQuote);
      toast.success("Quote loaded!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  const handleNewQuote = () => {
    fetchQuote();
  };

  return (
    <ToolLayout
      title="💬 Quote of the Day"
      description="Get daily inspiration with motivational quotes."
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center space-x-2">
              <Quote className="w-6 h-6 text-blue-500" />
              <span>Daily Inspiration</span>
            </CardTitle>
            <CardDescription>
              Discover wisdom and motivation through carefully curated quotes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto"></div>
              </div>
            ) : quote ? (
              <div className="space-y-4">
                <blockquote className="text-xl italic text-gray-700 leading-relaxed">
                  "{quote.content}"
                </blockquote>
                <cite className="text-lg font-semibold text-blue-600">
                  — {quote.author}
                </cite>
                {quote.tags && quote.tags.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {quote.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ) : null}
            
            <Button onClick={handleNewQuote} className="mt-6" disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Get New Quote
            </Button>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default QuoteOfDay;
