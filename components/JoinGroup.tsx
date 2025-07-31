import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { useAuth } from './AuthContext';
import { ArrowLeft, Users, Link as LinkIcon } from 'lucide-react';
import { projectId } from '../utils/supabase/info';

interface JoinGroupProps {
  onBack: () => void;
  onGroupJoined: (group: any) => void;
}

export const JoinGroup: React.FC<JoinGroupProps> = ({
  onBack,
  onGroupJoined,
}) => {
  const { getAccessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [inviteCode, setInviteCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inviteCode.trim()) {
      setError('O código de convite é obrigatório');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = getAccessToken();
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7b29b695/groups/join/${inviteCode.trim()}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao entrar no grupo');
      }

      const data = await response.json();
      setSuccess('Você entrou no grupo com sucesso!');
      
      // Wait a moment to show success message, then navigate
      setTimeout(() => {
        onGroupJoined(data.group);
      }, 1500);
    } catch (err) {
      let message = err instanceof Error ? err.message : 'Erro ao entrar no grupo'
      if (message.includes('Already a member')) {
        setError('Você já é membro deste grupo');
      } else if (message.includes('Invalid invite code')) {
        setError('Código de convite inválido ou expirado');
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCodeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove spaces and convert to uppercase for consistency
    const value = e.target.value.replace(/\s/g, '').toUpperCase();
    setInviteCode(value);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="p-2"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Entrar em um Grupo</h1>
          <p className="text-gray-600 mt-1">Use um código de convite para participar</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <LinkIcon className="w-5 h-5 text-blue-600" />
            <span>Código de Convite</span>
          </CardTitle>
          <CardDescription>
            Digite o código de convite que você recebeu para entrar no grupo
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="invite-code">Código de Convite *</Label>
              <Input
                id="invite-code"
                type="text"
                placeholder="Digite o código (ex: ABC12345)"
                value={inviteCode}
                onChange={handleCodeInput}
                className="text-center font-mono text-lg tracking-wider"
                maxLength={8}
                required
              />
              <p className="text-sm text-gray-500">
                O código geralmente tem 8 caracteres
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-3">
                <Users className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-900">Como conseguir um código?</h3>
                  <ul className="text-sm text-blue-700 mt-1 space-y-1">
                    <li>• Peça para um membro do grupo compartilhar o código</li>
                    <li>• O administrador do grupo pode encontrar o código nas configurações</li>
                    <li>• Códigos são únicos para cada grupo</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                type="submit"
                disabled={loading || !inviteCode.trim()}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {loading ? 'Entrando...' : 'Entrar no Grupo'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="flex-1"
              >
                Voltar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg">Precisa de Ajuda?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              <strong>Não tem um código?</strong> Peça para alguém do grupo compartilhar o código de convite com você.
            </p>
            <p>
              <strong>Código não funciona?</strong> Verifique se digitou corretamente. Códigos são sensíveis a maiúsculas e minúsculas.
            </p>
            <p>
              <strong>Quer criar seu próprio grupo?</strong> Use a opção "Criar Novo Grupo" no menu principal.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};