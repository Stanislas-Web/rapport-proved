import React, { useState, useEffect } from 'react';
import { EffectifAnnuelService, EffectifAnnuelPayload } from '../../../services/effectifAnnuel/effectifAnnuel.service';
import toast from 'react-hot-toast';

// Interface pour les effectifs au niveau préscolaire et primaire
interface EffectifGarconsFilles {
  effectifGarconsFilles: number;
  effectifFilles: number;
}

// Interface pour les effectifs au niveau secondaire
interface EffectifGarconsFilles2 {
  effectifGarcons: number;
  effectifFilles: number;
}

// Interface pour l'enseignement secondaire
interface EnseignementSecondaire {
  septiemeCTEB: EffectifGarconsFilles2;
  huitiemeCTEB: EffectifGarconsFilles2;
  premiereHumanite: EffectifGarconsFilles2;
  quatriemeHumanite: EffectifGarconsFilles2;
}

// Interface principale pour les effectifs
export interface EffectifsAnneePrecedente {
  niveauPrescolaire: {
    espaceCommunautaireEveil: EffectifGarconsFilles;
    maternel: EffectifGarconsFilles;
    prePrimaire: EffectifGarconsFilles;
    special: EffectifGarconsFilles;
  };
  niveauPrimaire: {
    enseignementSpecial: EffectifGarconsFilles;
    enseignementPrimaire: EffectifGarconsFilles;
  };
  niveauSecondaire: {
    enseignementSpecial: EffectifGarconsFilles2;
    enseignementSecondaire: EnseignementSecondaire;
  };
}

interface EffectifsPrecedentProps {
  effectifs: EffectifsAnneePrecedente;
  onUpdate: (effectifs: EffectifsAnneePrecedente) => void;
  identificationProved?: string;
  annee?: string;
}

