import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import Index from "./pages/Index";
import Subjects from "./pages/Subjects";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/subjects" element={<AppLayout><Subjects /></AppLayout>} />
          <Route path="/calendar" element={<AppLayout><div className="p-8"><h1 className="text-3xl font-bold">Calendário</h1><p className="text-muted-foreground">Em desenvolvimento...</p></div></AppLayout>} />
          <Route path="/timer" element={<AppLayout><div className="p-8"><h1 className="text-3xl font-bold">Timer</h1><p className="text-muted-foreground">Em desenvolvimento...</p></div></AppLayout>} />
          <Route path="/notes" element={<AppLayout><div className="p-8"><h1 className="text-3xl font-bold">Anotações</h1><p className="text-muted-foreground">Em desenvolvimento...</p></div></AppLayout>} />
          <Route path="/settings" element={<AppLayout><div className="p-8"><h1 className="text-3xl font-bold">Configurações</h1><p className="text-muted-foreground">Em desenvolvimento...</p></div></AppLayout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
