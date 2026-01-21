import React, { useState } from 'react';
import { formatTimeSince, deleteDraft } from '../utils/draftUtils';

interface DraftIndicatorProps {
  lastSaved: Date | null;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  completionPercentage: number;
  onForceSave?: () => void;
  onClearDraft?: () => void;
  error?: Error | null;
}

const DraftIndicator: React.FC<DraftIndicatorProps> = ({
  lastSaved,
  isSaving,
  hasUnsavedChanges,
  completionPercentage,
  onForceSave,
  onClearDraft,
  error
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleClearDraft = () => {
    // Supprimer toutes les clés de brouillon
    deleteDraft();
    
    // Callback pour notifier le parent
    if (onClearDraft) {
      onClearDraft();
    }
    
    setShowConfirmDelete(false);
    
    // Forcer le nettoyage et recharger
    setTimeout(() => {
      window.location.href = window.location.pathname;
    }, 100);
  };
  const getStatusColor = () => {
    if (error) return 'text-red-600';
    if (isSaving) return 'text-blue-600';
    if (hasUnsavedChanges) return 'text-orange-600';
    return 'text-green-600';
  };

  const getStatusIcon = () => {
    if (error) {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
    if (isSaving) {
      return (
        <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      );
    }
    if (hasUnsavedChanges) {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  };

  const getStatusText = () => {
    if (error) return 'Erreur de sauvegarde';
    if (isSaving) return 'Enregistrement...';
    if (hasUnsavedChanges) return 'Modifications non enregistrées';
    if (lastSaved) return `Enregistré ${formatTimeSince(lastSaved)}`;
    return 'Aucune sauvegarde';
  };

  const getProgressColor = () => {
    if (completionPercentage < 30) return 'bg-red-500';
    if (completionPercentage < 70) return 'bg-orange-500';
    return 'bg-green-500';
  };

  return (
    <div className="fixed top-20 right-4 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-4 min-w-[280px]">
      {/* Statut de sauvegarde */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={getStatusColor()}>
            {getStatusIcon()}
          </span>
          <span className={`text-sm font-medium pr-5 ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
        
        {onForceSave && !isSaving && (
          <button
            onClick={onForceSave}
            className="text-xs text-blue-600 hover:text-blue-800 underline"
            title="Enregistrer maintenant"
          >
            Enregistrer
          </button>
        )}
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="mb-3 text-xs text-red-600 bg-red-50 p-2 rounded">
          {error.message}
        </div>
      )}

      {/* Barre de progression */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>Progression</span>
          <span className="font-semibold">{completionPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${getProgressColor()}`}
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Indicateur de statut du brouillon */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-xs text-gray-600">Brouillon</span>
          <span className="ml-auto px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
            En cours
          </span>
        </div>
        
        {/* Bouton pour vider le brouillon */}
        <div className="mt-2">
          {!showConfirmDelete ? (
            <button
              onClick={() => setShowConfirmDelete(true)}
              className="text-xs text-red-600 hover:text-red-800 hover:underline flex items-center gap-1"
              title="Vider le brouillon et recommencer"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Vider le brouillon
            </button>
          ) : (
            <div className="bg-red-50 p-2 rounded space-y-2">
              <p className="text-xs text-red-700">Êtes-vous sûr ? Cette action est irréversible.</p>
              <div className="flex gap-2">
                <button
                  onClick={handleClearDraft}
                  className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Confirmer
                </button>
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="text-xs px-2 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Auto-save indicator */}
      <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <span>Sauvegarde automatique activée</span>
      </div>
    </div>
  );
};

export default DraftIndicator;
