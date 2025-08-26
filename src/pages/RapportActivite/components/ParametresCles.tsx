import React from 'react';
import { RapportActivite } from '../../../models/RapportActivite';

interface ParametresClesProps {
  formData: RapportActivite;
  setFormData: React.Dispatch<React.SetStateAction<RapportActivite>>;
}

const ParametresCles: React.FC<ParametresClesProps> = ({ formData, setFormData }) => {
  // Vérification de sécurité pour s'assurer que les données sont initialisées
  if (!formData || !formData.parametresCles || !formData.parametresCles.nombreEcolesClasses) {
    console.log('🔍 ParametresCles: Données non initialisées, affichage du loader');
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
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h3 className="text-lg font-medium mb-4 text-primary">I. LES QUATRE PARAMETRES CLES DU SYSTEME EDUCATIF</h3>
      <p className="text-sm text-gray-600 mb-4">ECOLE-CLASSE-ELEVE-ENSEIGNANT</p>
      
      {/* I.1. NIVEAU PRESCOLAIRE */}
      <div className="mb-6">
        <h4 className="font-medium mb-3 text-blue-600">I.1. NIVEAU PRESCOLAIRE</h4>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-3 py-2 text-left">Niveau d'Enseignement</th>
                <th className="border border-gray-300 px-3 py-2 text-center">Nbre d'Ecole</th>
                <th className="border border-gray-300 px-3 py-2 text-center">Nbre de Classe</th>
                <th className="border border-gray-300 px-3 py-2 text-center">Effectif Garçons/Filles</th>
                <th className="border border-gray-300 px-3 py-2 text-center">Effectif Filles</th>
                <th className="border border-gray-300 px-3 py-2 text-center">Taux d'accroissement</th>
              </tr>
            </thead>
            <tbody>
              {/* a) Espace Communautaire d'éveil (ECE) */}
              <tr>
                <td className="border border-gray-300 px-3 py-2 font-medium">a) Espace Communautaire d'éveil (ECE)</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input
                    type="number"
                    value={formData.parametresCles.nombreEcolesClasses.niveauPrescolaire.espaceCommunautaireEveil.nombreEcoles || ''}
                    onChange={(e) => handleInputChange('parametresCles.nombreEcolesClasses.niveauPrescolaire.espaceCommunautaireEveil.nombreEcoles', Number(e.target.value))}
                    className="w-full text-center border-none focus:outline-none focus:ring-0"
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input
                    type="number"
                    value={formData.parametresCles.nombreEcolesClasses.niveauPrescolaire.espaceCommunautaireEveil.nombreClasses || ''}
                    onChange={(e) => handleInputChange('parametresCles.nombreEcolesClasses.niveauPrescolaire.espaceCommunautaireEveil.nombreClasses', Number(e.target.value))}
                    className="w-full text-center border-none focus:outline-none focus:ring-0"
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input
                    type="number"
                    value={formData.parametresCles.effectifScolaire.niveauPrescolaire.espaceCommunautaireEveil.effectifGarconsFilles || ''}
                    onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauPrescolaire.espaceCommunautaireEveil.effectifGarconsFilles', Number(e.target.value))}
                    className="w-full text-center border-none focus:outline-none focus:ring-0"
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input
                    type="number"
                    value={formData.parametresCles.effectifScolaire.niveauPrescolaire.espaceCommunautaireEveil.effectifFilles || ''}
                    onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauPrescolaire.espaceCommunautaireEveil.effectifFilles', Number(e.target.value))}
                    className="w-full text-center border-none focus:outline-none focus:ring-0"
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input
                    type="number"
                    step="0.1"
                    value={formData.parametresCles.effectifScolaire.niveauPrescolaire.espaceCommunautaireEveil.tauxAccroissementGarconsFilles || ''}
                    onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauPrescolaire.espaceCommunautaireEveil.tauxAccroissementGarconsFilles', Number(e.target.value))}
                    className="w-full text-center border-none focus:outline-none focus:ring-0"
                  />
                </td>
              </tr>

              {/* b) Maternel */}
              <tr>
                <td className="border border-gray-300 px-3 py-2 font-medium">b) Maternel</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input
                    type="number"
                    value={formData.parametresCles.nombreEcolesClasses.niveauPrescolaire.maternel.nombreEcoles || ''}
                    onChange={(e) => handleInputChange('parametresCles.nombreEcolesClasses.niveauPrescolaire.maternel.nombreEcoles', Number(e.target.value))}
                    className="w-full text-center border-none focus:outline-none focus:ring-0"
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input
                    type="number"
                    value={formData.parametresCles.nombreEcolesClasses.niveauPrescolaire.maternel.nombreClasses || ''}
                    onChange={(e) => handleInputChange('parametresCles.nombreEcolesClasses.niveauPrescolaire.maternel.nombreClasses', Number(e.target.value))}
                    className="w-full text-center border-none focus:outline-none focus:ring-0"
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input
                    type="number"
                    value={formData.parametresCles.effectifScolaire.niveauPrescolaire.maternel.effectifGarconsFilles || ''}
                    onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauPrescolaire.maternel.effectifGarconsFilles', Number(e.target.value))}
                    className="w-full text-center border-none focus:outline-none focus:ring-0"
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input
                    type="number"
                    value={formData.parametresCles.effectifScolaire.niveauPrescolaire.maternel.effectifFilles || ''}
                    onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauPrescolaire.maternel.effectifFilles', Number(e.target.value))}
                    className="w-full text-center border-none focus:outline-none focus:ring-0"
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input
                    type="number"
                    step="0.1"
                    value={formData.parametresCles.effectifScolaire.niveauPrescolaire.maternel.tauxAccroissementGarconsFilles || ''}
                    onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauPrescolaire.maternel.tauxAccroissementGarconsFilles', Number(e.target.value))}
                    className="w-full text-center border-none focus:outline-none focus:ring-0"
                  />
                </td>
              </tr>

              {/* c) Pré-Primaire */}
              <tr>
                <td className="border border-gray-300 px-3 py-2 font-medium">c) Pré-Primaire</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input
                    type="number"
                    value={formData.parametresCles.nombreEcolesClasses.niveauPrescolaire.prePrimaire.nombreEcoles || ''}
                    onChange={(e) => handleInputChange('parametresCles.nombreEcolesClasses.niveauPrescolaire.prePrimaire.nombreEcoles', Number(e.target.value))}
                    className="w-full text-center border-none focus:outline-none focus:ring-0"
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input
                    type="number"
                    value={formData.parametresCles.nombreEcolesClasses.niveauPrescolaire.prePrimaire.nombreClasses || ''}
                    onChange={(e) => handleInputChange('parametresCles.nombreEcolesClasses.niveauPrescolaire.prePrimaire.nombreClasses', Number(e.target.value))}
                    className="w-full text-center border-none focus:outline-none focus:ring-0"
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input
                    type="number"
                    value={formData.parametresCles.effectifScolaire.niveauPrescolaire.prePrimaire.effectifGarconsFilles || ''}
                    onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauPrescolaire.prePrimaire.effectifGarconsFilles', Number(e.target.value))}
                    className="w-full text-center border-none focus:outline-none focus:ring-0"
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input
                    type="number"
                    value={formData.parametresCles.effectifScolaire.niveauPrescolaire.prePrimaire.effectifFilles || ''}
                    onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauPrescolaire.prePrimaire.effectifFilles', Number(e.target.value))}
                    className="w-full text-center border-none focus:outline-none focus:ring-0"
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input
                    type="number"
                    step="0.1"
                    value={formData.parametresCles.effectifScolaire.niveauPrescolaire.prePrimaire.tauxAccroissementGarconsFilles || ''}
                    onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauPrescolaire.prePrimaire.tauxAccroissementGarconsFilles', Number(e.target.value))}
                    className="w-full text-center border-none focus:outline-none focus:ring-0"
                  />
                </td>
              </tr>

              {/* d) Spécial */}
              <tr>
                <td className="border border-gray-300 px-3 py-2 font-medium">d) Spécial</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input
                    type="number"
                    value={formData.parametresCles.nombreEcolesClasses.niveauPrescolaire.special.nombreEcoles || ''}
                    onChange={(e) => handleInputChange('parametresCles.nombreEcolesClasses.niveauPrescolaire.special.nombreEcoles', Number(e.target.value))}
                    className="w-full text-center border-none focus:outline-none focus:ring-0"
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input
                    type="number"
                    value={formData.parametresCles.nombreEcolesClasses.niveauPrescolaire.special.nombreClasses || ''}
                    onChange={(e) => handleInputChange('parametresCles.nombreEcolesClasses.niveauPrescolaire.special.nombreClasses', Number(e.target.value))}
                    className="w-full text-center border-none focus:outline-none focus:ring-0"
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input
                    type="number"
                    value={formData.parametresCles.effectifScolaire.niveauPrescolaire.special.effectifGarconsFilles || ''}
                    onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauPrescolaire.special.effectifGarconsFilles', Number(e.target.value))}
                    className="w-full text-center border-none focus:outline-none focus:ring-0"
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input
                    type="number"
                    value={formData.parametresCles.effectifScolaire.niveauPrescolaire.special.effectifFilles || ''}
                    onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauPrescolaire.special.effectifFilles', Number(e.target.value))}
                    className="w-full text-center border-none focus:outline-none focus:ring-0"
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input
                    type="number"
                    step="0.1"
                    value={formData.parametresCles.effectifScolaire.niveauPrescolaire.special.tauxAccroissementGarconsFilles || ''}
                    onChange={(e) => handleInputChange('parametresCles.effectifScolaire.niveauPrescolaire.special.tauxAccroissementGarconsFilles', Number(e.target.value))}
                    className="w-full text-center border-none focus:outline-none focus:ring-0"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Message informatif */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
        <p className="text-blue-800 text-sm">
          <strong>Note :</strong> Ce composant affiche les données de base. Pour une saisie complète et détaillée, 
          veuillez utiliser le composant "Paramètres Clés (Suite)" qui contient tous les niveaux d'enseignement.
        </p>
      </div>
    </div>
  );
};

export default ParametresCles;
