
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DocumentsPage from "./pages/DocumentsPage";
import AskPage from "./pages/AskPage";
import NavBar from "./components/layout/NavBar";
import { DocumentProvider } from "./context/DocumentContext";
import { QueryProvider } from "./context/QueryContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DocumentProvider>
      <QueryProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="flex flex-col min-h-screen">
              <NavBar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/documents" element={<DocumentsPage />} />
                  <Route path="/ask" element={<AskPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </QueryProvider>
    </DocumentProvider>
  </QueryClientProvider>
);

export default App;
