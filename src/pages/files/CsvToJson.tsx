
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Download, FileText, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ToolLayout from "@/components/ToolLayout";

const CsvToJson = () => {
  const [csvInput, setCsvInput] = useState("");
  const [jsonOutput, setJsonOutput] = useState("");
  const [rowCount, setRowCount] = useState(0);
  const { toast } = useToast();

  const convertCsvToJson = () => {
    if (!csvInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter CSV data",
        variant: "destructive"
      });
      return;
    }

    try {
      const lines = csvInput.trim().split('\n');
      const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''));
      
      const jsonData = lines.slice(1).map(line => {
        const values = line.split(',').map(value => value.trim().replace(/"/g, ''));
        const obj: any = {};
        
        headers.forEach((header, index) => {
          obj[header] = values[index] || '';
        });
        
        return obj;
      });

      const formattedJson = JSON.stringify(jsonData, null, 2);
      setJsonOutput(formattedJson);
      setRowCount(jsonData.length);
      
      toast({
        title: "Success",
        description: `Converted ${jsonData.length} rows to JSON!`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to parse CSV data",
        variant: "destructive"
      });
    }
  };

  const copyJson = () => {
    navigator.clipboard.writeText(jsonOutput);
    toast({
      title: "Copied",
      description: "JSON data copied to clipboard"
    });
  };

  const downloadJson = () => {
    const blob = new Blob([jsonOutput], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted.json";
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded",
      description: "JSON file downloaded"
    });
  };

  const loadExample = () => {
    const exampleCsv = `name,age,city,email
John Doe,30,New York,john@example.com
Jane Smith,25,Los Angeles,jane@example.com
Bob Johnson,35,Chicago,bob@example.com
Alice Brown,28,Miami,alice@example.com`;

    setCsvInput(exampleCsv);
  };

  return (
    <ToolLayout
      title="📄 CSV to JSON Converter"
      description="Convert CSV data to JSON format with automatic parsing and validation."
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <Button onClick={convertCsvToJson}>
              <FileText className="w-4 h-4 mr-2" />
              Convert to JSON
            </Button>
            <Button onClick={loadExample} variant="outline">
              Load Example
            </Button>
          </div>
          
          {jsonOutput && (
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">
                <CheckCircle className="w-3 h-3 mr-1" />
                {rowCount} rows
              </Badge>
              <Button onClick={copyJson} size="sm">
                <Copy className="w-4 h-4 mr-2" />
                Copy JSON
              </Button>
              <Button onClick={downloadJson} size="sm" variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">CSV Input</label>
            <Textarea
              placeholder="name,age,city&#10;John Doe,30,New York&#10;Jane Smith,25,Los Angeles"
              value={csvInput}
              onChange={(e) => setCsvInput(e.target.value)}
              className="min-h-[400px] font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">JSON Output</label>
            {jsonOutput ? (
              <Textarea
                value={jsonOutput}
                readOnly
                className="min-h-[400px] font-mono text-sm bg-muted"
              />
            ) : (
              <div className="min-h-[400px] border rounded bg-muted/50 flex items-center justify-center">
                <p className="text-muted-foreground">JSON output will appear here</p>
              </div>
            )}
          </div>
        </div>

        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-sm">📋 CSV Format Tips</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p>• First row should contain column headers</p>
                <p>• Use commas to separate values</p>
                <p>• Wrap text with quotes if it contains commas</p>
              </div>
              <div>
                <p>• Each row should have the same number of columns</p>
                <p>• Empty values are allowed</p>
                <p>• No extra spaces around commas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default CsvToJson;
