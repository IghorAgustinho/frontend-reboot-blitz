import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  FileText
} from "lucide-react";

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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <CalendarIcon className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-gradient">Calendário</h1>
            <p className="text-muted-foreground">Gerencie seus eventos e compromissos</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Google Conectado
            </Badge>
          </div>
          
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Criar Evento
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Criar Novo Evento</DialogTitle>
                <DialogDescription>
                  Adicione um novo evento ao seu calendário
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Título do Evento</Label>
                  <Input
                    id="title"
                    value={newEvent.title || ""}
                    onChange={(e) => setNewEvent(prev => ({...prev, title: e.target.value}))}
                    placeholder="Ex: Prova de Matemática"
                  />
                </div>
                
                <div>
                  <Label htmlFor="date">Data</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newEvent.date || ""}
                    onChange={(e) => setNewEvent(prev => ({...prev, date: e.target.value}))}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="all-day"
                    checked={newEvent.isAllDay || false}
                    onCheckedChange={(checked) => setNewEvent(prev => ({...prev, isAllDay: checked}))}
                  />
                  <Label htmlFor="all-day">Dia inteiro</Label>
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
                      />
                    </div>
                    <div>
                      <Label htmlFor="end-time">Hora Fim</Label>
                      <Input
                        id="end-time"
                        type="time"
                        value={newEvent.endTime || ""}
                        onChange={(e) => setNewEvent(prev => ({...prev, endTime: e.target.value}))}
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
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={newEvent.description || ""}
                    onChange={(e) => setNewEvent(prev => ({...prev, description: e.target.value}))}
                    placeholder="Adicione detalhes sobre o evento..."
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateEvent}>
                    Salvar Evento
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Calendar */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {daysOfWeek.map(day => (
              <div key={day} className="p-2 text-center font-semibold text-muted-foreground">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth(currentDate).map((day, index) => (
              <div
                key={index}
                className={`min-h-[100px] p-2 border rounded-lg ${
                  day ? 'hover:bg-muted/50 cursor-pointer' : ''
                } ${isToday(day || 0) ? 'bg-primary/10 border-primary' : 'border-border'}`}
              >
                {day && (
                  <>
                    <div className={`text-sm font-semibold mb-1 ${
                      isToday(day) ? 'text-primary' : 'text-foreground'
                    }`}>
                      {day}
                    </div>
                    <div className="space-y-1">
                      {getEventsForDay(day).map(event => (
                        <div
                          key={event.id}
                          onClick={() => openEventDetails(event)}
                          className="text-xs p-1 bg-primary/20 text-primary rounded cursor-pointer hover:bg-primary/30 transition-colors"
                        >
                          {event.title}
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
        <DialogContent className="sm:max-w-[425px]">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedEvent.title}</DialogTitle>
                <DialogDescription>
                  Detalhes do evento
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span>{new Date(selectedEvent.date).toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {selectedEvent.isAllDay 
                      ? 'Dia Inteiro' 
                      : `${selectedEvent.startTime} - ${selectedEvent.endTime}`
                    }
                  </span>
                </div>
                
                {selectedEvent.location && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedEvent.location}</span>
                  </div>
                )}
                
                {selectedEvent.description && (
                  <div className="flex items-start space-x-2">
                    <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="text-sm">{selectedEvent.description}</span>
                  </div>
                )}
                
                <div className="flex justify-between pt-4">
                  <Button variant="outline">
                    Adicionar ao Google
                  </Button>
                  <Button variant="outline" onClick={() => setIsDetailsModalOpen(false)}>
                    Fechar
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Calendar;