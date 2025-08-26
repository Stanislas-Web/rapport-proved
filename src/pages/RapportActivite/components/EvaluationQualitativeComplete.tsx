import React from 'react';

const EvaluationQualitativeComplete: React.FC = () => {
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