import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye, EyeOff, BookOpen, Sparkles, Lock, Mail, User } from "lucide-react";
import { toast } from "sonner";
// v2.0

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");
  
  const [signInData, setSignInData] = useState({
    email: "",
    password: ""
  });
  
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      toast.success("Email de recuperação enviado!");
      setShowForgotPassword(false);
      setForgotPasswordEmail("");
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/3 left-1/2 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-primary/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-secondary/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Sharp Top Element - Invertido */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/20 overflow-hidden">
        <div className="absolute -bottom-px left-0 right-0">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16">
            <polygon 
              points="0,120 300,0 900,0 1200,120" 
              className="fill-background"
            />
          </svg>
        </div>
        {/* Decorative Dots Pattern */}
        <div className="absolute top-8 left-12 w-2 h-2 bg-primary/40 rounded-full animate-pulse"></div>
        <div className="absolute top-4 left-32 w-1.5 h-1.5 bg-secondary/40 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-10 right-24 w-2 h-2 bg-primary/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-6 right-48 w-1.5 h-1.5 bg-secondary/40 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* Sharp Bottom Element - Invertido */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-br from-secondary/20 via-primary/20 to-secondary/20 overflow-hidden">
        <div className="absolute -top-px left-0 right-0">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16">
            <polygon 
              points="0,0 300,120 900,120 1200,0" 
              className="fill-background"
            />
          </svg>
        </div>
        {/* Decorative Dots Pattern */}
        <div className="absolute bottom-8 left-16 w-2 h-2 bg-secondary/40 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
        <div className="absolute bottom-4 left-40 w-1.5 h-1.5 bg-primary/40 rounded-full animate-pulse" style={{ animationDelay: '0.8s' }}></div>
        <div className="absolute bottom-10 right-20 w-2 h-2 bg-secondary/40 rounded-full animate-pulse" style={{ animationDelay: '1.3s' }}></div>
        <div className="absolute bottom-6 right-52 w-1.5 h-1.5 bg-primary/40 rounded-full animate-pulse" style={{ animationDelay: '1.8s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 py-24">
        {/* Logo/Brand */}
        <div className="mb-8 text-center animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-2">
            <div className="w-14 h-14 rounded-2xl gradient-aurora flex items-center justify-center shadow-aurora transition-transform hover:scale-110">
              <BookOpen className="h-7 w-7 text-white" />
            </div>
            <span className="text-4xl font-bold text-gradient">Skillium</span>
          </div>
          <p className="text-muted-foreground text-sm mt-1">Transforme seus estudos em conquistas</p>
        </div>

        {/* Login Card */}
          <div className="w-full max-w-md animate-scale-in">
          <div className="relative">
            {/* Glow Effect Suavizado */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-secondary/30 to-primary/30 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
            
            {/* Card */}
            <div className="relative bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm">
              {/* Gradient Header Bar */}
              <div className="h-1.5 w-full gradient-aurora"></div>

              {/* Content */}
              <div className="p-8">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-aurora mb-4 shadow-lg">
                    <Sparkles className="h-8 w-8 text-white animate-pulse" />
                  </div>
                  <h2 className="text-2xl font-bold mb-1">
                    {activeTab === "signin" ? "Bem-vindo de volta!" : "Crie sua conta"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {activeTab === "signin" 
                      ? "Entre para continuar sua jornada" 
                      : "Comece sua jornada de estudos hoje"}
                  </p>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/30 p-1 h-12 rounded-xl">
                    <TabsTrigger 
                      value="signin"
                      className="data-[state=active]:gradient-aurora data-[state=active]:text-white rounded-lg transition-all font-semibold data-[state=active]:shadow-md"
                    >
                      Entrar
                    </TabsTrigger>
                    <TabsTrigger 
                      value="signup"
                      className="data-[state=active]:gradient-aurora data-[state=active]:text-white rounded-lg transition-all font-semibold data-[state=active]:shadow-md"
                    >
                      Criar Conta
                    </TabsTrigger>
                  </TabsList>
                  
                   {/* Sign In Form */}
                  <TabsContent value="signin" className="mt-0 animate-fade-in">
                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signin-email" className="text-sm font-medium flex items-center gap-2">
                          <Mail className="w-4 h-4 text-primary" />
                          Email
                        </Label>
                        <Input
                          id="signin-email"
                          type="email"
                          placeholder="seu@email.com"
                          value={signInData.email}
                          onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                          required
                          className="h-11 bg-background/50 border-border/50 focus:border-primary transition-all focus:shadow-sm"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="signin-password" className="text-sm font-medium flex items-center gap-2">
                          <Lock className="w-4 h-4 text-primary" />
                          Senha
                        </Label>
                        <div className="relative">
                          <Input
                            id="signin-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={signInData.password}
                            onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                            required
                            className="h-11 pr-11 bg-background/50 border-border/50 focus:border-primary transition-all focus:shadow-sm"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input type="checkbox" className="rounded border-border w-4 h-4 text-primary focus:ring-primary" />
                          <span className="text-muted-foreground group-hover:text-foreground transition-colors">Lembrar-me</span>
                        </label>
                        <button 
                          type="button" 
                          onClick={() => setShowForgotPassword(true)}
                          className="text-primary hover:underline font-medium transition-colors"
                        >
                          Esqueceu a senha?
                        </button>
                      </div>

                      <Button 
                        type="submit" 
                        variant="aurora"
                        className="w-full h-11 mt-6" 
                        disabled={loading}
                      >
                        {loading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Entrando...
                          </div>
                        ) : (
                          "Entrar"
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                  
                   {/* Sign Up Form */}
                  <TabsContent value="signup" className="mt-0 animate-fade-in">
                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-name" className="text-sm font-medium flex items-center gap-2">
                          <User className="w-4 h-4 text-primary" />
                          Nome Completo
                        </Label>
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="Seu nome"
                          value={signUpData.name}
                          onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                          required
                          className="h-11 bg-background/50 border-border/50 focus:border-primary transition-all focus:shadow-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-email" className="text-sm font-medium flex items-center gap-2">
                          <Mail className="w-4 h-4 text-primary" />
                          Email
                        </Label>
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="seu@email.com"
                          value={signUpData.email}
                          onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                          required
                          className="h-11 bg-background/50 border-border/50 focus:border-primary transition-all focus:shadow-sm"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="signup-password" className="text-sm font-medium flex items-center gap-2">
                          <Lock className="w-4 h-4 text-primary" />
                          Senha
                        </Label>
                        <div className="relative">
                          <Input
                            id="signup-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={signUpData.password}
                            onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                            required
                            className="h-11 pr-11 bg-background/50 border-border/50 focus:border-primary transition-all focus:shadow-sm"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Mínimo de 8 caracteres</p>
                      </div>

                      <Button 
                        type="submit" 
                        variant="aurora"
                        className="w-full h-11 mt-6"
                        disabled={loading}
                      >
                        {loading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Criando conta...
                          </div>
                        ) : (
                          "Criar Conta"
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-xs text-muted-foreground text-center max-w-md animate-fade-in">
          Ao continuar, você concorda com nossos{" "}
          <span 
            onClick={() => setShowTerms(true)}
            className="text-primary hover:underline cursor-pointer"
          >
            Termos de Uso
          </span>{" "}
          e{" "}
          <span 
            onClick={() => setShowPrivacy(true)}
            className="text-primary hover:underline cursor-pointer"
          >
            Política de Privacidade
          </span>
        </p>
      </div>

      {/* Forgot Password Dialog */}
      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Recuperar Senha
            </DialogTitle>
            <DialogDescription>
              Digite seu email para receber as instruções de recuperação de senha.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleForgotPassword} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="forgot-email">Email</Label>
              <Input
                id="forgot-email"
                type="email"
                placeholder="seu@email.com"
                value={forgotPasswordEmail}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForgotPassword(false)}
                className="flex-1"
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                variant="aurora"
                className="flex-1"
                disabled={loading}
              >
                {loading ? "Enviando..." : "Enviar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Terms Dialog */}
      <Dialog open={showTerms} onOpenChange={setShowTerms}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Termos de Uso</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
              Bem-vindo ao Skillium! Ao utilizar nossa plataforma, você concorda com os seguintes termos:
            </p>
            <h3 className="font-semibold text-foreground">1. Uso da Plataforma</h3>
            <p>
              O Skillium é uma ferramenta de gestão de estudos. Você é responsável por manter suas credenciais seguras.
            </p>
            <h3 className="font-semibold text-foreground">2. Privacidade dos Dados</h3>
            <p>
              Seus dados são protegidos e utilizados apenas para melhorar sua experiência na plataforma.
            </p>
            <h3 className="font-semibold text-foreground">3. Responsabilidades</h3>
            <p>
              Você concorda em utilizar a plataforma de forma ética e não realizar atividades que possam prejudicar outros usuários.
            </p>
            <p className="text-xs italic">
              *Este é um texto modelo. Substitua pelo conteúdo real dos seus termos de uso.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Privacy Policy Dialog */}
      <Dialog open={showPrivacy} onOpenChange={setShowPrivacy}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Política de Privacidade</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
              A privacidade dos nossos usuários é fundamental para o Skillium.
            </p>
            <h3 className="font-semibold text-foreground">Coleta de Dados</h3>
            <p>
              Coletamos apenas informações essenciais: nome, email e dados de uso da plataforma para melhorar sua experiência.
            </p>
            <h3 className="font-semibold text-foreground">Uso dos Dados</h3>
            <p>
              Seus dados são utilizados para personalizar sua experiência, gerar estatísticas e melhorar nossos serviços.
            </p>
            <h3 className="font-semibold text-foreground">Compartilhamento</h3>
            <p>
              Não compartilhamos seus dados pessoais com terceiros sem seu consentimento explícito.
            </p>
            <h3 className="font-semibold text-foreground">Segurança</h3>
            <p>
              Utilizamos as melhores práticas de segurança para proteger seus dados contra acesso não autorizado.
            </p>
            <p className="text-xs italic">
              *Este é um texto modelo. Substitua pelo conteúdo real da sua política de privacidade.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;
