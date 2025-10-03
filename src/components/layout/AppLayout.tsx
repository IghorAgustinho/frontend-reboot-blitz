import { useState } from "react";
import { AppSidebar } from "./AppSidebar";
import { cn } from "@/lib/utils";
import { useFocusMode } from "@/hooks/useFocusMode";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Enable focus mode audio alert
  useFocusMode();

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <main 
        className={cn(
          "flex-1 overflow-hidden transition-all duration-300",
          "animate-fade-in"
        )}
      >
        {children}
      </main>
    </div>
  );
}