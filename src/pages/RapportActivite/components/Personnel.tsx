import React from 'react';
import { RapportActivite } from '../../../models/RapportActivite';

interface PersonnelProps {
  formData: RapportActivite;
  setFormData: React.Dispatch<React.SetStateAction<RapportActivite>>;
}

const Personnel: React.FC<PersonnelProps> = ({ formData, setFormData }) => {
  // Vérification de sécurité pour s'assurer que les données sont initialisées
  if (!formData || !formData.personnel || !formData.personnel.personnelEnseignant) {
    console.log('🔍 Personnel: Données non initialisées, affichage du loader');
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
      <h3 className="text-lg font-medium mb-4 text-primary">II. PERSONNEL</h3>
      
      {/* II.1. Personnel Enseignant */}
      <div className="mb-6">
        <h4 className="font-medium mb-3 text-blue-600">II.1. Personnel Enseignant (débout et assis)</h4>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-3 py-2 text-left">Niveau d'Enseignement</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Types d'enseignement</th>
                <th className="border border-gray-300 px-3 py-2 text-center">Nbre d'Enseignants par catégorie</th>
              </tr>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-3 py-2"></th>
                <th className="border border-gray-300 px-3 py-2"></th>
                <th className="border border-gray-300 px-3 py-2 text-center">
                  <div className="grid grid-cols-2 gap-2">
                    <span>HF</span>
                    <span>F</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {/* NIVEAU PRESCOLAIRE */}
              <tr>
                <td className="border border-gray-300 px-3 py-2 font-medium" rowSpan={2}>A. NIVEAU PRESCOLAIRE</td>
                <td className="border border-gray-300 px-3 py-2">a) Enseignement Préscolaire Spécial (handicap)</td>
                <td className="border border-gray-300 px-3 py-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={formData.personnel?.personnelEnseignant?.niveauPrescolaire?.enseignementPrescolaireSpecial?.hommes ?? ''}
                      onChange={(e) => handleInputChange('personnel.personnelEnseignant.niveauPrescolaire.enseignementPrescolaireSpecial.hommes', Number(e.target.value))}
                      className="w-full text-center border-none focus:outline-none focus:ring-0"
                      placeholder="0"
                    />
                    <input
                      type="number"
                      value={formData.personnel?.personnelEnseignant?.niveauPrescolaire?.enseignementPrescolaireSpecial?.femmes ?? ''}
                      onChange={(e) => handleInputChange('personnel.personnelEnseignant.niveauPrescolaire.enseignementPrescolaireSpecial.femmes', Number(e.target.value))}
                      className="w-full text-center border-none focus:outline-none focus:ring-0"
                      placeholder="0"
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">b) Enseignement Préscolaire</td>
                <td className="border border-gray-300 px-3 py-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={formData.personnel?.personnelEnseignant?.niveauPrescolaire?.enseignementPrescolaire?.hommes ?? ''}
                      onChange={(e) => handleInputChange('personnel.personnelEnseignant.niveauPrescolaire.enseignementPrescolaire.hommes', Number(e.target.value))}
                      className="w-full text-center border-none focus:outline-none focus:ring-0"
                      placeholder="0"
                    />
                    <input
                      type="number"
                      value={formData.personnel?.personnelEnseignant?.niveauPrescolaire?.enseignementPrescolaire?.femmes ?? ''}
                      onChange={(e) => handleInputChange('personnel.personnelEnseignant.niveauPrescolaire.enseignementPrescolaire.femmes', Number(e.target.value))}
                      className="w-full text-center border-none focus:outline-none focus:ring-0"
                      placeholder="0"
                    />
                  </div>
                </td>
              </tr>

              {/* NIVEAU PRIMAIRE */}
              <tr>
                <td className="border border-gray-300 px-3 py-2 font-medium" rowSpan={2}>B. NIVEAU PRIMAIRE</td>
                <td className="border border-gray-300 px-3 py-2">a) Enseignement Primaire Spécial (handicap)</td>
                <td className="border border-gray-300 px-3 py-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={formData.personnel?.personnelEnseignant?.niveauPrimaire?.enseignementPrescolaireSpecial?.hommes ?? ''}
                      onChange={(e) => handleInputChange('personnel.personnelEnseignant.niveauPrimaire.enseignementPrescolaireSpecial.hommes', Number(e.target.value))}
                      className="w-full text-center border-none focus:outline-none focus:ring-0"
                      placeholder="0"
                    />
                    <input
                      type="number"
                      value={formData.personnel?.personnelEnseignant?.niveauPrimaire?.enseignementPrescolaireSpecial?.femmes ?? ''}
                      onChange={(e) => handleInputChange('personnel.personnelEnseignant.niveauPrimaire.enseignementPrescolaireSpecial.femmes', Number(e.target.value))}
                      className="w-full text-center border-none focus:outline-none focus:ring-0"
                      placeholder="0"
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">b) Enseignement Primaire</td>
                <td className="border border-gray-300 px-3 py-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={formData.personnel?.personnelEnseignant?.niveauPrimaire?.enseignementPrimaire?.hommes ?? ''}
                      onChange={(e) => handleInputChange('personnel.personnelEnseignant.niveauPrimaire.enseignementPrimaire.hommes', Number(e.target.value))}
                      className="w-full text-center border-none focus:outline-none focus:ring-0"
                      placeholder="0"
                    />
                    <input
                      type="number"
                      value={formData.personnel?.personnelEnseignant?.niveauPrimaire?.enseignementPrimaire?.femmes ?? ''}
                      onChange={(e) => handleInputChange('personnel.personnelEnseignant.niveauPrimaire.enseignementPrimaire.femmes', Number(e.target.value))}
                      className="w-full text-center border-none focus:ring-0"
                      placeholder="0"
                    />
                  </div>
                </td>
              </tr>

              {/* NIVEAU SECONDAIRE */}
              <tr>
                <td className="border border-gray-300 px-3 py-2 font-medium" rowSpan={2}>C. NIVEAU SECONDAIRE</td>
                <td className="border border-gray-300 px-3 py-2">a) Enseignement Secondaire Spécial (handicap)</td>
                <td className="border border-gray-300 px-3 py-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={formData.personnel?.personnelEnseignant?.niveauSecondaire?.enseignementPrescolaireSpecial?.hommes ?? ''}
                      onChange={(e) => handleInputChange('personnel.personnelEnseignant.niveauSecondaire.enseignementPrescolaireSpecial.hommes', Number(e.target.value))}
                      className="w-full text-center border-none focus:outline-none focus:ring-0"
                      placeholder="0"
                    />
                    <input
                      type="number"
                      value={formData.personnel?.personnelEnseignant?.niveauSecondaire?.enseignementPrescolaireSpecial?.femmes ?? ''}
                      onChange={(e) => handleInputChange('personnel.personnelEnseignant.niveauSecondaire.enseignementPrescolaireSpecial.femmes', Number(e.target.value))}
                      className="w-full text-center border-none focus:outline-none focus:ring-0"
                      placeholder="0"
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">b) Enseignement Secondaire</td>
                <td className="border border-gray-300 px-3 py-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={formData.personnel?.personnelEnseignant?.niveauSecondaire?.enseignementSecondaire?.hommes ?? ''}
                      onChange={(e) => handleInputChange('personnel.personnelEnseignant.niveauSecondaire.enseignementSecondaire.hommes', Number(e.target.value))}
                      className="w-full text-center border-none focus:outline-none focus:ring-0"
                      placeholder="0"
                    />
                    <input
                      type="number"
                      value={formData.personnel?.personnelEnseignant?.niveauSecondaire?.enseignementSecondaire?.femmes ?? ''}
                      onChange={(e) => handleInputChange('personnel.personnelEnseignant.niveauSecondaire.enseignementSecondaire.femmes', Number(e.target.value))}
                      className="w-full text-center border-none focus:outline-none focus:ring-0"
                      placeholder="0"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* II.2. Personnel Administratif */}
      <div className="mb-6">
        <h4 className="font-medium mb-3 text-blue-600">II.2. Personnel Administratif / Bureau Gestionnaire</h4>
        <p className="text-sm mb-3">Ne renseigner que l'effectif du personnel pris en charge par le Trésor Public</p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-3 py-2 text-center">Code</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Bureau Gestionnaire (BG)</th>
                <th className="border border-gray-300 px-3 py-2 text-center">Nombre du Personnel Administratif des BG</th>
              </tr>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-3 py-2"></th>
                <th className="border border-gray-300 px-3 py-2"></th>
                <th className="border border-gray-300 px-3 py-2 text-center">
                  <div className="grid grid-cols-2 gap-2">
                    <span>HF</span>
                    <span>F</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-3 py-2 text-center">01</td>
                <td className="border border-gray-300 px-3 py-2">Direction Provinciale EDU-NC</td>
                <td className="border border-gray-300 px-3 py-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={formData.personnel?.personnelAdministratif?.directionProvinciale?.hommes || ''}
                      onChange={(e) => handleInputChange('personnel.personnelAdministratif.directionProvinciale.hommes', Number(e.target.value))}
                      className="w-full text-center border-none focus:outline-none focus:ring-0"
                      placeholder="0"
                    />
                    <input
                      type="number"
                      value={formData.personnel?.personnelAdministratif?.directionProvinciale?.femmes || ''}
                      onChange={(e) => handleInputChange('personnel.personnelAdministratif.directionProvinciale.femmes', Number(e.target.value))}
                      className="w-full text-center border-none focus:outline-none focus:ring-0"
                      placeholder="0"
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2 text-center">02</td>
                <td className="border border-gray-300 px-3 py-2">Inspection Principale</td>
                <td className="border border-gray-300 px-3 py-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={formData.personnel?.personnelAdministratif?.inspectionPrincipale?.hommes || ''}
                      onChange={(e) => handleInputChange('personnel.personnelAdministratif.inspectionPrincipale.hommes', Number(e.target.value))}
                      className="w-full text-center border-none focus:outline-none focus:ring-0"
                      placeholder="0"
                    />
                    <input
                      type="number"
                      value={formData.personnel?.personnelAdministratif?.inspectionPrincipale?.femmes || ''}
                      onChange={(e) => handleInputChange('personnel.personnelAdministratif.inspectionPrincipale.femmes', Number(e.target.value))}
                      className="w-full text-center border-none focus:outline-none focus:ring-0"
                      placeholder="0"
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2 text-center">03</td>
                <td className="border border-gray-300 px-3 py-2">DINACOPE</td>
                <td className="border border-gray-300 px-3 py-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={formData.personnel?.personnelAdministratif?.dinacope?.hommes || ''}
                      onChange={(e) => handleInputChange('personnel.personnelAdministratif.dinacope.hommes', Number(e.target.value))}
                      className="w-full text-center border-none focus:outline-none focus:ring-0"
                      placeholder="0"
                    />
                    <input
                      type="number"
                      value={formData.personnel?.personnelAdministratif?.dinacope?.femmes || ''}
                      onChange={(e) => handleInputChange('personnel.personnelAdministratif.dinacope.femmes', Number(e.target.value))}
                      className="w-full text-center border-none focus:outline-none focus:ring-0"
                      placeholder="0"
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2 text-center">04</td>
                <td className="border border-gray-300 px-3 py-2">SERNIE</td>
                <td className="border border-gray-300 px-3 py-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={formData.personnel?.personnelAdministratif?.sernie?.hommes || ''}
                      onChange={(e) => handleInputChange('personnel.personnelAdministratif.sernie.hommes', Number(e.target.value))}
                      className="w-full text-center border-none focus:outline-none focus:ring-0"
                      placeholder="0"
                    />
                    <input
                      type="number"
                      value={formData.personnel?.personnelAdministratif?.sernie?.femmes || ''}
                      onChange={(e) => handleInputChange('personnel.personnelAdministratif.sernie.femmes', Number(e.target.value))}
                      className="w-full text-center border-none focus:outline-none focus:ring-0"
                      placeholder="0"
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2 text-center">05</td>
                <td className="border border-gray-300 px-3 py-2">Coordination Provinciale</td>
                <td className="border border-gray-300 px-3 py-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={formData.personnel?.personnelAdministratif?.coordinationProvinciale?.hommes || ''}
                      onChange={(e) => handleInputChange('personnel.personnelAdministratif.coordinationProvinciale.hommes', Number(e.target.value))}
                      className="w-full text-center border-none focus:outline-none focus:ring-0"
                      placeholder="0"
                    />
                    <input
                      type="number"
                      value={formData.personnel?.personnelAdministratif?.coordinationProvinciale?.femmes || ''}
                      onChange={(e) => handleInputChange('personnel.personnelAdministratif.coordinationProvinciale.femmes', Number(e.target.value))}
                      className="w-full text-center border-none focus:outline-none focus:ring-0"
                      placeholder="0"
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2 text-center">06</td>
                <td className="border border-gray-300 px-3 py-2">Sous-Division</td>
                <td className="border border-gray-300 px-3 py-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={formData.personnel?.personnelAdministratif?.sousDivision?.hommes || ''}
                      onChange={(e) => handleInputChange('personnel.personnelAdministratif.sousDivision.hommes', Number(e.target.value))}
                      className="w-full text-center border-none focus:outline-none focus:ring-0"
                      placeholder="0"
                    />
                    <input
                      type="number"
                      value={formData.personnel?.personnelAdministratif?.sousDivision?.femmes || ''}
                      onChange={(e) => handleInputChange('personnel.personnelAdministratif.sousDivision.femmes', Number(e.target.value))}
                      className="w-full text-center border-none focus:outline-none focus:ring-0"
                      placeholder="0"
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2 text-center">07</td>
                <td className="border border-gray-300 px-3 py-2">Pools d'Inspection Primaire</td>
                <td className="border border-gray-300 px-3 py-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={formData.personnel?.personnelAdministratif?.poolsInspectionPrimaire?.hommes || ''}
                      onChange={(e) => handleInputChange('personnel.personnelAdministratif.poolsInspectionPrimaire.hommes', Number(e.target.value))}
                      className="w-full text-center border-none focus:outline-none focus:ring-0"
                      placeholder="0"
                    />
                    <input
                      type="number"
                      value={formData.personnel?.personnelAdministratif?.poolsInspectionPrimaire?.femmes || ''}
                      onChange={(e) => handleInputChange('personnel.personnelAdministratif.poolsInspectionPrimaire.femmes', Number(e.target.value))}
                      className="w-full text-center border-none focus:outline-none focus:ring-0"
                      placeholder="0"
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2 text-center">08</td>
                <td className="border border-gray-300 px-3 py-2">Pools d'Inspection Secondaire</td>
                <td className="border border-gray-300 px-3 py-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={formData.personnel?.personnelAdministratif?.poolsInspectionSecondaire?.hommes || ''}
                      onChange={(e) => handleInputChange('personnel.personnelAdministratif.poolsInspectionSecondaire.hommes', Number(e.target.value))}
                      className="w-full text-center border-none focus:outline-none focus:ring-0"
                      placeholder="0"
                    />
                    <input
                      type="number"
                      value={formData.personnel?.personnelAdministratif?.poolsInspectionSecondaire?.femmes || ''}
                      onChange={(e) => handleInputChange('personnel.personnelAdministratif.poolsInspectionSecondaire.femmes', Number(e.target.value))}
                      className="w-full text-center border-none focus:outline-none focus:ring-0"
                      placeholder="0"
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2 text-center">09</td>
                <td className="border border-gray-300 px-3 py-2">Antenne DINACOPE</td>
                <td className="border border-gray-300 px-3 py-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={formData.personnel?.personnelAdministratif?.antenneDinacope?.hommes || ''}
                      onChange={(e) => handleInputChange('personnel.personnelAdministratif.antenneDinacope.hommes', Number(e.target.value))}
                      className="w-full text-center border-none focus:outline-none focus:ring-0"
                      placeholder="0"
                    />
                    <input
                      type="number"
                      value={formData.personnel?.personnelAdministratif?.antenneDinacope?.femmes || ''}
                      onChange={(e) => handleInputChange('personnel.personnelAdministratif.antenneDinacope.femmes', Number(e.target.value))}
                      className="w-full text-center border-none focus:outline-none focus:ring-0"
                      placeholder="0"
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2 text-center">10</td>
                <td className="border border-gray-300 px-3 py-2">Antenne SERNIE</td>
                <td className="border border-gray-300 px-3 py-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={formData.personnel?.personnelAdministratif?.antenneSernie?.hommes || ''}
                      onChange={(e) => handleInputChange('personnel.personnelAdministratif.antenneSernie.hommes', Number(e.target.value))}
                      className="w-full text-center border-none focus:outline-none focus:ring-0"
                      placeholder="0"
                    />
                    <input
                      type="number"
                      value={formData.personnel?.personnelAdministratif?.antenneSernie?.femmes || ''}
                      onChange={(e) => handleInputChange('personnel.personnelAdministratif.antenneSernie.femmes', Number(e.target.value))}
                      className="w-full text-center border-none focus:outline-none focus:ring-0"
                      placeholder="0"
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2 text-center">11</td>
                <td className="border border-gray-300 px-3 py-2">Coordination Diocésaine</td>
                <td className="border border-gray-300 px-3 py-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={formData.personnel?.personnelAdministratif?.coordinationDiocesaine?.hommes || ''}
                      onChange={(e) => handleInputChange('personnel.personnelAdministratif.coordinationDiocesaine.hommes', Number(e.target.value))}
                      className="w-full text-center border-none focus:outline-none focus:ring-0"
                      placeholder="0"
                    />
                    <input
                      type="number"
                      value={formData.personnel?.personnelAdministratif?.coordinationDiocesaine?.femmes || ''}
                      onChange={(e) => handleInputChange('personnel.personnelAdministratif.coordinationDiocesaine.femmes', Number(e.target.value))}
                      className="w-full text-center border-none focus:outline-none focus:ring-0"
                      placeholder="0"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Personnel; 