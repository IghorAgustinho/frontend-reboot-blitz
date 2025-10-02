import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Plus, 
  ChevronDown, 
  ChevronRight,
  MoreVertical,
  FileText,
  Download,
  Trash2,
  Edit,
  Archive,
  CheckCircle2,
  Circle,
  Upload
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface StudyFile {
  id: string;
  name: string;
  type: string;
  completed: boolean;
  uploadDate: string;
}

interface StudyContent {
  id: string;
  title: string;
  files: StudyFile[];
  progress: number;
}

interface Subject {
  id: string;
  name: string;
  color: string;
  contents: StudyContent[];
  progress: number;
  archived: boolean;
}

interface StudyUnit {
  id: string;
  name: string;
  subjects: Subject[];
  expanded: boolean;
  progress: number;
}

export default function Subjects() {
  // Study units will be loaded from backend API
  const [studyUnits, setStudyUnits] = useState<StudyUnit[]>([]);

  const toggleUnit = (unitId: string) => {
    setStudyUnits(units =>
      units.map(unit =>
        unit.id === unitId ? { ...unit, expanded: !unit.expanded } : unit
      )
    );
  };

  const toggleFileCompletion = (subjectId: string, contentId: string, fileId: string) => {
    setStudyUnits(units =>
      units.map(unit => ({
        ...unit,
        subjects: unit.subjects.map(subject =>
          subject.id === subjectId
            ? {
                ...subject,
                contents: subject.contents.map(content =>
                  content.id === contentId
                    ? {
                        ...content,
                        files: content.files.map(file =>
                          file.id === fileId ? { ...file, completed: !file.completed } : file
                        )
                      }
                    : content
                )
              }
            : subject
        )
      }))
    );
  };

  return (
    <div className="flex flex-col space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-gradient">Disciplinas</span>
          </h1>
          <p className="text-muted-foreground">
            Organize seus conteúdos acadêmicos por semestre e disciplina
          </p>
        </div>
        <Button variant="aurora" size="lg">
          <Plus className="mr-2 h-5 w-5" />
          Nova Unidade de Estudo
        </Button>
      </div>

      {/* Study Units */}
      <div className="space-y-6">
        {studyUnits.length === 0 ? (
          <Card className="shadow-card">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nenhuma unidade de estudo ainda</h3>
              <p className="text-muted-foreground text-center mb-6">
                Comece criando sua primeira unidade de estudo para organizar suas disciplinas
              </p>
              <Button variant="aurora" size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Criar Primeira Unidade
              </Button>
            </CardContent>
          </Card>
        ) : studyUnits.map((unit) => (
          <Card key={unit.id} className="shadow-card hover:shadow-float transition-all duration-300">
            <CardHeader 
              className="cursor-pointer select-none"
              onClick={() => toggleUnit(unit.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {unit.expanded ? (
                    <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform" />
                  )}
                  <div className="space-y-1">
                    <CardTitle className="text-xl">{unit.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      {unit.subjects.length} disciplina(s) • {unit.progress}% concluído
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Progress value={unit.progress} className="w-24 h-2" />
                    <span className="text-sm font-medium text-muted-foreground">
                      {unit.progress}%
                    </span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Renomear
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Archive className="mr-2 h-4 w-4" />
                        Arquivar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>

            {unit.expanded && (
              <CardContent className="space-y-4 animate-accordion-down">
                {/* Subjects Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {unit.subjects.map((subject) => (
                    <Card key={subject.id} className="shadow-card hover:shadow-aurora transition-all duration-300 group">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={cn("h-3 w-3 rounded-full", subject.color)} />
                            <CardTitle className="text-lg">{subject.name}</CardTitle>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Renomear
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Plus className="mr-2 h-4 w-4" />
                                Novo Conteúdo
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Archive className="mr-2 h-4 w-4" />
                                Arquivar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="flex items-center justify-between">
                          <Progress value={subject.progress} className="flex-1 h-2" />
                          <span className="ml-2 text-sm font-medium text-muted-foreground">
                            {subject.progress}%
                          </span>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-3">
                        {subject.contents.length === 0 ? (
                          <div className="text-center py-6 space-y-2">
                            <FileText className="h-8 w-8 text-muted-foreground mx-auto" />
                            <p className="text-sm text-muted-foreground">
                              Nenhum conteúdo ainda
                            </p>
                            <Button variant="outline" size="sm">
                              <Plus className="mr-2 h-4 w-4" />
                              Adicionar Conteúdo
                            </Button>
                          </div>
                        ) : (
                          subject.contents.map((content) => (
                            <div key={content.id} className="space-y-2 p-3 rounded-lg border bg-muted/30">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-sm">{content.title}</h4>
                                <Badge variant="secondary" className="text-xs">
                                  {content.files.length} arquivo(s)
                                </Badge>
                              </div>
                              
                              {content.files.length > 0 && (
                                <div className="space-y-1">
                                  {content.files.map((file) => (
                                    <div
                                      key={file.id}
                                      className={cn(
                                        "flex items-center justify-between p-2 rounded border text-xs",
                                        file.completed
                                          ? "bg-green-50 border-green-200 text-green-800 line-through"
                                          : "bg-background"
                                      )}
                                    >
                                      <div className="flex items-center space-x-2">
                                        <button
                                          onClick={() => toggleFileCompletion(subject.id, content.id, file.id)}
                                          className="text-primary hover:text-primary/80"
                                        >
                                          {file.completed ? (
                                            <CheckCircle2 className="h-4 w-4" />
                                          ) : (
                                            <Circle className="h-4 w-4" />
                                          )}
                                        </button>
                                        <span className="truncate">{file.name}</span>
                                      </div>
                                      <div className="flex space-x-1">
                                        <Button variant="ghost" size="icon" className="h-6 w-6">
                                          <Download className="h-3 w-3" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive">
                                          <Trash2 className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              <Button variant="outline" size="sm" className="w-full">
                                <Upload className="mr-2 h-4 w-4" />
                                Adicionar Arquivo
                              </Button>
                            </div>
                          ))
                        )}
                      </CardContent>
                    </Card>
                  ))}

                  {/* Add Subject Card */}
                  <Card className="shadow-card border-dashed border-2 hover:border-primary/50 transition-all duration-300 cursor-pointer group">
                    <CardContent className="flex flex-col items-center justify-center h-full py-12 space-y-3">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Plus className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-medium text-muted-foreground">Nova Disciplina</h3>
                      <p className="text-xs text-muted-foreground text-center">
                        Adicione uma nova disciplina a este semestre
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}