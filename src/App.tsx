import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
  <HashRouter>
    <Routes>
      <Route path="/" element={<Index />} />

      {/* Listado */}
      <Route path="/blog" element={<Blog />} />

      {/* Detalle principal con parámetro slug */}
      <Route path="/blog/:slug" element={<BlogPost />} />

      {/* Catch-all → a la home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
