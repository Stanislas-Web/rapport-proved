import React, { useState, useEffect } from 'react';
import { RapportActivite } from '../../../models/RapportActivite';

interface GouvernanceProps {
  formData: RapportActivite;
  setFormData: React.Dispatch<React.SetStateAction<RapportActivite>>;
  autoSaveForceSave?: () => void;
}

const Gouvernance: React.FC<GouvernanceProps> = ({ formData, setFormData, autoSaveForceSave }) => {
  // État pour le modal de calcul des formations
  const [showCalculModalFormations, setShowCalculModalFormations] = useState(false);

  // État pour les formations des gestionnaires - initialiser depuis formData si disponible
  const [formationsGestionnaires, setFormationsGestionnaires] = useState(() => 
    formData?.gouvernance?.formationsGestionnaires || {
      leadershipScolaire: { tauxGF: 0, tauxFilles: 0 },
      managementScolaire: { tauxGF: 0, tauxFilles: 0 },
      calculIndicateurs: { tauxGF: 0, tauxFilles: 0 },
      gestionEntiteEducationnelle: { tauxGF: 0, tauxFilles: 0 },
      planification: { tauxGF: 0, tauxFilles: 0 }
    }
  );

  // État pour les données brutes de calcul des formations
  const [calculDataFormations, setCalculDataFormations] = useState({
    leadershipScolaire: { total: 0, formes: 0, garcons: 0, filles: 0 },
    managementScolaire: { total: 0, formes: 0, garcons: 0, filles: 0 },
    calculIndicateurs: { total: 0, formes: 0, garcons: 0, filles: 0 },
    gestionEntiteEducationnelle: { total: 0, formes: 0, garcons: 0, filles: 0 },
    planification: { total: 0, formes: 0, garcons: 0, filles: 0 }
  });

  const handleChange = (field: keyof RapportActivite, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Fonction pour gérer les changements de champs imbriqués
  const handleInputChange = (path: string, value: string) => {
    setFormData(prev => {
      const updated = { ...prev };
      const keys = path.split('.');
      let current: any = updated;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  // Synchroniser formationsGestionnaires avec formData
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      gouvernance: {
        ...prev.gouvernance,
        formationsGestionnaires
      }
    }));
  }, [formationsGestionnaires, setFormData]);

  // Charger formationsGestionnaires depuis formData au montage et quand formData change
  useEffect(() => {
    const formations = formData?.gouvernance?.formationsGestionnaires;
    if (formations) {
      setFormationsGestionnaires(formations);
    }
  }, [formData?.gouvernance?.formationsGestionnaires]);

  // Fonction pour ouvrir le modal de calcul des formations
  const openCalculModalFormations = () => {
    setShowCalculModalFormations(true);
  };

  // Fonction pour mettre à jour les données de calcul des formations
  const updateCalculDataFormations = (formation: string, field: string, value: number) => {
    // Empêcher les valeurs négatives
    const validatedValue = Math.max(0, value);
    setCalculDataFormations(prev => ({
      ...prev,
      [formation]: {
        ...prev[formation as keyof typeof prev],
        [field]: validatedValue
      }
    }));
  };

  // Fonction pour mettre à jour les formations des gestionnaires
  const updateFormationsGestionnaires = (formation: string, field: 'tauxGF' | 'tauxFilles', value: number) => {
    setFormationsGestionnaires(prev => {
      const updated = { ...prev };
      const currentFormation = updated[formation as keyof typeof updated];
      currentFormation[field] = Math.max(0, Math.min(100, value)); // Limiter entre 0 et 100
      return updated;
    });
  };

  // Fonction pour calculer les taux de formations à partir des nombres
  const calculerTauxFormations = () => {
    const nouveauxTaux: any = {};
    
    Object.keys(calculDataFormations).forEach((formation) => {
      const data = calculDataFormations[formation as keyof typeof calculDataFormations];
      const total = data.total || 0;
      
      if (total > 0) {
        const tauxGF = Math.round((data.formes / total) * 100 * 100) / 100;
        const tauxFilles = Math.round((data.filles / total) * 100 * 100) / 100;
        
        nouveauxTaux[formation] = {
          tauxGF: tauxGF,
          tauxFilles: tauxFilles
        };
      } else {
        nouveauxTaux[formation] = { tauxGF: 0, tauxFilles: 0 };
      }
    });
    
    setFormationsGestionnaires(nouveauxTaux);
    setShowCalculModalFormations(false);
    
    // Sauvegarder immédiatement dans le brouillon
    setTimeout(() => {
      if (autoSaveForceSave) {
        autoSaveForceSave();
      }
    }, 500);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h3 className="text-lg font-medium mb-4 text-primary">IV. GOUVERNANCE (GESTION ET PILOTAGE DU SOUS-SECTEUR)</h3>
      
      {/* IV.1. Mise en Œuvre de la SSEF */}
      <div className="mb-6">
        <h4 className="font-bold mb-3">IV.1. Mise en Œuvre de la SSEF (Stratégie Sectorielle de l'Éducation et de la Formation)</h4>
        
        {/* IV.1.A. Niveau Province Educationnelle */}
        <div className="mb-4">
          <h5 className="font-semibold text-blue-600 mb-3">IV.1.A. Au niveau de la Province Educationnelle</h5>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">1. Elaboration du PAO de la Province Educationnelle dans une approche participative et ascendante (3 lignes)</label>
            <textarea
              className="w-full h-20 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Décrivez l'élaboration du PAO..."
              value={formData.gouvernance.miseEnOeuvreSSEF.niveauProvinceEducationnelle.elaborationPAO}
              onChange={(e) => handleInputChange('gouvernance.miseEnOeuvreSSEF.niveauProvinceEducationnelle.elaborationPAO', e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">2. Mise en œuvre : Suivi</label>
            <textarea
              className="w-full h-20 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Décrivez la mise en œuvre et le suivi..."
              value={formData.gouvernance.miseEnOeuvreSSEF.niveauProvinceEducationnelle.miseEnOeuvre}
              onChange={(e) => handleInputChange('gouvernance.miseEnOeuvreSSEF.niveauProvinceEducationnelle.miseEnOeuvre', e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">3. Evaluation à Mi-Parcours</label>
            <textarea
              className="w-full h-20 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Décrivez l'évaluation à mi-parcours..."
              value={formData.gouvernance.miseEnOeuvreSSEF.niveauProvinceEducationnelle.evaluationMiParcours}
              onChange={(e) => handleInputChange('gouvernance.miseEnOeuvreSSEF.niveauProvinceEducationnelle.evaluationMiParcours', e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">4. Evaluation Finale</label>
            <textarea
              className="w-full h-20 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Décrivez l'évaluation finale..."
              value={formData.gouvernance.miseEnOeuvreSSEF.niveauProvinceEducationnelle.evaluationFinale}
              onChange={(e) => handleInputChange('gouvernance.miseEnOeuvreSSEF.niveauProvinceEducationnelle.evaluationFinale', e.target.value)}
            />
          </div>
        </div>

        {/* IV.1.B. Niveau Province Administrative */}
        <div className="mb-4">
          <h5 className="font-semibold text-blue-600 mb-3">IV.1.B. Au niveau de la Province Administrative</h5>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">1. Elaboration du PAO de la Province Administrative autour des Gouverneurs de Province (Ministres Provinciaux) dans le Cadre du Comité Technique Provincial de la SSEF (3 lignes au maximum)</label>
            <textarea
              className="w-full h-20 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Décrivez l'élaboration du PAO provincial..."
              value={formData.gouvernance.miseEnOeuvreSSEF.niveauProvinceAdministrative.elaborationPAO}
              onChange={(e) => handleInputChange('gouvernance.miseEnOeuvreSSEF.niveauProvinceAdministrative.elaborationPAO', e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">2. Mise en œuvre : Suivi</label>
            <textarea
              className="w-full h-20 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Décrivez la mise en œuvre et le suivi..."
              value={formData.gouvernance.miseEnOeuvreSSEF.niveauProvinceAdministrative.miseEnOeuvre}
              onChange={(e) => handleInputChange('gouvernance.miseEnOeuvreSSEF.niveauProvinceAdministrative.miseEnOeuvre', e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">3. Evaluation à Mi-Parcours</label>
            <textarea
              className="w-full h-20 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Décrivez l'évaluation à mi-parcours..."
              value={formData.gouvernance.miseEnOeuvreSSEF.niveauProvinceAdministrative.evaluationMiParcours}
              onChange={(e) => handleInputChange('gouvernance.miseEnOeuvreSSEF.niveauProvinceAdministrative.evaluationMiParcours', e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">4. Evaluation Finale</label>
            <textarea
              className="w-full h-20 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Décrivez l'évaluation finale..."
              value={formData.gouvernance.miseEnOeuvreSSEF.niveauProvinceAdministrative.evaluationFinale}
              onChange={(e) => handleInputChange('gouvernance.miseEnOeuvreSSEF.niveauProvinceAdministrative.evaluationFinale', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* IV.2. Inspections Administratives C2B */}
      <div className="mb-6">
        <h4 className="font-bold mb-3">IV.2. Inspections Administratives C2B</h4>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-3 py-2 text-left">Niveau d'Enseignement</th>
                <th className="border border-gray-300 px-3 py-2 text-center">Nbre Prévu</th>
                <th className="border border-gray-300 px-3 py-2 text-center">Nbre Réalisé</th>
                <th className="border border-gray-300 px-3 py-2 text-center">% Réalisation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-3 py-2">Préscolaire</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0"
                    value={formData.gouvernance.inspectionsAdministrativesC2B.prescolaire.nombrePrevu ?? ''}
                    onChange={(e) => handleInputChange('gouvernance.inspectionsAdministrativesC2B.prescolaire.nombrePrevu', e.target.value)}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0"
                    value={formData.gouvernance.inspectionsAdministrativesC2B.prescolaire.nombreRealise ?? ''}
                    onChange={(e) => handleInputChange('gouvernance.inspectionsAdministrativesC2B.prescolaire.nombreRealise', e.target.value)}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0"
                    step="0.1"
                    value={formData.gouvernance.inspectionsAdministrativesC2B.prescolaire.pourcentageRealisation ?? ''}
                    onChange={(e) => handleInputChange('gouvernance.inspectionsAdministrativesC2B.prescolaire.pourcentageRealisation', e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">Primaire</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0"
                    value={formData.gouvernance.inspectionsAdministrativesC2B.primaire.nombrePrevu ?? ''}
                    onChange={(e) => handleInputChange('gouvernance.inspectionsAdministrativesC2B.primaire.nombrePrevu', e.target.value)}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0"
                    value={formData.gouvernance.inspectionsAdministrativesC2B.primaire.nombreRealise ?? ''}
                    onChange={(e) => handleInputChange('gouvernance.inspectionsAdministrativesC2B.primaire.nombreRealise', e.target.value)}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0"
                    step="0.1"
                    value={formData.gouvernance.inspectionsAdministrativesC2B.primaire.pourcentageRealisation ?? ''}
                    onChange={(e) => handleInputChange('gouvernance.inspectionsAdministrativesC2B.primaire.pourcentageRealisation', e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">Secondaire</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0"
                    value={formData.gouvernance.inspectionsAdministrativesC2B.secondaire.nombrePrevu ?? ''}
                    onChange={(e) => handleInputChange('gouvernance.inspectionsAdministrativesC2B.secondaire.nombrePrevu', e.target.value)}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0"
                    value={formData.gouvernance.inspectionsAdministrativesC2B.secondaire.nombreRealise ?? ''}
                    onChange={(e) => handleInputChange('gouvernance.inspectionsAdministrativesC2B.secondaire.nombreRealise', e.target.value)}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0"
                    step="0.1"
                    value={formData.gouvernance.inspectionsAdministrativesC2B.secondaire.pourcentageRealisation ?? ''}
                    onChange={(e) => handleInputChange('gouvernance.inspectionsAdministrativesC2B.secondaire.pourcentageRealisation', e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">Spécial (handicap)</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0"
                    value={formData.gouvernance.inspectionsAdministrativesC2B.special.nombrePrevu ?? ''}
                    onChange={(e) => handleInputChange('gouvernance.inspectionsAdministrativesC2B.special.nombrePrevu', e.target.value)}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0"
                    value={formData.gouvernance.inspectionsAdministrativesC2B.special.nombreRealise ?? ''}
                    onChange={(e) => handleInputChange('gouvernance.inspectionsAdministrativesC2B.special.nombreRealise', e.target.value)}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0"
                    step="0.1"
                    value={formData.gouvernance.inspectionsAdministrativesC2B.special.pourcentageRealisation ?? ''}
                    onChange={(e) => handleInputChange('gouvernance.inspectionsAdministrativesC2B.special.pourcentageRealisation', e.target.value)}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* IV.8. Vulgarisation des Instructions Officielles */}
      <div className="mb-6">
        <h4 className="font-bold mb-3">IV.8. Vulgarisation des Instructions Officielles</h4>
        <p className="text-sm text-gray-600 mb-2">en Indiquer les Principales et mettre en exergue particulièrement la mise en pratique de celles relatives à la Nouvelle Citoyenneté</p>
        <p className="text-sm text-gray-600 mb-4">(10 lignes au maximum)</p>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Instructions Officielles</label>
          <textarea
            className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Entrez les instructions officielles vulgarisées..."
            value={formData.gouvernance.vulgarisationInstructions.instructionsOfficielles}
            onChange={(e) => handleInputChange('gouvernance.vulgarisationInstructions.instructionsOfficielles', e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Mise en pratique de la Nouvelle Citoyenneté</label>
          <textarea
            className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Décrivez la mise en pratique de la Nouvelle Citoyenneté..."
            value={formData.gouvernance.vulgarisationInstructions.nouvelleCitoyennete}
            onChange={(e) => handleInputChange('gouvernance.vulgarisationInstructions.nouvelleCitoyennete', e.target.value)}
          />
        </div>
      </div>

      {/* IV.9. Formation des Gestionnaires des BG Provinciaux et de Proximité */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-bold">IV.9. Formation des Gestionnaires des BG Provinciaux et de Proximité</h4>
          <button
            type="button"
            onClick={openCalculModalFormations}
            className="px-4 py-2 text-sm bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors flex items-center gap-2"
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
                <th className="border border-gray-300 px-3 py-2 text-left">Formation</th>
                <th className="border border-gray-300 px-3 py-2 text-center">Taux (GF)</th>
                <th className="border border-gray-300 px-3 py-2 text-center">(F)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-3 py-2">En Leadership Scolaire</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    max="100"
                    step="0.1"
                    value={formationsGestionnaires.leadershipScolaire.tauxGF ?? ''}
                    onChange={(e) => updateFormationsGestionnaires('leadershipScolaire', 'tauxGF', Number(e.target.value))}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    max="100"
                    step="0.1"
                    value={formationsGestionnaires.leadershipScolaire.tauxFilles ?? ''}
                    onChange={(e) => updateFormationsGestionnaires('leadershipScolaire', 'tauxFilles', Number(e.target.value))}
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">En Management Scolaire</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    max="100"
                    step="0.1"
                    value={formationsGestionnaires.managementScolaire.tauxGF ?? ''}
                    onChange={(e) => updateFormationsGestionnaires('managementScolaire', 'tauxGF', Number(e.target.value))}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    max="100"
                    step="0.1"
                    value={formationsGestionnaires.managementScolaire.tauxFilles ?? ''}
                    onChange={(e) => updateFormationsGestionnaires('managementScolaire', 'tauxFilles', Number(e.target.value))}
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">En Calcul, analyse, interprétations des indicateurs statistiques</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    max="100"
                    step="0.1"
                    value={formationsGestionnaires.calculIndicateurs.tauxGF ?? ''}
                    onChange={(e) => updateFormationsGestionnaires('calculIndicateurs', 'tauxGF', Number(e.target.value))}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    max="100"
                    step="0.1"
                    value={formationsGestionnaires.calculIndicateurs.tauxFilles ?? ''}
                    onChange={(e) => updateFormationsGestionnaires('calculIndicateurs', 'tauxFilles', Number(e.target.value))}
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">En Gestion d'une entité éducationnelle</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    max="100"
                    step="0.1"
                    value={formationsGestionnaires.gestionEntiteEducationnelle.tauxGF ?? ''}
                    onChange={(e) => updateFormationsGestionnaires('gestionEntiteEducationnelle', 'tauxGF', Number(e.target.value))}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    max="100"
                    step="0.1"
                    value={formationsGestionnaires.gestionEntiteEducationnelle.tauxFilles ?? ''}
                    onChange={(e) => updateFormationsGestionnaires('gestionEntiteEducationnelle', 'tauxFilles', Number(e.target.value))}
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">Planification</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    max="100"
                    step="0.1"
                    value={formationsGestionnaires.planification.tauxGF ?? ''}
                    onChange={(e) => updateFormationsGestionnaires('planification', 'tauxGF', Number(e.target.value))}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    max="100"
                    step="0.1"
                    value={formationsGestionnaires.planification.tauxFilles ?? ''}
                    onChange={(e) => updateFormationsGestionnaires('planification', 'tauxFilles', Number(e.target.value))}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">Bref commentaire sur le module exploité</label>
          <textarea
            className="w-full h-20 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Commentaire sur le module..."
            value={formData.gouvernance.commentaireFormations || ''}
            onChange={(e) => handleInputChange('gouvernance.commentaireFormations', e.target.value)}
          />
        </div>
      </div>

      {/* Modal de calcul des formations des gestionnaires */}
      {showCalculModalFormations && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Calculer les taux de formation des gestionnaires</h3>
              <button
                onClick={() => setShowCalculModalFormations(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-4">
              <p className="text-sm text-gray-600 mb-6">
                Saisissez les nombres de gestionnaires pour chaque type de formation. Les pourcentages seront calculés automatiquement.
              </p>

              {/* En Leadership Scolaire */}
              <div className="mb-6 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-lg mb-4 text-cyan-700">En Leadership Scolaire</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Gestionnaires</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={calculDataFormations.leadershipScolaire.total || ''}
                      onChange={(e) => updateCalculDataFormations('leadershipScolaire', 'total', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Formés</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={calculDataFormations.leadershipScolaire.formes || ''}
                      onChange={(e) => updateCalculDataFormations('leadershipScolaire', 'formes', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Garçons</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={calculDataFormations.leadershipScolaire.garcons || ''}
                      onChange={(e) => updateCalculDataFormations('leadershipScolaire', 'garcons', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Filles</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      value={calculDataFormations.leadershipScolaire.filles || ''}
                      onChange={(e) => updateCalculDataFormations('leadershipScolaire', 'filles', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* En Management Scolaire */}
              <div className="mb-6 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-lg mb-4 text-cyan-700">En Management Scolaire</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Gestionnaires</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={calculDataFormations.managementScolaire.total || ''}
                      onChange={(e) => updateCalculDataFormations('managementScolaire', 'total', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Formés</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={calculDataFormations.managementScolaire.formes || ''}
                      onChange={(e) => updateCalculDataFormations('managementScolaire', 'formes', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Garçons</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={calculDataFormations.managementScolaire.garcons || ''}
                      onChange={(e) => updateCalculDataFormations('managementScolaire', 'garcons', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Filles</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      value={calculDataFormations.managementScolaire.filles || ''}
                      onChange={(e) => updateCalculDataFormations('managementScolaire', 'filles', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* En Calcul, analyse, interprétations des indicateurs statistiques */}
              <div className="mb-6 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-lg mb-4 text-cyan-700">En Calcul, analyse, interprétations des indicateurs statistiques</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Gestionnaires</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={calculDataFormations.calculIndicateurs.total || ''}
                      onChange={(e) => updateCalculDataFormations('calculIndicateurs', 'total', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Formés</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={calculDataFormations.calculIndicateurs.formes || ''}
                      onChange={(e) => updateCalculDataFormations('calculIndicateurs', 'formes', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Garçons</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={calculDataFormations.calculIndicateurs.garcons || ''}
                      onChange={(e) => updateCalculDataFormations('calculIndicateurs', 'garcons', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Filles</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      value={calculDataFormations.calculIndicateurs.filles || ''}
                      onChange={(e) => updateCalculDataFormations('calculIndicateurs', 'filles', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* En Gestion d'une entité éducationnelle */}
              <div className="mb-6 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-lg mb-4 text-cyan-700">En Gestion d'une entité éducationnelle</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Gestionnaires</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={calculDataFormations.gestionEntiteEducationnelle.total || ''}
                      onChange={(e) => updateCalculDataFormations('gestionEntiteEducationnelle', 'total', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Formés</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={calculDataFormations.gestionEntiteEducationnelle.formes || ''}
                      onChange={(e) => updateCalculDataFormations('gestionEntiteEducationnelle', 'formes', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Garçons</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={calculDataFormations.gestionEntiteEducationnelle.garcons || ''}
                      onChange={(e) => updateCalculDataFormations('gestionEntiteEducationnelle', 'garcons', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Filles</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      value={calculDataFormations.gestionEntiteEducationnelle.filles || ''}
                      onChange={(e) => updateCalculDataFormations('gestionEntiteEducationnelle', 'filles', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Planification */}
              <div className="mb-6 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-lg mb-4 text-cyan-700">Planification</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Gestionnaires</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={calculDataFormations.planification.total || ''}
                      onChange={(e) => updateCalculDataFormations('planification', 'total', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Formés</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={calculDataFormations.planification.formes || ''}
                      onChange={(e) => updateCalculDataFormations('planification', 'formes', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Garçons</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={calculDataFormations.planification.garcons || ''}
                      onChange={(e) => updateCalculDataFormations('planification', 'garcons', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Filles</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      value={calculDataFormations.planification.filles || ''}
                      onChange={(e) => updateCalculDataFormations('planification', 'filles', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setShowCalculModalFormations(false)}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={calculerTauxFormations}
                className="px-6 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors flex items-center gap-2"
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

      {/* IV.3. Comités Provinciaux */}
      <div className="mb-6 mt-6">
        <h4 className="font-bold mb-3">IV.3. Comités Provinciaux</h4>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-3 py-2 text-left">Comité</th>
                <th className="border border-gray-300 px-3 py-2">Fréquence des réunions</th>
                <th className="border border-gray-300 px-3 py-2">Points traités</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-3 py-2">EDUNC</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="text" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0 p-1" 
                    value={formData.gouvernance?.comitesProvinciaux?.comiteEDUNC?.frequenceReunions || ''}
                    onChange={(e) => handleInputChange('gouvernance.comitesProvinciaux.comiteEDUNC.frequenceReunions', e.target.value)}
                    placeholder="Ex: Mensuellement"
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="text" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0 p-1" 
                    value={formData.gouvernance?.comitesProvinciaux?.comiteEDUNC?.pointsTraites || ''}
                    onChange={(e) => handleInputChange('gouvernance.comitesProvinciaux.comiteEDUNC.pointsTraites', e.target.value)}
                    placeholder="Points traités"
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">ENAFP</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="text" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0 p-1" 
                    value={formData.gouvernance?.comitesProvinciaux?.comiteENAFP?.frequenceReunions || ''}
                    onChange={(e) => handleInputChange('gouvernance.comitesProvinciaux.comiteENAFP.frequenceReunions', e.target.value)}
                    placeholder="Ex: Trimestriellement"
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="text" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0 p-1" 
                    value={formData.gouvernance?.comitesProvinciaux?.comiteENAFP?.pointsTraites || ''}
                    onChange={(e) => handleInputChange('gouvernance.comitesProvinciaux.comiteENAFP.pointsTraites', e.target.value)}
                    placeholder="Points traités"
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">TENASOSP</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="text" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0 p-1" 
                    value={formData.gouvernance?.comitesProvinciaux?.comiteTENASOSP?.frequenceReunions || ''}
                    onChange={(e) => handleInputChange('gouvernance.comitesProvinciaux.comiteTENASOSP.frequenceReunions', e.target.value)}
                    placeholder="Fréquence"
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="text" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0 p-1" 
                    value={formData.gouvernance?.comitesProvinciaux?.comiteTENASOSP?.pointsTraites || ''}
                    onChange={(e) => handleInputChange('gouvernance.comitesProvinciaux.comiteTENASOSP.pointsTraites', e.target.value)}
                    placeholder="Points traités"
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">Examen d'État</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="text" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0 p-1" 
                    value={formData.gouvernance?.comitesProvinciaux?.comiteExamenEtat?.frequenceReunions || ''}
                    onChange={(e) => handleInputChange('gouvernance.comitesProvinciaux.comiteExamenEtat.frequenceReunions', e.target.value)}
                    placeholder="Fréquence"
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="text" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0 p-1" 
                    value={formData.gouvernance?.comitesProvinciaux?.comiteExamenEtat?.pointsTraites || ''}
                    onChange={(e) => handleInputChange('gouvernance.comitesProvinciaux.comiteExamenEtat.pointsTraites', e.target.value)}
                    placeholder="Points traités"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* IV.4. Rémunération du Personnel */}
      <div className="mb-6 mt-6">
        <h4 className="font-bold mb-3">IV.4. Rémunération du Personnel</h4>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-2 py-2 text-left">Structure</th>
                <th className="border border-gray-300 px-2 py-2 text-center">Total Agents</th>
                <th className="border border-gray-300 px-2 py-2 text-center">Non Payés</th>
              </tr>
            </thead>
            <tbody>
              {[
                { key: 'directionProvinciale', label: 'Direction Provinciale' },
                { key: 'inspectionPrincipale', label: 'Inspection Principale' },
                { key: 'dinacope', label: 'DINACOPE' },
                { key: 'sernie', label: 'SERNIE' },
                { key: 'coordinationProvinciale', label: 'Coordination Provinciale' },
                { key: 'sousDivision', label: 'Sous-Division' },
                { key: 'poolsInspectionPrimaire', label: 'Pools Inspection Primaire' },
                { key: 'poolsInspectionSecondaire', label: 'Pools Inspection Secondaire' },
                { key: 'antenneDinacope', label: 'Antenne DINACOPE' },
                { key: 'antenneSernie', label: 'Antenne SERNIE' },
                { key: 'coordinationDiocesaine', label: 'Coordination Diocésaine' },
                { key: 'sousCoordinationConventionnees', label: 'Sous-Coordination Conventionnées' },
                { key: 'conseillerieResidente', label: 'Conseillerie Résidente' }
              ].map((item) => (
                <tr key={item.key}>
                  <td className="border border-gray-300 px-2 py-2">{item.label}</td>
                  <td className="border border-gray-300 px-2 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0 p-1" 
                      value={formData.gouvernance?.remunerationPersonnel?.[item.key as keyof any]?.totalAgents || 0}
                      onChange={(e) => handleInputChange(`gouvernance.remunerationPersonnel.${item.key}.totalAgents`, e.target.value)}
                      placeholder="0"
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0 p-1" 
                      value={formData.gouvernance?.remunerationPersonnel?.[item.key as keyof any]?.nonPayes || 0}
                      onChange={(e) => handleInputChange(`gouvernance.remunerationPersonnel.${item.key}.nonPayes`, e.target.value)}
                      placeholder="0"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* IV.5. Groupes d'Aides Psychopédagogiques */}
      <div className="mb-6 mt-6">
        <h4 className="font-bold mb-3">IV.5. Groupes d'Aides Psychopédagogiques (GAP)</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nombre de GAP mis en place</label>
            <input 
              type="number" 
              className="w-full p-2 border border-gray-300 rounded-md" 
              value={formData.gouvernance?.groupesAidesPsychopedagogiques?.nombreGAPMisEnPlace || 0}
              onChange={(e) => handleInputChange('gouvernance.groupesAidesPsychopedagogiques.nombreGAPMisEnPlace', e.target.value)}
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Nombre de GAP opérationnel</label>
            <input 
              type="number" 
              className="w-full p-2 border border-gray-300 rounded-md" 
              value={formData.gouvernance?.groupesAidesPsychopedagogiques?.nombreGAPOperationnel || 0}
              onChange={(e) => handleInputChange('gouvernance.groupesAidesPsychopedagogiques.nombreGAPOperationnel', e.target.value)}
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Nombre de cas pris en charge</label>
            <input 
              type="number" 
              className="w-full p-2 border border-gray-300 rounded-md" 
              value={formData.gouvernance?.groupesAidesPsychopedagogiques?.nombreCasPrisEnCharge || 0}
              onChange={(e) => handleInputChange('gouvernance.groupesAidesPsychopedagogiques.nombreCasPrisEnCharge', e.target.value)}
              placeholder="0"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Problèmes identifiés</label>
          <textarea 
            className="w-full h-20 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
            value={formData.gouvernance?.groupesAidesPsychopedagogiques?.problemesIdentifies || ''}
            onChange={(e) => handleInputChange('gouvernance.groupesAidesPsychopedagogiques.problemesIdentifies', e.target.value)}
            placeholder="Problèmes identifiés..."
          />
        </div>
        <div className="mt-3">
          <label className="block text-sm font-medium mb-2">Solutions préconisées</label>
          <textarea 
            className="w-full h-20 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
            value={formData.gouvernance?.groupesAidesPsychopedagogiques?.solutionsPreconisees || ''}
            onChange={(e) => handleInputChange('gouvernance.groupesAidesPsychopedagogiques.solutionsPreconisees', e.target.value)}
            placeholder="Solutions préconisées..."
          />
        </div>
      </div>

      {/* IV.6. Acquisitions de Matériels */}
      <div className="mb-6 mt-6">
        <h4 className="font-bold mb-3">IV.6. Acquisitions de Matériels</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { key: 'ecoles', label: 'Pour les Écoles' },
            { key: 'bureauxGestionnaires', label: 'Pour les Bureaux des Gestionnaires' }
          ].map((section) => (
            <div key={section.key} className="border border-gray-200 rounded-lg p-4">
              <h5 className="font-semibold text-base mb-3">{section.label}</h5>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-2">Nature</label>
                <textarea 
                  className="w-full h-16 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
                  value={formData.gouvernance?.acquisitionsMateriels?.[section.key as keyof any]?.nature || ''}
                  onChange={(e) => handleInputChange(`gouvernance.acquisitionsMateriels.${section.key}.nature`, e.target.value)}
                  placeholder="Description du matériel..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Source de Financement</label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-medium mb-1 block">Gouvernement</label>
                    <input 
                      type="number" 
                      className="w-full p-1 border border-gray-300 rounded text-sm" 
                      value={formData.gouvernance?.acquisitionsMateriels?.[section.key as keyof any]?.sourceFinancement?.gvt || 0}
                      onChange={(e) => handleInputChange(`gouvernance.acquisitionsMateriels.${section.key}.sourceFinancement.gvt`, e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block">Projet</label>
                    <input 
                      type="number" 
                      className="w-full p-1 border border-gray-300 rounded text-sm" 
                      value={formData.gouvernance?.acquisitionsMateriels?.[section.key as keyof any]?.sourceFinancement?.projet || 0}
                      onChange={(e) => handleInputChange(`gouvernance.acquisitionsMateriels.${section.key}.sourceFinancement.projet`, e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block">PTFs</label>
                    <input 
                      type="number" 
                      className="w-full p-1 border border-gray-300 rounded text-sm" 
                      value={formData.gouvernance?.acquisitionsMateriels?.[section.key as keyof any]?.sourceFinancement?.ptfs || 0}
                      onChange={(e) => handleInputChange(`gouvernance.acquisitionsMateriels.${section.key}.sourceFinancement.ptfs`, e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block">ONG</label>
                    <input 
                      type="number" 
                      className="w-full p-1 border border-gray-300 rounded text-sm" 
                      value={formData.gouvernance?.acquisitionsMateriels?.[section.key as keyof any]?.sourceFinancement?.ong || 0}
                      onChange={(e) => handleInputChange(`gouvernance.acquisitionsMateriels.${section.key}.sourceFinancement.ong`, e.target.value)}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* IV.7. Infrastructure des Bureaux */}
      <div className="mb-6 mt-6">
        <h4 className="font-bold mb-3">IV.7. Infrastructure des Bureaux</h4>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-2 py-2 text-left">Structure</th>
                <th className="border border-gray-300 px-2 py-2 text-center">Propriétaire</th>
                <th className="border border-gray-300 px-2 py-2 text-center">Locataire</th>
              </tr>
            </thead>
            <tbody>
              {[
                { key: 'directionProvinciale', label: 'Direction Provinciale' },
                { key: 'inspectionPrincipale', label: 'Inspection Principale' },
                { key: 'dinacope', label: 'DINACOPE' },
                { key: 'sernie', label: 'SERNIE' },
                { key: 'coordinationProvinciale', label: 'Coordination Provinciale' },
                { key: 'sousDivision', label: 'Sous-Division' },
                { key: 'poolsInspectionPrimaire', label: 'Pools Inspection Primaire' },
                { key: 'poolsInspectionSecondaire', label: 'Pools Inspection Secondaire' },
                { key: 'antenneDinacope', label: 'Antenne DINACOPE' },
                { key: 'antenneSernie', label: 'Antenne SERNIE' },
                { key: 'coordinationDiocesaine', label: 'Coordination Diocésaine' },
                { key: 'sousCoordinationConventionnees', label: 'Sous-Coordination Conventionnées' },
                { key: 'conseillerieResidente', label: 'Conseillerie Résidente' }
              ].map((item) => (
                <tr key={item.key}>
                  <td className="border border-gray-300 px-2 py-2">{item.label}</td>
                  <td className="border border-gray-300 px-2 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0 p-1" 
                      value={formData.gouvernance?.infrastructureBureaux?.[item.key as keyof any]?.proprietaire || 0}
                      onChange={(e) => handleInputChange(`gouvernance.infrastructureBureaux.${item.key}.proprietaire`, e.target.value)}
                      placeholder="0"
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0 p-1" 
                      value={formData.gouvernance?.infrastructureBureaux?.[item.key as keyof any]?.locataire || 0}
                      onChange={(e) => handleInputChange(`gouvernance.infrastructureBureaux.${item.key}.locataire`, e.target.value)}
                      placeholder="0"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Gouvernance; 