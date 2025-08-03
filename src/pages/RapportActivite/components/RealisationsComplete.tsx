import React from 'react';
import { RapportActivite } from '../../../models/RapportActivite';

interface RealisationsCompleteProps {
  formData: RapportActivite;
  setFormData: React.Dispatch<React.SetStateAction<RapportActivite>>;
}

const RealisationsComplete: React.FC<RealisationsCompleteProps> = () => {
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
                <td className="border border-gray-300 px-3 py-2">Primaire</td>
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
                <td className="border border-gray-300 px-3 py-2">Secondaire</td>
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
                <td className="border border-gray-300 px-3 py-2">Spécial (handicap: Tout niveau confondu)</td>
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

      {/* IV.3. Fonctionnement des Comités Provinciaux */}
      <div className="mb-6">
        <h4 className="font-bold mb-3">IV.3. Fonctionnement des Comités Provinciaux</h4>
        
        {/* IV.3.1. Comité Provincial de l'EDU-NC */}
        <div className="mb-4">
          <h5 className="font-bold mb-2">IV.3.1. Comité Provincial de l'EDU-NC: Fréquence des Réunions</h5>
          <p className="text-sm text-gray-600 mb-2">Quelques Principaux points traités (10 lignes au maximum)</p>
          <textarea
            className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Décrivez les points traités..."
          />
        </div>

        {/* IV.3.2. Comité Provincial de l'ENAFP */}
        <div className="mb-4">
          <h5 className="font-bold mb-2">IV.3.2. Comité Provincial de l'ENAFP</h5>
          <textarea
            className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Décrivez les activités du comité..."
          />
        </div>

        {/* IV.3.3. Comité Provincial de TENASOSP */}
        <div className="mb-4">
          <h5 className="font-bold mb-2">IV.3.3. Comité Provincial de TENASOSP</h5>
          <p className="text-sm text-gray-600 mb-2">Quelques Principaux points traités (10 lignes au maximum)</p>
          <textarea
            className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Décrivez les points traités..."
          />
        </div>

        {/* IV.3.4. Comité Provincial d'EXAMEN D'ETAT */}
        <div className="mb-4">
          <h5 className="font-bold mb-2">IV.3.4. Comité Provincial d'EXAMEN D'ETAT</h5>
          <p className="text-sm text-gray-600 mb-2">Quelques Principaux points traités (10 lignes au maximum)</p>
          <textarea
            className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Décrivez les points traités..."
          />
        </div>
      </div>

      {/* IV.5. Vulgarisation des Instructions Officielles */}
      <div className="mb-6">
        <h4 className="font-bold mb-3">IV.5. Vulgarisation des Instructions Officielles</h4>
        <p className="text-sm text-gray-600 mb-2">en Indiquer les Principales et mettre en exergue particulièrement la mise en pratique de celles relatives à la Nouvelle Citoyenneté</p>
        <p className="text-sm text-gray-600 mb-4">(10 lignes au maximum)</p>
        <textarea
          className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Entrez les instructions officielles vulgarisées..."
        />
      </div>

      {/* IV.6. Fonctionnement des Groupes d'aides Psychopédagogiques */}
      <div className="mb-6">
        <h4 className="font-bold mb-3">IV.6. Fonctionnement des Groupes d'aides Psychopédagogiques</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">NBRE DE GAP MIS EN PLACE</label>
            <input type="number" className="w-full p-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">NBRE DE GAP OPERATIONNEL</label>
            <input type="number" className="w-full p-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">NBRE DE CAS PRIS EN CHARGE</label>
            <input type="number" className="w-full p-2 border border-gray-300 rounded-md" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Principaux problèmes identifiés</label>
            <textarea
              className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Décrivez les problèmes..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Solutions Préconisées</label>
            <textarea
              className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Décrivez les solutions..."
            />
          </div>
        </div>
      </div>

      {/* IV.7. Acquisitions des Matériels Informatique et Roulant */}
      <div className="mb-6">
        <h4 className="font-bold mb-3">IV.7. Acquisitions des Matériels Informatique et Roulant</h4>
        
        {/* A. ECOLES */}
        <div className="mb-4">
          <h5 className="font-medium mb-2">A. ECOLES: Nature</h5>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">GVT:</label>
              <input type="text" className="w-full p-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Projet:</label>
              <input type="text" className="w-full p-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">PTFS:</label>
              <input type="text" className="w-full p-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">ONG:</label>
              <input type="text" className="w-full p-2 border border-gray-300 rounded-md" />
            </div>
          </div>
        </div>

        {/* B. BUREAUX GESTIONNAIRE */}
        <div className="mb-4">
          <h5 className="font-medium mb-2">B. BUREAUX GESTIONNAIRE: Nature</h5>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">GVT:</label>
              <input type="text" className="w-full p-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Projet:</label>
              <input type="text" className="w-full p-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">PTFS:</label>
              <input type="text" className="w-full p-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">ONG:</label>
              <input type="text" className="w-full p-2 border border-gray-300 rounded-md" />
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
                <th className="border border-gray-300 px-3 py-2 text-center">Propriétaire</th>
                <th className="border border-gray-300 px-3 py-2 text-center">Locataire</th>
                <th className="border border-gray-300 px-3 py-2 text-center">STATUT D'OCCUPATION (Nombre/Chiffre)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-3 py-2">01</td>
                <td className="border border-gray-300 px-3 py-2">Direction Provinciale EDU-NC</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="radio" name="status_01" className="mx-auto block" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="radio" name="status_01" className="mx-auto block" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">02</td>
                <td className="border border-gray-300 px-3 py-2">Inspection Principale Provinciale</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="radio" name="status_02" className="mx-auto block" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="radio" name="status_02" className="mx-auto block" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">03</td>
                <td className="border border-gray-300 px-3 py-2">Direction Provinciale DINACOPE</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="radio" name="status_03" className="mx-auto block" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="radio" name="status_03" className="mx-auto block" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">04</td>
                <td className="border border-gray-300 px-3 py-2">Division SERNIE</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="radio" name="status_04" className="mx-auto block" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="radio" name="status_04" className="mx-auto block" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">05</td>
                <td className="border border-gray-300 px-3 py-2">Coordination Provinciale</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="radio" name="status_05" className="mx-auto block" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="radio" name="status_05" className="mx-auto block" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">06</td>
                <td className="border border-gray-300 px-3 py-2">Sous-Division</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="radio" name="status_06" className="mx-auto block" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="radio" name="status_06" className="mx-auto block" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">07</td>
                <td className="border border-gray-300 px-3 py-2">Pools D'inspection Primaire</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="radio" name="status_07" className="mx-auto block" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="radio" name="status_07" className="mx-auto block" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">08</td>
                <td className="border border-gray-300 px-3 py-2">Pools D'inspection Secondaire</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="radio" name="status_08" className="mx-auto block" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="radio" name="status_08" className="mx-auto block" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">09</td>
                <td className="border border-gray-300 px-3 py-2">Antenne DINACOPE</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="radio" name="status_09" className="mx-auto block" />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input type="radio" name="status_09" className="mx-auto block" />
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
  );
};

export default RealisationsComplete; 