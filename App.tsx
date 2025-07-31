import React, { useState } from 'react';
import { AuthProvider, useAuth } from './components/AuthContext';
import { Navigation } from './components/Navigation';
import { LoginForm } from './components/LoginForm';
import { GroupHome } from './components/GroupHome';
import { CreateGroup } from './components/CreateGroup';
import { JoinGroup } from './components/JoinGroup';
import { AddEvent } from './components/AddEvent';
import { GroupsList } from './components/GroupsList';
import { UserProfile } from './components/UserProfile';
import { ResetPassword } from './components/ResetPassword';

type View = 'login' | 'groups' | 'group-home' | 'create-group' | 'join-group' | 'add-event' | 'profile' | 'reset-password';

function AppContent() {
  const { user, signOut, loading } = useAuth();
  const [currentView, setCurrentView] = useState<View>('groups');
  const [selectedGroup, setSelectedGroup] = useState(null);

  // Verificar se é uma página de reset de senha
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');
    
    if (type === 'recovery') {
      setCurrentView('reset-password');
    }
  }, []);

  // Show loading while auth is being determined
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Show login if no user (except for reset password)
  if (!user && currentView !== 'reset-password') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <main className="container mx-auto px-4 py-6 max-w-4xl">
          <LoginForm onLogin={() => setCurrentView('groups')} />
        </main>
      </div>
    );
  }

  // Show reset password without navigation
  if (currentView === 'reset-password') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <ResetPassword 
          onSuccess={() => setCurrentView('login')}
          onBack={() => setCurrentView('login')}
        />
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    setCurrentView('groups');
    setSelectedGroup(null);
  };

  const handleGroupSelect = (group: any) => {
    setSelectedGroup(group);
    setCurrentView('group-home');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'groups':
        return (
          <GroupsList 
            onGroupSelect={handleGroupSelect}
            onCreateGroup={() => setCurrentView('create-group')}
            onJoinGroup={() => setCurrentView('join-group')}
          />
        );
      case 'group-home':
        return (
          <GroupHome 
            group={selectedGroup}
            onBack={() => setCurrentView('groups')}
            onAddEvent={() => setCurrentView('add-event')}
          />
        );
      case 'create-group':
        return (
          <CreateGroup 
            onBack={() => setCurrentView('groups')}
            onGroupCreated={(group) => handleGroupSelect(group)}
          />
        );
      case 'join-group':
        return (
          <JoinGroup 
            onBack={() => setCurrentView('groups')}
            onGroupJoined={(group) => handleGroupSelect(group)}
          />
        );
      case 'add-event':
        return (
          <AddEvent 
            group={selectedGroup}
            onBack={() => setCurrentView('group-home')}
            onEventAdded={() => setCurrentView('group-home')}
          />
        );
      case 'profile':
        return (
          <UserProfile 
            onBack={() => setCurrentView('groups')}
          />
        );
      case 'reset-password':
        return (
          <ResetPassword 
            onSuccess={() => setCurrentView('login')}
            onBack={() => setCurrentView('login')}
          />
        );
      default:
        return (
          <GroupsList 
            onGroupSelect={handleGroupSelect}
            onCreateGroup={() => setCurrentView('create-group')}
            onJoinGroup={() => setCurrentView('join-group')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navigation 
        currentView={currentView}
        onSignOut={handleSignOut}
        onNavigate={setCurrentView}
        selectedGroup={selectedGroup}
      />
      
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {renderCurrentView()}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}