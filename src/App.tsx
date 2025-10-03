import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FocusModeProvider } from "./contexts/FocusModeContext";
import { AppLayout } from "./components/layout/AppLayout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import Timer from "./pages/Timer";
import Notes from "./pages/Notes";
import Subjects from "./pages/Subjects";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <FocusModeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
            <Route path="/subjects" element={<AppLayout><Subjects /></AppLayout>} />
            <Route path="/calendar" element={<AppLayout><Calendar /></AppLayout>} />
            <Route path="/timer" element={<AppLayout><Timer /></AppLayout>} />
            <Route path="/notes" element={<AppLayout><Notes /></AppLayout>} />
            <Route path="/settings" element={<AppLayout><Settings /></AppLayout>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </FocusModeProvider>
  </QueryClientProvider>
);

export default App;
