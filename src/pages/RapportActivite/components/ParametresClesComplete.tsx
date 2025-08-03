import React from 'react';
import { RapportActivite } from '../../../models/RapportActivite';

interface ParametresClesCompleteProps {
  formData: RapportActivite;
  setFormData: React.Dispatch<React.SetStateAction<RapportActivite>>;
}

const ParametresClesComplete: React.FC<ParametresClesCompleteProps> = ({ formData, setFormData }) => {
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h3 className="text-lg font-medium mb-4 text-primary">I. LES QUATRE PARAMETRES CLES DU SYSTEME EDUCATIF (SUITE)</h3>
      
      {/* I.1.2. NIVEAU PRIMAIRE */}
      <div className="mb-6">
        <h4 className="font-medium mb-3 text-blue-600">I.1.2. NIVEAU PRIMAIRE</h4>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-3 py-2 text-left">Niveau d'Enseignement</th>
                <th className="border border-gray-300 px-3 py-2 text-center">Nbre d'Ecole</th>
                <th className="border border-gray-300 px-3 py-2 text-center">Nbre de Classe</th>
                <th className="border border-gray-300 px-3 py-2 text-center">Effectif Garçons</th>
                <th className="border border-gray-300 px-3 py-2 text-center">Effectif Filles</th>
                <th className="border border-gray-300 px-3 py-2 text-center">Taux d'accroissement</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-3 py-2 font-medium">a) Enseignement Spécial (handicap)</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                </td>
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
                <td className="border border-gray-300 px-3 py-2 font-medium">b) Enseignement Primaire</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                </td>
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

      {/* I.1.3. NIVEAU SECONDAIRE */}
      <div className="mb-6">
        <h4 className="font-medium mb-3 text-blue-600">I.1.3. NIVEAU SECONDAIRE</h4>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-3 py-2 text-left">Niveau d'Enseignement</th>
                <th className="border border-gray-300 px-3 py-2 text-center">Nbre d'Ecole</th>
                <th className="border border-gray-300 px-3 py-2 text-center">Nbre de Classe</th>
                <th className="border border-gray-300 px-3 py-2 text-center">Effectif Garçons</th>
                <th className="border border-gray-300 px-3 py-2 text-center">Effectif Filles</th>
                <th className="border border-gray-300 px-3 py-2 text-center">Taux d'accroissement</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-3 py-2 font-medium">a) Enseignement Spécial (handicap)</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                </td>
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
                <td className="border border-gray-300 px-3 py-2 font-medium">b) Enseignement Secondaire</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                </td>
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

      {/* I.2. Effectif Scolaire et Taux d'accroissement */}
      <div className="mb-6">
        <h4 className="font-medium mb-3 text-blue-600">I.2. Effectif Scolaire et Taux d'accroissement</h4>
        
        {/* I.2.1. NIVEAU PRESCOLAIRE */}
        <div className="mb-4">
          <h5 className="font-medium mb-2">I.2.1. NIVEAU PRESCOLAIRE</h5>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left">Niveau d'Enseignement</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">Effectif Elèves au Préscolaire</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">Taux d'accroissement par rapport à l'année antérieure</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">a) Espace Communautaire d'éveil (ECE)</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">b) Maternel</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">c) Pré-Primaire</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">d) Spécial (handicap)</td>
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

        {/* I.2.2. NIVEAU PRIMAIRE */}
        <div className="mb-4">
          <h5 className="font-medium mb-2">I.2.2. NIVEAU PRIMAIRE</h5>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left">Niveau d'Enseignement</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">Effectif Elèves au Primaire</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">Taux d'accroissement par rapport à l'année antérieure</th>
                </tr>
              </thead>
              <tbody>
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
              </tbody>
            </table>
          </div>
        </div>

        {/* I.2.3. NIVEAU SECONDAIRE */}
        <div className="mb-4">
          <h5 className="font-medium mb-2">I.2.3. NIVEAU SECONDAIRE</h5>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left">Niveau d'Enseignement</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">Effectif Elèves au Secondaire</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">Taux d'accroissement par rapport à l'année antérieure</th>
                </tr>
              </thead>
              <tbody>
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
                  <td className="border border-gray-300 px-3 py-2">b) Enseignement Secondaire</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">de 7e CTEB</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">de 8e CTEB</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">de 1re Hum</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">de 4ème Hum</td>
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

export default ParametresClesComplete; 