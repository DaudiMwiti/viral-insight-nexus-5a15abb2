
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Comparison from "./pages/Comparison";
import Insights from "./pages/Insights";
import Alerts from "./pages/Alerts";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./components/theme/ThemeProvider";

// Focus visible outline styles
import "./styles/focus-visible.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="insight-ai-theme">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <TooltipProvider>
            <Toaster />
            <Sonner position="top-right" />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/homepage" element={<Navigate to="/insights" replace />} />
              <Route path="/overview" element={<Navigate to="/insights" replace />} />
              <Route path="/comparison" element={<Comparison />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
