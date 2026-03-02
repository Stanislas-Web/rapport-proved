import React from 'react';
import { RapportActivite } from '../../../models/RapportActivite';

interface ParametresClesCompleteProps {
  formData: RapportActivite;
  setFormData: React.Dispatch<React.SetStateAction<RapportActivite>>;
  onInputChange?: (field: string, value: any) => void;
  previousYearEffectifs?: any;
}

const ParametresClesComplete: React.FC<ParametresClesCompleteProps> = ({ formData, setFormData, onInputChange, previousYearEffectifs }) => {
  // Vérification de sécurité pour s'assurer que les données sont initialisées
  if (!formData || !formData.parametresCles || !formData.parametresCles.nombreEcolesClasses) {
    console.log('🔍 ParametresClesComplete: Données non initialisées, affichage du loader');
    return (
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-500">Chargement des données...</p>
          </div>
        </div>
      </div>
    );
  }

  const handleInputChange = (path: string, value: number | string) => {
    // DEBUG CRITIQUE — ce log DOIT apparaître dans la console du navigateur
    if (path.includes('effectifScolaire') && !path.includes('taux')) {
      console.log('🔴🔴🔴 ParametresClesComplete handleInputChange:', path, '=', value);
      console.log('🔴🔴🔴 previousYearEffectifs PROP =', previousYearEffectifs ? JSON.stringify(previousYearEffectifs).substring(0, 200) : 'NULL ❌❌❌');
    }
    
    setFormData(prev => {
      const newData = JSON.parse(JSON.stringify(prev)); // Deep clone pour immutabilité
      const keys = path.split('.');
      let current: any = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      // Arrondir les nombres à 2 décimales, laisser les strings telles quelles
      const finalValue = typeof value === 'number' ? Math.round(value * 100) / 100 : value;
      current[keys[keys.length - 1]] = finalValue;
      
      // Auto-calcul des taux d'accroissement quand un champ effectif change
      // Formule: Taux = ((Effectif_N - Effectif_N-1) / Effectif_N-1) × 100
      const isTauxField = path.includes('tauxAccroissement') || 
                           (path.includes('tauxGarcons') && path.includes('effectifScolaire')) || 
                           (path.includes('tauxFilles') && path.includes('effectifScolaire'));
      
      if (previousYearEffectifs && path.includes('effectifScolaire') && !isTauxField) {
        // Niveau Préscolaire
        ['espaceCommunautaireEveil', 'maternel', 'prePrimaire', 'special'].forEach(niveau => {
          const prevData = previousYearEffectifs.niveauPrescolaire?.[niveau];
          const curData = newData.parametresCles?.effectifScolaire?.niveauPrescolaire?.[niveau];
          if (prevData && curData) {
            const prevGF = Number(prevData.effectifGarconsFilles) || 0;
            const curGF = Number(curData.effectifGarconsFilles) || 0;
            const prevF = Number(prevData.effectifFilles) || 0;
            const curF = Number(curData.effectifFilles) || 0;
            if (prevGF > 0 && curGF > 0) {
              curData.tauxAccroissementGarconsFilles = Math.round(((curGF - prevGF) / prevGF) * 100 * 1000) / 1000;
            }
            if (prevF > 0 && curF > 0) {
              curData.tauxAccroissementFilles = Math.round(((curF - prevF) / prevF) * 100 * 1000) / 1000;
            }
          }
        });
        
        // Niveau Primaire
        ['enseignementSpecial', 'enseignementPrimaire'].forEach(niveau => {
          const prevData = previousYearEffectifs.niveauPrimaire?.[niveau];
          const curData = newData.parametresCles?.effectifScolaire?.niveauPrimaire?.[niveau];
          if (prevData && curData) {
            const prevGF = Number(prevData.effectifGarconsFilles) || 0;
            const curGF = Number(curData.effectifGarconsFilles) || 0;
            const prevF = Number(prevData.effectifFilles) || 0;
            const curF = Number(curData.effectifFilles) || 0;
            if (prevGF > 0 && curGF > 0) {
              curData.tauxAccroissementGarconsFilles = Math.round(((curGF - prevGF) / prevGF) * 100 * 1000) / 1000;
            }
            if (prevF > 0 && curF > 0) {
              curData.tauxAccroissementFilles = Math.round(((curF - prevF) / prevF) * 100 * 1000) / 1000;
            }
          }
        });
        
        // Niveau Secondaire - Enseignement Spécial
        const prevSecSp = previousYearEffectifs.niveauSecondaire?.enseignementSpecial;
        const curSecSp = newData.parametresCles?.effectifScolaire?.niveauSecondaire?.enseignementSpecial;
        if (prevSecSp && curSecSp) {
          const prevG = Number(prevSecSp.effectifGarcons) || 0;
          const curG = Number(curSecSp.effectifGarcons) || 0;
          const prevF = Number(prevSecSp.effectifFilles) || 0;
          const curF = Number(curSecSp.effectifFilles) || 0;
          if (prevG > 0 && curG > 0) {
            curSecSp.tauxGarcons = Math.round(((curG - prevG) / prevG) * 100 * 1000) / 1000;
          }
          if (prevF > 0 && curF > 0) {
            curSecSp.tauxFilles = Math.round(((curF - prevF) / prevF) * 100 * 1000) / 1000;
          }
        }
        
        // Niveau Secondaire - Enseignement Secondaire
        ['septiemeCTEB', 'huitiemeCTEB', 'premiereHumanite', 'quatriemeHumanite'].forEach(classe => {
          const prevData = previousYearEffectifs.niveauSecondaire?.enseignementSecondaire?.[classe];
          const curData = newData.parametresCles?.effectifScolaire?.niveauSecondaire?.enseignementSecondaire?.[classe];
          if (prevData && curData) {
            const prevG = Number(prevData.effectifGarcons) || 0;
            const curG = Number(curData.effectifGarcons) || 0;
            const prevF = Number(prevData.effectifFilles) || 0;
            const curF = Number(curData.effectifFilles) || 0;
            if (prevG > 0 && curG > 0) {
              curData.tauxGarcons = Math.round(((curG - prevG) / prevG) * 100 * 1000) / 1000;
            }
            if (prevF > 0 && curF > 0) {
              curData.tauxFilles = Math.round(((curF - prevF) / prevF) * 100 * 1000) / 1000;
            }
          }
        });
      }
      
      return newData;
    });
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h3 className="text-lg font-medium mb-4 text-primary">I. LES QUATRE PARAMETRES CLES DU SYSTEME EDUCATIF (SUITE)</h3>
      
      {/* I.1.1. NOMBRE D'ECOLES ET DE CLASSES */}
      <div className="mb-6">
        <h4 className="font-medium mb-3 text-blue-600">I.1.1. NOMBRE D'ECOLES ET DE CLASSES</h4>
        
        {/* NIVEAU PRESCOLAIRE */}
        <div className="mb-4">
          <h5 className="font-medium mb-2">NIVEAU PRESCOLAIRE</h5>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left">Type d'Enseignement</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">Nombre d'Ecoles</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">Nombre de Classes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">Espace Communautaire d'éveil (ECE)</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.nombreEcolesClasses?.niveauPrescolaire?.espaceCommunautaireEveil?.nombreEcoles ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.nombreEcolesClasses.niveauPrescolaire.espaceCommunautaireEveil.nombreEcoles', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.nombreEcolesClasses?.niveauPrescolaire?.espaceCommunautaireEveil?.nombreClasses ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.nombreEcolesClasses.niveauPrescolaire.espaceCommunautaireEveil.nombreClasses', Number(e.target.value))}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">Maternel</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.nombreEcolesClasses?.niveauPrescolaire?.maternel?.nombreEcoles ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.nombreEcolesClasses.niveauPrescolaire.maternel.nombreEcoles', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.nombreEcolesClasses?.niveauPrescolaire?.maternel?.nombreClasses ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.nombreEcolesClasses.niveauPrescolaire.maternel.nombreClasses', Number(e.target.value))}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">Pré-Primaire</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.nombreEcolesClasses?.niveauPrescolaire?.prePrimaire?.nombreEcoles ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.nombreEcolesClasses.niveauPrescolaire.prePrimaire.nombreEcoles', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.nombreEcolesClasses?.niveauPrescolaire?.prePrimaire?.nombreClasses ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.nombreEcolesClasses.niveauPrescolaire.prePrimaire.nombreClasses', Number(e.target.value))}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">Spécial (handicap)</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.nombreEcolesClasses?.niveauPrescolaire?.special?.nombreEcoles ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.nombreEcolesClasses.niveauPrescolaire.special.nombreEcoles', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.nombreEcolesClasses?.niveauPrescolaire?.special?.nombreClasses ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.nombreEcolesClasses.niveauPrescolaire.special.nombreClasses', Number(e.target.value))}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* NIVEAU PRIMAIRE */}
        <div className="mb-4">
          <h5 className="font-medium mb-2">NIVEAU PRIMAIRE</h5>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left">Type d'Enseignement</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">Nombre d'Ecoles</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">Total Classes</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">Classes Pléthoriques</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">Enseignement Spécial (handicap)</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.nombreEcolesClasses?.niveauPrimaire?.enseignementSpecial?.nombreEcoles ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.nombreEcolesClasses.niveauPrimaire.enseignementSpecial.nombreEcoles', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.nombreEcolesClasses?.niveauPrimaire?.enseignementSpecial?.totalClassesSpecialesPrim ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.nombreEcolesClasses.niveauPrimaire.enseignementSpecial.totalClassesSpecialesPrim', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.nombreEcolesClasses?.niveauPrimaire?.enseignementSpecial?.classesPlethoriques ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.nombreEcolesClasses.niveauPrimaire.enseignementSpecial.classesPlethoriques', Number(e.target.value))}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">Enseignement Primaire</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.nombreEcolesClasses?.niveauPrimaire?.enseignementPrimaire?.nombreEcoles ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.nombreEcolesClasses.niveauPrimaire.enseignementPrimaire.nombreEcoles', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.nombreEcolesClasses?.niveauPrimaire?.enseignementPrimaire?.totalClassesPrimaire ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.nombreEcolesClasses.niveauPrimaire.enseignementPrimaire.totalClassesPrimaire', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.nombreEcolesClasses?.niveauPrimaire?.enseignementPrimaire?.classesPlethoriques ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.nombreEcolesClasses.niveauPrimaire.enseignementPrimaire.classesPlethoriques', Number(e.target.value))}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* NIVEAU SECONDAIRE */}
        <div className="mb-4">
          <h5 className="font-medium mb-2">NIVEAU SECONDAIRE</h5>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left">Type d'Enseignement</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">Nombre d'Écoles</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">Total Classes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">Enseignement Spécial (handicap)</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.nombreEcolesClasses?.niveauSecondaire?.enseignementSpecial?.nombreEcoles ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.nombreEcolesClasses.niveauSecondaire.enseignementSpecial.nombreEcoles', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.nombreEcolesClasses?.niveauSecondaire?.enseignementSpecial?.totalClassesSpecialesSec ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.nombreEcolesClasses.niveauSecondaire.enseignementSpecial.totalClassesSpecialesSec', Number(e.target.value))}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">Enseignement Secondaire - Nombre d'Écoles</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.nombreEcolesClasses?.niveauSecondaire?.enseignementSecondaire?.nombreEcoles ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.nombreEcolesClasses.niveauSecondaire.enseignementSecondaire.nombreEcoles', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.nombreEcolesClasses?.niveauSecondaire?.enseignementSecondaire?.totalClassesSecondaire ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.nombreEcolesClasses.niveauSecondaire.enseignementSecondaire.totalClassesSecondaire', Number(e.target.value))}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">1er Cycle - Classes 7ème CTEB</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.nombreEcolesClasses?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.nombreEcoles7eme ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.nombreEcolesClasses.niveauSecondaire.enseignementSecondaire.premierCycle.nombreEcoles7eme', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.nombreEcolesClasses?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.classes7emeCTEB ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.nombreEcolesClasses.niveauSecondaire.enseignementSecondaire.premierCycle.classes7emeCTEB', Number(e.target.value))}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">1er Cycle - Classes 8ème CTEB</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.nombreEcolesClasses?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.nombreEcoles8eme ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.nombreEcolesClasses.niveauSecondaire.enseignementSecondaire.premierCycle.nombreEcoles8eme', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.nombreEcolesClasses?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.classes8emeCTEB ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.nombreEcolesClasses.niveauSecondaire.enseignementSecondaire.premierCycle.classes8emeCTEB', Number(e.target.value))}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">2ème Cycle - Total Classes Humanités</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.nombreEcolesClasses?.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.nombreEcolesHumanites ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.nombreEcolesClasses.niveauSecondaire.enseignementSecondaire.deuxiemeCycle.nombreEcolesHumanites', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.nombreEcolesClasses?.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.totalClassesHumanites ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.nombreEcolesClasses.niveauSecondaire.enseignementSecondaire.deuxiemeCycle.totalClassesHumanites', Number(e.target.value))}
                    />
                  </td>
                </tr>
                <tr className="bg-gray-50 font-medium">
                  <td className="border border-gray-300 px-3 py-2">Total Classes 1er & 2ème Cycle</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.nombreEcolesClasses?.niveauSecondaire?.enseignementSecondaire?.nombreEcoles1er2emeCycle ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.nombreEcolesClasses.niveauSecondaire.enseignementSecondaire.nombreEcoles1er2emeCycle', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.nombreEcolesClasses?.niveauSecondaire?.enseignementSecondaire?.totalClasses1er2emeCycle ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.nombreEcolesClasses.niveauSecondaire.enseignementSecondaire.totalClasses1er2emeCycle', Number(e.target.value))}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* I.1.2. EFFECTIF SCOLAIRE ET TAUX D'ACCROISSEMENT */}
      <div className="mb-6">
        <h4 className="font-medium mb-3 text-blue-600">I.1.2. EFFECTIF SCOLAIRE ET TAUX D'ACCROISSEMENT</h4>
        
        {/* Indicateur de données année précédente */}
        {previousYearEffectifs ? (
          <div className="bg-green-50 border border-green-200 rounded p-2 mb-3 text-sm text-green-700">
            ✅ Données année précédente chargées — les taux seront calculés automatiquement.
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded p-2 mb-3 text-sm text-amber-700">
            ⚠️ Données année précédente non disponibles — veuillez d'abord remplir les effectifs via le bouton "Effectifs de l'année précédente" ci-dessus, puis les taux seront calculés automatiquement.
          </div>
        )}
        
        {/* NIVEAU PRESCOLAIRE */}
        <div className="mb-4">
          <h5 className="font-medium mb-2">NIVEAU PRESCOLAIRE</h5>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left">Type d'Enseignement</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">Effectif Garçons/Filles</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">Effectif Filles</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">Taux Accroissement G/F</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">Taux Accroissement Filles</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">Espace Communautaire d'éveil (ECE)</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauPrescolaire?.espaceCommunautaireEveil?.effectifGarconsFilles ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauPrescolaire.espaceCommunautaireEveil.effectifGarconsFilles', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauPrescolaire?.espaceCommunautaireEveil?.effectifFilles ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauPrescolaire.espaceCommunautaireEveil.effectifFilles', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      step="0.01"
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauPrescolaire?.espaceCommunautaireEveil?.tauxAccroissementGarconsFilles ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauPrescolaire.espaceCommunautaireEveil.tauxAccroissementGarconsFilles', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      step="0.01"
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauPrescolaire?.espaceCommunautaireEveil?.tauxAccroissementFilles ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauPrescolaire.espaceCommunautaireEveil.tauxAccroissementFilles', Number(e.target.value))}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">Maternel</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauPrescolaire?.maternel?.effectifGarconsFilles ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauPrescolaire.maternel.effectifGarconsFilles', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauPrescolaire?.maternel?.effectifFilles ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauPrescolaire.maternel.effectifFilles', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      step="0.01"
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauPrescolaire?.maternel?.tauxAccroissementGarconsFilles ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauPrescolaire.maternel.tauxAccroissementGarconsFilles', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      step="0.01"
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauPrescolaire?.maternel?.tauxAccroissementFilles ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauPrescolaire.maternel.tauxAccroissementFilles', Number(e.target.value))}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">Pré-Primaire</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauPrescolaire?.prePrimaire?.effectifGarconsFilles ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauPrescolaire.prePrimaire.effectifGarconsFilles', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauPrescolaire?.prePrimaire?.effectifFilles ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauPrescolaire.prePrimaire.effectifFilles', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      step="0.01"
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauPrescolaire?.prePrimaire?.tauxAccroissementGarconsFilles ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauPrescolaire.prePrimaire.tauxAccroissementGarconsFilles', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      step="0.01"
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauPrescolaire?.prePrimaire?.tauxAccroissementFilles ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauPrescolaire.prePrimaire.tauxAccroissementFilles', Number(e.target.value))}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">Spécial (handicap)</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauPrescolaire?.special?.effectifGarconsFilles ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauPrescolaire.special.effectifGarconsFilles', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauPrescolaire?.special?.effectifFilles ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauPrescolaire.special.effectifFilles', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      step="0.01"
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauPrescolaire?.special?.tauxAccroissementGarconsFilles ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauPrescolaire.special.tauxAccroissementGarconsFilles', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      step="0.01"
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauPrescolaire?.special?.tauxAccroissementFilles ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauPrescolaire.special.tauxAccroissementFilles', Number(e.target.value))}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* NIVEAU PRIMAIRE */}
        <div className="mb-4">
          <h5 className="font-medium mb-2">NIVEAU PRIMAIRE</h5>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left">Type d'Enseignement</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">Effectif Garçons/Filles</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">Effectif Filles</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">Taux Accroissement G/F</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">Taux Accroissement Filles</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">Enseignement Spécial (handicap)</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauPrimaire?.enseignementSpecial?.effectifGarconsFilles ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauPrimaire.enseignementSpecial.effectifGarconsFilles', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauPrimaire?.enseignementSpecial?.effectifFilles ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauPrimaire.enseignementSpecial.effectifFilles', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      step="0.01"
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauPrimaire?.enseignementSpecial?.tauxAccroissementGarconsFilles ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauPrimaire.enseignementSpecial.tauxAccroissementGarconsFilles', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      step="0.01"
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauPrimaire?.enseignementSpecial?.tauxAccroissementFilles ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauPrimaire.enseignementSpecial.tauxAccroissementFilles', Number(e.target.value))}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">Enseignement Primaire</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauPrimaire?.enseignementPrimaire?.effectifGarconsFilles ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauPrimaire.enseignementPrimaire.effectifGarconsFilles', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauPrimaire?.enseignementPrimaire?.effectifFilles ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauPrimaire.enseignementPrimaire.effectifFilles', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      step="0.01"
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauPrimaire?.enseignementPrimaire?.tauxAccroissementGarconsFilles ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauPrimaire.enseignementPrimaire.tauxAccroissementGarconsFilles', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      step="0.01"
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauPrimaire?.enseignementPrimaire?.tauxAccroissementFilles ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauPrimaire.enseignementPrimaire.tauxAccroissementFilles', Number(e.target.value))}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* NIVEAU SECONDAIRE */}
        <div className="mb-4">
          <h5 className="font-medium mb-2">NIVEAU SECONDAIRE</h5>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left">Type d'Enseignement</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">Effectif Garçons</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">Effectif Filles</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">Taux Garçons</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">Taux Filles</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">Enseignement Spécial (handicap)</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauSecondaire?.enseignementSpecial?.effectifGarcons ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauSecondaire.enseignementSpecial.effectifGarcons', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauSecondaire?.enseignementSpecial?.effectifFilles ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauSecondaire.enseignementSpecial.effectifFilles', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauSecondaire?.enseignementSpecial?.tauxGarcons ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauSecondaire.enseignementSpecial.tauxGarcons', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauSecondaire?.enseignementSpecial?.tauxFilles ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauSecondaire.enseignementSpecial.tauxFilles', Number(e.target.value))}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">7ème CTEB</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauSecondaire?.enseignementSecondaire?.septiemeCTEB?.effectifGarcons ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauSecondaire.enseignementSecondaire.septiemeCTEB.effectifGarcons', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauSecondaire?.enseignementSecondaire?.septiemeCTEB?.effectifFilles ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauSecondaire.enseignementSecondaire.septiemeCTEB.effectifFilles', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauSecondaire?.enseignementSecondaire?.septiemeCTEB?.tauxGarcons ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauSecondaire.enseignementSecondaire.septiemeCTEB.tauxGarcons', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauSecondaire?.enseignementSecondaire?.septiemeCTEB?.tauxFilles ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauSecondaire.enseignementSecondaire.septiemeCTEB.tauxFilles', Number(e.target.value))}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">8ème CTEB</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauSecondaire?.enseignementSecondaire?.huitiemeCTEB?.effectifGarcons ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauSecondaire.enseignementSecondaire.huitiemeCTEB.effectifGarcons', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauSecondaire?.enseignementSecondaire?.huitiemeCTEB?.effectifFilles ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauSecondaire.enseignementSecondaire.huitiemeCTEB.effectifFilles', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauSecondaire?.enseignementSecondaire?.huitiemeCTEB?.tauxGarcons ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauSecondaire.enseignementSecondaire.huitiemeCTEB.tauxGarcons', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauSecondaire?.enseignementSecondaire?.huitiemeCTEB?.tauxFilles ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauSecondaire.enseignementSecondaire.huitiemeCTEB.tauxFilles', Number(e.target.value))}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">1ère Humanité</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauSecondaire?.enseignementSecondaire?.premiereHumanite?.effectifGarcons ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauSecondaire.enseignementSecondaire.premiereHumanite.effectifGarcons', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauSecondaire?.enseignementSecondaire?.premiereHumanite?.effectifFilles ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauSecondaire.enseignementSecondaire.premiereHumanite.effectifFilles', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauSecondaire?.enseignementSecondaire?.premiereHumanite?.tauxGarcons ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauSecondaire.enseignementSecondaire.premiereHumanite.tauxGarcons', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauSecondaire?.enseignementSecondaire?.premiereHumanite?.tauxFilles ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauSecondaire.enseignementSecondaire.premiereHumanite.tauxFilles', Number(e.target.value))}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">4ème Humanité</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauSecondaire?.enseignementSecondaire?.quatriemeHumanite?.effectifGarcons ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauSecondaire.enseignementSecondaire.quatriemeHumanite.effectifGarcons', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauSecondaire?.enseignementSecondaire?.quatriemeHumanite?.effectifFilles ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauSecondaire.enseignementSecondaire.quatriemeHumanite.effectifFilles', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauSecondaire?.enseignementSecondaire?.quatriemeHumanite?.tauxGarcons ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauSecondaire.enseignementSecondaire.quatriemeHumanite.tauxGarcons', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauSecondaire?.enseignementSecondaire?.quatriemeHumanite?.tauxFilles ?? ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauSecondaire.enseignementSecondaire.quatriemeHumanite.tauxFilles', Number(e.target.value))}
                    />
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

export default ParametresClesComplete;
