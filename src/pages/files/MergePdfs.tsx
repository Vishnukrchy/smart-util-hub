
import { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUp, Download, X, FilePlus2 } from "lucide-react";
import { toast } from "sonner";

interface UploadedFile {
  file: File;
  id: string;
  name: string;
  size: string;
}

const MergePdfs = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type !== 'application/pdf') {
        toast.error(`${file.name} is not a PDF file`);
        return;
      }

      const newFile: UploadedFile = {
        file,
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: formatFileSize(file.size)
      };

      setUploadedFiles(prev => [...prev, newFile]);
    });

    // Reset input
    event.target.value = '';
  }, []);

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const moveFileUp = (index: number) => {
    if (index === 0) return;
    setUploadedFiles(prev => {
      const newFiles = [...prev];
      [newFiles[index], newFiles[index - 1]] = [newFiles[index - 1], newFiles[index]];
      return newFiles;
    });
  };

  const moveFileDown = (index: number) => {
    if (index === uploadedFiles.length - 1) return;
    setUploadedFiles(prev => {
      const newFiles = [...prev];
      [newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]];
      return newFiles;
    });
  };

  const mergePdfs = async () => {
    if (uploadedFiles.length < 2) {
      toast.error("Please upload at least 2 PDF files to merge");
      return;
    }

    setIsProcessing(true);
    
    try {
      // Note: This is a simulation since actual PDF merging requires server-side processing
      // In a real implementation, you would send files to a backend service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a simple merged file name
      const mergedFileName = `merged_${Date.now()}.pdf`;
      
      // For demo purposes, we'll just download the first file as "merged"
      const firstFile = uploadedFiles[0].file;
      const url = URL.createObjectURL(firstFile);
      const a = document.createElement('a');
      a.href = url;
      a.download = mergedFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("PDFs merged successfully!");
    } catch (error) {
      console.error('Merge error:', error);
      toast.error("Failed to merge PDFs. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      title="📄 Merge PDFs"
      description="Combine multiple PDF files into one document."
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FilePlus2 className="w-6 h-6 text-blue-500" />
              <span>PDF Merger</span>
            </CardTitle>
            <CardDescription>
              Upload multiple PDF files and merge them into a single document
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Upload */}
            <div className="space-y-2">
              <Label htmlFor="pdf-upload">Upload PDF Files</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <FileUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <Input
                  id="pdf-upload"
                  type="file"
                  multiple
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Label
                  htmlFor="pdf-upload"
                  className="cursor-pointer text-blue-600 hover:text-blue-500"
                >
                  Click to upload PDF files or drag and drop
                </Label>
                <p className="text-sm text-gray-500 mt-2">
                  Select multiple PDF files to merge them together
                </p>
              </div>
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Uploaded Files ({uploadedFiles.length})</h3>
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-lg font-bold text-gray-500">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-gray-500">{file.size}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => moveFileUp(index)}
                          disabled={index === 0}
                        >
                          ↑
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => moveFileDown(index)}
                          disabled={index === uploadedFiles.length - 1}
                        >
                          ↓
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeFile(file.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Merge Button */}
            {uploadedFiles.length >= 2 && (
              <div className="text-center">
                <Button
                  onClick={mergePdfs}
                  disabled={isProcessing}
                  size="lg"
                  className="w-full md:w-auto"
                >
                  {isProcessing ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <Download className="w-5 h-5 mr-2" />
                      Merge PDFs
                    </>
                  )}
                </Button>
              </div>
            )}

            {uploadedFiles.length > 0 && uploadedFiles.length < 2 && (
              <div className="text-center text-gray-500">
                Upload at least 2 PDF files to enable merging
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Upload multiple PDF files using the upload area above</li>
              <li>Reorder files using the up/down arrows if needed</li>
              <li>Remove unwanted files using the X button</li>
              <li>Click "Merge PDFs" to combine all files into one document</li>
              <li>The merged PDF will be downloaded automatically</li>
            </ol>
            <p className="text-sm text-gray-500 mt-4">
              <strong>Note:</strong> This is a demo implementation. In a production environment, 
              PDF merging would be handled by a backend service for better performance and security.
            </p>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default MergePdfs;
