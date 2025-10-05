import { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  Home, 
  Calendar, 
  BookOpen, 
  Timer, 
  FileText, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Focus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useFocusModeContext } from "@/contexts/FocusModeContext";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Calendário", href: "/calendar", icon: Calendar },
  { name: "Disciplinas", href: "/subjects", icon: BookOpen },
  { name: "Timer", href: "/timer", icon: Timer },
  { name: "Anotações", href: "/notes", icon: FileText },
];

export function AppSidebar({ collapsed, onToggle }: SidebarProps) {
  const { focusModeEnabled, toggleFocusMode } = useFocusModeContext();
  
  return (
    <div
      className={cn(
        "flex h-screen flex-col border-r bg-card transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center border-b px-4">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-aurora">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">Skillium</span>
          </div>
        )}
        {collapsed && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-aurora mx-auto">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn(
            "h-8 w-8 hover:bg-accent/50 transition-colors flex-shrink-0",
            collapsed ? "ml-0" : "ml-auto"
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* User Profile */}
      <div className="border-b p-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10 ring-2 ring-primary/20">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=test" />
            <AvatarFallback className="gradient-aurora text-white font-semibold">
              UT
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">Usuário Teste</p>
              <p className="text-xs leading-none text-muted-foreground">
                teste@exemplo.com
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                "hover:bg-accent/50 hover:text-accent-foreground",
                isActive
                  ? "bg-primary text-primary-foreground shadow-aurora"
                  : "text-muted-foreground",
                collapsed && "justify-center px-0"
              )
            }
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t p-4 space-y-2">
        {/* Focus Mode Section */}
        <div className={cn(
          "mb-2 rounded-lg border border-border bg-muted/30 transition-all",
          collapsed ? "p-2" : "p-4"
        )}>
          <div className="flex items-center gap-3 mb-2">
            <div className={cn(
              "flex items-center justify-center rounded-md bg-primary/10",
              collapsed ? "h-8 w-8 mx-auto" : "h-9 w-9"
            )}>
              <Focus className={cn("text-primary", collapsed ? "h-4 w-4" : "h-5 w-5")} />
            </div>
            {!collapsed && (
              <h3 className="font-semibold text-sm">Modo Foco</h3>
            )}
          </div>
          
          {!collapsed && (
            <>
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                Receba alertas sonoros quando perder o foco por mais de 15 segundos, ajudando você a manter a concentração nos estudos.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">
                  {focusModeEnabled ? "Ativado" : "Desativado"}
                </span>
                <Switch
                  checked={focusModeEnabled}
                  onCheckedChange={toggleFocusMode}
                />
              </div>
            </>
          )}
          
          {collapsed && (
            <div className="flex justify-center mt-1">
              <Switch
                checked={focusModeEnabled}
                onCheckedChange={toggleFocusMode}
                className="scale-75"
              />
            </div>
          )}
        </div>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
              "hover:bg-accent/50 hover:text-accent-foreground",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground",
              collapsed && "justify-center px-0"
            )
          }
        >
          <Settings className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>Configurações</span>}
        </NavLink>
        
        <Button
          variant="ghost"
          className={cn(
            "w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors",
            collapsed ? "justify-center px-0" : "justify-start"
          )}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span className="ml-3">Sair</span>}
        </Button>
      </div>
    </div>
  );
}