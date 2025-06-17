
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import ToolLayout from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, Quote } from "lucide-react";
import { toast } from "sonner";

interface QuoteResponse {
  content: string;
  author: string;
  tags: string[];
}

const fetchQuote = async (): Promise<QuoteResponse> => {
  const response = await fetch('https://api.quotable.io/random');
  if (!response.ok) {
    throw new Error('Failed to fetch quote');
  }
  return response.json();
};

const QuoteOfDay = () => {
  const { data: quote, isLoading, error, refetch } = useQuery({
    queryKey: ['quote'],
    queryFn: fetchQuote,
  });

  const handleNewQuote = () => {
    refetch();
    toast.success("New quote loaded!");
  };

  if (error) {
    return (
      <ToolLayout
        title="💬 Quote of the Day"
        description="Get daily inspiration with motivational quotes."
      >
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2 text-red-600">Error Loading Quote</h3>
          <p className="text-muted-foreground mb-4">Unable to fetch quote. Please try again.</p>
          <Button onClick={handleNewQuote}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </ToolLayout>
    );
  }

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
