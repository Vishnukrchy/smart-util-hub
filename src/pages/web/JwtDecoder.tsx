
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Copy, Key, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ToolLayout from "@/components/ToolLayout";

const JwtDecoder = () => {
  const [jwt, setJwt] = useState("");
  const [decodedData, setDecodedData] = useState<any>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const decodeJWT = () => {
    if (!jwt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a JWT token",
        variant: "destructive"
      });
      return;
    }

    try {
      const parts = jwt.split('.');
      if (parts.length !== 3) {
        throw new Error("Invalid JWT format - must have 3 parts");
      }

      const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));

      // Check if token is expired
      const now = Math.floor(Date.now() / 1000);
      const isExpired = payload.exp && payload.exp < now;

      setDecodedData({
        header,
        payload,
        signature: parts[2],
        isExpired,
        issuedAt: payload.iat ? new Date(payload.iat * 1000).toLocaleString() : null,
        expiresAt: payload.exp ? new Date(payload.exp * 1000).toLocaleString() : null
      });

      setIsValid(!isExpired);
      setError("");
      
      toast({
        title: "Success",
        description: `JWT decoded successfully${isExpired ? " (Token is expired)" : ""}!`
      });
    } catch (err) {
      setIsValid(false);
      setError(err instanceof Error ? err.message : "Invalid JWT token");
      setDecodedData(null);
      toast({
        title: "Error",
        description: "Invalid JWT token format",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: `${label} copied to clipboard`
    });
  };

  const loadExample = () => {
    // Example JWT token (header.payload.signature format)
    const exampleJWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE3MzM5MTYwMDB9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
    setJwt(exampleJWT);
  };

  return (
    <ToolLayout
      title="🌐 JWT Decoder"
      description="Decode and analyze JWT tokens to view their header, payload, and signature."
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <Button onClick={decodeJWT}>
              <Key className="w-4 h-4 mr-2" />
              Decode JWT
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
                  Valid Token
                </>
              ) : (
                <>
                  <XCircle className="w-3 h-3 mr-1" />
                  {decodedData?.isExpired ? "Expired Token" : "Invalid Token"}
                </>
              )}
            </Badge>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">JWT Token</label>
          <Textarea
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            value={jwt}
            onChange={(e) => setJwt(e.target.value)}
            className="min-h-[120px] font-mono text-sm"
          />
        </div>

        {error && (
          <Card className="bg-red-50 border-red-200">
            <CardHeader>
              <CardTitle className="text-red-700 text-sm">Decode Error</CardTitle>
            </CardHeader>
            <CardContent>
              <code className="text-red-600 text-sm">{error}</code>
            </CardContent>
          </Card>
        )}

        {decodedData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Header</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(JSON.stringify(decodedData.header, null, 2), "Header")}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <pre className="text-sm bg-muted p-3 rounded overflow-auto">
                  {JSON.stringify(decodedData.header, null, 2)}
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Payload</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(JSON.stringify(decodedData.payload, null, 2), "Payload")}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <pre className="text-sm bg-muted p-3 rounded overflow-auto">
                  {JSON.stringify(decodedData.payload, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </div>
        )}

        {decodedData && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Lock className="w-5 h-5 mr-2" />
                Token Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {decodedData.issuedAt && (
                <div className="flex justify-between">
                  <span className="font-medium">Issued At:</span>
                  <span>{decodedData.issuedAt}</span>
                </div>
              )}
              {decodedData.expiresAt && (
                <div className="flex justify-between">
                  <span className="font-medium">Expires At:</span>
                  <span className={decodedData.isExpired ? "text-red-600" : ""}>
                    {decodedData.expiresAt}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="font-medium">Algorithm:</span>
                <span>{decodedData.header.alg}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Type:</span>
                <span>{decodedData.header.typ}</span>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-sm">🔒 JWT Security Info</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>• JWT tokens contain encoded but not encrypted data</p>
            <p>• Never store sensitive information in JWT payload</p>
            <p>• Signature verification requires the secret key</p>
            <p>• Always check token expiration in production</p>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default JwtDecoder;
