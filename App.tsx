import { useState } from 'react';
import { AuthProvider, useAuth } from './components/AuthContext';
import { Navigation } from './components/Navigation';
import { LoginForm } from './components/LoginForm';
import { GroupHome } from './components/GroupHome';
import { CreateGroup } from './components/CreateGroup';
import { JoinGroup } from './components/JoinGroup';
import { AddEvent } from './components/AddEvent';
import { GroupsList } from './components/GroupsList';

type View = 'login' | 'groups' | 'group-home' | 'create-group' | 'join-group' | 'add-event';

function AppContent() {
  const { user, signOut, loading } = useAuth();
  const [currentView, setCurrentView] = useState<View>('groups');
  const [selectedGroup, setSelectedGroup] = useState(null);

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

  // Show login if no user
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <main className="container mx-auto px-4 py-6 max-w-4xl">
          <LoginForm onLogin={() => setCurrentView('groups')} />
        </main>
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