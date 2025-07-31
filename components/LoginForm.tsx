import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { useAuth } from './AuthContext';
import { Users, Mail, Lock, User, KeyRound, CheckCircle2 } from 'lucide-react';

interface LoginFormProps {
  onLogin: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const { signIn, signUp, resetPassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [socialLoading] = useState<string | null>(null);
  const [resetLoading, setResetLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('login');
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  // Signup form state
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await signIn(loginData.email, loginData.password);
      
      if (error) {
        setError(error.message || 'Erro ao fazer login');
      } else {
        onLogin();
      }
    } catch (err) {
      setError('Erro inesperado ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (signupData.password !== signupData.confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    if (signupData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const { error } = await signUp(
        signupData.email, 
        signupData.password, 
        signupData.name
      );
      
      if (error) {
        setError(error.message || 'Erro ao criar conta');
      } else {
        onLogin();
      }
    } catch (err) {
      setError('Erro inesperado ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  /* social login not included in this version
  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    setSocialLoading(provider);
    setError('');

    try {
      const { error } = await signInWithProvider(provider);
      
      if (error) {
        setError(`Erro ao fazer login com ${provider}`);
      }
      // Note: onLogin will be called automatically via AuthContext when auth state changes
    } catch (err) {
      setError(`Erro inesperado ao fazer login com ${provider}`);
    } finally {
      setSocialLoading(null);
    }
  };
*/
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);

    try {
      const { error } = await resetPassword(resetEmail);
      
      if (error) {
        setError(error.message || 'Erro ao enviar email de recuperação');
      } else {
        setResetSuccess(true);
        setError('');
      }
    } catch (err) {
      setError('Erro inesperado ao enviar email de recuperação');
    } finally {
      setResetLoading(false);
    }
  };

  const handleResetModalClose = () => {
    setResetModalOpen(false);
    setResetEmail('');
    setResetSuccess(false);
    setError('');
  };
/* social login buttons not included in this version
  const SocialButton = ({ provider, icon, label, color }: {
    provider: 'google' | 'facebook' | 'apple';
    icon: React.ReactNode;
    label: string;
    color: string;
  }) => {
    const isLoading = socialLoading === provider;
    
    return (
      <Button
        type="button"
        variant="outline"
        onClick={() => handleSocialLogin(provider)}
        disabled={socialLoading !== null}
        className={`w-full justify-center gap-3 h-11 ${color} transition-all hover:scale-[1.02]`}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          icon
        )}
        <span>{isLoading ? 'Conectando...' : label}</span>
      </Button>
    );
  };
*/
  return (
    <div className="min-h-[calc(100vh-2rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Oração em Grupo</h1>
          <p className="text-gray-600">Conecte-se com sua comunidade de fé</p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">Bem-vindo</CardTitle>
            <CardDescription>
              Entre ou crie sua conta para começar
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="signup">Criar Conta</TabsTrigger>
              </TabsList>

              {error && (
                <Alert className="mb-4 border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-password">Senha</Label>
                      <Dialog open={resetModalOpen} onOpenChange={setResetModalOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            type="button" 
                            variant="link" 
                            className="px-0 h-auto text-sm text-blue-600 hover:text-blue-800"
                            onClick={() => {
                              setResetModalOpen(true);
                              setResetEmail(loginData.email);
                              setResetSuccess(false);
                              setError('');
                            }}
                          >
                            Esqueci minha senha
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <KeyRound className="w-5 h-5 text-blue-600" />
                              Recuperar Senha
                            </DialogTitle>
                            <DialogDescription>
                              Digite seu email para receber instruções de recuperação de senha.
                            </DialogDescription>
                          </DialogHeader>
                          
                          {!resetSuccess ? (
                            <form onSubmit={handleResetPassword} className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="reset-email">Email</Label>
                                <div className="relative">
                                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                  <Input
                                    id="reset-email"
                                    type="email"
                                    placeholder="seu@email.com"
                                    value={resetEmail}
                                    onChange={(e) => setResetEmail(e.target.value)}
                                    className="pl-10"
                                    required
                                  />
                                </div>
                              </div>
                              
                              {error && (
                                <Alert className="border-red-200 bg-red-50">
                                  <AlertDescription className="text-red-800">
                                    {error}
                                  </AlertDescription>
                                </Alert>
                              )}
                              
                              <div className="flex gap-3">
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  onClick={handleResetModalClose}
                                  className="flex-1"
                                >
                                  Cancelar
                                </Button>
                                <Button 
                                  type="submit" 
                                  disabled={resetLoading}
                                  className="flex-1"
                                >
                                  {resetLoading ? (
                                    <>
                                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                                      Enviando...
                                    </>
                                  ) : (
                                    'Enviar Email'
                                  )}
                                </Button>
                              </div>
                            </form>
                          ) : (
                            <div className="text-center py-4">
                              <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
                              <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Email Enviado!
                              </h3>
                              <p className="text-gray-600 mb-4">
                                Verifique sua caixa de entrada em <strong>{resetEmail}</strong> e siga as instruções para redefinir sua senha.
                              </p>
                              <p className="text-sm text-gray-500 mb-4">
                                Não recebeu o email? Verifique a pasta de spam ou tente novamente.
                              </p>
                              <Button onClick={handleResetModalClose} className="w-full">
                                Fechar
                              </Button>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="Sua senha"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={loading || socialLoading !== null}
                  >
                    {loading ? 'Entrando...' : 'Entrar'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Nome</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Seu nome completo"
                        value={signupData.name}
                        onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={signupData.email}
                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        value={signupData.password}
                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password">Confirmar Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-confirm-password"
                        type="password"
                        placeholder="Confirme sua senha"
                        value={signupData.confirmPassword}
                        onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.valu
(Content truncated due to size limit. Use line ranges to read in chunks)