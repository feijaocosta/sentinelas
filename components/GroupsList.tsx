import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { useAuth } from './AuthContext';
import { Users, Plus, Link as LinkIcon, Calendar, MessageCircle, ArrowRight } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface GroupsListProps {
  onGroupSelect: (group: any) => void;
  onCreateGroup: () => void;
  onJoinGroup: () => void;
}

export const GroupsList: React.FC<GroupsListProps> = ({
  onGroupSelect,
  onCreateGroup,
  onJoinGroup,
}) => {
  const { getAccessToken } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const token = getAccessToken();
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7b29b695/groups`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao carregar grupos');
      }

      const data = await response.json();
      setGroups(data.groups || []);
    } catch (err) {
      setError('Erro ao carregar grupos');
      console.error('Fetch groups error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando grupos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Meus Grupos de Oração</h1>
        <p className="text-gray-600">Gerencie seus grupos e participe das orações em comunidade</p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={onCreateGroup}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Novo Grupo</span>
        </Button>
        
        <Button
          onClick={onJoinGroup}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <LinkIcon className="w-4 h-4" />
          <span>Entrar com Convite</span>
        </Button>
      </div>

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Groups Grid */}
      {groups.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Nenhum grupo encontrado
            </h3>
            <p className="text-gray-500 mb-6">
              Você ainda não participa de nenhum grupo de oração.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={onCreateGroup}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Grupo
              </Button>
              <Button
                onClick={onJoinGroup}
                variant="outline"
              >
                <LinkIcon className="w-4 h-4 mr-2" />
                Entrar em um Grupo
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <Card 
              key={group.id} 
              className="hover:shadow-lg transition-all duration-200 cursor-pointer group border-0 shadow-md"
              onClick={() => onGroupSelect(group)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {group.name}
                    </CardTitle>
                    <CardDescription className="mt-1 text-sm">
                      {group.description || 'Sem descrição'}
                    </CardDescription>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>Pedidos</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Eventos</span>
                    </div>
                  </div>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                    Ativo
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};