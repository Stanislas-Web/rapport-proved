import React, { useState, ReactNode, useEffect } from 'react';
import Header from '../components/Header/index';
import Sidebar from '../components/Sidebar/index';
import { useAutoLogout } from '../hooks/useAutoLogout';
import { useAutoLogoutNotification } from '../hooks/useAutoLogoutNotification';
import AutoLogoutWarning from '../components/Notification/AutoLogoutWarning';

const DefaultLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Vérifier si l'utilisateur est connecté en vérifiant le téléphone et le mot de passe dans le localStorage
  useEffect(() => {
    const telephone = localStorage.getItem('telephone');
    const password = localStorage.getItem('password');

    if (telephone && password) {
      setIsAuthenticated(true); // L'utilisateur est connecté
    }
  }, []);

  // Système de déconnexion automatique après 23h de session
  useAutoLogout({ 
    sessionDurationHours: 23, // 23 heures après la connexion
    checkInterval: 60000 // Vérification toutes les minutes
  });

  // Notification d'avertissement avant déconnexion
  const { showWarning, timeLeft, dismissWarning } = useAutoLogoutNotification({
    sessionDurationHours: 23, // 23 heures après la connexion
    warningMinutes: 5, // Avertir 5 minutes avant
    checkInterval: 60000 // Vérification toutes les minutes
  });

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      {/* Notification d'avertissement de déconnexion automatique */}
      <AutoLogoutWarning 
        show={showWarning && isAuthenticated} 
        timeLeft={timeLeft} 
        onDismiss={dismissWarning} 
      />
      
      {/* ===== Page Wrapper Start ===== */}
      <div className="flex h-screen overflow-hidden">
        {isAuthenticated && (
          <>
            {/* ===== Sidebar Start ===== */}
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            {/* ===== Sidebar End ===== */}
          </>
        )}

        {/* ===== Content Area Start ===== */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {isAuthenticated && (
            <>
              {/* ===== Header Start ===== */}
              <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
              {/* ===== Header End ===== */}
            </>
          )}

          {/* ===== Main Content Start ===== */}
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              {children}
            </div>
          </main>
          {/* ===== Main Content End ===== */}
        </div>
        {/* ===== Content Area End ===== */}
      </div>
      {/* ===== Page Wrapper End ===== */}
    </div>
  );
};

export default DefaultLayout;
