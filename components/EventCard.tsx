import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar, MapPin } from 'lucide-react';

interface EventCardProps {
  event: any;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isUpcoming = date > now;
    
    return {
      formatted: date.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      isUpcoming,
    };
  };

  const eventDate = formatEventDate(event.event_date);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            {event.title}
          </CardTitle>
          <Badge 
            variant={eventDate.isUpcoming ? "default" : "secondary"}
            className={eventDate.isUpcoming ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}
          >
            {eventDate.isUpcoming ? 'Próximo' : 'Realizado'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-start space-x-3">
          <Calendar className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-gray-900 capitalize">
              {eventDate.formatted}
            </p>
          </div>
        </div>

        {event.location && (
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-gray-700">
                {event.location}
              </p>
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Criado em {new Date(event.created_at).toLocaleDateString('pt-BR')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};