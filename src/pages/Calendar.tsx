import { useState, useCallback, useEffect } from "react";
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
  Loader2,
  Trash2,
  Edit,
  ExternalLink
} from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isToday,
  parseISO,
  isSameDay
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URL, getAuthHeaders } from "@/config/api";

interface CalendarEvent {
  id: string;
  titulo: string;
  descricao: string | null;
  data_inicio: string;
  data_fim: string;
}

interface EventFormState {
  id?: string;
  titulo: string;
  data: string;
  horaInicio: string;
  horaFim: string;
  isAllDay: boolean;
  descricao: string;
}

const api = {
  fetchEvents: async (): Promise<CalendarEvent[]> => {
    const response = await fetch(`${API_URL}/eventos/listar.php`, { headers: getAuthHeaders() });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Erro de rede" }));
      throw new Error(errorData.error || "Erro ao buscar eventos");
    }
    const data = await response.json();
    if (!data.success) throw new Error(data.error || 'Erro no backend');
    return data.data;
  },
  createEvent: async (newEvent: { titulo: string, data_inicio: string, data_fim: string, descricao?: string }): Promise<CalendarEvent> => {
    const response = await fetch(`${API_URL}/eventos/criar.php`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(newEvent)
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Erro de rede" }));
      throw new Error(errorData.error || "Erro ao criar evento");
    }
    const data = await response.json();
    if (!data.success) throw new Error(data.error || 'Erro no backend');
    return data.data;
  },
  updateEvent: async (updatedEvent: { id: string, titulo: string, data_inicio: string, data_fim: string, descricao?: string }): Promise<CalendarEvent> => {
    const response = await fetch(`${API_URL}/eventos/atualizar.php`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updatedEvent)
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Erro de rede" }));
      throw new Error(errorData.error || "Erro ao atualizar evento");
    }
    const data = await response.json();
    if (!data.success) throw new Error(data.error || 'Erro no backend');
    return data.data;
  },
  deleteEvent: async (id: string): Promise<string> => {
    const response = await fetch(`${API_URL}/eventos/excluir.php`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      body: JSON.stringify({ id })
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Erro de rede" }));
      throw new Error(errorData.error || "Erro ao excluir evento");
    }
    const data = await response.json();
    if (!data.success) throw new Error(data.error || 'Erro no backend');
    return data.message;
  }
};

const initialFormState: EventFormState = {
  titulo: "",
  data: "",
  horaInicio: "09:00",
  horaFim: "10:00",
  isAllDay: false,
  descricao: ""
};

