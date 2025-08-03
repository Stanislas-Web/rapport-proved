import React from 'react';
import { RapportActivite } from '../../../models/RapportActivite';

interface GouvernanceProps {
  formData: RapportActivite;
  setFormData: React.Dispatch<React.SetStateAction<RapportActivite>>;
}

const Gouvernance: React.FC<GouvernanceProps> = ({ formData, setFormData }) => {
  const handleChange = (field: keyof RapportActivite, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h3 className="text-lg font-medium mb-4 text-primary">IV. GOUVERNANCE (GESTION ET PILOTAGE DU SOUS-SECTEUR)</h3>
      {/* IV.8. Vulgarisation des Instructions Officielles */}
      <div className="mb-6">
        <h4 className="font-bold mb-3">IV.8. Vulgarisation des Instructions Officielles</h4>
        <p className="text-sm text-gray-600 mb-2">en Indiquer les Principales et mettre en exergue particulièrement la mise en pratique de celles relatives à la Nouvelle Citoyenneté</p>
        <p className="text-sm text-gray-600 mb-4">(10 lignes au maximum)</p>
        <textarea
          className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Entrez les instructions officielles vulgarisées..."
        />
      </div>

      {/* IV.9. Formation des Gestionnaires des BG Provinciaux et de Proximité */}
      <div className="mb-6">
        <h4 className="font-bold mb-3">IV.9. Formation des Gestionnaires des BG Provinciaux et de Proximité</h4>
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
                  <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">En Management Scolaire</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">En Calcul, analyse, interprétations des indicateurs statistiques</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">En Gestion d'une entité éducationnelle</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">Planification</td>
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
        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">Bref commentaire sur le module exploité</label>
          <textarea
            className="w-full h-20 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Commentaire sur le module..."
          />
        </div>
      </div>
    </div>
  );
};

export default Gouvernance; 