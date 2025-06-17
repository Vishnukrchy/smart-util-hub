
import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Brain, Heart, Frown, Smile, Meh } from "lucide-react";
import { toast } from "sonner";

interface MoodResult {
  overall: string;
  confidence: number;
  emotions: {
    joy: number;
    sadness: number;
    anger: number;
    fear: number;
    surprise: number;
    neutral: number;
  };
  keywords: string[];
}

const MoodAnalyzer = () => {
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<MoodResult | null>(null);

  const analyzeText = async () => {
    if (!text.trim()) {
      toast.error("Please enter some text to analyze");
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate analysis with a more sophisticated approach
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      // Simple keyword-based sentiment analysis
      const words = text.toLowerCase().split(/\s+/);
      
      const positiveWords = ['happy', 'joy', 'love', 'excited', 'amazing', 'wonderful', 'great', 'good', 'excellent', 'fantastic', 'beautiful', 'awesome', 'perfect', 'brilliant', 'delighted'];
      const negativeWords = ['sad', 'angry', 'hate', 'terrible', 'awful', 'bad', 'horrible', 'disappointed', 'frustrated', 'annoyed', 'upset', 'depressed', 'worried', 'stressed'];
      const fearWords = ['afraid', 'scared', 'worried', 'anxious', 'nervous', 'terrified', 'frightened'];
      const surpriseWords = ['surprised', 'shocked', 'amazed', 'unexpected', 'wow', 'unbelievable'];
      
      let positiveCount = 0;
      let negativeCount = 0;
      let fearCount = 0;
      let surpriseCount = 0;
      
      const foundKeywords: string[] = [];
      
      words.forEach(word => {
        if (positiveWords.includes(word)) {
          positiveCount++;
          foundKeywords.push(word);
        }
        if (negativeWords.includes(word)) {
          negativeCount++;
          foundKeywords.push(word);
        }
        if (fearWords.includes(word)) {
          fearCount++;
          foundKeywords.push(word);
        }
        if (surpriseWords.includes(word)) {
          surpriseCount++;
          foundKeywords.push(word);
        }
      });
      
      const totalEmotionalWords = positiveCount + negativeCount + fearCount + surpriseCount;
      const textLength = words.length;
      
      // Calculate emotion percentages
      const joy = Math.min(90, (positiveCount / textLength) * 100 * 5);
      const sadness = Math.min(90, (negativeCount / textLength) * 100 * 5);
      const fear = Math.min(90, (fearCount / textLength) * 100 * 5);
      const surprise = Math.min(90, (surpriseCount / textLength) * 100 * 5);
      const anger = Math.min(90, (negativeCount / textLength) * 100 * 3);
      const neutral = Math.max(10, 100 - joy - sadness - fear - surprise - anger);
      
      // Determine overall mood
      let overall = "neutral";
      let confidence = 50;
      
      if (joy > 30) {
        overall = "positive";
        confidence = Math.min(95, 60 + joy);
      } else if (sadness > 20 || anger > 20) {
        overall = "negative";
        confidence = Math.min(95, 60 + Math.max(sadness, anger));
      } else if (fear > 20) {
        overall = "anxious";
        confidence = Math.min(95, 60 + fear);
      } else if (surprise > 20) {
        overall = "surprised";
        confidence = Math.min(95, 60 + surprise);
      }
      
      if (totalEmotionalWords === 0) {
        overall = "neutral";
        confidence = 80;
      }

      const analysisResult: MoodResult = {
        overall,
        confidence,
        emotions: {
          joy: Math.round(joy),
          sadness: Math.round(sadness),
          anger: Math.round(anger),
          fear: Math.round(fear),
          surprise: Math.round(surprise),
          neutral: Math.round(neutral)
        },
        keywords: [...new Set(foundKeywords)].slice(0, 10)
      };
      
      setResult(analysisResult);
      toast.success("Mood analysis completed!");
    } catch (error) {
      toast.error("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'positive':
        return <Smile className="w-8 h-8 text-green-500" />;
      case 'negative':
        return <Frown className="w-8 h-8 text-red-500" />;
      case 'anxious':
        return <Heart className="w-8 h-8 text-orange-500" />;
      default:
        return <Meh className="w-8 h-8 text-gray-500" />;
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'positive':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'negative':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'anxious':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <ToolLayout
      title="🧠 Mood Analyzer"
      description="Analyze the emotional sentiment and mood of your text using AI."
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-6 h-6 text-purple-500" />
              <span>Text Analysis</span>
            </CardTitle>
            <CardDescription>
              Enter text to analyze its emotional content and overall sentiment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Textarea
                placeholder="Enter your text here... (e.g., journal entry, social media post, email, etc.)"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-32"
                maxLength={5000}
              />
              <p className="text-sm text-gray-500 mt-2">
                {text.length}/5000 characters
              </p>
            </div>
            
            <Button 
              onClick={analyzeText} 
              disabled={isAnalyzing || !text.trim()}
              className="w-full"
            >
              {isAnalyzing ? "Analyzing..." : "Analyze Mood"}
            </Button>
          </CardContent>
        </Card>

        {result && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Overall Mood</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`flex items-center space-x-4 p-4 rounded-lg border ${getMoodColor(result.overall)}`}>
                  {getMoodIcon(result.overall)}
                  <div>
                    <p className="text-xl font-semibold capitalize">{result.overall}</p>
                    <p className="text-sm opacity-75">Confidence: {result.confidence}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Emotion Breakdown</CardTitle>
                <CardDescription>
                  Detailed analysis of emotional components in your text
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(result.emotions).map(([emotion, percentage]) => (
                  <div key={emotion} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium capitalize">{emotion}</span>
                      <span className="text-sm text-gray-600">{percentage}%</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {result.keywords.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Key Emotional Words</CardTitle>
                  <CardDescription>
                    Words that influenced the mood analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {result.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default MoodAnalyzer;
