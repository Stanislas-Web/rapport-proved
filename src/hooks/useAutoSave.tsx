import { useEffect, useRef, useState } from 'react';

interface AutoSaveOptions {
  key: string;
  data: any;
  delay?: number; // Délai en millisecondes (défaut: 30000 = 30s)
  enabled?: boolean;
  onSave?: () => void;
  onError?: (error: Error) => void;
  customSave?: (data: any) => void; // Fonction de sauvegarde personnalisée
}

interface AutoSaveStatus {
  lastSaved: Date | null;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  error: Error | null;
}

export const useAutoSave = ({
  key,
  data,
  delay = 30000,
  enabled = true,
  onSave,
  onError,
  customSave
}: AutoSaveOptions) => {
  const [status, setStatus] = useState<AutoSaveStatus>({
    lastSaved: null,
    isSaving: false,
    hasUnsavedChanges: false,
    error: null
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedDataRef = useRef<string>('');
  const isFirstRenderRef = useRef(true);

  // Fonction pour sauvegarder
  const save = async (force: boolean = false) => {
    if (!enabled && !force) return;

    const currentData = JSON.stringify(data);
    
    // Ne sauvegarder que si les données ont changé
    if (currentData === lastSavedDataRef.current && !force) {
      return;
    }

    setStatus(prev => ({ ...prev, isSaving: true, error: null }));

    try {
      // Utiliser la fonction de sauvegarde personnalisée si fournie
      if (customSave) {
        customSave(data);
      } else {
        // Sinon, sauvegarder dans localStorage (ancien comportement)
        localStorage.setItem(key, currentData);
        localStorage.setItem(`${key}_timestamp`, new Date().toISOString());
      }
      
      lastSavedDataRef.current = currentData;
      
      setStatus({
        lastSaved: new Date(),
        isSaving: false,
        hasUnsavedChanges: false,
        error: null
      });

      onSave?.();
    } catch (error) {
      const err = error as Error;
      setStatus(prev => ({ 
        ...prev, 
        isSaving: false, 
        error: err 
      }));
      onError?.(err);
    }
  };

  // Auto-save avec debounce
  useEffect(() => {
    // Ignorer le premier render
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      // Charger l'état initial depuis la vraie source (rapport_draft avec métadonnées)
      const draftStr = localStorage.getItem('rapport_draft');
      if (draftStr) {
        try {
          const draft = JSON.parse(draftStr);
          // Si c'est un draft avec metadata, extraire la date
          const timestamp = draft.metadata?.lastSavedAt || 
                           localStorage.getItem(`${key}_timestamp`);
          
          if (timestamp) {
            lastSavedDataRef.current = JSON.stringify(draft.formData || draft);
            setStatus(prev => ({
              ...prev,
              lastSaved: new Date(timestamp),
              hasUnsavedChanges: false
            }));
          }
        } catch (e) {
          console.error('Erreur chargement état initial:', e);
        }
      }
      return;
    }

    if (!enabled) return;

    const currentData = JSON.stringify(data);
    
    // Marquer comme non sauvegardé si les données changent
    if (currentData !== lastSavedDataRef.current) {
      setStatus(prev => ({ ...prev, hasUnsavedChanges: true }));
    }

    // Clear le timeout précédent
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Créer un nouveau timeout
    timeoutRef.current = setTimeout(() => {
      save();
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, delay, enabled]);

  // Fonction pour forcer la sauvegarde
  const forceSave = () => save(true);

  // Fonction pour effacer le brouillon
  const clearDraft = () => {
    localStorage.removeItem(key);
    localStorage.removeItem(`${key}_timestamp`);
    lastSavedDataRef.current = '';
    setStatus({
      lastSaved: null,
      isSaving: false,
      hasUnsavedChanges: false,
      error: null
    });
  };

  return {
    ...status,
    forceSave,
    clearDraft
  };
};
