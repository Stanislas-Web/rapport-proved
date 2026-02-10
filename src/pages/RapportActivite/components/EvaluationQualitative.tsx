import React from 'react';

interface EvaluationQualitativeProps {
  formData?: any;
  setFormData?: React.Dispatch<React.SetStateAction<any>>;
}

const EvaluationQualitative: React.FC<EvaluationQualitativeProps> = ({ formData, setFormData }) => {
  const handleRadioChange = (path: string, value: string) => {
    if (!setFormData) return;
    
    const [section, subsection, niveau] = path.split('.');
    setFormData((prev: any) => ({
      ...prev,
      ameliorationQualite: {
        ...prev.ameliorationQualite,
        disponibiliteMoyensEnseignement: {
          ...prev.ameliorationQualite?.disponibiliteMoyensEnseignement,
          [subsection]: {
            ...prev.ameliorationQualite?.disponibiliteMoyensEnseignement?.[subsection],
            [niveau]: value
          }
        }
      }
    }));
  };

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
                    <input type="radio" name="prog_1" className="mx-auto block" checked={formData?.ameliorationQualite?.disponibiliteMoyensEnseignement?.programmesScolaires?.ece === 'TRES BON'} onChange={() => handleRadioChange('ameliorationQualite.programmesScolaires.ece', 'TRES BON')} />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="prog_1" className="mx-auto block" checked={formData?.ameliorationQualite?.disponibiliteMoyensEnseignement?.programmesScolaires?.ece === 'BON'} onChange={() => handleRadioChange('ameliorationQualite.programmesScolaires.ece', 'BON')} />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="prog_1" className="mx-auto block" checked={formData?.ameliorationQualite?.disponibiliteMoyensEnseignement?.programmesScolaires?.ece === 'CARENCE'} onChange={() => handleRadioChange('ameliorationQualite.programmesScolaires.ece', 'CARENCE')} />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">b) Préprimaire</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="prog_2" className="mx-auto block" checked={formData?.ameliorationQualite?.disponibiliteMoyensEnseignement?.programmesScolaires?.preprimaire === 'TRES BON'} onChange={() => handleRadioChange('ameliorationQualite.programmesScolaires.preprimaire', 'TRES BON')} />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="prog_2" className="mx-auto block" checked={formData?.ameliorationQualite?.disponibiliteMoyensEnseignement?.programmesScolaires?.preprimaire === 'BON'} onChange={() => handleRadioChange('ameliorationQualite.programmesScolaires.preprimaire', 'BON')} />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="prog_2" className="mx-auto block" checked={formData?.ameliorationQualite?.disponibiliteMoyensEnseignement?.programmesScolaires?.preprimaire === 'CARENCE'} onChange={() => handleRadioChange('ameliorationQualite.programmesScolaires.preprimaire', 'CARENCE')} />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">c) Maternel</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="prog_3" className="mx-auto block" checked={formData?.ameliorationQualite?.disponibiliteMoyensEnseignement?.programmesScolaires?.maternel === 'TRES BON'} onChange={() => handleRadioChange('ameliorationQualite.programmesScolaires.maternel', 'TRES BON')} />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="prog_3" className="mx-auto block" checked={formData?.ameliorationQualite?.disponibiliteMoyensEnseignement?.programmesScolaires?.maternel === 'BON'} onChange={() => handleRadioChange('ameliorationQualite.programmesScolaires.maternel', 'BON')} />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="prog_3" className="mx-auto block" checked={formData?.ameliorationQualite?.disponibiliteMoyensEnseignement?.programmesScolaires?.maternel === 'CARENCE'} onChange={() => handleRadioChange('ameliorationQualite.programmesScolaires.maternel', 'CARENCE')} />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">d) Primaire</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="prog_4" className="mx-auto block" checked={formData?.ameliorationQualite?.disponibiliteMoyensEnseignement?.programmesScolaires?.primaire === 'TRES BON'} onChange={() => handleRadioChange('ameliorationQualite.programmesScolaires.primaire', 'TRES BON')} />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="prog_4" className="mx-auto block" checked={formData?.ameliorationQualite?.disponibiliteMoyensEnseignement?.programmesScolaires?.primaire === 'BON'} onChange={() => handleRadioChange('ameliorationQualite.programmesScolaires.primaire', 'BON')} />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="prog_4" className="mx-auto block" checked={formData?.ameliorationQualite?.disponibiliteMoyensEnseignement?.programmesScolaires?.primaire === 'CARENCE'} onChange={() => handleRadioChange('ameliorationQualite.programmesScolaires.primaire', 'CARENCE')} />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">e) Secondaire</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="prog_5" className="mx-auto block" checked={formData?.ameliorationQualite?.disponibiliteMoyensEnseignement?.programmesScolaires?.secondaire === 'TRES BON'} onChange={() => handleRadioChange('ameliorationQualite.programmesScolaires.secondaire', 'TRES BON')} />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="prog_5" className="mx-auto block" checked={formData?.ameliorationQualite?.disponibiliteMoyensEnseignement?.programmesScolaires?.secondaire === 'BON'} onChange={() => handleRadioChange('ameliorationQualite.programmesScolaires.secondaire', 'BON')} />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="prog_5" className="mx-auto block" checked={formData?.ameliorationQualite?.disponibiliteMoyensEnseignement?.programmesScolaires?.secondaire === 'CARENCE'} onChange={() => handleRadioChange('ameliorationQualite.programmesScolaires.secondaire', 'CARENCE')} />
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
                    <input type="radio" name="man_1" className="mx-auto block" checked={formData?.ameliorationQualite?.disponibiliteMoyensEnseignement?.manuelsScolaires?.ece === 'TRES BON'} onChange={() => handleRadioChange('ameliorationQualite.manuelsScolaires.ece', 'TRES BON')} />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="man_1" className="mx-auto block" checked={formData?.ameliorationQualite?.disponibiliteMoyensEnseignement?.manuelsScolaires?.ece === 'BON'} onChange={() => handleRadioChange('ameliorationQualite.manuelsScolaires.ece', 'BON')} />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="man_1" className="mx-auto block" checked={formData?.ameliorationQualite?.disponibiliteMoyensEnseignement?.manuelsScolaires?.ece === 'CARENCE'} onChange={() => handleRadioChange('ameliorationQualite.manuelsScolaires.ece', 'CARENCE')} />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">b) Préprimaire</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="man_2" className="mx-auto block" checked={formData?.ameliorationQualite?.disponibiliteMoyensEnseignement?.manuelsScolaires?.preprimaire === 'TRES BON'} onChange={() => handleRadioChange('ameliorationQualite.manuelsScolaires.preprimaire', 'TRES BON')} />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="man_2" className="mx-auto block" checked={formData?.ameliorationQualite?.disponibiliteMoyensEnseignement?.manuelsScolaires?.preprimaire === 'BON'} onChange={() => handleRadioChange('ameliorationQualite.manuelsScolaires.preprimaire', 'BON')} />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="man_2" className="mx-auto block" checked={formData?.ameliorationQualite?.disponibiliteMoyensEnseignement?.manuelsScolaires?.preprimaire === 'CARENCE'} onChange={() => handleRadioChange('ameliorationQualite.manuelsScolaires.preprimaire', 'CARENCE')} />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">c) Maternel</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="man_3" className="mx-auto block" checked={formData?.ameliorationQualite?.disponibiliteMoyensEnseignement?.manuelsScolaires?.maternel === 'TRES BON'} onChange={() => handleRadioChange('ameliorationQualite.manuelsScolaires.maternel', 'TRES BON')} />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="man_3" className="mx-auto block" checked={formData?.ameliorationQualite?.disponibiliteMoyensEnseignement?.manuelsScolaires?.maternel === 'BON'} onChange={() => handleRadioChange('ameliorationQualite.manuelsScolaires.maternel', 'BON')} />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="man_3" className="mx-auto block" checked={formData?.ameliorationQualite?.disponibiliteMoyensEnseignement?.manuelsScolaires?.maternel === 'CARENCE'} onChange={() => handleRadioChange('ameliorationQualite.manuelsScolaires.maternel', 'CARENCE')} />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">d) Primaire</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="man_4" className="mx-auto block" checked={formData?.ameliorationQualite?.disponibiliteMoyensEnseignement?.manuelsScolaires?.primaire === 'TRES BON'} onChange={() => handleRadioChange('ameliorationQualite.manuelsScolaires.primaire', 'TRES BON')} />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="man_4" className="mx-auto block" checked={formData?.ameliorationQualite?.disponibiliteMoyensEnseignement?.manuelsScolaires?.primaire === 'BON'} onChange={() => handleRadioChange('ameliorationQualite.manuelsScolaires.primaire', 'BON')} />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="man_4" className="mx-auto block" checked={formData?.ameliorationQualite?.disponibiliteMoyensEnseignement?.manuelsScolaires?.primaire === 'CARENCE'} onChange={() => handleRadioChange('ameliorationQualite.manuelsScolaires.primaire', 'CARENCE')} />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">e) Secondaire</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="man_5" className="mx-auto block" checked={formData?.ameliorationQualite?.disponibiliteMoyensEnseignement?.manuelsScolaires?.secondaire === 'TRES BON'} onChange={() => handleRadioChange('ameliorationQualite.manuelsScolaires.secondaire', 'TRES BON')} />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="man_5" className="mx-auto block" checked={formData?.ameliorationQualite?.disponibiliteMoyensEnseignement?.manuelsScolaires?.secondaire === 'BON'} onChange={() => handleRadioChange('ameliorationQualite.manuelsScolaires.secondaire', 'BON')} />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="radio" name="man_5" className="mx-auto block" checked={formData?.ameliorationQualite?.disponibiliteMoyensEnseignement?.manuelsScolaires?.secondaire === 'CARENCE'} onChange={() => handleRadioChange('ameliorationQualite.manuelsScolaires.secondaire', 'CARENCE')} />
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