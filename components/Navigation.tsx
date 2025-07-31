import React, { useState } from 'react';
import { LucideIcon, Menu, X, Users, Plus, LogOut, Link as LinkIcon } from 'lucide-react';
import { Button } from './ui/button';

type View = 'login' | 'groups' | 'group-home' | 'create-group' | 'join-group' | 'add-event';

type MenuItem = {
  id: View;
  label: string;
  icon: LucideIcon;
};

interface NavigationProps {
  currentView: string;
  onSignOut: () => void;
  onNavigate: (view: View) => void;
  selectedGroup: any;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onSignOut,
  onNavigate,
  selectedGroup
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems: MenuItem[] = [
    { id: 'groups', label: 'Meus Grupos', icon: Users },
    { id: 'create-group', label: 'Criar Grupo', icon: Plus },
    { id: 'join-group', label: 'Entrar no Grupo', icon: LinkIcon },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">
              {selectedGroup ? selectedGroup.name : 'Oração em Grupo'}
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentView === item.id ? "default" : "ghost"}
                  onClick={() => onNavigate(item.id)}
                  className="flex items-center space-x-2"
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{item.label}</span>
                </Button>
              );
            })}
            
            <Button
              variant="outline"
              onClick={onSignOut}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="p-2"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-2">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={currentView === item.id ? "default" : "ghost"}
                    onClick={() => {
                      onNavigate(item.id);
                      setIsMenuOpen(false);
                    }}
                    className="justify-start flex items-center space-x-3 w-full"
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Button>
                );
              })}
              
              <Button
                variant="outline"
                onClick={() => {
                  onSignOut();
                  setIsMenuOpen(false);
                }}
                className="justify-start flex items-center space-x-3 w-full text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};