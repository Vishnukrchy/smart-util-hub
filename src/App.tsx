import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ChatRoom from "./pages/ChatRoom";

// AI Features
import PromptEnhancer from "./pages/ai/PromptEnhancer";
import ResumeImprover from "./pages/ai/ResumeImprover";
import MoodAnalyzer from "./pages/ai/MoodAnalyzer";
import AiChatTester from "./pages/ai/AiChatTester";
import EmailAssistant from "./pages/ai/EmailAssistant";
import LinkedInPostGenerator from "./pages/ai/LinkedInPostGenerator";
import InstagramPostGenerator from "./pages/ai/InstagramPostGenerator";
import TwitterPostGenerator from "./pages/ai/TwitterPostGenerator";
import AIPostGenerator from "./pages/ai/AIPostGenerator";

// File Tools
import PdfToWord from "./pages/files/PdfToWord";
import ImageToText from "./pages/files/ImageToText";
import MergePdfs from "./pages/files/MergePdfs";
import FileCompressor from "./pages/files/FileCompressor";
import CsvToJson from "./pages/files/CsvToJson";

// Web & Dev Tools
import UrlShortener from "./pages/web/UrlShortener";
import YoutubeDownloader from "./pages/web/YoutubeDownloader";
import JsonFormatter from "./pages/web/JsonFormatter";
import JwtDecoder from "./pages/web/JwtDecoder";
import RegexTester from "./pages/web/RegexTester";
import MarkdownToHtml from "./pages/web/MarkdownToHtml";
import TimestampConverter from "./pages/web/TimestampConverter";
import UuidGenerator from "./pages/web/UuidGenerator";
import QrCodeGenerator from "./pages/web/QrCodeGenerator";
import HTTPCats from "./pages/web/HTTPCats";
import XKCDComic from "./pages/web/XKCDComic";

// Productivity Tools
import TodoTracker from "./pages/productivity/TodoTracker";
import DailyPlanner from "./pages/productivity/DailyPlanner";
import StickyNotes from "./pages/productivity/StickyNotes";

// UI Tools
import ImageResizer from "./pages/ui/ImageResizer";
import GradientGenerator from "./pages/ui/GradientGenerator";
import FaviconGenerator from "./pages/ui/FaviconGenerator";
import ColorContrast from "./pages/ui/ColorContrast";
import BoxShadowGenerator from "./pages/ui/BoxShadowGenerator";

// Fun & Extras
import CoinFlip from "./pages/fun/CoinFlip";
import QuoteOfDay from "./pages/fun/QuoteOfDay";
import SpeedTester from "./pages/fun/SpeedTester";
import MemeGenerator from "./pages/fun/MemeGenerator";
import TriviaQuiz from "./pages/fun/TriviaQuiz";

import Connect from "./pages/Connect"; // NEW
import About from "./pages/About";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background flex flex-col">
          <Navbar />
          <main className="flex-1 container mx-auto px-4 py-8 overflow-auto">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/chat" element={<ChatRoom />} />
              
              {/* AI Features */}
              <Route path="/ai/prompt-enhancer" element={<PromptEnhancer />} />
              <Route path="/ai/resume-improver" element={<ResumeImprover />} />
              <Route path="/ai/mood-analyzer" element={<MoodAnalyzer />} />
              <Route path="/ai/chat-tester" element={<AiChatTester />} />
              <Route path="/ai/email-assistant" element={<EmailAssistant />} />
              <Route path="/ai/post-generator" element={<AIPostGenerator />} />
              <Route path="/ai/post-generator/linkedin" element={<LinkedInPostGenerator />} />
              <Route path="/ai/post-generator/instagram" element={<InstagramPostGenerator />} />
              <Route path="/ai/post-generator/twitter" element={<TwitterPostGenerator />} />
              
              {/* File Tools */}
              <Route path="/files/pdf-to-word" element={<PdfToWord />} />
              <Route path="/files/image-to-text" element={<ImageToText />} />
              <Route path="/files/merge-pdfs" element={<MergePdfs />} />
              <Route path="/files/compressor" element={<FileCompressor />} />
              <Route path="/files/csv-to-json" element={<CsvToJson />} />
              
              {/* Web & Dev Tools */}
              <Route path="/web/url-shortener" element={<UrlShortener />} />
              <Route path="/web/youtube-downloader" element={<YoutubeDownloader />} />
              <Route path="/web/json-formatter" element={<JsonFormatter />} />
              <Route path="/web/jwt-decoder" element={<JwtDecoder />} />
              <Route path="/web/regex-tester" element={<RegexTester />} />
              <Route path="/web/markdown-to-html" element={<MarkdownToHtml />} />
              <Route path="/web/timestamp-converter" element={<TimestampConverter />} />
              <Route path="/web/uuid-generator" element={<UuidGenerator />} />
              <Route path="/web/qr-generator" element={<QrCodeGenerator />} />
              <Route path="/web/http-cats" element={<HTTPCats />} />
              <Route path="/web/xkcd-comic" element={<XKCDComic />} />
              
              {/* Productivity Tools */}
              <Route path="/productivity/todo-tracker" element={<TodoTracker />} />
              <Route path="/productivity/daily-planner" element={<DailyPlanner />} />
              <Route path="/productivity/sticky-notes" element={<StickyNotes />} />
              
              {/* UI Tools */}
              <Route path="/ui/image-resizer" element={<ImageResizer />} />
              <Route path="/ui/gradient-generator" element={<GradientGenerator />} />
              <Route path="/ui/favicon-generator" element={<FaviconGenerator />} />
              <Route path="/ui/color-contrast" element={<ColorContrast />} />
              <Route path="/ui/box-shadow" element={<BoxShadowGenerator />} />
              
              {/* Fun & Extras */}
              <Route path="/fun/coin-flip" element={<CoinFlip />} />
              <Route path="/fun/quote-of-day" element={<QuoteOfDay />} />
              <Route path="/fun/meme-generator" element={<MemeGenerator />} />
              <Route path="/fun/trivia-quiz" element={<TriviaQuiz />} />
              <Route path="/fun/speed-tester" element={<SpeedTester />} />
              
              <Route path="/connect" element={<Connect />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
