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
              {/* Strict Global Bounds for X Leak Prevention & Noise Layer Attachment */}
              <main className="relative w-full max-w-[100vw] overflow-x-clip bg-background">
                {/* Fixed Noise Overlay mapping to 100dvh to avoid GPU Context Loss */}
                <div
                  className="fixed inset-0 z-50 pointer-events-none mix-blend-overlay opacity-20"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat',
                  }}
                />

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
              </main>
            </ScrollOrchestrator>
          </HashRouter>
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  </SmoothScroll>
);

export default App;
