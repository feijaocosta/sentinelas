import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { useAuth } from './AuthContext';
import { ArrowLeft, Calendar, MapPin, Clock } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface AddEventProps {
  group: any;
  onBack: () => void;
  onEventAdded: () => void;
}

export const AddEvent: React.FC<AddEventProps> = ({
  group,
  onBack,
  onEventAdded,
}) => {
  const { getAccessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    event_date: '',
    location: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('O título do evento é obrigatório');
      return;
    }

    if (!formData.event_date) {
      setError('A data e hora do evento são obrigatórias');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = getAccessToken();
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7b29b695/groups/${group.id}/events`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            event_date: new Date(formData.event_date).toISOString(),
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao criar evento');
      }

      onEventAdded();
    } catch (err) {
      setError(err.message || 'Erro ao criar evento');
    } finally {
      setLoading(false);
    }
  };

  // Get current date/time for min attribute
  const now = new Date();
  const currentDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

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
          <h1 className="text-3xl font-bold text-gray-900">Adicionar Evento</h1>
          <p className="text-gray-600 mt-1">
            Criar evento para <span className="font-medium">{group.name}</span>
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span>Novo Evento</span>
          </CardTitle>
          <CardDescription>
            Organize encontros, cultos de oração e eventos especiais para o grupo
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
              <Label htmlFor="title">Título do Evento *</Label>
              <Input
                id="title"
                type="text"
                placeholder="Ex: Culto de Oração Semanal"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="event_date">Data e Hora *</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="event_date"
                  type="datetime-local"
                  value={formData.event_date}
                  onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                  min={currentDateTime}
                  className="pl-10"
                  required
                />
              </div>
              <p className="text-sm text-gray-500">
                Selecione a data e hora do evento
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Local (opcional)</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="location"
                  type="text"
                  placeholder="Ex: Igreja Central, Sala 10 ou Online via Zoom"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-900">Dicas para Eventos</h3>
                  <ul className="text-sm text-blue-700 mt-1 space-y-1">
                    <li>• Seja específico no título para facilitar a identificação</li>
                    <li>• Inclua o local mesmo para eventos online</li>
                    <li>• Considere criar eventos recorrentes separadamente</li>
                    <li>• Todos os membros do grupo poderão ver o evento</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {loading ? 'Criando Evento...' : 'Criar Evento'}
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

      {/* Preview Card */}
      {(formData.title || formData.event_date || formData.location) && (
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg">Visualização do Evento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {formData.title && (
                <div>
                  <h3 className="font-semibold text-gray-900">{formData.title}</h3>
                </div>
              )}
              
              {formData.event_date && (
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(formData.event_date).toLocaleDateString('pt-BR', {
                      weekday: 'long',
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              )}
              
              {formData.location && (
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{formData.location}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};