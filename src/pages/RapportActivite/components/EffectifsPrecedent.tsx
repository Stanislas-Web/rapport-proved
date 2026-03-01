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
  prefillData?: EffectifsAnneePrecedente | null;
}

const EffectifsPrecedent: React.FC<EffectifsPrecedentProps> = ({ effectifs, onUpdate, identificationProved, annee, prefillData }) => {
  const [showModal, setShowModal] = useState(false);
  const [localEffectifs, setLocalEffectifs] = useState<EffectifsAnneePrecedente>(effectifs);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // Garde la dernière version sauvegardée pour ne jamais la perdre
  const [savedEffectifs, setSavedEffectifs] = useState<EffectifsAnneePrecedente | null>(null);

  // Log pour debug
  console.log('🎯 EffectifsPrecedent render - localEffectifs.niveauPrescolaire.maternel:', localEffectifs.niveauPrescolaire?.maternel);

  // Charger les effectifs depuis l'API à chaque ouverture du modal
  useEffect(() => {
    if (!showModal) return;

    const loadEffectifs = async () => {
      if (identificationProved && annee) {
        setIsLoading(true);
        console.log('🔍 Chargement effectifs depuis API - ID:', identificationProved, 'Année:', annee);
        console.log('🔍 GET previous/' + identificationProved + '/' + annee + ' → retourne année précédente');
        
        try {
          const data = await EffectifAnnuelService.getByProvedAndAnnee(identificationProved, annee);
          console.log('📦 Données reçues de l\'API:', data);
          
          let effectifsCharges = null;
          
          // Format API documenté: { success, isDefaultData, data: { effectifs } }
          if (data && data.success && data.data?.effectifs && !data.isDefaultData) {
            effectifsCharges = data.data.effectifs;
            console.log('✅ Format API standard - effectifs extraits (données réelles)');
          }
          // Format API avec isDefaultData = true → valeurs par défaut, pas de vraies données
          else if (data && data.success && data.isDefaultData) {
            console.log('ℹ️ API retourne des valeurs par défaut (isDefaultData=true)');
            // On ne charge pas les valeurs par défaut de l'API, on utilise prefillData si dispo
            effectifsCharges = null;
          }
          // Fallback: format tableau
          else if (Array.isArray(data) && data.length > 0 && data[0]?.effectifs) {
            effectifsCharges = data[0].effectifs;
            console.log('✅ Format tableau - effectifs extraits');
          } 
          // Fallback: objet direct avec effectifs
          else if (data && data.effectifs) {
            effectifsCharges = data.effectifs;
            console.log('✅ Format objet direct - effectifs extraits');
          }
          // Fallback: structure effectifs directe
          else if (data && data.niveauPrescolaire && data.niveauPrimaire && data.niveauSecondaire) {
            effectifsCharges = data;
            console.log('✅ Format direct - structure effectifs');
          }
          
          if (effectifsCharges) {
            console.log('✅ Données API chargées:', effectifsCharges);
            setLocalEffectifs(effectifsCharges);
            setSavedEffectifs(effectifsCharges);
            toast.success('📊 Effectifs existants chargés !', { duration: 2000 });
          } else if (prefillData) {
            console.log('🔄 Pré-remplissage avec les effectifs du rapport précédent');
            setLocalEffectifs(prefillData);
            toast.success('📊 Effectifs pré-remplis à partir du rapport précédent', { duration: 3000 });
          } else {
            console.log('❌ Aucun effectif trouvé dans la réponse');
          }
          
        } catch (error: any) {
          if (error.response?.status !== 404) {
            console.error('❌ Erreur chargement effectifs:', error);
          } else {
            console.log('ℹ️ Aucun effectif existant (404)');
            if (prefillData) {
              console.log('🔄 Pré-remplissage (404) avec les effectifs du rapport précédent');
              setLocalEffectifs(prefillData);
              toast.success('📊 Effectifs pré-remplis à partir du rapport précédent', { duration: 3000 });
            }
          }
        } finally {
          setIsLoading(false);
        }
      } else if (prefillData) {
        console.log('🔄 Pré-remplissage direct (sans API) avec les effectifs du rapport précédent');
        setLocalEffectifs(prefillData);
      }
    };

    loadEffectifs();
  }, [showModal]); // Fetch API à chaque ouverture du modal

  // Calculer l'année précédente à partir de l'année courante (ex: "2025-2026" → "2024-2025")
  const getAnneePrecedente = (anneeCourante: string): string => {
    const parts = anneeCourante.split('-');
    if (parts.length === 2) {
      const startYear = parseInt(parts[0]) - 1;
      const endYear = parseInt(parts[1]) - 1;
      return `${startYear}-${endYear}`;
    }
    return anneeCourante;
  };

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
      // Le modal édite les effectifs de l'année PRÉCÉDENTE
      // annee = année courante (ex: "2025-2026"), on doit sauvegarder sous "2024-2025"
      const anneePrecedente = getAnneePrecedente(annee);
      console.log('💾 Sauvegarde effectifs - Année courante:', annee, '→ Année précédente (POST):', anneePrecedente);

      const payload: EffectifAnnuelPayload = {
        identificationProved,
        annee: anneePrecedente,
        effectifs: localEffectifs
      };
      
      const response = await EffectifAnnuelService.create(payload);
      console.log('✅ Réponse POST:', response);
      
      // Utiliser directement la réponse du POST (données confirmées par le backend)
      let effectifsConfirmes = localEffectifs;
      if (response && response.data && response.data.effectifs) {
        effectifsConfirmes = response.data.effectifs;
        console.log('✅ Données confirmées par le backend:', effectifsConfirmes);
      }
      
      setSavedEffectifs(effectifsConfirmes);
      setLocalEffectifs(effectifsConfirmes);
      onUpdate(effectifsConfirmes);
      
      setShowModal(false);
      toast.success('Effectifs enregistrés avec succès !');
    } catch (error: any) {
      console.error('Erreur lors de l\'enregistrement:', error);
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
    // Restaurer avec les dernières données sauvegardées, sinon prefillData, sinon effectifs prop
    setLocalEffectifs(savedEffectifs || prefillData || effectifs);
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
