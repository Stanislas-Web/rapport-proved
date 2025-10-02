import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface UseAutoLogoutOptions {
  sessionDurationHours: number; // Durée de session en heures (ex: 23 pour 23 heures)
  checkInterval?: number; // Intervalle de vérification en millisecondes (défaut: 60000 = 1 minute)
}

export const useAutoLogout = ({ 
  sessionDurationHours, 
  checkInterval = 60000 
}: UseAutoLogoutOptions) => {
  const navigate = useNavigate();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const logout = () => {
    // Supprimer les informations utilisateur du localStorage
    localStorage.removeItem('telephone');
    localStorage.removeItem('password');
    localStorage.removeItem('token');
    localStorage.removeItem('data');
    localStorage.removeItem('loginTime');

    // Rediriger l'utilisateur vers la page de connexion
    navigate('/signin');
    
    // Afficher un message d'information
    console.log(`🕚 Déconnexion automatique : Session expirée après ${sessionDurationHours}h`);
  };

  const checkTime = () => {
    const loginTimeStr = localStorage.getItem('loginTime');
    
    if (!loginTimeStr) {
      // Pas d'heure de connexion enregistrée, pas de déconnexion automatique
      return;
    }

    const loginTime = new Date(loginTimeStr);
    const now = new Date();
    
    // Calculer le temps écoulé depuis la connexion en millisecondes
    const timeElapsed = now.getTime() - loginTime.getTime();
    
    // Convertir en heures
    const hoursElapsed = timeElapsed / (1000 * 60 * 60);
    
    // Si le temps écoulé dépasse la durée de session autorisée
    if (hoursElapsed >= sessionDurationHours) {
      logout();
    }
  };

  useEffect(() => {
    // Vérifier immédiatement au montage du composant
    checkTime();

    // Configurer l'intervalle de vérification
    intervalRef.current = setInterval(checkTime, checkInterval);

    // Nettoyer l'intervalle lors du démontage
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [sessionDurationHours, checkInterval]);

  return {
    logout,
    checkTime
  };
};