export default function Calendar() {
  const queryClient = useQueryClient();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false); 
  const [currentEventForm, setCurrentEventForm] = useState<EventFormState>(initialFormState);

  const { data: events, isLoading: isLoadingEvents, isError: isEventsError, error: eventsError } = useQuery({
    queryKey: ['calendarEvents', format(currentDate, 'yyyy-MM')],
    queryFn: api.fetchEvents
  });

  const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const getDaysInMonth = (date: Date) => {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 }); 
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });
    
    const days = [];
    let day = startDate;
    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  };
  
  const getEventsForDay = (day: Date) => {
    return events?.filter(event => isSameDay(parseISO(event.data_inicio), day)) || [];
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1));
  };

  const invalidateCalendar = () => {
    queryClient.invalidateQueries({ queryKey: ['calendarEvents'] });
  };

  const createEventMutation = useMutation({
    mutationFn: api.createEvent,
    onSuccess: () => {
      toast.success("Evento criado com sucesso!");
      invalidateCalendar();
      setIsCreateModalOpen(false); 
      setCurrentEventForm(initialFormState); 
    },
    onError: (err: Error) => toast.error("Erro ao criar evento", { description: err.message })
  });

  const updateEventMutation = useMutation({
    mutationFn: api.updateEvent,
    onSuccess: () => {
      toast.success("Evento atualizado com sucesso!");
      invalidateCalendar();
      setIsDetailsModalOpen(false); 
      setIsEditing(false); 
      setSelectedEvent(null); 
    },
    onError: (err: Error) => toast.error("Erro ao atualizar evento", { description: err.message })
  });

  const deleteEventMutation = useMutation({
    mutationFn: api.deleteEvent,
    onSuccess: () => {
      toast.success("Evento excluído com sucesso!");
      invalidateCalendar();
      setIsDetailsModalOpen(false); 
      setSelectedEvent(null); 
    },
    onError: (err: Error) => toast.error("Erro ao excluir evento", { description: err.message })
  });

  const handleFormChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setCurrentEventForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);

  const handleSaveNewEvent = useCallback(() => {
    if (!currentEventForm.titulo || !currentEventForm.data) {
        toast.error("Título e Data são obrigatórios.");
        return;
    }
    
    let data_inicio_iso: string;
    let data_fim_iso: string;

    if (currentEventForm.isAllDay) {
        data_inicio_iso = `${currentEventForm.data}T00:00:00`;
        data_fim_iso = `${currentEventForm.data}T23:59:59`;
    } else {
        data_inicio_iso = `${currentEventForm.data}T${currentEventForm.horaInicio || '00:00'}:00`;
        data_fim_iso = `${currentEventForm.data}T${currentEventForm.horaFim || '23:59'}:00`;
    }

    createEventMutation.mutate({
        titulo: currentEventForm.titulo,
        descricao: currentEventForm.descricao,
        data_inicio: data_inicio_iso,
        data_fim: data_fim_iso,
    });
  }, [currentEventForm, createEventMutation]);

  const handleUpdateExistingEvent = useCallback(() => {
    if (!selectedEvent?.id || !currentEventForm.titulo || !currentEventForm.data) {
        toast.error("Erro: ID do evento, Título e Data são obrigatórios para atualizar.");
        return;
    }

    let data_inicio_iso: string;
    let data_fim_iso: string;

    if (currentEventForm.isAllDay) {
        data_inicio_iso = `${currentEventForm.data}T00:00:00`;
        data_fim_iso = `${currentEventForm.data}T23:59:59`;
    } else {
        data_inicio_iso = `${currentEventForm.data}T${currentEventForm.horaInicio || '00:00'}:00`;
        data_fim_iso = `${currentEventForm.data}T${currentEventForm.horaFim || '23:59'}:00`;
    }

    updateEventMutation.mutate({
        id: selectedEvent.id,
        titulo: currentEventForm.titulo,
        descricao: currentEventForm.descricao,
        data_inicio: data_inicio_iso,
        data_fim: data_fim_iso,
    });
  }, [selectedEvent, currentEventForm, updateEventMutation]);

  const handleDeleteEvent = useCallback(() => {
    if (!selectedEvent?.id) {
        toast.error("Erro: ID do evento não encontrado para exclusão.");
        return;
    }
    if (confirm(`Tem certeza que deseja excluir o evento "${selectedEvent.titulo}"?`)) {
        deleteEventMutation.mutate(selectedEvent.id);
    }
  }, [selectedEvent, deleteEventMutation]);

  const handleOpenDetails = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEditing(false); 
    
    const dataInicio = parseISO(event.data_inicio);
    const dataFim = parseISO(event.data_fim);

    const isEventAllDay = (
      format(dataInicio, 'HH:mm:ss') === '00:00:00' &&
      format(dataFim, 'HH:mm:ss') === '23:59:59'
    );

    setCurrentEventForm({
      titulo: event.titulo,
      data: format(dataInicio, 'yyyy-MM-dd'),
      horaInicio: format(dataInicio, 'HH:mm'),
      horaFim: format(dataFim, 'HH:mm'),
      isAllDay: isEventAllDay,
      descricao: event.descricao || ""
    });
    setIsDetailsModalOpen(true);
  }, []);

  const checkIsToday = (day: Date) => isToday(day);

  useEffect(() => {
    if (isEventsError && eventsError) {
      toast.error("Erro ao carregar eventos do calendário.", { description: eventsError.message });
    }
  }, [isEventsError, eventsError]);

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
        
        {/* Botão de Criar Evento */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button variant="aurora" className="shadow-aurora" onClick={() => setCurrentEventForm(initialFormState)}> 
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
                <Label htmlFor="create-titulo">Título do Evento</Label>
                <Input
                  id="create-titulo"
                  name="titulo"
                  value={currentEventForm.titulo}
                  onChange={handleFormChange}
                  placeholder="Ex: Prova de Matemática"
                  className="border-border/50 focus:border-primary transition-colors"
                />
              </div>
              
              <div>
                <Label htmlFor="create-data">Data</Label>
                <Input
                  id="create-data"
                  name="data"
                  type="date"
                  value={currentEventForm.data}
                  onChange={handleFormChange}
                  className="border-border/50 focus:border-primary transition-colors"
                />
              </div>
              
              <div className="flex items-center space-x-2 p-3 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5 border border-border/50">
                <Switch
                  id="create-all-day"
                  name="isAllDay"
                  checked={currentEventForm.isAllDay}
                  onCheckedChange={(checked) => setCurrentEventForm(prev => ({...prev, isAllDay: checked}))}
                />
                <Label htmlFor="create-all-day" className="cursor-pointer">Dia inteiro</Label>
              </div>
              
              {!currentEventForm.isAllDay && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="create-horaInicio">Hora Início</Label>
                    <Input
                      id="create-horaInicio"
                      name="horaInicio"
                      type="time"
                      value={currentEventForm.horaInicio}
                      onChange={handleFormChange}
                      className="border-border/50 focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <Label htmlFor="create-horaFim">Hora Fim</Label>
                    <Input
                      id="create-horaFim"
                      name="horaFim"
                      type="time"
                      value={currentEventForm.horaFim}
                      onChange={handleFormChange}
                      className="border-border/50 focus:border-primary transition-colors"
                    />
                  </div>
                </div>
              )}
              
              <div>
                <Label htmlFor="create-descricao">Descrição</Label>
                <Textarea
                  id="create-descricao"
                  name="descricao"
                  value={currentEventForm.descricao}
                  onChange={handleFormChange}
                  placeholder="Adicione detalhes sobre o evento..."
                  className="border-border/50 focus:border-primary transition-colors"
                />
              </div>
            </div>
            <DialogFooter className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancelar
              </Button>
              <Button 
                variant="aurora" 
                onClick={handleSaveNewEvent} 
                disabled={createEventMutation.isPending}
                className="shadow-aurora"
              >
                {createEventMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar Evento
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Calendário */}
      <Card className="shadow-float border-border/50 overflow-hidden animate-scale-in">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-border/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-2xl md:text-3xl font-bold text-gradient">
              {format(currentDate, "MMMM 'de' yyyy", { locale: ptBR })}
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
          {/* Cabeçalho dos dias da semana */}
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
          
          {/* Grelha de dias */}
          <div className="grid grid-cols-7 gap-2" style={{ minHeight: '60vh' }}>
            {getDaysInMonth(currentDate).map((day, index) => {
              const d = day; 
              const eventsForThisDay = d ? getEventsForDay(d) : [];
              const isCurrentMonth = d ? isSameMonth(d, currentDate) : false;
              const isDayToday = d ? checkIsToday(d) : false;
              
              return (
                <div
                  key={index}
                  className={cn(
                    "h-auto min-h-[80px] md:min-h-[100px] p-2 md:p-3 border rounded-xl flex flex-col items-start space-y-2 transition-all duration-300", 
                    isCurrentMonth ? 'hover:bg-muted/50 bg-card' : 'bg-muted/30 text-muted-foreground',
                    isDayToday
                      ? 'bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/50 shadow-aurora ring-1 ring-primary/20'
                      : 'border-border/50'
                  )}
                >
                  {d && (
                    <>
                      <div className={cn(
                        "text-sm md:text-base font-bold",
                        isDayToday ? 'text-primary' : 'text-foreground'
                      )}>
                        {format(d, 'd')}
                      </div>
                      <div className="w-full space-y-1 overflow-auto max-h-[50px] md:max-h-[70px] scrollbar-hide">
                        {isLoadingEvents ? (
                          <p className="text-xs text-muted-foreground">A carregar...</p>
                        ) : (
                          eventsForThisDay.map(event => (
                            <Badge 
                              key={event.id}
                              variant="secondary"
                              className="w-full justify-start text-xs cursor-pointer hover:bg-primary/20 hover:text-primary transition-colors duration-200 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20"
                              onClick={() => handleOpenDetails(event)} 
                              title={event.titulo} 
                            >
                              <Clock className="h-3 w-3 mr-1 flex-shrink-0 text-primary" />
                              <span className="truncate">
                                {format(parseISO(event.data_inicio), 'HH:mm')} - {event.titulo}
                              </span>
                            </Badge>
                          ))
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Modal de Detalhes / Edição de Evento */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="sm:max-w-[425px] shadow-float animate-scale-in">
          {!isEditing ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gradient">{selectedEvent?.titulo}</DialogTitle>
                <DialogDescription className="text-muted-foreground">Detalhes do evento</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5 border border-border/50">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <CalendarIcon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium">
                    {selectedEvent && format(parseISO(selectedEvent.data_inicio), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </span>
                </div>
                
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5 border border-border/50">
                  <div className="p-2 rounded-lg bg-secondary/10">
                    <Clock className="h-4 w-4 text-secondary" />
                  </div>
                  <span className="font-medium">
                    { selectedEvent && ( (parseISO(selectedEvent.data_inicio).getUTCHours() === 0 && parseISO(selectedEvent.data_fim).getUTCHours() === 23 && parseISO(selectedEvent.data_inicio).getUTCMinutes() === 0 && parseISO(selectedEvent.data_fim).getUTCMinutes() === 59)
                      ? 'Dia Inteiro' 
                      : `${format(parseISO(selectedEvent.data_inicio), 'HH:mm')} - ${format(parseISO(selectedEvent.data_fim), 'HH:mm')}`
                    )}
                  </span>
                </div>
                
                {selectedEvent?.descricao && (
                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5 border border-border/50">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm flex-1">{selectedEvent.descricao}</span>
                  </div>
                )}
              </div>
              <DialogFooter className="flex justify-between w-full">
                <div className="flex gap-2">
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={handleDeleteEvent} 
                    disabled={deleteEventMutation.isPending}
                  >
                    {deleteEventMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" /> Editar
                  </Button>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setIsDetailsModalOpen(false)}
                >
                  Fechar
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gradient">Editar Evento</DialogTitle>
                <DialogDescription className="text-muted-foreground">Modifique os detalhes do seu evento</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="edit-titulo">Título do Evento</Label>
                  <Input 
                    id="edit-titulo" 
                    name="titulo"
                    value={currentEventForm.titulo} 
                    onChange={handleFormChange}
                    className="border-border/50 focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-data">Data</Label>
                  <Input 
                    id="edit-data" 
                    name="data"
                    type="date" 
                    value={currentEventForm.data} 
                    onChange={handleFormChange}
                    className="border-border/50 focus:border-primary transition-colors"
                  />
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5 border border-border/50">
                  <Switch 
                    id="edit-all-day" 
                    name="isAllDay"
                    checked={currentEventForm.isAllDay} 
                    onCheckedChange={(checked) => setCurrentEventForm(prev => ({...prev, isAllDay: checked}))}
                  />
                  <Label htmlFor="edit-all-day" className="cursor-pointer">Dia inteiro</Label>
                </div>
                {!currentEventForm.isAllDay && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-horaInicio">Hora Início</Label>
                      <Input 
                        id="edit-horaInicio" 
                        name="horaInicio"
                        type="time" 
                        value={currentEventForm.horaInicio} 
                        onChange={handleFormChange}
                        className="border-border/50 focus:border-primary transition-colors"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-horaFim">Hora Fim</Label>
                      <Input 
                        id="edit-horaFim" 
                        name="horaFim"
                        type="time" 
                        value={currentEventForm.horaFim} 
                        onChange={handleFormChange}
                        className="border-border/50 focus:border-primary transition-colors"
                      />
                    </div>
                  </div>
                )}
                <div>
                  <Label htmlFor="edit-descricao">Descrição</Label>
                  <Textarea 
                    id="edit-descricao" 
                    name="descricao"
                    value={currentEventForm.descricao} 
                    onChange={handleFormChange}
                    className="border-border/50 focus:border-primary transition-colors"
                  />
                </div>
              </div>
              <DialogFooter className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancelar</Button>
                <Button 
                  variant="aurora" 
                  onClick={handleUpdateExistingEvent} 
                  disabled={updateEventMutation.isPending}
                  className="shadow-aurora"
                >
                  {updateEventMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Salvar Alterações
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
