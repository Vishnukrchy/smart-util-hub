
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Brain, 
  FileText, 
  Globe, 
  Calendar, 
  Palette, 
  Gamepad2,
  Sparkles,
  ArrowRight
} from "lucide-react";

const utilityCategories = [
  {
    title: "🌐 Web & Dev Tools",
    description: "Developer utilities and web tools",
    icon: Globe,
    color: "from-green-500 to-emerald-500",
    tools: [
      { name: "URL Shortener", path: "/web/url-shortener", description: "Create short URLs" },
      { name: "YouTube Downloader", path: "/web/youtube-downloader", description: "Download YouTube videos" },
      { name: "JSON Formatter", path: "/web/json-formatter", description: "Format and validate JSON" },
      { name: "JWT Decoder", path: "/web/jwt-decoder", description: "Decode JWT tokens" },
      { name: "Regex Tester", path: "/web/regex-tester", description: "Test regular expressions" },
      { name: "Markdown to HTML", path: "/web/markdown-to-html", description: "Convert Markdown" },
      { name: "Timestamp Converter", path: "/web/timestamp-converter", description: "Convert timestamps" },
      { name: "UUID Generator", path: "/web/uuid-generator", description: "Generate unique IDs" },
      { name: "QR Code Generator", path: "/web/qr-generator", description: "Generate QR codes" }
    ]
  },
  {
    title: "🎨 UI Tools",
    description: "Design and styling utilities",
    icon: Palette,
    color: "from-pink-500 to-rose-500",
    tools: [
      { name: "Image Resizer", path: "/ui/image-resizer", description: "Resize images" },
      { name: "Gradient Generator", path: "/ui/gradient-generator", description: "Create CSS gradients" },
      { name: "Favicon Generator", path: "/ui/favicon-generator", description: "Generate favicons" },
      { name: "Color Contrast", path: "/ui/color-contrast", description: "Check color contrast" },
      { name: "Box Shadow Generator", path: "/ui/box-shadow", description: "Create CSS shadows" }
    ]
  },
  {
    title: "📈 Productivity Tools",
    description: "Stay organized and productive",
    icon: Calendar,
    color: "from-orange-500 to-red-500",
    tools: [
      { name: "Todo Tracker", path: "/productivity/todo-tracker", description: "Manage your tasks" },
      { name: "Daily Planner", path: "/productivity/daily-planner", description: "Plan your day" },
      { name: "Sticky Notes", path: "/productivity/sticky-notes", description: "Quick notes" }
    ]
  },
  {
    title: "🧠 AI Features",
    description: "AI-powered tools for text enhancement and analysis",
    icon: Brain,
    color: "from-purple-500 to-pink-500",
    tools: [
      { name: "Prompt Enhancer", path: "/ai/prompt-enhancer", description: "Improve your AI prompts" },
      { name: "Email Assistant", path: "/ai/email-assistant", description: "AI Email Assistant to help you write reply emails" },
      { name: "Mood Analyzer", path: "/ai/mood-analyzer", description: "Analyze text sentiment" },
      { name: "AI Chat Tester", path: "/ai/chat-tester", description: "Test AI conversations" },
      { name: "Resume Improver", path: "/ai/resume-improver", description: "Enhance your resume text" }
    ]
  },
  {
    title: "📄 File Tools",
    description: "Convert, merge, and process your files",
    icon: FileText,
    color: "from-blue-500 to-cyan-500",
    tools: [
      { name: "PDF to Word", path: "/files/pdf-to-word", description: "Convert PDF to Word" },
      { name: "Image to Text", path: "/files/image-to-text", description: "Extract text from images" },
      { name: "Merge PDFs", path: "/files/merge-pdfs", description: "Combine multiple PDFs" },
      { name: "File Compressor", path: "/files/compressor", description: "Reduce file sizes" },
      { name: "CSV to JSON", path: "/files/csv-to-json", description: "Convert CSV to JSON" }
    ]
  },
  {
    title: "🧪 Fun & Extras",
    description: "Entertaining and miscellaneous tools",
    icon: Gamepad2,
    color: "from-indigo-500 to-purple-500",
    tools: [
      { name: "Coin Flip", path: "/fun/coin-flip", description: "Flip a virtual coin" },
      { name: "Quote of the Day", path: "/fun/quote-of-day", description: "Daily inspiration" },
      { name: "Speed Tester", path: "/fun/speed-tester", description: "Test internet speed" }
    ]
  }
];

const Index = () => {
  return (
    <ScrollArea className="h-full">
      <div className="space-y-8 pb-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="w-8 h-8 text-purple-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              SmartUtil
            </h1>
            <Sparkles className="w-8 h-8 text-blue-500" />
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your one-stop destination for daily utility tools. From developer utilities to AI-powered enhancement and productivity tools.
          </p>
          <Badge variant="secondary" className="text-sm">
            {utilityCategories.reduce((total, category) => total + category.tools.length, 0)} Tools Available
          </Badge>
        </div>

        {/* Utility Categories */}
        <div className="space-y-12">
          {utilityCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center`}>
                  <category.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{category.title}</h2>
                  <p className="text-muted-foreground">{category.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {category.tools.map((tool, toolIndex) => (
                  <Link key={toolIndex} to={tool.path}>
                    <Card className="h-full hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center justify-between">
                          {tool.name}
                          <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>{tool.description}</CardDescription>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center py-8 border-t">
          <p className="text-muted-foreground">
            Built with React, TypeScript, and Tailwind CSS, and Python , and Gemini 
          </p>
        </div>
      </div>
    </ScrollArea>
  );
};

export default Index;
