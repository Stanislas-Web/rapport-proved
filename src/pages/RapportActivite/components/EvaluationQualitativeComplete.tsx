import React, { useState } from 'react';

interface EvaluationQualitativeCompleteProps {
  formData?: any;
  setFormData?: React.Dispatch<React.SetStateAction<any>>;
}

const EvaluationQualitativeComplete: React.FC<EvaluationQualitativeCompleteProps> = () => {
  // État pour les inspections pédagogiques C3
  const [inspectionsC3, setInspectionsC3] = useState({
    maternel: { prevu: 0, realise: 0, pourcentage: 0 },
    primaire: { prevu: 0, realise: 0, pourcentage: 0 },
    secondaire: { prevu: 0, realise: 0, pourcentage: 0 },
    special: { prevu: 0, realise: 0, pourcentage: 0 }
  });

  // État pour les inspections de formation
  const [inspectionsFormation, setInspectionsFormation] = useState({
    maternel: { prevu: 0, realise: 0, pourcentage: 0 },
    primaire: { prevu: 0, realise: 0, pourcentage: 0 },
    secondaire: { prevu: 0, realise: 0, pourcentage: 0 },
    special: { prevu: 0, realise: 0, pourcentage: 0 }
  });

  // Fonction pour calculer le pourcentage
  const calculatePercentage = (realise: number, prevu: number): number => {
    if (prevu === 0) return 0;
    return Math.round((realise / prevu) * 100 * 100) / 100;
  };

  // Fonction pour mettre à jour les valeurs des inspections C3
  const updateInspection = (niveau: string, field: 'prevu' | 'realise', value: number) => {
    setInspectionsC3(prev => {
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

  // Fonction pour mettre à jour les valeurs des inspections de formation
  const updateInspectionFormation = (niveau: string, field: 'prevu' | 'realise', value: number) => {
    setInspectionsFormation(prev => {
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
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h3 className="text-lg font-medium mb-4 text-primary">III. EVALUATION QUALITATIVE (SUITE)</h3>
      
      {/* III.1.3. Matériels Didactiques */}
      <div className="mb-6">
        <h4 className="font-bold mb-3">III.1.3. Matériels Didactiques</h4>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-3 py-2 text-left">Niveau d'Enseignement</th>
                <th className="border border-gray-300 px-3 py-2 text-center">TRES BON</th>
                <th className="border border-gray-300 px-3 py-2 text-center">BON</th>
                <th className="border border-gray-300 px-3 py-2 text-center">CARENCE</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-3 py-2">a) Espace Communautaire d'éveil (ECE)</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="radio" name="mat_1" className="mx-auto block" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="radio" name="mat_1" className="mx-auto block" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="radio" name="mat_1" className="mx-auto block" />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">b) Préprimaire</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="radio" name="mat_2" className="mx-auto block" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="radio" name="mat_2" className="mx-auto block" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="radio" name="mat_2" className="mx-auto block" />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">c) Maternel</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="radio" name="mat_3" className="mx-auto block" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="radio" name="mat_3" className="mx-auto block" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="radio" name="mat_3" className="mx-auto block" />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">d) Primaire</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="radio" name="mat_4" className="mx-auto block" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="radio" name="mat_4" className="mx-auto block" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="radio" name="mat_4" className="mx-auto block" />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">e) Secondaire</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="radio" name="mat_5" className="mx-auto block" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="radio" name="mat_5" className="mx-auto block" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="radio" name="mat_5" className="mx-auto block" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* III.1.4. Matériels & Réactif des Laboratoires */}
      <div className="mb-6">
        <h4 className="font-bold mb-3">III.1.4. Matériels & Réactif des Laboratoires: HUMANITES SCIENTIFIQUES</h4>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-3 py-2 text-left">Laboratoire</th>
                <th className="border border-gray-300 px-3 py-2 text-center">TRES BON</th>
                <th className="border border-gray-300 px-3 py-2 text-center">BON</th>
                <th className="border border-gray-300 px-3 py-2 text-center">CARENCE</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-3 py-2">a) LABORATOIRE DE CHIMIE</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="radio" name="lab_chimie" className="mx-auto block" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="radio" name="lab_chimie" className="mx-auto block" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="radio" name="lab_chimie" className="mx-auto block" />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">b) LABORATOIRE DE BIOLOGIE</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="radio" name="lab_bio" className="mx-auto block" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="radio" name="lab_bio" className="mx-auto block" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="radio" name="lab_bio" className="mx-auto block" />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">c) LABORATOIRE DE PHYSIQUE</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="radio" name="lab_phys" className="mx-auto block" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="radio" name="lab_phys" className="mx-auto block" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="radio" name="lab_phys" className="mx-auto block" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* III.1.5. Equipements Ateliers */}
      <div className="mb-6">
        <h4 className="font-bold mb-3">III.1.5. Equipements Ateliers: HUMANITES TECHNIQUES</h4>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-3 py-2 text-left">Equipement</th>
                <th className="border border-gray-300 px-3 py-2 text-center">TRES BON</th>
                <th className="border border-gray-300 px-3 py-2 text-center">BON</th>
                <th className="border border-gray-300 px-3 py-2 text-center">CARENCE</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-3 py-2">a) EQUIPEMENTS ATELIERS</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="radio" name="atelier" className="mx-auto block" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="radio" name="atelier" className="mx-auto block" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="radio" name="atelier" className="mx-auto block" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* III.2. Visites des classes & réunions pédagogiques */}
      <div className="mb-6">
        <h4 className="font-bold mb-3">III.2. Visites des classes & réunions pédagogiques par les C.E et fonctionnement des cellules de base d'encadrement & de formation (Unites Pédagogiques)</h4>
        
        {/* III.2.1. Fréquences des Visites des Classes */}
        <div className="mb-4">
          <h5 className="font-bold mb-2">III.2.1. Fréquences des Visites des Classes</h5>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left">Niveau d'Enseignement</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">TRES BON</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">BON</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">ASSEZ BON</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">a) Espace Communautaire d'éveil (ECE)</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="visite_1" className="mx-auto block" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="visite_1" className="mx-auto block" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="visite_1" className="mx-auto block" />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">b) Préprimaire</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="visite_2" className="mx-auto block" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="visite_2" className="mx-auto block" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="visite_2" className="mx-auto block" />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">c) Maternel</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="visite_3" className="mx-auto block" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="visite_3" className="mx-auto block" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="visite_3" className="mx-auto block" />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">d) Primaire</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="visite_4" className="mx-auto block" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="visite_4" className="mx-auto block" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="visite_4" className="mx-auto block" />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">e) Secondaire</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="visite_5" className="mx-auto block" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="visite_5" className="mx-auto block" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="visite_5" className="mx-auto block" />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">f) Spécial (handicap : Tout niveau confondu)</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="visite_6" className="mx-auto block" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="visite_6" className="mx-auto block" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="visite_6" className="mx-auto block" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* III.2.2. Fréquence des Réunions Pédagogiques */}
        <div className="mb-4">
          <h5 className="font-bold mb-2">III.2.2. Fréquence des Réunions Pédagogiques</h5>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left">Niveau d'Enseignement</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">TRES BON</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">BON</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">ASSEZ BON</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">a) Espace Communautaire d'éveil (ECE)</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="reunion_1" className="mx-auto block" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="reunion_1" className="mx-auto block" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="reunion_1" className="mx-auto block" />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">b) Préprimaire</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="reunion_2" className="mx-auto block" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="reunion_2" className="mx-auto block" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="reunion_2" className="mx-auto block" />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">c) Maternel</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="reunion_3" className="mx-auto block" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="reunion_3" className="mx-auto block" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="reunion_3" className="mx-auto block" />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">d) Primaire</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="reunion_4" className="mx-auto block" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="reunion_4" className="mx-auto block" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="reunion_4" className="mx-auto block" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* III.2.3. Fonctionnement Cellule de Base */}
        <div className="mb-4">
          <h5 className="font-bold mb-2">III.2.3. Fonctionnement Cellule de Base: FREQUENCE DES REUNIONS DES UP</h5>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left">Niveau d'Enseignement</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">TRES BON</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">BON</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">ASSEZ BON</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">a) Espace Communautaire d'éveil (ECE)</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="cellule_1" className="mx-auto block" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="cellule_1" className="mx-auto block" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="cellule_1" className="mx-auto block" />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">b) Maternel</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="cellule_2" className="mx-auto block" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="cellule_2" className="mx-auto block" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="cellule_2" className="mx-auto block" />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">c) Primaire</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="cellule_3" className="mx-auto block" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="cellule_3" className="mx-auto block" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="cellule_3" className="mx-auto block" />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">d) Secondaire</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="cellule_4" className="mx-auto block" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="cellule_4" className="mx-auto block" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="cellule_4" className="mx-auto block" />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">e) Spécial (handicap : Tout niveau confondu)</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="cellule_5" className="mx-auto block" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="cellule_5" className="mx-auto block" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="cellule_5" className="mx-auto block" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* III.3. Activités Inspectorales */}
      <div className="mb-6">
        <h4 className="font-bold mb-3">III.3. Activités Inspectorales</h4>
        
        {/* III.3.1. Inspections Pédagogiques C3 */}
        <div className="mb-4">
          <h5 className="font-bold mb-2">III.3.1. Inspections Pédagogiques C3</h5>
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
                      value={inspectionsC3.maternel.prevu || ''}
                      onChange={(e) => updateInspection('maternel', 'prevu', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      min="0"
                      max={inspectionsC3.maternel.prevu || undefined}
                      value={inspectionsC3.maternel.realise || ''}
                      onChange={(e) => updateInspection('maternel', 'realise', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2 bg-gray-50">
                    <span className="w-full text-center font-medium text-blue-600">
                      {inspectionsC3.maternel.pourcentage}%
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
                      value={inspectionsC3.primaire.prevu || ''}
                      onChange={(e) => updateInspection('primaire', 'prevu', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      min="0"
                      max={inspectionsC3.primaire.prevu || undefined}
                      value={inspectionsC3.primaire.realise || ''}
                      onChange={(e) => updateInspection('primaire', 'realise', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2 bg-gray-50">
                    <span className="w-full text-center font-medium text-blue-600">
                      {inspectionsC3.primaire.pourcentage}%
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
                      value={inspectionsC3.secondaire.prevu || ''}
                      onChange={(e) => updateInspection('secondaire', 'prevu', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      min="0"
                      max={inspectionsC3.secondaire.prevu || undefined}
                      value={inspectionsC3.secondaire.realise || ''}
                      onChange={(e) => updateInspection('secondaire', 'realise', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2 bg-gray-50">
                    <span className="w-full text-center font-medium text-blue-600">
                      {inspectionsC3.secondaire.pourcentage}%
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
                      min="0"
                      value={inspectionsC3.special.prevu || ''}
                      onChange={(e) => updateInspection('special', 'prevu', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      min="0"
                      max={inspectionsC3.special.prevu || undefined}
                      value={inspectionsC3.special.realise || ''}
                      onChange={(e) => updateInspection('special', 'realise', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2 bg-gray-50">
                    <span className="w-full text-center font-medium text-blue-600">
                      {inspectionsC3.special.pourcentage}%
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* III.3.2. Inspections de Formation */}
        <div className="mb-4">
          <h5 className="font-bold mb-2">III.3.2. Inspections de Formation</h5>
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
                      min="0"
                      value={inspectionsFormation.maternel.prevu || ''}
                      onChange={(e) => updateInspectionFormation('maternel', 'prevu', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      min="0"
                      max={inspectionsFormation.maternel.prevu || undefined}
                      value={inspectionsFormation.maternel.realise || ''}
                      onChange={(e) => updateInspectionFormation('maternel', 'realise', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2 bg-gray-50">
                    <span className="w-full text-center font-medium text-blue-600">
                      {inspectionsFormation.maternel.pourcentage}%
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
                      min="0"
                      value={inspectionsFormation.primaire.prevu || ''}
                      onChange={(e) => updateInspectionFormation('primaire', 'prevu', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      min="0"
                      max={inspectionsFormation.primaire.prevu || undefined}
                      value={inspectionsFormation.primaire.realise || ''}
                      onChange={(e) => updateInspectionFormation('primaire', 'realise', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2 bg-gray-50">
                    <span className="w-full text-center font-medium text-blue-600">
                      {inspectionsFormation.primaire.pourcentage}%
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
                      min="0"
                      value={inspectionsFormation.secondaire.prevu || ''}
                      onChange={(e) => updateInspectionFormation('secondaire', 'prevu', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      min="0"
                      max={inspectionsFormation.secondaire.prevu || undefined}
                      value={inspectionsFormation.secondaire.realise || ''}
                      onChange={(e) => updateInspectionFormation('secondaire', 'realise', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2 bg-gray-50">
                    <span className="w-full text-center font-medium text-blue-600">
                      {inspectionsFormation.secondaire.pourcentage}%
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
                      min="0"
                      value={inspectionsFormation.special.prevu || ''}
                      onChange={(e) => updateInspectionFormation('special', 'prevu', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      min="0"
                      max={inspectionsFormation.special.prevu || undefined}
                      value={inspectionsFormation.special.realise || ''}
                      onChange={(e) => updateInspectionFormation('special', 'realise', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2 bg-gray-50">
                    <span className="w-full text-center font-medium text-blue-600">
                      {inspectionsFormation.special.pourcentage}%
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* III.3.3. Formation Continue */}
        <div className="mb-4">
          <h5 className="font-bold mb-2">III.3.3. Formation Continue</h5>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left">Niveau d'Enseignement</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">TRES BON</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">BON</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">CARENCE</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">Maternel</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="formation_1" className="mx-auto block" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="formation_1" className="mx-auto block" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="formation_1" className="mx-auto block" />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">Primaire</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="formation_2" className="mx-auto block" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="formation_2" className="mx-auto block" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="formation_2" className="mx-auto block" />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">Secondaire</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="formation_3" className="mx-auto block" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="formation_3" className="mx-auto block" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="formation_3" className="mx-auto block" />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">Spécial (handicap: Tout niveau confondu)</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="formation_4" className="mx-auto block" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="formation_4" className="mx-auto block" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="formation_4" className="mx-auto block" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Quelques Principaux Thèmes Exploités */}
        <div className="mb-4">
          <h5 className="font-medium mb-2">Quelques Principaux Thèmes Exploités</h5>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left">Niveau d'Enseignement</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">Thèmes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">a) Espace Communautaire d'éveil (ECE)</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="text" className="w-full text-center border-none focus:outline-none focus:ring-0" placeholder="Thèmes exploités..." />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">b) Maternel</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="text" className="w-full text-center border-none focus:outline-none focus:ring-0" placeholder="Thèmes exploités..." />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* III.4. Quelques Indicateurs du Rendement Interne */}
      <div className="mb-6">
        <h4 className="font-bold mb-3">III.4. Quelques Indicateurs du Rendement Interne</h4>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-3 py-2 text-left">Niveau d'Enseignement</th>
                <th className="border border-gray-300 px-3 py-2 text-center">% D'ABANDON</th>
                <th className="border border-gray-300 px-3 py-2 text-center">% DE REUSSITE</th>
                <th className="border border-gray-300 px-3 py-2 text-center">% D'ECHEC</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-3 py-2">A. 6*** Primaire</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">B. 8*** CETB</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">C. 4*** Humanité</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">D. Proportion des diplômés en Mathématiques</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">E. Proportion des Diplômés des Filières Techniques</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* III.5. Quelques Indicateurs du Rendement Externes */}
      <div className="mb-6">
        <h4 className="font-bold mb-3">III.5. Quelques Indicateurs du Rendement Externes (Examens certificatifs)</h4>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-3 py-2 text-left">Niveau d'Enseignement</th>
                <th className="border border-gray-300 px-3 py-2 text-center">% GF</th>
                <th className="border border-gray-300 px-3 py-2 text-center">F</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-3 py-2">A. NIVEAU PRESCOLAIRE</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">a) Espace Communautaire d'Eveil</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">b) Classe Préprimaire</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">c) Maternel</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">C. NIVEAU PRIMAIRE</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">a) Enseignement Spécial (handicap)</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">b) Enseignement Primaire</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">C. NIVEAU SECONDAIRE</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">a) Enseignement Spécial (handicap)</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">b) Enseignement Secondaire Normal</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* III.8. Efficacité Externe du Système Educatif */}
      <div className="mb-6">
        <h4 className="font-bold mb-3">III.8. Efficacité Externe du Système Educatif: Examen, Evaluations certificatives</h4>
        
        {/* A. NIVEAU PRIMAIRE */}
        <div className="mb-4">
          <h5 className="font-medium mb-2">A. NIVEAU PRIMAIRE (Primary Level)</h5>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left">Indicateur</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">Taux (GF)</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">des (Filles)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">1) TAUX D'ABANDON %</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">2) TAUX DE REUSSITE %</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">3) TAUX D'ECHEC %</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* B. NIVEAU SECONDAIRE */}
        <div className="mb-4">
          <h5 className="font-medium mb-2">B. NIVEAU SECONDAIRE</h5>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left">Indicateur</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">Taux (GF)</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">(F)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">1) TAUX D'ABANDON %</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">2) TAUX DE REUSSITE %</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">3) TAUX D'ECHEC %</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* TAUX DIPLÔMES DE FINALISTES (OCDE) */}
        <div className="mb-4">
          <h5 className="font-medium mb-2">TAUX DIPLÔMES DE FINALISTES (OCDE)</h5>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left">Type de Diplôme</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">Taux (GF)</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">(F)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">HUMANITES SCIENTIFIQUES</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">HUMANITES TECHNIQUES</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationQualitativeComplete; 