import { useEffect, useState } from 'react';

interface UseAutoLogoutNotificationOptions {
  sessionDurationHours: number; // Durée de session en heures (ex: 23 pour 23 heures)
  warningMinutes: number; // Minutes avant la déconnexion pour afficher l'avertissement
  checkInterval?: number; // Intervalle de vérification en millisecondes
}

export const useAutoLogoutNotification = ({ 
  sessionDurationHours, 
  warningMinutes = 5,
  checkInterval = 60000 
}: UseAutoLogoutNotificationOptions) => {
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const checkTime = () => {
      const loginTimeStr = localStorage.getItem('loginTime');
      
      if (!loginTimeStr) {
        setShowWarning(false);
        return;
      }

      const loginTime = new Date(loginTimeStr);
      const now = new Date();
      
      // Calculer le temps écoulé depuis la connexion en millisecondes
      const timeElapsed = now.getTime() - loginTime.getTime();
      
      // Convertir en minutes
      const minutesElapsed = timeElapsed / (1000 * 60);
      
      // Calculer le temps total de session en minutes
      const totalSessionMinutes = sessionDurationHours * 60;
      
      // Calculer le temps restant en minutes
      const minutesUntilLogout = totalSessionMinutes - minutesElapsed;

      // Afficher l'avertissement si on est dans la période d'avertissement
      if (minutesUntilLogout <= warningMinutes && minutesUntilLogout > 0) {
        setShowWarning(true);
        setTimeLeft(Math.ceil(minutesUntilLogout));
      } else {
        setShowWarning(false);
      }
    };

    // Vérifier immédiatement
    checkTime();

    // Configurer l'intervalle de vérification
    const interval = setInterval(checkTime, checkInterval);

    return () => clearInterval(interval);
  }, [sessionDurationHours, warningMinutes, checkInterval]);

  return {
    showWarning,
    timeLeft,
    dismissWarning: () => setShowWarning(false)
  };
};
