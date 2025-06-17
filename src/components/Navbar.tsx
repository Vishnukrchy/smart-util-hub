import { Link, useLocation } from "react-router-dom";
import { Home, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const menuCategories = [
  {
    title: "🌐 Web & Dev Tools",
    links: [
      { name: "URL Shortener", path: "/web/url-shortener" },
      { name: "YouTube Downloader", path: "/web/youtube-downloader" },
      { name: "JSON Formatter", path: "/web/json-formatter" },
      { name: "JWT Decoder", path: "/web/jwt-decoder" },
      { name: "Regex Tester", path: "/web/regex-tester" },
      { name: "Markdown to HTML", path: "/web/markdown-to-html" },
      { name: "Timestamp Converter", path: "/web/timestamp-converter" },
      { name: "UUID Generator", path: "/web/uuid-generator" },
      { name: "QR Code Generator", path: "/web/qr-generator" }
    ]
  },
  {
    title: "📈 Productivity Tools",
    links: [
      { name: "Todo Tracker", path: "/productivity/todo-tracker" },
      { name: "Daily Planner", path: "/productivity/daily-planner" },
      { name: "Sticky Notes", path: "/productivity/sticky-notes" }
    ]
  },
  {
    title: "🧠 AI Features",
    links: [
      { name: "Prompt Enhancer", path: "/ai/prompt-enhancer" },
      { name: "Resume Improver", path: "/ai/resume-improver" },
      { name: "Mood Analyzer", path: "/ai/mood-analyzer" },
      { name: "AI Chat Tester", path: "/ai/chat-tester" },
      { name: "Email Assistant", path: "/ai/email-assistant" },
    ]
  },
  {
    title: "📄 File Tools",
    links: [
      { name: "PDF to Word", path: "/files/pdf-to-word" },
      { name: "Image to Text", path: "/files/image-to-text" },
      { name: "Merge PDFs", path: "/files/merge-pdfs" },
      { name: "File Compressor", path: "/files/compressor" },
      { name: "CSV to JSON", path: "/files/csv-to-json" }
    ]
  },
  {
    title: "🎨 UI Tools",
    links: [
      { name: "Image Resizer", path: "/ui/image-resizer" },
      { name: "Gradient Generator", path: "/ui/gradient-generator" },
      { name: "Favicon Generator", path: "/ui/favicon-generator" },
      { name: "Color Contrast", path: "/ui/color-contrast" },
      { name: "Box Shadow Generator", path: "/ui/box-shadow" }
    ]
  },
  {
    title: "🧪 Fun & Extras",
    links: [
      { name: "Coin Flip", path: "/fun/coin-flip" },
      { name: "Quote of the Day", path: "/fun/quote-of-day" },
      { name: "Speed Tester", path: "/fun/speed-tester" }
    ]
  }
];

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
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

          <Link to="/connect">
            <Button
              variant={location.pathname === "/connect" ? "secondary" : "outline"}
              size="sm"
              className="transition-all shadow-sm border-purple-500 text-purple-700 !font-semibold"
            >
              Connect
            </Button>
          </Link>

          <Link to="/about">
            <Button
              variant={location.pathname === "/about" ? "secondary" : "outline"}
              size="sm"
              className="transition-all shadow-sm border-blue-500 text-blue-700 !font-semibold"
            >
              About
            </Button>
          </Link>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Menu className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="text-left">SmartUtil Tools</SheetTitle>
                <SheetDescription className="text-left">
                  Navigate to any utility tool
                </SheetDescription>
              </SheetHeader>
              
              <ScrollArea className="h-[calc(100vh-120px)] mt-6">
                <div className="space-y-6 pr-4">
                  {menuCategories.map((category, index) => (
                    <div key={index} className="space-y-2">
                      <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                        {category.title}
                      </h3>
                      <div className="space-y-1 ml-2">
                        {category.links.map((link, linkIndex) => (
                          <Link 
                            key={linkIndex} 
                            to={link.path} 
                            className="block text-sm py-2 px-3 rounded-md hover:bg-muted hover:text-foreground transition-colors"
                          >
                            {link.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
