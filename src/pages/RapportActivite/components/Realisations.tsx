import React, { useState, useEffect } from 'react';
import { RapportActivite } from '../../../models/RapportActivite';

interface RealisationsProps {
  formData: RapportActivite;
  setFormData: React.Dispatch<React.SetStateAction<RapportActivite>>;
  autoSaveForceSave?: () => void;
}

const Realisations: React.FC<RealisationsProps> = ({ formData, setFormData, autoSaveForceSave }) => {
  // État pour le modal de calcul des indicateurs d'accès
  const [showCalculModalAcces, setShowCalculModalAcces] = useState(false);

  // État pour les cantines scolaires (4 sources de financement)
  const [cantines, setCantines] = useState(() => ({
    prescolaire: { gvt: 0, projet: 0, ptfs: 0, ong: 0 },
    primaire: { gvt: 0, projet: 0, ptfs: 0, ong: 0 },
    secondaire: { gvt: 0, projet: 0, ptfs: 0, ong: 0 }
  }));

  // Flag pour éviter la boucle infinie
  const [cantinesLoaded, setCantinesLoaded] = useState(false);

  // Charger les données des cantines depuis le backend UNE SEULE FOIS
  useEffect(() => {
    if (!cantinesLoaded) {
      const cantinesDetail = formData?.realisations?.accesAccessibiliteEquite?.cantinesScolaires?.cantinesScolairesDetail;
      if (cantinesDetail) {
        setCantines({
          prescolaire: cantinesDetail.prescolaire || { gvt: 0, projet: 0, ptfs: 0, ong: 0 },
          primaire: cantinesDetail.primaire || { gvt: 0, projet: 0, ptfs: 0, ong: 0 },
          secondaire: cantinesDetail.secondaire || { gvt: 0, projet: 0, ptfs: 0, ong: 0 }
        });
        setCantinesLoaded(true);
      }
    }
  }, [formData?.realisations?.accesAccessibiliteEquite?.cantinesScolaires?.cantinesScolairesDetail, cantinesLoaded]);

  // Sync cantines to formData (total par niveau)
  useEffect(() => {
    if (cantinesLoaded) { // Seulement après le chargement initial
      const prescolaireTotal = cantines.prescolaire.gvt + cantines.prescolaire.projet + cantines.prescolaire.ptfs + cantines.prescolaire.ong;
      const primaireTotal = cantines.primaire.gvt + cantines.primaire.projet + cantines.primaire.ptfs + cantines.primaire.ong;
      const secondaireTotal = cantines.secondaire.gvt + cantines.secondaire.projet + cantines.secondaire.ptfs + cantines.secondaire.ong;

      setFormData(prev => ({
        ...prev,
        realisations: {
          ...prev.realisations,
          accesAccessibiliteEquite: {
            ...prev.realisations.accesAccessibiliteEquite,
            cantinesScolaires: {
              ...prev.realisations.accesAccessibiliteEquite.cantinesScolaires,
              prescolaire: prescolaireTotal,
              primaire: primaireTotal,
              secondaire: secondaireTotal,
              cantinesScolairesDetail: {
                prescolaire: cantines.prescolaire,
                primaire: cantines.primaire,
                secondaire: cantines.secondaire
              }
            }
          }
        }
      }));
    }
  }, [cantines, cantinesLoaded, setFormData]);

  // État pour les indicateurs d'accès
  const [indicateursAcces, setIndicateursAcces] = useState({
    nouveauxInscritsPrimaire: { tauxGF: 0, tauxFilles: 0 },
    transitionPrimaireCTEB: { tauxGF: 0, tauxFilles: 0 },
    transitionCTEBHumanites: { tauxGF: 0, tauxFilles: 0 }
  });

  // Flag pour charger les indicateurs d'accès
  const [indicateursAccesLoaded, setIndicateursAccesLoaded] = useState(false);

  // Charger les indicateurs d'accès depuis le backend
  useEffect(() => {
    const indicateurs = formData?.realisations?.accesAccessibiliteEquite?.indicateursAcces;
    
    if (indicateurs) {
      console.log('🔍 [IV.7] Chargement indicateursAcces depuis backend:', indicateurs);
      
      // Vérifier si au moins un champ GF existe dans le backend
      const hasData = indicateurs.proportionNouveauxInscrits !== undefined || 
                     indicateurs.tauxTransitionPrimaireCTEB !== undefined || 
                     indicateurs.tauxTransitionCTEBHumanites !== undefined;
      
      if (hasData && !indicateursAccesLoaded) {
        const newState = {
          nouveauxInscritsPrimaire: { 
            tauxGF: indicateurs.proportionNouveauxInscrits || 0, 
            tauxFilles: indicateurs.proportionNouveauxInscrits_Filles || 0 
          },
          transitionPrimaireCTEB: { 
            tauxGF: indicateurs.tauxTransitionPrimaireCTEB || 0, 
            tauxFilles: indicateurs.tauxTransitionPrimaireCTEB_Filles || 0 
          },
          transitionCTEBHumanites: { 
            tauxGF: indicateurs.tauxTransitionCTEBHumanites || 0, 
            tauxFilles: indicateurs.tauxTransitionCTEBHumanites_Filles || 0 
          }
        };
        
        console.log('✅ [IV.7] Mise à jour de l\'état local avec:', newState);
        setIndicateursAcces(newState);
        setIndicateursAccesLoaded(true);
      }
    }
  }, [formData?.realisations?.accesAccessibiliteEquite?.indicateursAcces, indicateursAccesLoaded]);

  // Sync indicateursAcces vers formData (les 6 champs du modèle: 3 GF + 3 Filles)
  useEffect(() => {
    if (indicateursAccesLoaded) {
      setFormData(prev => ({
        ...prev,
        realisations: {
          ...prev.realisations,
          accesAccessibiliteEquite: {
            ...prev.realisations.accesAccessibiliteEquite,
            indicateursAcces: {
              proportionNouveauxInscrits: indicateursAcces.nouveauxInscritsPrimaire.tauxGF,
              proportionNouveauxInscrits_Filles: indicateursAcces.nouveauxInscritsPrimaire.tauxFilles,
              tauxTransitionPrimaireCTEB: indicateursAcces.transitionPrimaireCTEB.tauxGF,
              tauxTransitionPrimaireCTEB_Filles: indicateursAcces.transitionPrimaireCTEB.tauxFilles,
              tauxTransitionCTEBHumanites: indicateursAcces.transitionCTEBHumanites.tauxGF,
              tauxTransitionCTEBHumanites_Filles: indicateursAcces.transitionCTEBHumanites.tauxFilles
            }
          }
        }
      }));
    }
  }, [indicateursAcces, indicateursAccesLoaded, setFormData]);

  // État pour les données brutes de calcul des indicateurs d'accès
  const [calculDataAcces, setCalculDataAcces] = useState({
    nouveauxInscritsPrimaire: { candidats: 0, admis: 0, garcons: 0, filles: 0 },
    transitionPrimaireCTEB: { finissantsPrimaire: 0, inscritsCTEB: 0, garcons: 0, filles: 0 },
    transitionCTEBHumanites: { finissantsCTEB: 0, inscritsHumanites: 0, garcons: 0, filles: 0 }
  });

  // Fonction pour ouvrir le modal de calcul d'accès
  const openCalculModalAcces = () => {
    setShowCalculModalAcces(true);
  };

  // Fonction pour mettre à jour les données de calcul d'accès
  const updateCalculDataAcces = (indicateur: string, field: string, value: number) => {
    // Empêcher les valeurs négatives
    const validatedValue = Math.max(0, value);
    setCalculDataAcces(prev => ({
      ...prev,
      [indicateur]: {
        ...prev[indicateur as keyof typeof prev],
        [field]: validatedValue
      }
    }));
  };

  // Fonction pour mettre à jour les indicateurs d'accès
  const updateIndicateursAcces = (indicateur: string, field: 'tauxGF' | 'tauxFilles', value: number) => {
    setIndicateursAcces(prev => {
      const updated = { ...prev };
      const currentIndicateur = updated[indicateur as keyof typeof updated];
      currentIndicateur[field] = Math.max(0, Math.min(100, value)); // Limiter entre 0 et 100
      return updated;
    });
  };

  // Fonction pour calculer les taux d'accès à partir des nombres
  const calculerTauxAcces = () => {
    const nouveauxTaux: any = {};
    
    // Nouveaux inscrits au primaire
    const dataNouveauxInscrits = calculDataAcces.nouveauxInscritsPrimaire;
    const candidats = dataNouveauxInscrits.candidats || 0;
    if (candidats > 0) {
      const tauxGF = Math.round((dataNouveauxInscrits.admis / candidats) * 100 * 100) / 100;
      const tauxFilles = Math.round((dataNouveauxInscrits.filles / candidats) * 100 * 100) / 100;
      nouveauxTaux.nouveauxInscritsPrimaire = {
        tauxGF: tauxGF,
        tauxFilles: tauxFilles
      };
    } else {
      nouveauxTaux.nouveauxInscritsPrimaire = { tauxGF: 0, tauxFilles: 0 };
    }

    // Transition Primaire vers CTEB
    const dataTransitionPrimaire = calculDataAcces.transitionPrimaireCTEB;
    const finissantsPrimaire = dataTransitionPrimaire.finissantsPrimaire || 0;
    if (finissantsPrimaire > 0) {
      const tauxGF = Math.round((dataTransitionPrimaire.inscritsCTEB / finissantsPrimaire) * 100 * 100) / 100;
      const tauxFilles = Math.round((dataTransitionPrimaire.filles / finissantsPrimaire) * 100 * 100) / 100;
      nouveauxTaux.transitionPrimaireCTEB = {
        tauxGF: tauxGF,
        tauxFilles: tauxFilles
      };
    } else {
      nouveauxTaux.transitionPrimaireCTEB = { tauxGF: 0, tauxFilles: 0 };
    }

    // Transition CTEB vers Humanités
    const dataTransitionCTEB = calculDataAcces.transitionCTEBHumanites;
    const finissantsCTEB = dataTransitionCTEB.finissantsCTEB || 0;
    if (finissantsCTEB > 0) {
      const tauxGF = Math.round((dataTransitionCTEB.inscritsHumanites / finissantsCTEB) * 100 * 100) / 100;
      const tauxFilles = Math.round((dataTransitionCTEB.filles / finissantsCTEB) * 100 * 100) / 100;
      nouveauxTaux.transitionCTEBHumanites = {
        tauxGF: tauxGF,
        tauxFilles: tauxFilles
      };
    } else {
      nouveauxTaux.transitionCTEBHumanites = { tauxGF: 0, tauxFilles: 0 };
    }
    
    setIndicateursAcces(nouveauxTaux);
    setIndicateursAccesLoaded(true); // Marquer comme chargé après calcul
    setShowCalculModalAcces(false);
    
    // Sauvegarder immédiatement dans le brouillon
    setTimeout(() => {
      if (autoSaveForceSave) {
        autoSaveForceSave();
      }
    }, 500);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h3 className="text-lg font-medium mb-4 text-primary">IV. REALISATIONS DE LA PROVINCE EDUCATIONELLE PAR AXE STRATEGIQUE DE LA STRATEGIE SECTORIELLE DE L'EDUCATION ET DE LA FORMATION (SSEF) AINSI QUE DE L'EDUCATION EN SITUATION D'URGENCE (ESU)</h3>
      
      {/* IV.1. ACCES, ACCESSIBILITE & EQUITE */}
      <div className="mb-6">
        <h4 className="font-medium mb-3 text-blue-600">IV.1. ACCES, ACCESSIBILITE & EQUITE</h4>
        
        {/* IV.1.1. Nouvelles Salles de Classes */}
        <div className="mb-4">
          <h5 className="font-medium mb-2">IV.1.1. Nombre de Nouvelles Salles de Classes construites par niveau d'Enseignement:</h5>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left">Niveau d'Enseignement</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">Nombre</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">Source de Financement</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-3 py-2 font-medium">A. NIVEAU PRESCOLAIRE</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input
                      type="number"
                      value={formData.realisations?.accesAccessibiliteEquite?.nouvellesSallesClasses?.prescolaire || 0}
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value) || 0;
                        setFormData(prev => ({
                          ...prev,
                          realisations: {
                            ...prev.realisations,
                            accesAccessibiliteEquite: {
                              ...prev.realisations.accesAccessibiliteEquite,
                              nouvellesSallesClasses: {
                                ...prev.realisations.accesAccessibiliteEquite.nouvellesSallesClasses,
                                prescolaire: newValue
                              }
                            }
                          }
                        }));
                      }}
                      className="w-full text-center border-none focus:outline-none focus:ring-0"
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input
                      type="text"
                      value={formData.realisations?.accesAccessibiliteEquite?.nouvellesSallesClasses?.sourceFinancementPrescolaire || ''}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          realisations: {
                            ...prev.realisations,
                            accesAccessibiliteEquite: {
                              ...prev.realisations.accesAccessibiliteEquite,
                              nouvellesSallesClasses: {
                                ...prev.realisations.accesAccessibiliteEquite.nouvellesSallesClasses,
                                sourceFinancementPrescolaire: e.target.value
                              }
                            }
                          }
                        }));
                      }}
                      className="w-full text-center border-none focus:outline-none focus:ring-0"
                      placeholder="GVT, Projet, PTFS, ONG..."
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2 font-medium">B. NIVEAU PRIMAIRE</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input
                      type="number"
                      value={formData.realisations?.accesAccessibiliteEquite?.nouvellesSallesClasses?.primaire || 0}
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value) || 0;
                        setFormData(prev => ({
                          ...prev,
                          realisations: {
                            ...prev.realisations,
                            accesAccessibiliteEquite: {
                              ...prev.realisations.accesAccessibiliteEquite,
                              nouvellesSallesClasses: {
                                ...prev.realisations.accesAccessibiliteEquite.nouvellesSallesClasses,
                                primaire: newValue
                              }
                            }
                          }
                        }));
                      }}
                      className="w-full text-center border-none focus:outline-none focus:ring-0"
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input
                      type="text"
                      value={formData.realisations?.accesAccessibiliteEquite?.nouvellesSallesClasses?.sourceFinancementPrimaire || ''}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          realisations: {
                            ...prev.realisations,
                            accesAccessibiliteEquite: {
                              ...prev.realisations.accesAccessibiliteEquite,
                              nouvellesSallesClasses: {
                                ...prev.realisations.accesAccessibiliteEquite.nouvellesSallesClasses,
                                sourceFinancementPrimaire: e.target.value
                              }
                            }
                          }
                        }));
                      }}
                      className="w-full text-center border-none focus:outline-none focus:ring-0"
                      placeholder="GVT, Projet, PTFS, ONG..."
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2 font-medium">C. NIVEAU SECONDAIRE</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input
                      type="number"
                      value={formData.realisations?.accesAccessibiliteEquite?.nouvellesSallesClasses?.secondaire || 0}
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value) || 0;
                        setFormData(prev => ({
                          ...prev,
                          realisations: {
                            ...prev.realisations,
                            accesAccessibiliteEquite: {
                              ...prev.realisations.accesAccessibiliteEquite,
                              nouvellesSallesClasses: {
                                ...prev.realisations.accesAccessibiliteEquite.nouvellesSallesClasses,
                                secondaire: newValue
                              }
                            }
                          }
                        }));
                      }}
                      className="w-full text-center border-none focus:outline-none focus:ring-0"
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input
                      type="text"
                      value={formData.realisations?.accesAccessibiliteEquite?.nouvellesSallesClasses?.sourceFinancementSecondaire || ''}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          realisations: {
                            ...prev.realisations,
                            accesAccessibiliteEquite: {
                              ...prev.realisations.accesAccessibiliteEquite,
                              nouvellesSallesClasses: {
                                ...prev.realisations.accesAccessibiliteEquite.nouvellesSallesClasses,
                                sourceFinancementSecondaire: e.target.value
                              }
                            }
                          }
                        }));
                      }}
                      className="w-full text-center border-none focus:outline-none focus:ring-0"
                      placeholder="GVT, Projet, PTFS, ONG..."
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* IV.1.2. Nouveaux Bancs Tables */}
        <div className="mb-4">
          <h5 className="font-medium mb-2">IV.1.2. Nombre de Nouveaux Bancs Tables par niveau d'enseignement:</h5>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left">Niveau d'Enseignement</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">Nombre</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">Source de Financement</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-3 py-2 font-medium">A. NIVEAU PRESCOLAIRE</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      value={formData.realisations?.accesAccessibiliteEquite?.nouveauxBancsTables?.prescolaire || 0}
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value) || 0;
                        setFormData(prev => ({
                          ...prev,
                          realisations: {
                            ...prev.realisations,
                            accesAccessibiliteEquite: {
                              ...prev.realisations.accesAccessibiliteEquite,
                              nouveauxBancsTables: {
                                ...prev.realisations.accesAccessibiliteEquite.nouveauxBancsTables,
                                prescolaire: newValue
                              }
                            }
                          }
                        }));
                      }}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="text" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="GVT, Projet, PTFS, ONG..." 
                      value={formData.realisations?.accesAccessibiliteEquite?.nouveauxBancsTables?.sourceFinancementPrescolaire || ''}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          realisations: {
                            ...prev.realisations,
                            accesAccessibiliteEquite: {
                              ...prev.realisations.accesAccessibiliteEquite,
                              nouveauxBancsTables: {
                                ...prev.realisations.accesAccessibiliteEquite.nouveauxBancsTables,
                                sourceFinancementPrescolaire: e.target.value
                              }
                            }
                          }
                        }));
                      }}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2 font-medium">B. NIVEAU PRIMAIRE</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      value={formData.realisations?.accesAccessibiliteEquite?.nouveauxBancsTables?.primaire || 0}
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value) || 0;
                        setFormData(prev => ({
                          ...prev,
                          realisations: {
                            ...prev.realisations,
                            accesAccessibiliteEquite: {
                              ...prev.realisations.accesAccessibiliteEquite,
                              nouveauxBancsTables: {
                                ...prev.realisations.accesAccessibiliteEquite.nouveauxBancsTables,
                                primaire: newValue
                              }
                            }
                          }
                        }));
                      }}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="text" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="GVT, Projet, PTFS, ONG..." 
                      value={formData.realisations?.accesAccessibiliteEquite?.nouveauxBancsTables?.sourceFinancementPrimaire || ''}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          realisations: {
                            ...prev.realisations,
                            accesAccessibiliteEquite: {
                              ...prev.realisations.accesAccessibiliteEquite,
                              nouveauxBancsTables: {
                                ...prev.realisations.accesAccessibiliteEquite.nouveauxBancsTables,
                                sourceFinancementPrimaire: e.target.value
                              }
                            }
                          }
                        }));
                      }}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2 font-medium">C. NIVEAU SECONDAIRE</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      value={formData.realisations?.accesAccessibiliteEquite?.nouveauxBancsTables?.secondaire || 0}
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value) || 0;
                        setFormData(prev => ({
                          ...prev,
                          realisations: {
                            ...prev.realisations,
                            accesAccessibiliteEquite: {
                              ...prev.realisations.accesAccessibiliteEquite,
                              nouveauxBancsTables: {
                                ...prev.realisations.accesAccessibiliteEquite.nouveauxBancsTables,
                                secondaire: newValue
                              }
                            }
                          }
                        }));
                      }}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="text" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="GVT, Projet, PTFS, ONG..." 
                      value={formData.realisations?.accesAccessibiliteEquite?.nouveauxBancsTables?.sourceFinancementSecondaire || ''}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          realisations: {
                            ...prev.realisations,
                            accesAccessibiliteEquite: {
                              ...prev.realisations.accesAccessibiliteEquite,
                              nouveauxBancsTables: {
                                ...prev.realisations.accesAccessibiliteEquite.nouveauxBancsTables,
                                sourceFinancementSecondaire: e.target.value
                              }
                            }
                          }
                        }));
                      }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* IV.1.3. Nouvelles Latrines */}
        <div className="mb-4">
          <h5 className="font-medium mb-2">IV.1.3. Nombre de Blocs de Nouvelles Latrines:</h5>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left">Niveau d'Enseignement</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">Nombre</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">Source de Financement</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-3 py-2 font-medium">A. NIVEAU PRESCOLAIRE</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      value={formData.realisations?.accesAccessibiliteEquite?.nouvellesLatrines?.prescolaire || 0}
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value) || 0;
                        setFormData(prev => ({
                          ...prev,
                          realisations: {
                            ...prev.realisations,
                            accesAccessibiliteEquite: {
                              ...prev.realisations.accesAccessibiliteEquite,
                              nouvellesLatrines: {
                                ...prev.realisations.accesAccessibiliteEquite.nouvellesLatrines,
                                prescolaire: newValue
                              }
                            }
                          }
                        }));
                      }}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="text" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="GVT, Projet, PTFS, ONG..." 
                      value={formData.realisations?.accesAccessibiliteEquite?.nouvellesLatrines?.sourceFinancementPrescolaire || ''}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          realisations: {
                            ...prev.realisations,
                            accesAccessibiliteEquite: {
                              ...prev.realisations.accesAccessibiliteEquite,
                              nouvellesLatrines: {
                                ...prev.realisations.accesAccessibiliteEquite.nouvellesLatrines,
                                sourceFinancementPrescolaire: e.target.value
                              }
                            }
                          }
                        }));
                      }}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2 font-medium">B. NIVEAU PRIMAIRE</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      value={formData.realisations?.accesAccessibiliteEquite?.nouvellesLatrines?.primaire || 0}
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value) || 0;
                        setFormData(prev => ({
                          ...prev,
                          realisations: {
                            ...prev.realisations,
                            accesAccessibiliteEquite: {
                              ...prev.realisations.accesAccessibiliteEquite,
                              nouvellesLatrines: {
                                ...prev.realisations.accesAccessibiliteEquite.nouvellesLatrines,
                                primaire: newValue
                              }
                            }
                          }
                        }));
                      }}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="text" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="GVT, Projet, PTFS, ONG..." 
                      value={formData.realisations?.accesAccessibiliteEquite?.nouvellesLatrines?.sourceFinancementPrimaire || ''}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          realisations: {
                            ...prev.realisations,
                            accesAccessibiliteEquite: {
                              ...prev.realisations.accesAccessibiliteEquite,
                              nouvellesLatrines: {
                                ...prev.realisations.accesAccessibiliteEquite.nouvellesLatrines,
                                sourceFinancementPrimaire: e.target.value
                              }
                            }
                          }
                        }));
                      }}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2 font-medium">C. NIVEAU SECONDAIRE</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      value={formData.realisations?.accesAccessibiliteEquite?.nouvellesLatrines?.secondaire || 0}
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value) || 0;
                        setFormData(prev => ({
                          ...prev,
                          realisations: {
                            ...prev.realisations,
                            accesAccessibiliteEquite: {
                              ...prev.realisations.accesAccessibiliteEquite,
                              nouvellesLatrines: {
                                ...prev.realisations.accesAccessibiliteEquite.nouvellesLatrines,
                                secondaire: newValue
                              }
                            }
                          }
                        }));
                      }}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="text" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="GVT, Projet, PTFS, ONG..." 
                      value={formData.realisations?.accesAccessibiliteEquite?.nouvellesLatrines?.sourceFinancementSecondaire || ''}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          realisations: {
                            ...prev.realisations,
                            accesAccessibiliteEquite: {
                              ...prev.realisations.accesAccessibiliteEquite,
                              nouvellesLatrines: {
                                ...prev.realisations.accesAccessibiliteEquite.nouvellesLatrines,
                                sourceFinancementSecondaire: e.target.value
                              }
                            }
                          }
                        }));
                      }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* IV.4. Gratuité Enseignement Primaire */}
        <div className="mb-4">
          <h5 className="font-medium mb-2">IV.4. Gratuité Enseignement Primaire Public</h5>
          <textarea
            className="w-full h-20 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Décrivez l'état de la gratuité de l'enseignement primaire public..."
            value={formData.realisations?.accesAccessibiliteEquite?.gratuitéEnseignementPrimaire || ''}
            onChange={(e) => {
              setFormData(prev => ({
                ...prev,
                realisations: {
                  ...prev.realisations,
                  accesAccessibiliteEquite: {
                    ...prev.realisations.accesAccessibiliteEquite,
                    gratuitéEnseignementPrimaire: e.target.value
                  }
                }
              }));
            }}
          />
        </div>

        {/* IV.5. Sensibilisation */}
        <div className="mb-4">
          <h5 className="font-medium mb-2">IV.5. Sensibilisation pour la scolarisation des:</h5>
          <div className="space-y-3">
            <div className="flex items-center">
              <input 
                type="checkbox" 
                className="mr-2" 
                checked={formData.realisations?.accesAccessibiliteEquite?.sensibilisation?.filles || false}
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    realisations: {
                      ...prev.realisations,
                      accesAccessibiliteEquite: {
                        ...prev.realisations.accesAccessibiliteEquite,
                        sensibilisation: {
                          ...prev.realisations.accesAccessibiliteEquite.sensibilisation,
                          filles: e.target.checked
                        }
                      }
                    }
                  }));
                }}
              />
              <label>Filles</label>
            </div>
            <div className="flex items-center">
              <input 
                type="checkbox" 
                className="mr-2" 
                checked={formData.realisations?.accesAccessibiliteEquite?.sensibilisation?.enfantsHorsEcole || false}
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    realisations: {
                      ...prev.realisations,
                      accesAccessibiliteEquite: {
                        ...prev.realisations.accesAccessibiliteEquite,
                        sensibilisation: {
                          ...prev.realisations.accesAccessibiliteEquite.sensibilisation,
                          enfantsHorsEcole: e.target.checked
                        }
                      }
                    }
                  }));
                }}
              />
              <label>Enfants et Adolescents en dehors de l'Ecole (EADE):</label>
            </div>
            <div className="flex items-center">
              <input 
                type="checkbox" 
                className="mr-2" 
                checked={formData.realisations?.accesAccessibiliteEquite?.sensibilisation?.peuplesAutochtones || false}
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    realisations: {
                      ...prev.realisations,
                      accesAccessibiliteEquite: {
                        ...prev.realisations.accesAccessibiliteEquite,
                        sensibilisation: {
                          ...prev.realisations.accesAccessibiliteEquite.sensibilisation,
                          peuplesAutochtones: e.target.checked
                        }
                      }
                    }
                  }));
                }}
              />
              <label>Enfants des Peuples Autochtones</label>
            </div>
          </div>
        </div>

        {/* IV.6. Cantines Scolaires */}
        <div className="mb-4">
          <h5 className="font-medium mb-2">IV.6. Etat de Lieux organisation des Cantines Scolaires:</h5>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left">Niveau</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">GVT:</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">Projet:</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">PTFS:</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">ONG</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-3 py-2 font-medium">A. NIVEAU PRESCOLAIRE</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      value={cantines.prescolaire.gvt}
                      onChange={(e) => setCantines(prev => ({
                        ...prev,
                        prescolaire: { ...prev.prescolaire, gvt: parseInt(e.target.value) || 0 }
                      }))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      value={cantines.prescolaire.projet}
                      onChange={(e) => setCantines(prev => ({
                        ...prev,
                        prescolaire: { ...prev.prescolaire, projet: parseInt(e.target.value) || 0 }
                      }))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      value={cantines.prescolaire.ptfs}
                      onChange={(e) => setCantines(prev => ({
                        ...prev,
                        prescolaire: { ...prev.prescolaire, ptfs: parseInt(e.target.value) || 0 }
                      }))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      value={cantines.prescolaire.ong}
                      onChange={(e) => setCantines(prev => ({
                        ...prev,
                        prescolaire: { ...prev.prescolaire, ong: parseInt(e.target.value) || 0 }
                      }))}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2 font-medium">B. NIVEAU PRIMAIRE</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      value={cantines.primaire.gvt}
                      onChange={(e) => setCantines(prev => ({
                        ...prev,
                        primaire: { ...prev.primaire, gvt: parseInt(e.target.value) || 0 }
                      }))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      value={cantines.primaire.projet}
                      onChange={(e) => setCantines(prev => ({
                        ...prev,
                        primaire: { ...prev.primaire, projet: parseInt(e.target.value) || 0 }
                      }))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      value={cantines.primaire.ptfs}
                      onChange={(e) => setCantines(prev => ({
                        ...prev,
                        primaire: { ...prev.primaire, ptfs: parseInt(e.target.value) || 0 }
                      }))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      value={cantines.primaire.ong}
                      onChange={(e) => setCantines(prev => ({
                        ...prev,
                        primaire: { ...prev.primaire, ong: parseInt(e.target.value) || 0 }
                      }))}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2 font-medium">C. NIVEAU SECONDAIRE</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      value={cantines.secondaire.gvt}
                      onChange={(e) => setCantines(prev => ({
                        ...prev,
                        secondaire: { ...prev.secondaire, gvt: parseInt(e.target.value) || 0 }
                      }))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      value={cantines.secondaire.projet}
                      onChange={(e) => setCantines(prev => ({
                        ...prev,
                        secondaire: { ...prev.secondaire, projet: parseInt(e.target.value) || 0 }
                      }))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      value={cantines.secondaire.ptfs}
                      onChange={(e) => setCantines(prev => ({
                        ...prev,
                        secondaire: { ...prev.secondaire, ptfs: parseInt(e.target.value) || 0 }
                      }))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      value={cantines.secondaire.ong}
                      onChange={(e) => setCantines(prev => ({
                        ...prev,
                        secondaire: { ...prev.secondaire, ong: parseInt(e.target.value) || 0 }
                      }))}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Bref Commentaire (5 lignes maximum)</label>
            <textarea
              className="w-full h-20 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Commentaire sur les cantines scolaires..."
              value={formData.realisations?.accesAccessibiliteEquite?.cantinesScolaires?.commentaire || ''}
              onChange={(e) => {
                setFormData(prev => ({
                  ...prev,
                  realisations: {
                    ...prev.realisations,
                    accesAccessibiliteEquite: {
                      ...prev.realisations.accesAccessibiliteEquite,
                      cantinesScolaires: {
                        ...prev.realisations.accesAccessibiliteEquite.cantinesScolaires,
                        commentaire: e.target.value
                      }
                    }
                  }
                }));
              }}
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Total General Ecoles ayant des cantines Scolaires</label>
            <input 
              type="number" 
              className="w-48 p-2 border border-gray-300 rounded-md" 
              value={
                cantines.prescolaire.gvt + cantines.prescolaire.projet + cantines.prescolaire.ptfs + cantines.prescolaire.ong +
                cantines.primaire.gvt + cantines.primaire.projet + cantines.primaire.ptfs + cantines.primaire.ong +
                cantines.secondaire.gvt + cantines.secondaire.projet + cantines.secondaire.ptfs + cantines.secondaire.ong
              }
              readOnly
            />
          </div>
        </div>

        {/* IV.7. Indicateurs d'accès */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h5 className="font-medium">IV.7. Indicateurs d'accès: Proportion & Transition</h5>
            <button
              type="button"
              onClick={openCalculModalAcces}
              className="px-4 py-2 text-sm bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Calculer les taux
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left">Indicateur</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">% GF</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">F</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">a) % d'Elèves admis au primaire (Nouveaux Inscrits)</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      max="100"
                      step="0.1"
                      value={indicateursAcces.nouveauxInscritsPrimaire.tauxGF || ''}
                      onChange={(e) => updateIndicateursAcces('nouveauxInscritsPrimaire', 'tauxGF', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      max="100"
                      step="0.1"
                      value={indicateursAcces.nouveauxInscritsPrimaire.tauxFilles || ''}
                      onChange={(e) => updateIndicateursAcces('nouveauxInscritsPrimaire', 'tauxFilles', Number(e.target.value))}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">b) Taux de Transition du Primaire au CTEB</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      max="100"
                      step="0.1"
                      value={indicateursAcces.transitionPrimaireCTEB.tauxGF || ''}
                      onChange={(e) => updateIndicateursAcces('transitionPrimaireCTEB', 'tauxGF', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      max="100"
                      step="0.1"
                      value={indicateursAcces.transitionPrimaireCTEB.tauxFilles || ''}
                      onChange={(e) => updateIndicateursAcces('transitionPrimaireCTEB', 'tauxFilles', Number(e.target.value))}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">c) Taux de Transition du CTEB aux Humanités (8eme en 1ere Hum)</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      max="100"
                      step="0.1"
                      value={indicateursAcces.transitionCTEBHumanites.tauxGF || ''}
                      onChange={(e) => updateIndicateursAcces('transitionCTEBHumanites', 'tauxGF', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      max="100"
                      step="0.1"
                      value={indicateursAcces.transitionCTEBHumanites.tauxFilles || ''}
                      onChange={(e) => updateIndicateursAcces('transitionCTEBHumanites', 'tauxFilles', Number(e.target.value))}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Note */}
        <p className="text-sm text-gray-600 mt-4">
          <strong>NB:</strong> Spécifier la dénomination du Projet, du PTF ou de l'ONG ayant appuyé le financement des réalisations.
        </p>
      </div>

      {/* Modal de calcul des indicateurs d'accès */}
      {showCalculModalAcces && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Calculer les indicateurs d'accès et de transition</h3>
              <button
                onClick={() => setShowCalculModalAcces(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-4">
              <p className="text-sm text-gray-600 mb-6">
                Saisissez les nombres d'élèves pour chaque indicateur. Les pourcentages seront calculés automatiquement.
              </p>

              {/* a) % d'Elèves admis au primaire (Nouveaux Inscrits) */}
              <div className="mb-6 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-lg mb-4 text-teal-700">a) % d'Elèves admis au primaire (Nouveaux Inscrits)</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Candidats</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={calculDataAcces.nouveauxInscritsPrimaire.candidats || ''}
                      onChange={(e) => updateCalculDataAcces('nouveauxInscritsPrimaire', 'candidats', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Admis</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={calculDataAcces.nouveauxInscritsPrimaire.admis || ''}
                      onChange={(e) => updateCalculDataAcces('nouveauxInscritsPrimaire', 'admis', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Garçons</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={calculDataAcces.nouveauxInscritsPrimaire.garcons || ''}
                      onChange={(e) => updateCalculDataAcces('nouveauxInscritsPrimaire', 'garcons', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Filles</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      value={calculDataAcces.nouveauxInscritsPrimaire.filles || ''}
                      onChange={(e) => updateCalculDataAcces('nouveauxInscritsPrimaire', 'filles', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* b) Taux de Transition du Primaire au CTEB */}
              <div className="mb-6 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-lg mb-4 text-teal-700">b) Taux de Transition du Primaire au CTEB</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Finissants Primaire</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={calculDataAcces.transitionPrimaireCTEB.finissantsPrimaire || ''}
                      onChange={(e) => updateCalculDataAcces('transitionPrimaireCTEB', 'finissantsPrimaire', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Inscrits CTEB</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={calculDataAcces.transitionPrimaireCTEB.inscritsCTEB || ''}
                      onChange={(e) => updateCalculDataAcces('transitionPrimaireCTEB', 'inscritsCTEB', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Garçons</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={calculDataAcces.transitionPrimaireCTEB.garcons || ''}
                      onChange={(e) => updateCalculDataAcces('transitionPrimaireCTEB', 'garcons', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Filles</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      value={calculDataAcces.transitionPrimaireCTEB.filles || ''}
                      onChange={(e) => updateCalculDataAcces('transitionPrimaireCTEB', 'filles', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* c) Taux de Transition du CTEB aux Humanités */}
              <div className="mb-6 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-lg mb-4 text-teal-700">c) Taux de Transition du CTEB aux Humanités (8ème en 1ère Hum)</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Finissants CTEB</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={calculDataAcces.transitionCTEBHumanites.finissantsCTEB || ''}
                      onChange={(e) => updateCalculDataAcces('transitionCTEBHumanites', 'finissantsCTEB', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Inscrits Humanités</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={calculDataAcces.transitionCTEBHumanites.inscritsHumanites || ''}
                      onChange={(e) => updateCalculDataAcces('transitionCTEBHumanites', 'inscritsHumanites', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Garçons</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={calculDataAcces.transitionCTEBHumanites.garcons || ''}
                      onChange={(e) => updateCalculDataAcces('transitionCTEBHumanites', 'garcons', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Filles</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      value={calculDataAcces.transitionCTEBHumanites.filles || ''}
                      onChange={(e) => updateCalculDataAcces('transitionCTEBHumanites', 'filles', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setShowCalculModalAcces(false)}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={calculerTauxAcces}
                className="px-6 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Calculer les pourcentages
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Realisations; 