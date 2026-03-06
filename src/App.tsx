import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Awards from "./pages/Awards";
import AwardDetail from "./pages/AwardDetail";
import NotFound from "./pages/NotFound";
import ScrollOrchestrator from "./components/ScrollOrchestrator";
import { SmoothScroll } from './components/ui/SmoothScroll';

const queryClient = new QueryClient();

const App = () => (
  <SmoothScroll>
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <HashRouter>
            <ScrollOrchestrator>
              <Routes>
                <Route path="/" element={<Index />} />

                {/* Blog routes */}
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />

                {/* Awards routes */}
                <Route path="/premios" element={<Awards />} />
                <Route path="/premios/:slug" element={<AwardDetail />} />

                {/* Catch-all → home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </ScrollOrchestrator>
          </HashRouter>
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  </SmoothScroll>
);

export default App;
