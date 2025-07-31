import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { useAuth } from './AuthContext';
import { Heart, User, Clock } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface PrayerRequestCardProps {
  request: any;
  onPrayerLogged: () => void;
}

export const PrayerRequestCard: React.FC<PrayerRequestCardProps> = ({
  request,
  onPrayerLogged,
}) => {
  const { getAccessToken } = useAuth();
  const [praying, setPraying] = useState(false);

  const handlePray = async () => {
    setPraying(true);
    try {
      const token = getAccessToken();
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7b29b695/prayer-requests/${request.id}/pray`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        onPrayerLogged();
      }
    } catch (error) {
      console.error('Erro ao registrar oração:', error);
    } finally {
      setPraying(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'saude': 'bg-red-100 text-red-800',
      'familia': 'bg-blue-100 text-blue-800',
      'trabalho': 'bg-green-100 text-green-800',
      'espiritual': 'bg-purple-100 text-purple-800',
      'financeiro': 'bg-yellow-100 text-yellow-800',
      'relacionamento': 'bg-pink-100 text-pink-800',
      'outros': 'bg-gray-100 text-gray-800',
    };
    return colors[category] || colors['outros'];
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            {request.is_anonymous ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-500" />
              </div>
            ) : (
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
            )}
            <div>
              <p className="font-medium text-sm text-gray-900">
                {request.is_anonymous ? 'Anônimo' : 'Membro do grupo'}
              </p>
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>{formatDate(request.created_at)}</span>
              </div>
            </div>
          </div>
          {request.category && (
            <Badge 
              variant="secondary"
              className={getCategoryColor(request.category)}
            >
              {request.category.charAt(0).toUpperCase() + request.category.slice(1)}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-700 mb-4 leading-relaxed">
          {request.content}
        </p>
        
        <div className="flex items-center justify-between">
          <Button
            onClick={handlePray}
            disabled={praying}
            size="sm"
            className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
          >
            <Heart className="w-4 h-4" />
            <span>{praying ? 'Orando...' : 'Orei por isso'}</span>
          </Button>
          
          <span className="text-xs text-gray-500">
            Categoria: {request.category || 'Geral'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};