const EffectifsPrecedent: React.FC<EffectifsPrecedentProps> = ({ effectifs, onUpdate, identificationProved, annee }) => {
  const [showModal, setShowModal] = useState(false);
  const [localEffectifs, setLocalEffectifs] = useState<EffectifsAnneePrecedente>(effectifs);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Log des props reçues au montage
  useEffect(() => {
    console.log('🎯 EffectifsPrecedent - Props reçues:');
    console.log('  - identificationProved:', identificationProved);
    console.log('  - annee:', annee);
    console.log('  - effectifs (props):', effectifs);
  }, []);

  // Charger les effectifs existants à l'ouverture du modal
  useEffect(() => {
    const loadEffectifs = async () => {
      console.log('🔍 Modal ouvert:', showModal);
      console.log('🔍 identificationProved:', identificationProved, 'Type:', typeof identificationProved);
      console.log('🔍 annee:', annee, 'Type:', typeof annee);
      
      if (showModal && identificationProved && annee) {
        setIsLoading(true);
        console.log('📡 Chargement des effectifs depuis l\'API...');
        
        try {
          const data = await EffectifAnnuelService.getByProvedAndAnnee(identificationProved, annee);
          console.log('📦 Données reçues de l\'API:', data);
          
          let effectifsCharges = null;
          
          // Vérifier si la réponse est un tableau
          if (Array.isArray(data) && data.length > 0) {
            console.log('✅ Format: Tableau avec éléments');
            const firstItem = data[0];
            if (firstItem.effectifs) {
              effectifsCharges = firstItem.effectifs;
              console.log('✅ Effectifs trouvés dans firstItem.effectifs');
            }
          } 
          // Vérifier si c'est un objet direct avec effectifs
          else if (data && data.effectifs) {
            console.log('✅ Format: Objet avec propriété effectifs');
            effectifsCharges = data.effectifs;
          }
          // Vérifier si data est directement la structure effectifs
          else if (data && data.niveauPrescolaire && data.niveauPrimaire && data.niveauSecondaire) {
            console.log('✅ Format: Structure effectifs directe');
            effectifsCharges = data;
          }
          
          if (effectifsCharges) {
            console.log('✅ Mise à jour de localEffectifs avec:', effectifsCharges);
            setLocalEffectifs(effectifsCharges);
            toast.success('📊 Effectifs existants chargés !', { duration: 2000 });
          } else {
            console.log('❌ Aucun effectif trouvé dans la réponse');
          }
          
        } catch (error: any) {
          // Ne pas afficher d'erreur si c'est juste une absence de données (404)
          if (error.response?.status !== 404) {
            console.log('⚠️ Erreur lors du chargement:', error);
          } else {
            console.log('ℹ️ Aucune donnée existante (404)');
          }
        } finally {
          setIsLoading(false);
        }
      } else {
        console.log('❌ Conditions non remplies pour charger les effectifs');
        if (!showModal) console.log('  - Modal fermé');
        if (!identificationProved) console.log('  - identificationProved manquant');
        if (!annee) console.log('  - annee manquante');
      }
    };

    loadEffectifs();
  }, [showModal, identificationProved, annee]);

  const handleSave = async () => {
    if (!identificationProved) {
      toast.error('Identification PROVED manquante');
      return;
    }

    if (!annee) {
      toast.error('Année scolaire manquante');
      return;
    }

    setIsSaving(true);
    
    try {
      const payload: EffectifAnnuelPayload = {
        identificationProved,
        annee,
        effectifs: localEffectifs
      };

      console.log('📤 Envoi des effectifs:', payload);
      
      const response = await EffectifAnnuelService.create(payload);
      
      console.log('✅ Réponse du serveur:', response);
      
      // Recharger les effectifs depuis le backend pour garantir la synchronisation
      try {
        const updatedData = await EffectifAnnuelService.getByProvedAndAnnee(identificationProved, annee);
        
        let effectifsFromBackend = localEffectifs; // Par défaut
        
        if (Array.isArray(updatedData) && updatedData.length > 0 && updatedData[0].effectifs) {
          effectifsFromBackend = updatedData[0].effectifs;
        } else if (updatedData && updatedData.effectifs) {
          effectifsFromBackend = updatedData.effectifs;
        } else if (updatedData && updatedData.niveauPrescolaire) {
          effectifsFromBackend = updatedData;
        }
        
        setLocalEffectifs(effectifsFromBackend);
        onUpdate(effectifsFromBackend);
      } catch (reloadError) {
        // Si le rechargement échoue, utiliser les données locales
        console.log('⚠️ Rechargement impossible, utilisation des données locales');
        onUpdate(localEffectifs);
      }
      
      setShowModal(false);
      toast.success('Effectifs enregistrés avec succès !');
    } catch (error: any) {
      console.error('❌ Erreur lors de l\'enregistrement:', error);
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error
        || error.message 
        || 'Erreur lors de l\'enregistrement des effectifs';
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setLocalEffectifs(effectifs);
    setShowModal(false);
  };

  return (
    <div className="mb-4">
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="px-6 py-2.5 bg-primary text-white rounded-md hover:bg-opacity-90 transition-colors flex items-center gap-2 text-sm"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Effectifs année précédente
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col relative z-[10000]">
            <div className="sticky top-0 bg-primary text-white px-6 py-4 z-[10001]">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">Effectifs de l'année précédente</h3>
                  <p className="text-sm text-bodydark1 mt-1">Saisir les effectifs de référence</p>
                </div>
                <button
                  onClick={handleCancel}
                  className="text-white hover:bg-opacity-80 hover:bg-black rounded-full p-2 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <svg className="animate-spin h-12 w-12 text-primary mb-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-gray-600 text-lg">Chargement des effectifs...</p>
                </div>
              ) : (
                <>
              {/* NIVEAU PRESCOLAIRE */}
              <div className="mb-8">
                <h4 className="text-lg font-bold text-primary mb-4 pb-2 border-b-2 border-stroke">📚 Niveau Préscolaire</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Espace Communautaire d'Éveil */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h5 className="font-semibold text-primary mb-3">Espace Communautaire d'Éveil</h5>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Effectif Garçons + Filles</label>
                        <input
                          type="number"
                          min="0"
                          disabled={isLoading}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
                          value={localEffectifs.niveauPrescolaire.espaceCommunautaireEveil.effectifGarconsFilles}
                          onChange={(e) => setLocalEffectifs(prev => ({
                            ...prev,
                            niveauPrescolaire: {
                              ...prev.niveauPrescolaire,
                              espaceCommunautaireEveil: {
                                ...prev.niveauPrescolaire.espaceCommunautaireEveil,
                                effectifGarconsFilles: Number(e.target.value) || 0
                              }
                            }
                          }))}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Effectif Filles</label>
                        <input
                          type="number"
                          min="0"
                          disabled={isLoading}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          value={localEffectifs.niveauPrescolaire.espaceCommunautaireEveil.effectifFilles}
                          onChange={(e) => setLocalEffectifs(prev => ({
                            ...prev,
                            niveauPrescolaire: {
                              ...prev.niveauPrescolaire,
                              espaceCommunautaireEveil: {
                                ...prev.niveauPrescolaire.espaceCommunautaireEveil,
                                effectifFilles: Number(e.target.value) || 0
                              }
                            }
                          }))}
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Maternel */}
                  <div className="p-4 bg-gray-2 rounded-lg">
                    <h5 className="font-semibold text-primary mb-3">Maternel</h5>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Effectif Garçons + Filles</label>
                        <input
                          type="number"
                          min="0"
                          disabled={isLoading}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
                          value={localEffectifs.niveauPrescolaire.maternel.effectifGarconsFilles}
                          onChange={(e) => setLocalEffectifs(prev => ({
                            ...prev,
                            niveauPrescolaire: {
                              ...prev.niveauPrescolaire,
                              maternel: {
                                ...prev.niveauPrescolaire.maternel,
                                effectifGarconsFilles: Number(e.target.value) || 0
                              }
                            }
                          }))}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Effectif Filles</label>
                        <input
                          type="number"
                          min="0"
                          disabled={isLoading}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          value={localEffectifs.niveauPrescolaire.maternel.effectifFilles}
                          onChange={(e) => setLocalEffectifs(prev => ({
                            ...prev,
                            niveauPrescolaire: {
                              ...prev.niveauPrescolaire,
                              maternel: {
                                ...prev.niveauPrescolaire.maternel,
                                effectifFilles: Number(e.target.value) || 0
                              }
                            }
                          }))}
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Pré-Primaire */}
                  <div className="p-4 bg-gray-2 rounded-lg">
                    <h5 className="font-semibold text-primary mb-3">Pré-Primaire</h5>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Effectif Garçons + Filles</label>
                        <input
                          type="number"
                          min="0"
                          disabled={isLoading}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
                          value={localEffectifs.niveauPrescolaire.prePrimaire.effectifGarconsFilles}
                          onChange={(e) => setLocalEffectifs(prev => ({
                            ...prev,
                            niveauPrescolaire: {
                              ...prev.niveauPrescolaire,
                              prePrimaire: {
                                ...prev.niveauPrescolaire.prePrimaire,
                                effectifGarconsFilles: Number(e.target.value) || 0
                              }
                            }
                          }))}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Effectif Filles</label>
                        <input
                          type="number"
                          min="0"
                          disabled={isLoading}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          value={localEffectifs.niveauPrescolaire.prePrimaire.effectifFilles}
                          onChange={(e) => setLocalEffectifs(prev => ({
                            ...prev,
                            niveauPrescolaire: {
                              ...prev.niveauPrescolaire,
                              prePrimaire: {
                                ...prev.niveauPrescolaire.prePrimaire,
                                effectifFilles: Number(e.target.value) || 0
                              }
                            }
                          }))}
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Spécial Préscolaire */}
                  <div className="p-4 bg-gray-2 rounded-lg">
                    <h5 className="font-semibold text-primary mb-3">Enseignement Spécial</h5>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Effectif Garçons + Filles</label>
                        <input
                          type="number"
                          min="0"
                          disabled={isLoading}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
                          value={localEffectifs.niveauPrescolaire.special.effectifGarconsFilles}
                          onChange={(e) => setLocalEffectifs(prev => ({
                            ...prev,
                            niveauPrescolaire: {
                              ...prev.niveauPrescolaire,
                              special: {
                                ...prev.niveauPrescolaire.special,
                                effectifGarconsFilles: Number(e.target.value) || 0
                              }
                            }
                          }))}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Effectif Filles</label>
                        <input
                          type="number"
                          min="0"
                          disabled={isLoading}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          value={localEffectifs.niveauPrescolaire.special.effectifFilles}
                          onChange={(e) => setLocalEffectifs(prev => ({
                            ...prev,
                            niveauPrescolaire: {
                              ...prev.niveauPrescolaire,
                              special: {
                                ...prev.niveauPrescolaire.special,
                                effectifFilles: Number(e.target.value) || 0
                              }
                            }
                          }))}
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* NIVEAU PRIMAIRE */}
              <div className="mb-8">
                <h4 className="text-lg font-bold text-primary mb-4 pb-2 border-b-2 border-stroke">📖 Niveau Primaire</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Enseignement Spécial Primaire */}
                  <div className="p-4 bg-gray-2 rounded-lg">
                    <h5 className="font-semibold text-primary mb-3">Enseignement Spécial</h5>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Effectif Garçons + Filles</label>
                        <input
                          type="number"
                          min="0"
                          disabled={isLoading}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
                          value={localEffectifs.niveauPrimaire.enseignementSpecial.effectifGarconsFilles}
                          onChange={(e) => setLocalEffectifs(prev => ({
                            ...prev,
                            niveauPrimaire: {
                              ...prev.niveauPrimaire,
                              enseignementSpecial: {
                                ...prev.niveauPrimaire.enseignementSpecial,
                                effectifGarconsFilles: Number(e.target.value) || 0
                              }
                            }
                          }))}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Effectif Filles</label>
                        <input
                          type="number"
                          min="0"
                          disabled={isLoading}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          value={localEffectifs.niveauPrimaire.enseignementSpecial.effectifFilles}
                          onChange={(e) => setLocalEffectifs(prev => ({
                            ...prev,
                            niveauPrimaire: {
                              ...prev.niveauPrimaire,
                              enseignementSpecial: {
                                ...prev.niveauPrimaire.enseignementSpecial,
                                effectifFilles: Number(e.target.value) || 0
                              }
                            }
                          }))}
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Enseignement Primaire */}
                  <div className="p-4 bg-gray-2 rounded-lg">
                    <h5 className="font-semibold text-primary mb-3">Enseignement Primaire</h5>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Effectif Garçons + Filles</label>
                        <input
                          type="number"
                          min="0"
                          disabled={isLoading}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
                          value={localEffectifs.niveauPrimaire.enseignementPrimaire.effectifGarconsFilles}
                          onChange={(e) => setLocalEffectifs(prev => ({
                            ...prev,
                            niveauPrimaire: {
                              ...prev.niveauPrimaire,
                              enseignementPrimaire: {
                                ...prev.niveauPrimaire.enseignementPrimaire,
                                effectifGarconsFilles: Number(e.target.value) || 0
                              }
                            }
                          }))}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Effectif Filles</label>
                        <input
                          type="number"
                          min="0"
                          disabled={isLoading}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          value={localEffectifs.niveauPrimaire.enseignementPrimaire.effectifFilles}
                          onChange={(e) => setLocalEffectifs(prev => ({
                            ...prev,
                            niveauPrimaire: {
                              ...prev.niveauPrimaire,
                              enseignementPrimaire: {
                                ...prev.niveauPrimaire.enseignementPrimaire,
                                effectifFilles: Number(e.target.value) || 0
                              }
                            }
                          }))}
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* NIVEAU SECONDAIRE */}
              <div className="mb-8">
                <h4 className="text-lg font-bold text-primary mb-4 pb-2 border-b-2 border-stroke">🎓 Niveau Secondaire</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Enseignement Spécial Secondaire */}
                  <div className="p-4 bg-gray-2 rounded-lg">
                    <h5 className="font-semibold text-primary mb-3">Enseignement Spécial</h5>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Effectif Garçons</label>
                        <input
                          type="number"
                          min="0"
                          disabled={isLoading}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
                          value={localEffectifs.niveauSecondaire.enseignementSpecial.effectifGarcons}
                          onChange={(e) => setLocalEffectifs(prev => ({
                            ...prev,
                            niveauSecondaire: {
                              ...prev.niveauSecondaire,
                              enseignementSpecial: {
                                ...prev.niveauSecondaire.enseignementSpecial,
                                effectifGarcons: Number(e.target.value) || 0
                              }
                            }
                          }))}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Effectif Filles</label>
                        <input
                          type="number"
                          min="0"
                          disabled={isLoading}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          value={localEffectifs.niveauSecondaire.enseignementSpecial.effectifFilles}
                          onChange={(e) => setLocalEffectifs(prev => ({
                            ...prev,
                            niveauSecondaire: {
                              ...prev.niveauSecondaire,
                              enseignementSpecial: {
                                ...prev.niveauSecondaire.enseignementSpecial,
                                effectifFilles: Number(e.target.value) || 0
                              }
                            }
                          }))}
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 7ème CTEB */}
                  <div className="p-4 bg-gray-2 rounded-lg">
                    <h5 className="font-semibold text-primary mb-3">7ème CTEB</h5>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Effectif Garçons</label>
                        <input
                          type="number"
                          min="0"
                          disabled={isLoading}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
                          value={localEffectifs.niveauSecondaire.enseignementSecondaire.septiemeCTEB.effectifGarcons}
                          onChange={(e) => setLocalEffectifs(prev => ({
                            ...prev,
                            niveauSecondaire: {
                              ...prev.niveauSecondaire,
                              enseignementSecondaire: {
                                ...prev.niveauSecondaire.enseignementSecondaire,
                                septiemeCTEB: {
                                  ...prev.niveauSecondaire.enseignementSecondaire.septiemeCTEB,
                                  effectifGarcons: Number(e.target.value) || 0
                                }
                              }
                            }
                          }))}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Effectif Filles</label>
                        <input
                          type="number"
                          min="0"
                          disabled={isLoading}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          value={localEffectifs.niveauSecondaire.enseignementSecondaire.septiemeCTEB.effectifFilles}
                          onChange={(e) => setLocalEffectifs(prev => ({
                            ...prev,
                            niveauSecondaire: {
                              ...prev.niveauSecondaire,
                              enseignementSecondaire: {
                                ...prev.niveauSecondaire.enseignementSecondaire,
                                septiemeCTEB: {
                                  ...prev.niveauSecondaire.enseignementSecondaire.septiemeCTEB,
                                  effectifFilles: Number(e.target.value) || 0
                                }
                              }
                            }
                          }))}
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 8ème CTEB */}
                  <div className="p-4 bg-gray-2 rounded-lg">
                    <h5 className="font-semibold text-primary mb-3">8ème CTEB</h5>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Effectif Garçons</label>
                        <input
                          type="number"
                          min="0"
                          disabled={isLoading}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
                          value={localEffectifs.niveauSecondaire.enseignementSecondaire.huitiemeCTEB.effectifGarcons}
                          onChange={(e) => setLocalEffectifs(prev => ({
                            ...prev,
                            niveauSecondaire: {
                              ...prev.niveauSecondaire,
                              enseignementSecondaire: {
                                ...prev.niveauSecondaire.enseignementSecondaire,
                                huitiemeCTEB: {
                                  ...prev.niveauSecondaire.enseignementSecondaire.huitiemeCTEB,
                                  effectifGarcons: Number(e.target.value) || 0
                                }
                              }
                            }
                          }))}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Effectif Filles</label>
                        <input
                          type="number"
                          min="0"
                          disabled={isLoading}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          value={localEffectifs.niveauSecondaire.enseignementSecondaire.huitiemeCTEB.effectifFilles}
                          onChange={(e) => setLocalEffectifs(prev => ({
                            ...prev,
                            niveauSecondaire: {
                              ...prev.niveauSecondaire,
                              enseignementSecondaire: {
                                ...prev.niveauSecondaire.enseignementSecondaire,
                                huitiemeCTEB: {
                                  ...prev.niveauSecondaire.enseignementSecondaire.huitiemeCTEB,
                                  effectifFilles: Number(e.target.value) || 0
                                }
                              }
                            }
                          }))}
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 1ère Humanité */}
                  <div className="p-4 bg-gray-2 rounded-lg">
                    <h5 className="font-semibold text-primary mb-3">1ère Humanité</h5>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Effectif Garçons</label>
                        <input
                          type="number"
                          min="0"
                          disabled={isLoading}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
                          value={localEffectifs.niveauSecondaire.enseignementSecondaire.premiereHumanite.effectifGarcons}
                          onChange={(e) => setLocalEffectifs(prev => ({
                            ...prev,
                            niveauSecondaire: {
                              ...prev.niveauSecondaire,
                              enseignementSecondaire: {
                                ...prev.niveauSecondaire.enseignementSecondaire,
                                premiereHumanite: {
                                  ...prev.niveauSecondaire.enseignementSecondaire.premiereHumanite,
                                  effectifGarcons: Number(e.target.value) || 0
                                }
                              }
                            }
                          }))}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Effectif Filles</label>
                        <input
                          type="number"
                          min="0"
                          disabled={isLoading}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          value={localEffectifs.niveauSecondaire.enseignementSecondaire.premiereHumanite.effectifFilles}
                          onChange={(e) => setLocalEffectifs(prev => ({
                            ...prev,
                            niveauSecondaire: {
                              ...prev.niveauSecondaire,
                              enseignementSecondaire: {
                                ...prev.niveauSecondaire.enseignementSecondaire,
                                premiereHumanite: {
                                  ...prev.niveauSecondaire.enseignementSecondaire.premiereHumanite,
                                  effectifFilles: Number(e.target.value) || 0
                                }
                              }
                            }
                          }))}
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4ème Humanité */}
                  <div className="p-4 bg-gray-2 rounded-lg">
                    <h5 className="font-semibold text-primary mb-3">4ème Humanité</h5>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Effectif Garçons</label>
                        <input
                          type="number"
                          min="0"
                          disabled={isLoading}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
                          value={localEffectifs.niveauSecondaire.enseignementSecondaire.quatriemeHumanite.effectifGarcons}
                          onChange={(e) => setLocalEffectifs(prev => ({
                            ...prev,
                            niveauSecondaire: {
                              ...prev.niveauSecondaire,
                              enseignementSecondaire: {
                                ...prev.niveauSecondaire.enseignementSecondaire,
                                quatriemeHumanite: {
                                  ...prev.niveauSecondaire.enseignementSecondaire.quatriemeHumanite,
                                  effectifGarcons: Number(e.target.value) || 0
                                }
                              }
                            }
                          }))}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Effectif Filles</label>
                        <input
                          type="number"
                          min="0"
                          disabled={isLoading}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
                          value={localEffectifs.niveauSecondaire.enseignementSecondaire.quatriemeHumanite.effectifFilles}
                          onChange={(e) => setLocalEffectifs(prev => ({
                            ...prev,
                            niveauSecondaire: {
                              ...prev.niveauSecondaire,
                              enseignementSecondaire: {
                                ...prev.niveauSecondaire.enseignementSecondaire,
                                quatriemeHumanite: {
                                  ...prev.niveauSecondaire.enseignementSecondaire.quatriemeHumanite,
                                  effectifFilles: Number(e.target.value) || 0
                                }
                              }
                            }
                          }))}
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              </>
              )}
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3 z-[10001]">
              <button
                onClick={handleCancel}
                disabled={isSaving || isLoading}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || isLoading}
                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Enregistrer
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EffectifsPrecedent;
