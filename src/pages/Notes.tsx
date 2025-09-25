import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Search, 
  FileText, 
  Edit3, 
  Trash2, 
  Pin,
  Tag,
  Calendar
} from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      title: "Resumo de Álgebra Linear",
      content: "Matrizes são arranjos retangulares de números, símbolos ou expressões, organizados em linhas e colunas...",
      category: "Matemática",
      tags: ["matrizes", "álgebra", "linear"],
      isPinned: true,
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z"
    },
    {
      id: "2",
      title: "Conceitos de Física Quântica",
      content: "A mecânica quântica é uma teoria fundamental na física que descreve o comportamento da matéria e energia...",
      category: "Física",
      tags: ["quântica", "mecânica", "energia"],
      isPinned: false,
      createdAt: "2024-01-14T15:30:00Z",
      updatedAt: "2024-01-14T15:30:00Z"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    category: "",
    tags: ""
  });

  const categories = [...new Set(notes.map(note => note.category))];

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || note.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  const handleCreateNote = () => {
    if (!newNote.title || !newNote.content) return;

    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      category: newNote.category || "Geral",
      tags: newNote.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
      isPinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setNotes(prev => [note, ...prev]);
    setNewNote({ title: "", content: "", category: "", tags: "" });
    setIsCreateModalOpen(false);
  };

  const handleUpdateNote = () => {
    if (!editingNote || !newNote.title || !newNote.content) return;

    setNotes(prev => prev.map(note => 
      note.id === editingNote.id 
        ? {
            ...note,
            title: newNote.title,
            content: newNote.content,
            category: newNote.category || "Geral",
            tags: newNote.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
            updatedAt: new Date().toISOString()
          }
        : note
    ));

    setEditingNote(null);
    setNewNote({ title: "", content: "", category: "", tags: "" });
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setNewNote({
      title: note.title,
      content: note.content,
      category: note.category,
      tags: note.tags.join(", ")
    });
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const togglePinNote = (id: string) => {
    setNotes(prev => prev.map(note => 
      note.id === id ? { ...note, isPinned: !note.isPinned } : note
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    return content.length > maxLength ? content.substring(0, maxLength) + "..." : content;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileText className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-gradient">Anotações</h1>
            <p className="text-muted-foreground">Organize suas notas de estudo</p>
          </div>
        </div>
        
        <Dialog 
          open={isCreateModalOpen || !!editingNote} 
          onOpenChange={(open) => {
            if (!open) {
              setIsCreateModalOpen(false);
              setEditingNote(null);
              setNewNote({ title: "", content: "", category: "", tags: "" });
            }
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Anotação
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingNote ? "Editar Anotação" : "Nova Anotação"}
              </DialogTitle>
              <DialogDescription>
                {editingNote ? "Modifique sua anotação" : "Crie uma nova anotação para seus estudos"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="note-title">Título</Label>
                <Input
                  id="note-title"
                  value={newNote.title}
                  onChange={(e) => setNewNote(prev => ({...prev, title: e.target.value}))}
                  placeholder="Ex: Resumo de Física"
                />
              </div>
              
              <div>
                <Label htmlFor="note-category">Categoria</Label>
                <Input
                  id="note-category"
                  value={newNote.category}
                  onChange={(e) => setNewNote(prev => ({...prev, category: e.target.value}))}
                  placeholder="Ex: Matemática, Física, História..."
                />
              </div>
              
              <div>
                <Label htmlFor="note-tags">Tags (separadas por vírgula)</Label>
                <Input
                  id="note-tags"
                  value={newNote.tags}
                  onChange={(e) => setNewNote(prev => ({...prev, tags: e.target.value}))}
                  placeholder="Ex: prova, importante, resumo"
                />
              </div>
              
              <div>
                <Label htmlFor="note-content">Conteúdo</Label>
                <Textarea
                  id="note-content"
                  value={newNote.content}
                  onChange={(e) => setNewNote(prev => ({...prev, content: e.target.value}))}
                  placeholder="Escreva sua anotação aqui..."
                  className="min-h-[200px]"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setEditingNote(null);
                    setNewNote({ title: "", content: "", category: "", tags: "" });
                  }}
                >
                  Cancelar
                </Button>
                <Button onClick={editingNote ? handleUpdateNote : handleCreateNote}>
                  {editingNote ? "Atualizar" : "Criar"} Anotação
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar anotações..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Notes Grid */}
      {sortedNotes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma anotação encontrada</h3>
            <p className="text-muted-foreground text-center">
              {searchTerm || selectedCategory !== "all" 
                ? "Tente ajustar os filtros ou criar uma nova anotação"
                : "Crie sua primeira anotação para começar"
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortedNotes.map((note) => (
            <Card key={note.id} className="hover:shadow-lg transition-shadow group">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2 flex items-center space-x-2">
                      {note.isPinned && <Pin className="h-4 w-4 text-primary" />}
                      <span>{note.title}</span>
                    </CardTitle>
                    <CardDescription className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {note.category}
                      </Badge>
                      <span className="text-xs">
                        {formatDate(note.updatedAt)}
                      </span>
                    </CardDescription>
                  </div>
                  
                  <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePinNote(note.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Pin className={`h-3 w-3 ${note.isPinned ? 'text-primary' : 'text-muted-foreground'}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditNote(note)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit3 className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteNote(note.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-4">
                  {truncateContent(note.content)}
                </p>
                
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {note.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        <Tag className="h-2 w-2 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                    {note.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{note.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notes;