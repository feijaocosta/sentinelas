import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { PrayerRequestCard } from './PrayerRequestCard';
import { EventCard } from './EventCard';
import { AddPrayerRequest } from './AddPrayerRequest';
import { useAuth } from './AuthContext';
import { 
  ArrowLeft, 
  Plus, 
  MessageCircle, 
  Calendar, 
  Share2,
  Copy
} from 'lucide-react';
import { projectId } from '../utils/supabase/info';
import { Group } from 'types/group';
import { PrayerRequest } from 'types/prayerRequest';
import { Event } from 'types/event';

interface GroupHomeProps {
  group: any;
  onBack: () => void;
  onAddEvent: () => void;
}

export const GroupHome: React.FC<GroupHomeProps> = ({
  group,
  onBack,
  onAddEvent,
}) => {
  const { getAccessToken } = useAuth();
  const [groupData, setGroupData] = useState<Group | null>(null);
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddPrayer, setShowAddPrayer] = useState(false);
  const [showInviteCode, setShowInviteCode] = useState(false);

  useEffect(() => {
    if (group?.id) {
      fetchGroupData();
    }
  }, [group]);

  const fetchGroupData = async () => {
    try {
      const token = getAccessToken();
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7b29b695/groups/${group.id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao carregar dados do grupo');
      }

      const data = await response.json();
      setGroupData(data.group);
      setPrayerRequests(data.prayer_requests || []);
      setEvents(data.events || []);
    } catch (err) {
      setError('Erro ao carregar dados do grupo');
      console.error('Fetch group data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyInviteCode = () => {
    if (groupData?.invite_code) {
      navigator.clipboard.writeText(groupData.invite_code);
      alert('Código de convite copiado!');
    }
  };

  const handlePrayerAdded = () => {
    setShowAddPrayer(false);
    fetchGroupData(); // Refresh data
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Carregando grupo...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertDescription className="text-red-800">
          {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
            <h1 className="text-2xl font-bold text-gray-900">{group.name}</h1>
            {group.description && (
              <p className="text-gray-600 mt-1">{group.description}</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowInviteCode(!showInviteCode)}
            className="flex items-center space-x-2"
          >
            <Share2 className="w-4 h-4" />
            <span>Convidar</span>
          </Button>
        </div>
      </div>

      {/* Invite Code */}
      {showInviteCode && groupData?.invite_code && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-blue-900">Código de Convite</p>
                <p className="text-blue-700 font-mono text-lg">{groupData.invite_code}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyInviteCode}
                className="flex items-center space-x-2"
              >
                <Copy className="w-4 h-4" />
                <span>Copiar</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs defaultValue="prayers" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="prayers" className="flex items-center space-x-2">
            <MessageCircle className="w-4 h-4" />
            <span>Pedidos de Oração</span>
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Eventos</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="prayers" className="mt-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Pedidos de Oração ({prayerRequests.length})
            </h2>
            <Button
              onClick={() => setShowAddPrayer(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Pedido</span>
            </Button>
          </div>

          {showAddPrayer && (
            <AddPrayerRequest
              groupId={group.id}
              onSuccess={handlePrayerAdded}
              onCancel={() => setShowAddPrayer(false)}
            />
          )}

          {prayerRequests.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Nenhum pedido de oração
                </h3>
                <p className="text-gray-500 mb-4">
                  Seja o primeiro a compartilhar um pedido de oração com o grupo.
                </p>
                <Button
                  onClick={() => setShowAddPrayer(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Primeiro Pedido
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {prayerRequests.map((request) => (
                <PrayerRequestCard
                  key={request.id}
                  request={request}
                  onPrayerLogged={fetchGroupData}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="events" className="mt-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Eventos ({events.length})
            </h2>
            <Button
              onClick={onAddEvent}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Evento</span>
            </Button>
          </div>

          {events.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Nenhum evento agendado
                </h3>
                <p className="text-gray-500 mb-4">
                  Organize encontros de oração e eventos especiais para o grupo.
                </p>
                <Button
                  onClick={onAddEvent}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeiro Evento
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};