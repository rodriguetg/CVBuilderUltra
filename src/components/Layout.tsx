import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Home, 
  Upload, 
  LayoutDashboard, 
  Edit3, 
  Settings,
  Sparkles,
  FileSignature,
  Users,
  ChevronDown,
  Search
} from 'lucide-react';
import { useCVContext } from '../context/CVContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { state, dispatch } = useCVContext();
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);

  const { profiles, currentProfileId } = state;
  const currentProfile = profiles.find(p => p.id === currentProfileId);

  const navigation = [
    { name: 'Accueil', href: '/', icon: Home },
    { name: 'Import', href: '/import', icon: Upload },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Éditeur CV', href: '/edit', icon: Edit3 },
    { name: 'Lettres', href: '/letter-generator', icon: FileSignature },
    { name: 'Recherche d\'offres', href: '/job-search', icon: Search },
    { name: 'Profils', href: '/profiles', icon: Users },
    { name: 'Paramètres', href: '/settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    if (path === '/edit') return location.pathname.startsWith('/edit');
    return location.pathname.startsWith(path);
  };

  const handleProfileChange = (profileId: string) => {
    dispatch({ type: 'SET_CURRENT_PROFILE_ID', payload: profileId });
    setProfileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm border-b border-gray-200"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">CV Builder Ultra</h1>
                <p className="text-xs text-gray-600">Créateur de CV IA</p>
              </div>
            </Link>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button 
                  onClick={() => setProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200"
                >
                  <Users className="w-4 h-4" />
                  <span>{currentProfile?.name || 'Profils'}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <AnimatePresence>
                  {isProfileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border"
                    >
                      <div className="py-1">
                        {profiles.map(profile => (
                          <button
                            key={profile.id}
                            onClick={() => handleProfileChange(profile.id)}
                            className={`w-full text-left px-4 py-2 text-sm ${currentProfileId === profile.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                          >
                            {profile.name}
                          </button>
                        ))}
                         <div className="border-t my-1"></div>
                         <Link to="/profiles" onClick={() => setProfileMenuOpen(false)} className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-100">
                           Gérer les profils
                         </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <span>Propulsé par l'IA</span>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8 overflow-x-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 py-4 text-sm font-medium border-b-2 transition-colors duration-200 whitespace-nowrap ${
                    isActive(item.href)
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
