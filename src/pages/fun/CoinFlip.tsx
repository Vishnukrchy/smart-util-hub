
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RotateCcw, TrendingUp } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

const CoinFlip = () => {
  const [result, setResult] = useState<'heads' | 'tails' | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [history, setHistory] = useState<('heads' | 'tails')[]>([]);
  const [stats, setStats] = useState({ heads: 0, tails: 0 });

  const flipCoin = () => {
    setIsFlipping(true);
    
    // Simulate coin flip animation
    setTimeout(() => {
      const newResult = Math.random() < 0.5 ? 'heads' : 'tails';
      setResult(newResult);
      setHistory(prev => [newResult, ...prev.slice(0, 9)]); // Keep last 10
      setStats(prev => ({
        ...prev,
        [newResult]: prev[newResult] + 1
      }));
      setIsFlipping(false);
    }, 1000);
  };

  const reset = () => {
    setResult(null);
    setHistory([]);
    setStats({ heads: 0, tails: 0 });
  };

  return (
    <ToolLayout
      title="🧪 Coin Flip"
      description="Flip a virtual coin to make decisions or just for fun!"
    >
      <div className="space-y-6">
        {/* Coin Display */}
        <div className="text-center space-y-6">
          <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center text-4xl font-bold border-4 transition-all duration-1000 ${
            isFlipping 
              ? 'animate-spin bg-muted border-muted-foreground' 
              : result === 'heads'
              ? 'bg-yellow-100 border-yellow-400 text-yellow-800'
              : result === 'tails' 
              ? 'bg-gray-100 border-gray-400 text-gray-800'
              : 'bg-muted border-muted-foreground'
          }`}>
            {isFlipping ? '?' : result === 'heads' ? '👑' : result === 'tails' ? '🪙' : '?'}
          </div>

          {result && !isFlipping && (
            <div className="space-y-2">
              <h2 className="text-3xl font-bold capitalize">{result}!</h2>
              <p className="text-muted-foreground">
                {result === 'heads' ? 'The coin landed heads up' : 'The coin landed tails up'}
              </p>
            </div>
          )}

          <div className="flex justify-center space-x-3">
            <Button 
              onClick={flipCoin} 
              disabled={isFlipping}
              size="lg"
              className="px-8"
            >
              {isFlipping ? 'Flipping...' : 'Flip Coin'}
            </Button>
            
            {(history.length > 0 || result) && (
              <Button 
                onClick={reset} 
                variant="outline"
                size="lg"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Statistics */}
        {(stats.heads > 0 || stats.tails > 0) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-700">{stats.heads}</div>
                  <div className="text-sm text-yellow-600">Heads</div>
                  <div className="text-xs text-yellow-500">
                    {stats.heads + stats.tails > 0 ? Math.round((stats.heads / (stats.heads + stats.tails)) * 100) : 0}%
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-700">{stats.tails}</div>
                  <div className="text-sm text-gray-600">Tails</div>
                  <div className="text-xs text-gray-500">
                    {stats.heads + stats.tails > 0 ? Math.round((stats.tails / (stats.heads + stats.tails)) * 100) : 0}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent History */}
        {history.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Flips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {history.map((flip, index) => (
                  <div
                    key={index}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                      flip === 'heads'
                        ? 'bg-yellow-100 border-yellow-400 text-yellow-800'
                        : 'bg-gray-100 border-gray-400 text-gray-800'
                    }`}
                  >
                    {flip === 'heads' ? 'H' : 'T'}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ToolLayout>
  );
};

export default CoinFlip;
