import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Alert, AlertDescription } from './ui/alert';
import { useAuth } from './AuthContext';
import { X } from 'lucide-react';
import { projectId } from '../utils/supabase/info';

interface AddPrayerRequestProps {
  groupId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const AddPrayerRequest: React.FC<AddPrayerRequestProps> = ({
  groupId,
  onSuccess,
  onCancel,
}) => {
  const { getAccessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    content: '',
    category: 'outros',
    is_anonymous: false,
  });

  const categories = [
    { value: 'saude', label: 'Saúde' },
    { value: 'familia', label: 'Família' },
    { value: 'trabalho', label: 'Trabalho' },
    { value: 'espiritual', label: 'Espiritual' },
    { value: 'financeiro', label: 'Financeiro' },
    { value: 'relacionamento', label: 'Relacionamento' },
    { value: 'outros', label: 'Outros' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.content.trim()) {
      setError('O conteúdo do pedido é obrigatório');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = getAccessToken();
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7b29b695/groups/${groupId}/prayer-requests`,
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
        throw new Error(errorData.error || 'Erro ao criar pedido de oração');
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar pedido de oração');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-blue-900">
            Novo Pedido de Oração
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-blue-700 hover:text-blue-900"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="content">Pedido de Oração *</Label>
            <Textarea
              id="content"
              placeholder="Compartilhe seu pedido de oração com o grupo..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="min-h-[100px] bg-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="anonymous"
              checked={formData.is_anonymous}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, is_anonymous: checked as boolean })
              }
            />
            <Label 
              htmlFor="anonymous" 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Compartilhar anonimamente
            </Label>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {loading ? 'Criando...' : 'Compartilhar Pedido'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};