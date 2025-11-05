import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  FileText,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
  isAllDay: boolean;
  location?: string;
  description?: string;
}

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Events will be loaded from backend API
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    isAllDay: false,
    location: "",
    description: ""
  });

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getEventsForDay = (day: number) => {
    if (!day) return [];
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => event.date === dateStr);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleCreateEvent = () => {
    if (!newEvent.title || !newEvent.date) return;
    
    const event: CalendarEvent = {
      id: Date.now().toString(),
      title: newEvent.title,
      date: newEvent.date,
      startTime: newEvent.isAllDay ? undefined : newEvent.startTime,
      endTime: newEvent.isAllDay ? undefined : newEvent.endTime,
      isAllDay: newEvent.isAllDay || false,
      location: newEvent.location,
      description: newEvent.description
    };
    
    setEvents(prev => [...prev, event]);
    setNewEvent({
      title: "",
      date: "",
      startTime: "",
      endTime: "",
      isAllDay: false,
      location: "",
      description: ""
    });
    setIsCreateModalOpen(false);
  };

  const openEventDetails = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsDetailsModalOpen(true);
  };

  const isToday = (day: number) => {
    if (!day) return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="p-4 md:p-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 shadow-aurora">
            <CalendarIcon className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gradient">Calendário</h1>
            <p className="text-muted-foreground">Gerencie seus eventos e compromissos</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20 text-primary hover:shadow-aurora transition-all duration-200">
            <Sparkles className="w-3 h-3 mr-2" />
            Google Conectado
          </Badge>
          
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button variant="aurora" className="shadow-aurora">
                <Plus className="h-4 w-4 mr-2" />
                Criar Evento
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] shadow-float animate-scale-in">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gradient">Criar Novo Evento</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Adicione um novo evento ao seu calendário
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="title">Título do Evento</Label>
                  <Input
                    id="title"
                    value={newEvent.title || ""}
                    onChange={(e) => setNewEvent(prev => ({...prev, title: e.target.value}))}
                    placeholder="Ex: Prova de Matemática"
                    className="border-border/50 focus:border-primary transition-colors"
                  />
                </div>
                
                <div>
                  <Label htmlFor="date">Data</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newEvent.date || ""}
                    onChange={(e) => setNewEvent(prev => ({...prev, date: e.target.value}))}
                    className="border-border/50 focus:border-primary transition-colors"
                  />
                </div>
                
                <div className="flex items-center space-x-2 p-3 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5 border border-border/50">
                  <Switch
                    id="all-day"
                    checked={newEvent.isAllDay || false}
                    onCheckedChange={(checked) => setNewEvent(prev => ({...prev, isAllDay: checked}))}
                  />
                  <Label htmlFor="all-day" className="cursor-pointer">Dia inteiro</Label>
                </div>
                
                {!newEvent.isAllDay && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="start-time">Hora Início</Label>
                      <Input
                        id="start-time"
                        type="time"
                        value={newEvent.startTime || ""}
                        onChange={(e) => setNewEvent(prev => ({...prev, startTime: e.target.value}))}
                        className="border-border/50 focus:border-primary transition-colors"
                      />
                    </div>
                    <div>
                      <Label htmlFor="end-time">Hora Fim</Label>
                      <Input
                        id="end-time"
                        type="time"
                        value={newEvent.endTime || ""}
                        onChange={(e) => setNewEvent(prev => ({...prev, endTime: e.target.value}))}
                        className="border-border/50 focus:border-primary transition-colors"
                      />
                    </div>
                  </div>
                )}
                
                <div>
                  <Label htmlFor="location">Local</Label>
                  <Input
                    id="location"
                    value={newEvent.location || ""}
                    onChange={(e) => setNewEvent(prev => ({...prev, location: e.target.value}))}
                    placeholder="Ex: Sala 205"
                    className="border-border/50 focus:border-primary transition-colors"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={newEvent.description || ""}
                    onChange={(e) => setNewEvent(prev => ({...prev, description: e.target.value}))}
                    placeholder="Adicione detalhes sobre o evento..."
                    className="border-border/50 focus:border-primary transition-colors"
                  />
                </div>
              </div>
              <DialogFooter className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="aurora" onClick={handleCreateEvent} className="shadow-aurora">
                  Salvar Evento
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Calendar */}
      <Card className="shadow-float border-border/50 overflow-hidden animate-scale-in">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-border/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-2xl md:text-3xl font-bold text-gradient">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigateMonth('prev')}
                className="hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-all duration-200"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigateMonth('next')}
                className="hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-all duration-200"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {daysOfWeek.map(day => (
              <div 
                key={day} 
                className="p-2 text-center font-bold text-sm text-primary/80 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg"
              >
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {getDaysInMonth(currentDate).map((day, index) => (
              <div
                key={index}
                className={cn(
                  "h-auto min-h-[80px] md:min-h-[100px] p-2 md:p-3 border rounded-xl flex flex-col items-start space-y-2 transition-all duration-300",
                  day 
                    ? 'bg-card hover:bg-gradient-to-br hover:from-primary/5 hover:to-secondary/5 hover:shadow-aurora hover:scale-[1.02] cursor-pointer' 
                    : 'bg-muted/10 opacity-40',
                  isToday(day || 0)
                    ? 'bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/50 shadow-aurora ring-2 ring-primary/20 animate-glow'
                    : 'border-border/50'
                )}
              >
                {day && (
                  <>
                    <div className={cn(
                      "text-sm md:text-base font-bold flex items-center justify-center w-7 h-7 rounded-full transition-all duration-200",
                      isToday(day)
                        ? 'bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-lg scale-110'
                        : 'text-foreground'
                    )}>
                      {day}
                    </div>
                    <div className="w-full space-y-1 overflow-auto max-h-[50px] md:max-h-[70px] scrollbar-hide">
                      {getEventsForDay(day).map(event => (
                        <div
                          key={event.id}
                          onClick={() => openEventDetails(event)}
                          className="group w-full p-1.5 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 cursor-pointer hover:from-primary/20 hover:to-secondary/20 hover:border-primary/40 hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex items-start gap-1">
                            <Clock className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                            <p className="text-xs font-medium text-foreground truncate group-hover:text-primary transition-colors">
                              {event.title}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Event Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="sm:max-w-[425px] shadow-float animate-scale-in">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gradient">{selectedEvent.title}</DialogTitle>
                <DialogDescription>
                  Detalhes do evento
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5 border border-border/50">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <CalendarIcon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium">
                    {new Date(selectedEvent.date).toLocaleDateString('pt-BR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5 border border-border/50">
                  <div className="p-2 rounded-lg bg-secondary/10">
                    <Clock className="h-4 w-4 text-secondary" />
                  </div>
                  <span className="font-medium">
                    {selectedEvent.isAllDay 
                      ? 'Dia Inteiro' 
                      : `${selectedEvent.startTime} - ${selectedEvent.endTime}`
                    }
                  </span>
                </div>
                
                {selectedEvent.location && (
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5 border border-border/50">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium">{selectedEvent.location}</span>
                  </div>
                )}
                
                {selectedEvent.description && (
                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5 border border-border/50">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm flex-1">{selectedEvent.description}</span>
                  </div>
                )}
              </div>
              <DialogFooter className="flex justify-between w-full">
                <Button 
                  variant="outline" 
                  className="hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 hover:border-primary/30 transition-all"
                >
                  Adicionar ao Google
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="hover:bg-muted transition-all"
                >
                  Fechar
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Calendar;
