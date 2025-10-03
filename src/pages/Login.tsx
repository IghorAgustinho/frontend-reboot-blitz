import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, Sparkles, BookOpen, Target, Clock, Zap, TrendingUp, Award } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [signInData, setSignInData] = useState({
    email: "",
    password: ""
  });
  
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      toast.success("Login realizado com sucesso!");
      navigate("/dashboard");
      setLoading(false);
    }, 1000);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      toast.success("Conta criada com sucesso!");
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-background">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
          
          {/* Left Side - Branding */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-sm font-medium text-primary">Transforme seus estudos</span>
              </div>
              
              <div className="space-y-4">
                <h1 className="text-6xl md:text-7xl font-bold leading-tight">
                  <span className="text-gradient">Skillium</span>
                </h1>
                
                <p className="text-xl md:text-2xl text-muted-foreground max-w-xl">
                  A plataforma completa para organizar seus estudos, aumentar sua produtividade e alcançar seus objetivos acadêmicos
                </p>
              </div>
            </div>

            <div className="grid gap-4 pt-4">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all group">
                <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Organização Inteligente</h3>
                  <p className="text-muted-foreground text-sm">Gerencie disciplinas, conteúdos e materiais em um só lugar</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-secondary/30 transition-all group">
                <div className="p-3 rounded-xl bg-secondary/10 group-hover:bg-secondary/20 transition-colors">
                  <Target className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Foco Total</h3>
                  <p className="text-muted-foreground text-sm">Timer Pomodoro com alertas inteligentes para máxima concentração</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-accent/30 transition-all group">
                <div className="p-3 rounded-xl bg-accent/10 group-hover:bg-accent/20 transition-colors">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Evolução Contínua</h3>
                  <p className="text-muted-foreground text-sm">Acompanhe seu progresso com estatísticas detalhadas</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="animate-scale-in">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-2xl"></div>
              
              {/* Card */}
              <div className="relative bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl p-8 shadow-float">
                <div className="space-y-6">
                  {/* Header */}
                  <div className="text-center space-y-3">
                    <div className="mx-auto w-16 h-16 rounded-2xl gradient-aurora flex items-center justify-center shadow-aurora animate-glow">
                      <Award className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold">Bem-vindo!</h2>
                      <p className="text-muted-foreground mt-2">
                        Entre ou crie sua conta para começar sua jornada
                      </p>
                    </div>
                  </div>

                  {/* Tabs */}
                  <Tabs defaultValue="signin" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/50">
                      <TabsTrigger value="signin" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        Entrar
                      </TabsTrigger>
                      <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        Criar Conta
                      </TabsTrigger>
                    </TabsList>
                    
                    {/* Sign In Form */}
                    <TabsContent value="signin">
                      <form onSubmit={handleSignIn} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="signin-email">Email</Label>
                          <Input
                            id="signin-email"
                            type="email"
                            placeholder="seu@email.com"
                            value={signInData.email}
                            onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                            required
                            className="h-11 bg-background/50 border-border/50 focus:border-primary"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="signin-password">Senha</Label>
                          <div className="relative">
                            <Input
                              id="signin-password"
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              value={signInData.password}
                              onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                              required
                              className="h-11 pr-10 bg-background/50 border-border/50 focus:border-primary"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>

                        <Button 
                          type="submit" 
                          className="w-full h-11 mt-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-aurora" 
                          disabled={loading}
                        >
                          {loading ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              Entrando...
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Zap className="h-4 w-4" />
                              Entrar
                            </div>
                          )}
                        </Button>
                      </form>
                    </TabsContent>
                    
                    {/* Sign Up Form */}
                    <TabsContent value="signup">
                      <form onSubmit={handleSignUp} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="signup-name">Nome</Label>
                          <Input
                            id="signup-name"
                            type="text"
                            placeholder="Seu nome completo"
                            value={signUpData.name}
                            onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                            required
                            className="h-11 bg-background/50 border-border/50 focus:border-primary"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="signup-email">Email</Label>
                          <Input
                            id="signup-email"
                            type="email"
                            placeholder="seu@email.com"
                            value={signUpData.email}
                            onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                            required
                            className="h-11 bg-background/50 border-border/50 focus:border-primary"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="signup-password">Senha</Label>
                          <div className="relative">
                            <Input
                              id="signup-password"
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              value={signUpData.password}
                              onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                              required
                              className="h-11 pr-10 bg-background/50 border-border/50 focus:border-primary"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>

                        <Button 
                          type="submit" 
                          className="w-full h-11 mt-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-aurora"
                          disabled={loading}
                        >
                          {loading ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              Criando conta...
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Sparkles className="h-4 w-4" />
                              Criar Conta
                            </div>
                          )}
                        </Button>
                      </form>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
