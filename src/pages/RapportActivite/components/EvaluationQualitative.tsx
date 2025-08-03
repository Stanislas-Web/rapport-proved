import React from 'react';

const EvaluationQualitative: React.FC = () => {
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h3 className="text-lg font-medium mb-4 text-primary">III. EVALUATION QUALITATIVE</h3>
      
      {/* III.1. Disponibilité des moyens d'enseignement */}
      <div className="mb-6">
        <h4 className="font-medium mb-3 ">III.1. Disponibilité des moyens d'enseignement</h4>
        
        {/* III.1.1. Programmes Scolaires */}
        <div className="mb-4">
          <h5 className="font-medium mb-2 ">III.1.1. Programmes Scolaires</h5>
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
                    <input type="radio" name="prog_1" className="mx-auto block" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="prog_1" className="mx-auto block" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="prog_1" className="mx-auto block" />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">b) Préprimaire</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="prog_2" className="mx-auto block" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="prog_2" className="mx-auto block" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="prog_2" className="mx-auto block" />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">c) Maternel</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="prog_3" className="mx-auto block" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="prog_3" className="mx-auto block" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="prog_3" className="mx-auto block" />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">d) Primaire</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="prog_4" className="mx-auto block" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="prog_4" className="mx-auto block" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="prog_4" className="mx-auto block" />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">e) Secondaire</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="prog_5" className="mx-auto block" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="prog_5" className="mx-auto block" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="prog_5" className="mx-auto block" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* III.1.2. Manuels Scolaires */}
        <div className="mb-4">
          <h5 className="font-medium mb-2">III.1.2. Manuels Scolaires</h5>
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
                    <input type="radio" name="man_1" className="mx-auto block" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="man_1" className="mx-auto block" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="man_1" className="mx-auto block" />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">b) Préprimaire</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="man_2" className="mx-auto block" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="man_2" className="mx-auto block" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="man_2" className="mx-auto block" />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">c) Maternel</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="man_3" className="mx-auto block" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="man_3" className="mx-auto block" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="man_3" className="mx-auto block" />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">d) Primaire</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="man_4" className="mx-auto block" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="man_4" className="mx-auto block" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="man_4" className="mx-auto block" />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">e) Secondaire</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="man_5" className="mx-auto block" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="man_5" className="mx-auto block" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="man_5" className="mx-auto block" />
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

export default EvaluationQualitative; 