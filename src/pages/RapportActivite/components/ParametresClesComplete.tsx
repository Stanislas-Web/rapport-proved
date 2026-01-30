import React from 'react';
import { RapportActivite } from '../../../models/RapportActivite';

interface ParametresClesCompleteProps {
  formData: RapportActivite;
  setFormData: React.Dispatch<React.SetStateAction<RapportActivite>>;
}

const ParametresClesComplete: React.FC<ParametresClesCompleteProps> = ({ formData, setFormData }) => {
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
    setFormData(prev => {
      const newData = { ...prev };
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
                      value={formData.parametresCles?.nombreEcolesClasses?.niveauPrimaire?.enseignementSpecial?.nombreEcoles || ''}
                      onChange={(e) => handleInputChange('parametresCles.nombreEcolesClasses.niveauPrimaire.enseignementSpecial.nombreEcoles', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.nombreEcolesClasses?.niveauPrimaire?.enseignementSpecial?.totalClassesSpecialesPrim || ''}
                      onChange={(e) => handleInputChange('parametresCles.nombreEcolesClasses.niveauPrimaire.enseignementSpecial.totalClassesSpecialesPrim', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.nombreEcolesClasses?.niveauPrimaire?.enseignementSpecial?.classesPlethoriques || ''}
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
                      value={formData.parametresCles?.nombreEcolesClasses?.niveauPrimaire?.enseignementPrimaire?.nombreEcoles || ''}
                      onChange={(e) => handleInputChange('parametresCles.nombreEcolesClasses.niveauPrimaire.enseignementPrimaire.nombreEcoles', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.nombreEcolesClasses?.niveauPrimaire?.enseignementPrimaire?.totalClassesPrimaire || ''}
                      onChange={(e) => handleInputChange('parametresCles.nombreEcolesClasses.niveauPrimaire.enseignementPrimaire.totalClassesPrimaire', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.nombreEcolesClasses?.niveauPrimaire?.enseignementPrimaire?.classesPlethoriques || ''}
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
                      value={formData.parametresCles?.effectifScolaire?.niveauSecondaire?.enseignementSpecial?.effectifGarcons || ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauSecondaire.enseignementSpecial.effectifGarcons', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauSecondaire?.enseignementSpecial?.effectifFilles || ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauSecondaire.enseignementSpecial.effectifFilles', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauSecondaire?.enseignementSpecial?.tauxGarcons || ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauSecondaire.enseignementSpecial.tauxGarcons', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauSecondaire?.enseignementSpecial?.tauxFilles || ''}
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
                      value={formData.parametresCles?.effectifScolaire?.niveauSecondaire?.enseignementSecondaire?.septiemeCTEB?.effectifGarcons || ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauSecondaire.enseignementSecondaire.septiemeCTEB.effectifGarcons', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauSecondaire?.enseignementSecondaire?.septiemeCTEB?.effectifFilles || ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauSecondaire.enseignementSecondaire.septiemeCTEB.effectifFilles', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauSecondaire?.enseignementSecondaire?.septiemeCTEB?.tauxGarcons || ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauSecondaire.enseignementSecondaire.septiemeCTEB.tauxGarcons', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauSecondaire?.enseignementSecondaire?.septiemeCTEB?.tauxFilles || ''}
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
                      value={formData.parametresCles?.effectifScolaire?.niveauSecondaire?.enseignementSecondaire?.huitiemeCTEB?.effectifGarcons || ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauSecondaire.enseignementSecondaire.huitiemeCTEB.effectifGarcons', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauSecondaire?.enseignementSecondaire?.huitiemeCTEB?.effectifFilles || ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauSecondaire.enseignementSecondaire.huitiemeCTEB.effectifFilles', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauSecondaire?.enseignementSecondaire?.huitiemeCTEB?.tauxGarcons || ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauSecondaire.enseignementSecondaire.huitiemeCTEB.tauxGarcons', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauSecondaire?.enseignementSecondaire?.huitiemeCTEB?.tauxFilles || ''}
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
                      value={formData.parametresCles?.effectifScolaire?.niveauSecondaire?.enseignementSecondaire?.premiereHumanite?.effectifGarcons || ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauSecondaire.enseignementSecondaire.premiereHumanite.effectifGarcons', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauSecondaire?.enseignementSecondaire?.premiereHumanite?.effectifFilles || ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauSecondaire.enseignementSecondaire.premiereHumanite.effectifFilles', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauSecondaire?.enseignementSecondaire?.premiereHumanite?.tauxGarcons || ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauSecondaire.enseignementSecondaire.premiereHumanite.tauxGarcons', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauSecondaire?.enseignementSecondaire?.premiereHumanite?.tauxFilles || ''}
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
                      value={formData.parametresCles?.effectifScolaire?.niveauSecondaire?.enseignementSecondaire?.quatriemeHumanite?.effectifGarcons || ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauSecondaire.enseignementSecondaire.quatriemeHumanite.effectifGarcons', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauSecondaire?.enseignementSecondaire?.quatriemeHumanite?.effectifFilles || ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauSecondaire.enseignementSecondaire.quatriemeHumanite.effectifFilles', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauSecondaire?.enseignementSecondaire?.quatriemeHumanite?.tauxGarcons || ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauSecondaire.enseignementSecondaire.quatriemeHumanite.tauxGarcons', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauSecondaire?.enseignementSecondaire?.quatriemeHumanite?.tauxFilles || ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauSecondaire.enseignementSecondaire.quatriemeHumanite.tauxFilles', Number(e.target.value))}
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
                      value={formData.parametresCles?.effectifScolaire?.niveauPrimaire?.enseignementSpecial?.effectifGarconsFilles || ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauPrimaire.enseignementSpecial.effectifGarconsFilles', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauPrimaire?.enseignementSpecial?.effectifFilles || ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauPrimaire.enseignementSpecial.effectifFilles', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      step="0.01"
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauPrimaire?.enseignementSpecial?.tauxAccroissementGarconsFilles || ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauPrimaire.enseignementSpecial.tauxAccroissementGarconsFilles', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      step="0.01"
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauPrimaire?.enseignementSpecial?.tauxAccroissementFilles || ''}
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
                      value={formData.parametresCles?.effectifScolaire?.niveauPrimaire?.enseignementPrimaire?.effectifGarconsFilles || ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauPrimaire.enseignementPrimaire.effectifGarconsFilles', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauPrimaire?.enseignementPrimaire?.effectifFilles || ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauPrimaire.enseignementPrimaire.effectifFilles', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      step="0.01"
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauPrimaire?.enseignementPrimaire?.tauxAccroissementGarconsFilles || ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauPrimaire.enseignementPrimaire.tauxAccroissementGarconsFilles', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      step="0.01"
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={formData.parametresCles?.effectifScolaire?.niveauPrimaire?.enseignementPrimaire?.tauxAccroissementFilles || ''}
                      onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauPrimaire.enseignementPrimaire.tauxAccroissementFilles', Number(e.target.value))}
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
