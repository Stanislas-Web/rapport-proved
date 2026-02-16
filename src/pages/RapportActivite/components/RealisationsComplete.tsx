import React, { useState, useEffect } from 'react';
import { RapportActivite } from '../../../models/RapportActivite';

interface RealisationsCompleteProps {
  formData: RapportActivite;
  setFormData: React.Dispatch<React.SetStateAction<RapportActivite>>;
}

const RealisationsComplete: React.FC<RealisationsCompleteProps> = ({ formData, setFormData }) => {
  const mapInspectionsToLocal = (data?: RapportActivite['gouvernance']['inspectionsAdministrativesC2B']) => {
    if (!data) {
      return {
        maternel: { prevu: 0, realise: 0, pourcentage: 0 },
        primaire: { prevu: 0, realise: 0, pourcentage: 0 },
        secondaire: { prevu: 0, realise: 0, pourcentage: 0 },
        special: { prevu: 0, realise: 0, pourcentage: 0 }
      };
    }

    return {
      maternel: {
        prevu: data.prescolaire.nombrePrevu,
        realise: data.prescolaire.nombreRealise,
        pourcentage: data.prescolaire.pourcentageRealisation
      },
      primaire: {
        prevu: data.primaire.nombrePrevu,
        realise: data.primaire.nombreRealise,
        pourcentage: data.primaire.pourcentageRealisation
      },
      secondaire: {
        prevu: data.secondaire.nombrePrevu,
        realise: data.secondaire.nombreRealise,
        pourcentage: data.secondaire.pourcentageRealisation
      },
      special: {
        prevu: data.special.nombrePrevu,
        realise: data.special.nombreRealise,
        pourcentage: data.special.pourcentageRealisation
      }
    };
  };

  const initialBureauValues = formData.gouvernance?.infrastructureBureaux || {
    directionProvinciale: { proprietaire: 0, locataire: 0 },
    inspectionPrincipale: { proprietaire: 0, locataire: 0 },
    dinacope: { proprietaire: 0, locataire: 0 },
    sernie: { proprietaire: 0, locataire: 0 },
    coordinationProvinciale: { proprietaire: 0, locataire: 0 },
    sousDivision: { proprietaire: 0, locataire: 0 },
    poolsInspectionPrimaire: { proprietaire: 0, locataire: 0 },
    poolsInspectionSecondaire: { proprietaire: 0, locataire: 0 },
    antenneDinacope: { proprietaire: 0, locataire: 0 },
    antenneSernie: { proprietaire: 0, locataire: 0 },
    coordinationDiocesaine: { proprietaire: 0, locataire: 0 },
    sousCoordinationConventionnees: { proprietaire: 0, locataire: 0 },
    conseillerieResidente: { proprietaire: 0, locataire: 0 }
  };

  const initialTotals = formData.gouvernance?.totalInfrastructureBureaux || {
    totalProprietaire: 0,
    totalLocataire: 0
  };

  const initialInspectionsC2B = mapInspectionsToLocal(formData.gouvernance?.inspectionsAdministrativesC2B);
  // États pour les valeurs des bureaux
  const [bureauValues, setBureauValues] = useState(initialBureauValues);

  // États pour les totaux
  const [totals, setTotals] = useState(initialTotals);

  // État pour les inspections administratives C2B
  const [inspectionsC2B, setInspectionsC2B] = useState(initialInspectionsC2B);

  // États pour les comités provinciaux
  const [comitesProvinciaux, setComitesProvinciaux] = useState({
    comiteEDUNC: {
      frequenceReunions: '',
      pointsTraites: ''
    },
    comiteENAFP: {
      frequenceReunions: '',
      pointsTraites: ''
    },
    comiteTENASOSP: {
      frequenceReunions: '',
      pointsTraites: ''
    },
    comiteExamenEtat: {
      frequenceReunions: '',
      pointsTraites: ''
    }
  });

  // États pour la vulgarisation des instructions
  const [vulgarisationInstructions, setVulgarisationInstructions] = useState({
    instructionsOfficielles: '',
    nouvelleCitoyennete: ''
  });

  // Flag pour éviter la boucle infinie
  const [comitesLoaded, setComitesLoaded] = useState(false);
  const [lastLoadedRapportId, setLastLoadedRapportId] = useState<string | null>(null);

  // Réinitialiser le flag quand on charge un nouveau rapport
  useEffect(() => {
    const currentRapportId = formData?.identificationProved?._id || formData?._id;
    if (currentRapportId && currentRapportId !== lastLoadedRapportId) {
      console.log('🔄 [RealisationsComplete] Nouveau rapport détecté, réinitialisation du flag');
      setComitesLoaded(false);
      setLastLoadedRapportId(currentRapportId);
    }
  }, [formData?.identificationProved?._id, formData?._id, lastLoadedRapportId]);

  // États pour les acquisitions de matériels
  const [acquisitionsMateriels, setAcquisitionsMateriels] = useState({
    ecoles: {
      nature: formData.gouvernance?.acquisitionsMateriels?.ecoles?.nature || '',
      gvt: formData.gouvernance?.acquisitionsMateriels?.ecoles?.sourceFinancement?.gvt || 0,
      projet: formData.gouvernance?.acquisitionsMateriels?.ecoles?.sourceFinancement?.projet || 0,
      ptfs: formData.gouvernance?.acquisitionsMateriels?.ecoles?.sourceFinancement?.ptfs || 0,
      ong: formData.gouvernance?.acquisitionsMateriels?.ecoles?.sourceFinancement?.ong || 0
    },
    bureauxGestionnaires: {
      nature: formData.gouvernance?.acquisitionsMateriels?.bureauxGestionnaires?.nature || '',
      gvt: formData.gouvernance?.acquisitionsMateriels?.bureauxGestionnaires?.sourceFinancement?.gvt || 0,
      projet: formData.gouvernance?.acquisitionsMateriels?.bureauxGestionnaires?.sourceFinancement?.projet || 0,
      ptfs: formData.gouvernance?.acquisitionsMateriels?.bureauxGestionnaires?.sourceFinancement?.ptfs || 0,
      ong: formData.gouvernance?.acquisitionsMateriels?.bureauxGestionnaires?.sourceFinancement?.ong || 0
    }
  });

  // Fonction pour calculer le pourcentage
  const calculatePercentage = (realise: number, prevu: number): number => {
    if (prevu === 0) return 0;
    return Math.round((realise / prevu) * 100 * 100) / 100;
  };

  // Fonction pour mettre à jour les valeurs d'un bureau
  const updateBureauValue = (bureau: string, type: 'proprietaire' | 'locataire', value: number) => {
    setBureauValues(prev => ({
      ...prev,
      [bureau]: {
        ...prev[bureau as keyof typeof prev],
        [type]: value
      }
    }));
  };

  // Fonction pour mettre à jour les valeurs des inspections C2B
  const updateInspectionC2B = (niveau: string, field: 'prevu' | 'realise', value: number) => {
    setInspectionsC2B(prev => {
      const updated = { ...prev };
      const currentNiveau = updated[niveau as keyof typeof updated];
      
      if (field === 'prevu') {
        // Si on met à jour le nombre prévu
        currentNiveau.prevu = value;
        // Vérifier que le réalisé ne dépasse pas le prévu
        if (currentNiveau.realise > value) {
          currentNiveau.realise = value;
        }
      } else if (field === 'realise') {
        // Si on met à jour le nombre réalisé
        const prevuValue = currentNiveau.prevu;
        // Limiter le réalisé au maximum du prévu
        currentNiveau.realise = Math.min(value, prevuValue);
      }
      
      // Recalculer le pourcentage
      currentNiveau.pourcentage = 
        calculatePercentage(currentNiveau.realise, currentNiveau.prevu);
      
      return updated;
    });
  };

  // Charger les données des comités provinciaux depuis le backend UNE SEULE FOIS
  useEffect(() => {
    const comites = formData?.gouvernance?.comitesProvinciaux;
    const vulgarisation = formData?.gouvernance?.vulgarisationInstructions;

    console.log('🔍 [RealisationsComplete] useEffect déclenché');
    console.log('🔍 [RealisationsComplete] comites:', comites);
    console.log('🔍 [RealisationsComplete] comitesLoaded:', comitesLoaded);

    if (!comitesLoaded && (comites || vulgarisation)) {
      console.log('✅ [RealisationsComplete] Chargement des comités');
      if (comites) {
        setComitesProvinciaux({
          comiteEDUNC: {
            frequenceReunions: comites.comiteEDUNC?.frequenceReunions || '',
            pointsTraites: comites.comiteEDUNC?.pointsTraites || ''
          },
          comiteENAFP: {
            frequenceReunions: comites.comiteENAFP?.frequenceReunions || '',
            pointsTraites: comites.comiteENAFP?.pointsTraites || ''
          },
          comiteTENASOSP: {
            frequenceReunions: comites.comiteTENASOSP?.frequenceReunions || '',
            pointsTraites: comites.comiteTENASOSP?.pointsTraites || ''
          },
          comiteExamenEtat: {
            frequenceReunions: comites.comiteExamenEtat?.frequenceReunions || '',
            pointsTraites: comites.comiteExamenEtat?.pointsTraites || ''
          }
        });
      }

      if (vulgarisation) {
        setVulgarisationInstructions({
          instructionsOfficielles: vulgarisation.instructionsOfficielles || '',
          nouvelleCitoyennete: vulgarisation.nouvelleCitoyennete || ''
        });
      }

      setComitesLoaded(true);
    }
  }, [formData?.gouvernance?.comitesProvinciaux, formData?.gouvernance?.vulgarisationInstructions, comitesLoaded]);

  // Calcul automatique des totaux
  useEffect(() => {
    const totalProprietaire = Object.values(bureauValues).reduce((sum, bureau) => sum + bureau.proprietaire, 0);
    const totalLocataire = Object.values(bureauValues).reduce((sum, bureau) => sum + bureau.locataire, 0);
    
    setTotals({
      totalProprietaire,
      totalLocataire,
    });
  }, [bureauValues]);

  useEffect(() => {
    if (comitesLoaded) { // Seulement après le chargement initial
      setFormData(prev => ({
        ...prev,
        gouvernance: {
          ...prev.gouvernance,
          infrastructureBureaux: bureauValues,
          totalInfrastructureBureaux: totals,
          comitesProvinciaux: comitesProvinciaux,
          vulgarisationInstructions: vulgarisationInstructions
        }
      }));
    }
  }, [bureauValues, totals, comitesProvinciaux, vulgarisationInstructions, comitesLoaded, setFormData]);

  useEffect(() => {
    if (comitesLoaded) { // Seulement après le chargement initial
      setFormData(prev => ({
        ...prev,
        gouvernance: {
          ...prev.gouvernance,
          inspectionsAdministrativesC2B: {
            prescolaire: {
              nombrePrevu: inspectionsC2B.maternel.prevu,
              nombreRealise: inspectionsC2B.maternel.realise,
              pourcentageRealisation: inspectionsC2B.maternel.pourcentage
            },
            primaire: {
              nombrePrevu: inspectionsC2B.primaire.prevu,
              nombreRealise: inspectionsC2B.primaire.realise,
              pourcentageRealisation: inspectionsC2B.primaire.pourcentage
            },
            secondaire: {
              nombrePrevu: inspectionsC2B.secondaire.prevu,
              nombreRealise: inspectionsC2B.secondaire.realise,
              pourcentageRealisation: inspectionsC2B.secondaire.pourcentage
            },
            special: {
              nombrePrevu: inspectionsC2B.special.prevu,
              nombreRealise: inspectionsC2B.special.realise,
              pourcentageRealisation: inspectionsC2B.special.pourcentage
            }
          },
          acquisitionsMateriels: {
            ecoles: {
              nature: acquisitionsMateriels.ecoles.nature,
              sourceFinancement: {
                gvt: acquisitionsMateriels.ecoles.gvt,
                projet: acquisitionsMateriels.ecoles.projet,
                ptfs: acquisitionsMateriels.ecoles.ptfs,
                ong: acquisitionsMateriels.ecoles.ong
              }
            },
            bureauxGestionnaires: {
              nature: acquisitionsMateriels.bureauxGestionnaires.nature,
              sourceFinancement: {
                gvt: acquisitionsMateriels.bureauxGestionnaires.gvt,
                projet: acquisitionsMateriels.bureauxGestionnaires.projet,
                ptfs: acquisitionsMateriels.bureauxGestionnaires.ptfs,
                ong: acquisitionsMateriels.bureauxGestionnaires.ong
              }
            }
          }
        }
      }));
    }
  }, [inspectionsC2B, acquisitionsMateriels, comitesLoaded, setFormData]);

  // Synchronisation depuis formData quand le rapport change
  useEffect(() => {
    console.log('🔍 [RealisationsComplete] Chargement/rechargement des données - rapport ID:', formData?._id);
    
    // Ne synchroniser que si les données viennent de formData et non de nos changements locaux
    const infra = formData.gouvernance?.infrastructureBureaux;
    if (infra && Object.keys(infra).length > 0) {
      console.log('🔄 [RealisationsComplete] Chargement bureauValues depuis formData');
      setBureauValues(prev => {
        // Comparer les valeurs réelles, pas les objets eux-mêmes
        const isEqual = Object.keys(infra).every(
          key => JSON.stringify(prev[key as keyof typeof prev]) === JSON.stringify(infra[key as keyof typeof infra])
        );
        return isEqual ? prev : infra;
      });
    }

    const totalsData = formData.gouvernance?.totalInfrastructureBureaux;
    if (totalsData) {
      console.log('🔄 [RealisationsComplete] Chargement totals depuis formData');
      setTotals(prev => JSON.stringify(prev) === JSON.stringify(totalsData) ? prev : totalsData);
    }

    const inspectionsData = formData.gouvernance?.inspectionsAdministrativesC2B;
    if (inspectionsData) {
      console.log('🔄 [RealisationsComplete] Chargement inspectionsC2B depuis formData:', inspectionsData);
      const mapped = mapInspectionsToLocal(inspectionsData);
      setInspectionsC2B(prev => JSON.stringify(prev) === JSON.stringify(mapped) ? prev : mapped);
    }

    const acquisitionsData = formData.gouvernance?.acquisitionsMateriels;
    if (acquisitionsData) {
      console.log('🔄 [RealisationsComplete] Chargement acquisitionsMateriels depuis formData:', acquisitionsData);
      setAcquisitionsMateriels(prev => {
        const newData = {
          ecoles: {
            nature: acquisitionsData.ecoles?.nature || '',
            gvt: acquisitionsData.ecoles?.sourceFinancement?.gvt || 0,
            projet: acquisitionsData.ecoles?.sourceFinancement?.projet || 0,
            ptfs: acquisitionsData.ecoles?.sourceFinancement?.ptfs || 0,
            ong: acquisitionsData.ecoles?.sourceFinancement?.ong || 0
          },
          bureauxGestionnaires: {
            nature: acquisitionsData.bureauxGestionnaires?.nature || '',
            gvt: acquisitionsData.bureauxGestionnaires?.sourceFinancement?.gvt || 0,
            projet: acquisitionsData.bureauxGestionnaires?.sourceFinancement?.projet || 0,
            ptfs: acquisitionsData.bureauxGestionnaires?.sourceFinancement?.ptfs || 0,
            ong: acquisitionsData.bureauxGestionnaires?.sourceFinancement?.ong || 0
          }
        };
        return JSON.stringify(prev) === JSON.stringify(newData) ? prev : newData;
      });
    }
  }, [formData?._id]);
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h3 className="text-lg font-medium mb-4 text-primary">IV. REALISATIONS (SUITE)</h3>
      {/* IV.2. Inspections Administratives C2B */}
      <div className="mb-6">
        <h4 className="font-bold mb-3">IV.2.4. Inspections Administratives C2B</h4>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-3 py-2 text-left">Niveau d'Enseignement</th>
                <th className="border border-gray-300 px-3 py-2 text-center">NBRE PREVU</th>
                <th className="border border-gray-300 px-3 py-2 text-center">NBRE REALISE</th>
                <th className="border border-gray-300 px-3 py-2 text-center">% REALISATIONS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-3 py-2">Maternel</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    placeholder="0"
                    value={inspectionsC2B.maternel.prevu || ''}
                    onChange={(e) => updateInspectionC2B('maternel', 'prevu', Number(e.target.value))}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    placeholder="0"
                    max={inspectionsC2B.maternel.prevu || undefined}
                    value={inspectionsC2B.maternel.realise || ''}
                    onChange={(e) => updateInspectionC2B('maternel', 'realise', Number(e.target.value))}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2 bg-gray-50">
                  <span className="w-full text-center font-medium text-blue-600">
                    {inspectionsC2B.maternel.pourcentage}%
                  </span>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">Primaire</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    placeholder="0"
                    value={inspectionsC2B.primaire.prevu || ''}
                    onChange={(e) => updateInspectionC2B('primaire', 'prevu', Number(e.target.value))}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    placeholder="0"
                    max={inspectionsC2B.primaire.prevu || undefined}
                    value={inspectionsC2B.primaire.realise || ''}
                    onChange={(e) => updateInspectionC2B('primaire', 'realise', Number(e.target.value))}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2 bg-gray-50">
                  <span className="w-full text-center font-medium text-blue-600">
                    {inspectionsC2B.primaire.pourcentage}%
                  </span>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">Secondaire</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    placeholder="0"
                    value={inspectionsC2B.secondaire.prevu || ''}
                    onChange={(e) => updateInspectionC2B('secondaire', 'prevu', Number(e.target.value))}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    placeholder="0"
                    max={inspectionsC2B.secondaire.prevu || undefined}
                    value={inspectionsC2B.secondaire.realise || ''}
                    onChange={(e) => updateInspectionC2B('secondaire', 'realise', Number(e.target.value))}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2 bg-gray-50">
                  <span className="w-full text-center font-medium text-blue-600">
                    {inspectionsC2B.secondaire.pourcentage}%
                  </span>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">Spécial (handicap: Tout niveau confondu)</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    placeholder="0"
                    value={inspectionsC2B.special.prevu || ''}
                    onChange={(e) => updateInspectionC2B('special', 'prevu', Number(e.target.value))}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    placeholder="0"
                    max={inspectionsC2B.special.prevu || undefined}
                    value={inspectionsC2B.special.realise || ''}
                    onChange={(e) => updateInspectionC2B('special', 'realise', Number(e.target.value))}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2 bg-gray-50">
                  <span className="w-full text-center font-medium text-blue-600">
                    {inspectionsC2B.special.pourcentage}%
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* IV.3. Fonctionnement des Comités Provinciaux */}
      <div className="mb-6">
        <h4 className="font-bold mb-3">IV.3. Fonctionnement des Comités Provinciaux</h4>
        
        {/* IV.3.1. Comité Provincial de l'EDU-NC */}
        <div className="mb-4">
          <h5 className="font-bold mb-2">IV.3.1. Comité Provincial de l'EDU-NC: Fréquence des Réunions</h5>
          <textarea
            className="w-full h-20 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            placeholder="Fréquence des réunions..."
            value={comitesProvinciaux.comiteEDUNC.frequenceReunions}
            onChange={(e) => setComitesProvinciaux(prev => ({
              ...prev,
              comiteEDUNC: { ...prev.comiteEDUNC, frequenceReunions: e.target.value }
            }))}
          />
          <p className="text-sm text-gray-600 mb-2">Quelques Principaux points traités (10 lignes au maximum)</p>
          <textarea
            className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Décrivez les points traités..."
            value={comitesProvinciaux.comiteEDUNC.pointsTraites}
            onChange={(e) => setComitesProvinciaux(prev => ({
              ...prev,
              comiteEDUNC: { ...prev.comiteEDUNC, pointsTraites: e.target.value }
            }))}
          />
        </div>

        {/* IV.3.2. Comité Provincial de l'ENAFP */}
        <div className="mb-4">
          <h5 className="font-bold mb-2">IV.3.2. Comité Provincial de l'ENAFP</h5>
          <textarea
            className="w-full h-20 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            placeholder="Fréquence des réunions..."
            value={comitesProvinciaux.comiteENAFP.frequenceReunions}
            onChange={(e) => setComitesProvinciaux(prev => ({
              ...prev,
              comiteENAFP: { ...prev.comiteENAFP, frequenceReunions: e.target.value }
            }))}
          />
          <textarea
            className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Décrivez les activités du comité..."
            value={comitesProvinciaux.comiteENAFP.pointsTraites}
            onChange={(e) => setComitesProvinciaux(prev => ({
              ...prev,
              comiteENAFP: { ...prev.comiteENAFP, pointsTraites: e.target.value }
            }))}
          />
        </div>

        {/* IV.3.3. Comité Provincial de TENASOSP */}
        <div className="mb-4">
          <h5 className="font-bold mb-2">IV.3.3. Comité Provincial de TENASOSP</h5>
          <textarea
            className="w-full h-20 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            placeholder="Fréquence des réunions..."
            value={comitesProvinciaux.comiteTENASOSP.frequenceReunions}
            onChange={(e) => setComitesProvinciaux(prev => ({
              ...prev,
              comiteTENASOSP: { ...prev.comiteTENASOSP, frequenceReunions: e.target.value }
            }))}
          />
          <p className="text-sm text-gray-600 mb-2">Quelques Principaux points traités (10 lignes au maximum)</p>
          <textarea
            className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Décrivez les points traités..."
            value={comitesProvinciaux.comiteTENASOSP.pointsTraites}
            onChange={(e) => setComitesProvinciaux(prev => ({
              ...prev,
              comiteTENASOSP: { ...prev.comiteTENASOSP, pointsTraites: e.target.value }
            }))}
          />
        </div>

        {/* IV.3.4. Comité Provincial d'EXAMEN D'ETAT */}
        <div className="mb-4">
          <h5 className="font-bold mb-2">IV.3.4. Comité Provincial d'EXAMEN D'ETAT</h5>
          <textarea
            className="w-full h-20 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            placeholder="Fréquence des réunions..."
            value={comitesProvinciaux.comiteExamenEtat.frequenceReunions}
            onChange={(e) => setComitesProvinciaux(prev => ({
              ...prev,
              comiteExamenEtat: { ...prev.comiteExamenEtat, frequenceReunions: e.target.value }
            }))}
          />
          <p className="text-sm text-gray-600 mb-2">Quelques Principaux points traités (10 lignes au maximum)</p>
          <textarea
            className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Décrivez les points traités..."
            value={comitesProvinciaux.comiteExamenEtat.pointsTraites}
            onChange={(e) => setComitesProvinciaux(prev => ({
              ...prev,
              comiteExamenEtat: { ...prev.comiteExamenEtat, pointsTraites: e.target.value }
            }))}
          />
        </div>
      </div>

      {/* IV.5. Vulgarisation des Instructions Officielles */}
      <div className="mb-6">
        <h4 className="font-bold mb-3">IV.5. Vulgarisation des Instructions Officielles</h4>
        <p className="text-sm text-gray-600 mb-2">Instructions officielles</p>
        <textarea
          className="w-full h-24 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          placeholder="Entrez les instructions officielles vulgarisées..."
          value={vulgarisationInstructions.instructionsOfficielles}
          onChange={(e) => setVulgarisationInstructions(prev => ({
            ...prev,
            instructionsOfficielles: e.target.value
          }))}
        />
        <p className="text-sm text-gray-600 mb-2">Mise en pratique de celles relatives à la Nouvelle Citoyenneté (10 lignes au maximum)</p>
        <textarea
          className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Décrivez la mise en pratique de la nouvelle citoyenneté..."
          value={vulgarisationInstructions.nouvelleCitoyennete}
          onChange={(e) => setVulgarisationInstructions(prev => ({
            ...prev,
            nouvelleCitoyennete: e.target.value
          }))}
        />
      </div>

      {/* IV.6. Acquisitions des Matériels Informatique et Roulant */}
      <div className="mb-6">
        <h4 className="font-bold mb-3">IV.7. Acquisitions des Matériels Informatique et Roulant</h4>
        
        {/* A. ECOLES */}
        <div className="mb-4">
          <h5 className="font-medium mb-2">A. ECOLES: Nature</h5>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Nature des matériels</label>
            <input 
              type="text" 
              className="w-full p-2 border border-gray-300 rounded-md" 
              placeholder="Décrivez les matériels acquis..."
              value={acquisitionsMateriels.ecoles.nature}
              onChange={(e) => setAcquisitionsMateriels(prev => ({
                ...prev,
                ecoles: { ...prev.ecoles, nature: e.target.value }
              }))}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">GVT:</label>
              <input 
                type="number" 
                className="w-full p-2 border border-gray-300 rounded-md" 
                value={acquisitionsMateriels.ecoles.gvt}
                onChange={(e) => setAcquisitionsMateriels(prev => ({
                  ...prev,
                  ecoles: { ...prev.ecoles, gvt: parseInt(e.target.value) || 0 }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Projet:</label>
              <input 
                type="number" 
                className="w-full p-2 border border-gray-300 rounded-md" 
                value={acquisitionsMateriels.ecoles.projet}
                onChange={(e) => setAcquisitionsMateriels(prev => ({
                  ...prev,
                  ecoles: { ...prev.ecoles, projet: parseInt(e.target.value) || 0 }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">PTFS:</label>
              <input 
                type="number" 
                className="w-full p-2 border border-gray-300 rounded-md" 
                value={acquisitionsMateriels.ecoles.ptfs}
                onChange={(e) => setAcquisitionsMateriels(prev => ({
                  ...prev,
                  ecoles: { ...prev.ecoles, ptfs: parseInt(e.target.value) || 0 }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">ONG:</label>
              <input 
                type="number" 
                className="w-full p-2 border border-gray-300 rounded-md" 
                value={acquisitionsMateriels.ecoles.ong}
                onChange={(e) => setAcquisitionsMateriels(prev => ({
                  ...prev,
                  ecoles: { ...prev.ecoles, ong: parseInt(e.target.value) || 0 }
                }))}
              />
            </div>
          </div>
        </div>

        {/* B. BUREAUX GESTIONNAIRE */}
        <div className="mb-4">
          <h5 className="font-medium mb-2">B. BUREAUX GESTIONNAIRE: Nature</h5>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Nature des matériels</label>
            <input 
              type="text" 
              className="w-full p-2 border border-gray-300 rounded-md" 
              placeholder="Décrivez les matériels acquis..."
              value={acquisitionsMateriels.bureauxGestionnaires.nature}
              onChange={(e) => setAcquisitionsMateriels(prev => ({
                ...prev,
                bureauxGestionnaires: { ...prev.bureauxGestionnaires, nature: e.target.value }
              }))}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">GVT:</label>
              <input 
                type="number" 
                className="w-full p-2 border border-gray-300 rounded-md" 
                value={acquisitionsMateriels.bureauxGestionnaires.gvt}
                onChange={(e) => setAcquisitionsMateriels(prev => ({
                  ...prev,
                  bureauxGestionnaires: { ...prev.bureauxGestionnaires, gvt: parseInt(e.target.value) || 0 }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Projet:</label>
              <input 
                type="number" 
                className="w-full p-2 border border-gray-300 rounded-md" 
                value={acquisitionsMateriels.bureauxGestionnaires.projet}
                onChange={(e) => setAcquisitionsMateriels(prev => ({
                  ...prev,
                  bureauxGestionnaires: { ...prev.bureauxGestionnaires, projet: parseInt(e.target.value) || 0 }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">PTFS:</label>
              <input 
                type="number" 
                className="w-full p-2 border border-gray-300 rounded-md" 
                value={acquisitionsMateriels.bureauxGestionnaires.ptfs}
                onChange={(e) => setAcquisitionsMateriels(prev => ({
                  ...prev,
                  bureauxGestionnaires: { ...prev.bureauxGestionnaires, ptfs: parseInt(e.target.value) || 0 }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">ONG:</label>
              <input 
                type="number" 
                className="w-full p-2 border border-gray-300 rounded-md" 
                value={acquisitionsMateriels.bureauxGestionnaires.ong}
                onChange={(e) => setAcquisitionsMateriels(prev => ({
                  ...prev,
                  bureauxGestionnaires: { ...prev.bureauxGestionnaires, ong: parseInt(e.target.value) || 0 }
                }))}
              />
            </div>
          </div>
        </div>
      </div>

      {/* IV.8. Infrastructure Bureaux Gestionnaires */}
      <div className="mb-6">
        <h4 className="font-bold mb-3">IV.8. Infrastructure Bureaux Gestionnaires</h4>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-3 py-2 text-left">Code</th>
                <th className="border border-gray-300 px-3 py-2 text-left">BUREAU GESTIONNAIRE (BG)</th>
                <th className="border border-gray-300 px-3 py-2 text-center">Nombre Propriétaire</th>
                <th className="border border-gray-300 px-3 py-2 text-center">Nombre Locataire</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-3 py-2">01</td>
                <td className="border border-gray-300 px-3 py-2">Direction Provinciale EDU-NC</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    placeholder="0"
                    value={bureauValues.directionProvinciale.proprietaire}
                    onChange={(e) => updateBureauValue('directionProvinciale', 'proprietaire', parseInt(e.target.value) || 0)}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    placeholder="0"
                    value={bureauValues.directionProvinciale.locataire}
                    onChange={(e) => updateBureauValue('directionProvinciale', 'locataire', parseInt(e.target.value) || 0)}
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">02</td>
                <td className="border border-gray-300 px-3 py-2">Inspection Principale Provinciale</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    placeholder="0"
                    value={bureauValues.inspectionPrincipale.proprietaire}
                    onChange={(e) => updateBureauValue('inspectionPrincipale', 'proprietaire', parseInt(e.target.value) || 0)}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    placeholder="0"
                    value={bureauValues.inspectionPrincipale.locataire}
                    onChange={(e) => updateBureauValue('inspectionPrincipale', 'locataire', parseInt(e.target.value) || 0)}
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">03</td>
                <td className="border border-gray-300 px-3 py-2">Direction Provinciale DINACOPE</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    placeholder="0"
                    value={bureauValues.dinacope.proprietaire}
                    onChange={(e) => updateBureauValue('dinacope', 'proprietaire', parseInt(e.target.value) || 0)}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    placeholder="0"
                    value={bureauValues.dinacope.locataire}
                    onChange={(e) => updateBureauValue('dinacope', 'locataire', parseInt(e.target.value) || 0)}
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">04</td>
                <td className="border border-gray-300 px-3 py-2">Division SERNIE</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    placeholder="0"
                    value={bureauValues.sernie.proprietaire}
                    onChange={(e) => updateBureauValue('sernie', 'proprietaire', parseInt(e.target.value) || 0)}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    placeholder="0"
                    value={bureauValues.sernie.locataire}
                    onChange={(e) => updateBureauValue('sernie', 'locataire', parseInt(e.target.value) || 0)}
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">05</td>
                <td className="border border-gray-300 px-3 py-2">Coordination Provinciale</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    placeholder="0"
                    value={bureauValues.coordinationProvinciale.proprietaire}
                    onChange={(e) => updateBureauValue('coordinationProvinciale', 'proprietaire', parseInt(e.target.value) || 0)}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    placeholder="0"
                    value={bureauValues.coordinationProvinciale.locataire}
                    onChange={(e) => updateBureauValue('coordinationProvinciale', 'locataire', parseInt(e.target.value) || 0)}
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">06</td>
                <td className="border border-gray-300 px-3 py-2">Sous-Division</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    placeholder="0"
                    value={bureauValues.sousDivision.proprietaire}
                    onChange={(e) => updateBureauValue('sousDivision', 'proprietaire', parseInt(e.target.value) || 0)}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    placeholder="0"
                    value={bureauValues.sousDivision.locataire}
                    onChange={(e) => updateBureauValue('sousDivision', 'locataire', parseInt(e.target.value) || 0)}
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">07</td>
                <td className="border border-gray-300 px-3 py-2">Pools D'inspection Primaire</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    placeholder="0"
                    value={bureauValues.poolsInspectionPrimaire.proprietaire}
                    onChange={(e) => updateBureauValue('poolsInspectionPrimaire', 'proprietaire', parseInt(e.target.value) || 0)}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    placeholder="0"
                    value={bureauValues.poolsInspectionPrimaire.locataire}
                    onChange={(e) => updateBureauValue('poolsInspectionPrimaire', 'locataire', parseInt(e.target.value) || 0)}
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">08</td>
                <td className="border border-gray-300 px-3 py-2">Pools D'inspection Secondaire</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    placeholder="0"
                    value={bureauValues.poolsInspectionSecondaire.proprietaire}
                    onChange={(e) => updateBureauValue('poolsInspectionSecondaire', 'proprietaire', parseInt(e.target.value) || 0)}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    placeholder="0"
                    value={bureauValues.poolsInspectionSecondaire.locataire}
                    onChange={(e) => updateBureauValue('poolsInspectionSecondaire', 'locataire', parseInt(e.target.value) || 0)}
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">09</td>
                <td className="border border-gray-300 px-3 py-2">Antenne DINACOPE</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    placeholder="0"
                    value={bureauValues.antenneDinacope.proprietaire}
                    onChange={(e) => updateBureauValue('antenneDinacope', 'proprietaire', parseInt(e.target.value) || 0)}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    placeholder="0"
                    value={bureauValues.antenneDinacope.locataire}
                    onChange={(e) => updateBureauValue('antenneDinacope', 'locataire', parseInt(e.target.value) || 0)}
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">10</td>
                <td className="border border-gray-300 px-3 py-2">Antenne SERNIE</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    placeholder="0"
                    value={bureauValues.antenneSernie.proprietaire}
                    onChange={(e) => updateBureauValue('antenneSernie', 'proprietaire', parseInt(e.target.value) || 0)}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    placeholder="0"
                    value={bureauValues.antenneSernie.locataire}
                    onChange={(e) => updateBureauValue('antenneSernie', 'locataire', parseInt(e.target.value) || 0)}
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">11</td>
                <td className="border border-gray-300 px-3 py-2">Coordination Diocésaine</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    placeholder="0"
                    value={bureauValues.coordinationDiocesaine.proprietaire}
                    onChange={(e) => updateBureauValue('coordinationDiocesaine', 'proprietaire', parseInt(e.target.value) || 0)}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    placeholder="0"
                    value={bureauValues.coordinationDiocesaine.locataire}
                    onChange={(e) => updateBureauValue('coordinationDiocesaine', 'locataire', parseInt(e.target.value) || 0)}
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">12</td>
                <td className="border border-gray-300 px-3 py-2">Sous-Coordination Conventionnées</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    placeholder="0"
                    value={bureauValues.sousCoordinationConventionnees.proprietaire}
                    onChange={(e) => updateBureauValue('sousCoordinationConventionnees', 'proprietaire', parseInt(e.target.value) || 0)}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    placeholder="0"
                    value={bureauValues.sousCoordinationConventionnees.locataire}
                    onChange={(e) => updateBureauValue('sousCoordinationConventionnees', 'locataire', parseInt(e.target.value) || 0)}
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">13</td>
                <td className="border border-gray-300 px-3 py-2">Conseillerie Résidente</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    placeholder="0"
                    value={bureauValues.conseillerieResidente.proprietaire}
                    onChange={(e) => updateBureauValue('conseillerieResidente', 'proprietaire', parseInt(e.target.value) || 0)}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    placeholder="0"
                    value={bureauValues.conseillerieResidente.locataire}
                    onChange={(e) => updateBureauValue('conseillerieResidente', 'locataire', parseInt(e.target.value) || 0)}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Totaux */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Total Propriétaire</label>
            <input 
              type="number" 
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-50" 
              value={totals.totalProprietaire}
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Total Locataire</label>
            <input 
              type="number" 
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-50" 
              value={totals.totalLocataire}
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
  };
 
 export default RealisationsComplete; 