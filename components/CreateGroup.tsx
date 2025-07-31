import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { useAuth } from './AuthContext';
import { ArrowLeft, Users, Share2, Copy } from 'lucide-react';
import { projectId } from '../utils/supabase/info';
import { Group } from '../types/group';

interface CreateGroupProps {
  onBack: () => void;
  onGroupCreated: (group: any) => void;
}

export const CreateGroup: React.FC<CreateGroupProps> = ({
  onBack,
  onGroupCreated,
}) => {
  const { getAccessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdGroup, setCreatedGroup] = useState<Group | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('O nome do grupo é obrigatório');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = getAccessToken();
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7b29b695/groups`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao criar grupo');
      }

      const data = await response.json();
      setCreatedGroup(data.group);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar grupo');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyInviteCode = () => {
    if (createdGroup?.invite_code) {
      navigator.clipboard.writeText(createdGroup.invite_code);
      alert('Código de convite copiado!');
    }
  };

  if (createdGroup) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Grupo Criado!</h1>
          <p className="text-gray-600">Seu grupo de oração foi criado com sucesso</p>
        </div>

        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-900">{createdGroup.name}</CardTitle>
            <CardDescription className="text-green-700">
              {createdGroup.description || 'Sem descrição'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                <div>
                  <p className="font-medium text-gray-900">Código de Convite</p>
                  <p className="text-gray-600 font-mono text-lg">{createdGroup.invite_code}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Compartilhe este código para convidar membros
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleCopyInviteCode}
                  className="flex items-center space-x-2"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copiar</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => onGroupCreated(createdGroup)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Entrar no Grupo
          </Button>
          <Button
            variant="outline"
            onClick={onBack}
          >
            Voltar aos Grupos
          </Button>
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-gray-900">Criar Novo Grupo</h1>
          <p className="text-gray-600 mt-1">Configure seu grupo de oração</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span>Informações do Grupo</span>
          </CardTitle>
          <CardDescription>
            Preencha as informações básicas para criar seu grupo de oração
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

            <div className="space-y-2">
              <Label htmlFor="name">Nome do Grupo *</Label>
              <Input
                id="name"
                type="text"
                placeholder="Ex: Grupo de Oração da Igreja Central"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Textarea
                id="description"
                placeholder="Descreva o propósito e objetivos do grupo..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="min-h-[100px]"
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-3">
                <Share2 className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-900">Código de Convite</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Após criar o grupo, você receberá um código único para convidar outros membros.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {loading ? 'Criando Grupo...' : 'Criar Grupo'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};