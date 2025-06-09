
import { Link } from "react-router-dom";
import { Home, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar = () => {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">SU</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            SmartUtil
          </span>
        </Link>

        <div className="flex items-center space-x-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </Link>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Menu className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>SmartUtil Tools</SheetTitle>
                <SheetDescription>
                  Navigate to any utility tool
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">🧠 AI Features</h3>
                  <div className="space-y-1 ml-4">
                    <Link to="/ai/prompt-enhancer" className="block text-sm hover:text-primary">Prompt Enhancer</Link>
                    <Link to="/ai/resume-improver" className="block text-sm hover:text-primary">Resume Improver</Link>
                    <Link to="/ai/mood-analyzer" className="block text-sm hover:text-primary">Mood Analyzer</Link>
                    <Link to="/ai/chat-tester" className="block text-sm hover:text-primary">AI Chat Tester</Link>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">📄 File Tools</h3>
                  <div className="space-y-1 ml-4">
                    <Link to="/files/pdf-to-word" className="block text-sm hover:text-primary">PDF to Word</Link>
                    <Link to="/files/image-to-text" className="block text-sm hover:text-primary">Image to Text</Link>
                    <Link to="/files/merge-pdfs" className="block text-sm hover:text-primary">Merge PDFs</Link>
                    <Link to="/files/compressor" className="block text-sm hover:text-primary">File Compressor</Link>
                    <Link to="/files/csv-to-json" className="block text-sm hover:text-primary">CSV to JSON</Link>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">🌐 Web & Dev Tools</h3>
                  <div className="space-y-1 ml-4">
                    <Link to="/web/url-shortener" className="block text-sm hover:text-primary">URL Shortener</Link>
                    <Link to="/web/youtube-downloader" className="block text-sm hover:text-primary">YouTube Downloader</Link>
                    <Link to="/web/json-formatter" className="block text-sm hover:text-primary">JSON Formatter</Link>
                    <Link to="/web/jwt-decoder" className="block text-sm hover:text-primary">JWT Decoder</Link>
                    <Link to="/web/regex-tester" className="block text-sm hover:text-primary">Regex Tester</Link>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
