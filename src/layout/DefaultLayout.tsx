import React, { useState, ReactNode, useEffect } from 'react';
import Header from '../components/Header/index';
import Sidebar from '../components/Sidebar/index';

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

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
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
