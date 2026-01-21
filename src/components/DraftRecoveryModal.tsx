import React from 'react';
import { Draft } from '../utils/draftUtils';

interface DraftRecoveryModalProps {
  draft: Draft;
  onRestore: () => void;
  onDiscard: () => void;
  onCancel: () => void;
}

const DraftRecoveryModal: React.FC<DraftRecoveryModalProps> = ({
  draft,
  onRestore,
  onDiscard,
  onCancel
}) => {
  const { metadata } = draft;
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'full',
      timeStyle: 'short'
    }).format(date);
  };

  const getCompletionColor = () => {
    if (metadata.completionPercentage < 30) return 'text-red-600';
    if (metadata.completionPercentage < 70) return 'text-orange-600';
    return 'text-green-600';
  };

  const getCompletionBgColor = () => {
    if (metadata.completionPercentage < 30) return 'bg-red-500';
    if (metadata.completionPercentage < 70) return 'bg-orange-500';
    return 'bg-green-500';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        {/* Header */}
        <div className="bg-blue-50 border-b border-blue-100 px-6 py-4 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Brouillon trouvé</h2>
              <p className="text-sm text-gray-600">Un brouillon non terminé a été détecté</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-6">
          {/* Message principal */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-gray-700">
              Vous avez un brouillon enregistré pour ce rapport. Voulez-vous continuer là où vous vous êtes arrêté ?
            </p>
          </div>

          {/* Informations du brouillon */}
          <div className="space-y-4">
            {/* Date de dernière modification */}
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-gray-900">Dernière modification</p>
                <p className="text-sm text-gray-600">{formatDate(metadata.lastModifiedAt)}</p>
              </div>
            </div>

            {/* Progression */}
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 mb-2">Progression du formulaire</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${getCompletionBgColor()}`}
                      style={{ width: `${metadata.completionPercentage}%` }}
                    />
                  </div>
                  <span className={`text-sm font-semibold ${getCompletionColor()}`}>
                    {metadata.completionPercentage}%
                  </span>
                </div>
              </div>
            </div>

            {/* Section actuelle */}
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <div>
                <p className="text-sm font-medium text-gray-900">Section en cours</p>
                <p className="text-sm text-gray-600">{metadata.currentSection}</p>
              </div>
            </div>

            {/* Sections complétées */}
            {metadata.completedSections.length > 0 && (
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-1">Sections complétées</p>
                  <div className="flex flex-wrap gap-2">
                    {metadata.completedSections.map((section: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                      >
                        {section}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Warning si le brouillon est ancien */}
          {(() => {
            const lastModified = new Date(metadata.lastModifiedAt);
            const now = new Date();
            const diffDays = Math.floor((now.getTime() - lastModified.getTime()) / (1000 * 60 * 60 * 24));
            
            if (diffDays > 7) {
              return (
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-yellow-800">Brouillon ancien</p>
                      <p className="text-sm text-yellow-700">
                        Ce brouillon date de {diffDays} jour{diffDays > 1 ? 's' : ''}. Certaines informations peuvent être obsolètes.
                      </p>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })()}
        </div>

        {/* Footer avec boutons d'action */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex flex-col sm:flex-row gap-3 sm:justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 text-sm font-medium"
          >
            Annuler
          </button>
          <button
            onClick={onDiscard}
            className="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 transition-colors text-sm font-medium"
          >
            Supprimer le brouillon
          </button>
          <button
            onClick={onRestore}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reprendre le brouillon
          </button>
        </div>
      </div>
    </div>
  );
};

export default DraftRecoveryModal;
