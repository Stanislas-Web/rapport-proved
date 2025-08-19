import React from 'react';
import { RapportActivite } from '../../../models/RapportActivite';

interface PersonnelProps {
  formData: RapportActivite;
  setFormData: React.Dispatch<React.SetStateAction<RapportActivite>>;
}

const Personnel: React.FC<PersonnelProps> = ({ formData, setFormData }) => {
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
              <tr>
                <td className="border border-gray-300 px-3 py-2 font-medium">A. NIVEAU PRESCOLAIRE</td>
                <td className="border border-gray-300 px-3 py-2">a) Enseignement Préscolaire Spécial (handicap)</td>
                <td className="border border-gray-300 px-3 py-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={formData.personnel.personnelEnseignant.prescolaire.hommes}
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value) || 0;
                        setFormData(prev => ({
                          ...prev,
                          personnel: {
                            ...prev.personnel,
                            personnelEnseignant: {
                              ...prev.personnel.personnelEnseignant,
                              prescolaire: {
                                ...prev.personnel.personnelEnseignant.prescolaire,
                                hommes: newValue
                              }
                            }
                          }
                        }));
                      }}
                      className="w-full text-center border-none focus:outline-none focus:ring-0"
                    />
                    <input
                      type="number"
                      value={formData.personnel.personnelEnseignant.prescolaire.femmes}
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value) || 0;
                        setFormData(prev => ({
                          ...prev,
                          personnel: {
                            ...prev.personnel,
                            personnelEnseignant: {
                              ...prev.personnel.personnelEnseignant,
                              prescolaire: {
                                ...prev.personnel.personnelEnseignant.prescolaire,
                                femmes: newValue
                              }
                            }
                          }
                        }));
                      }}
                      className="w-full text-center border-none focus:outline-none focus:ring-0"
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
                      value={formData.personnel.personnelAdministratif.directionProvinciale}
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value) || 0;
                        setFormData(prev => ({
                          ...prev,
                          personnel: {
                            ...prev.personnel,
                            personnelAdministratif: {
                              ...prev.personnel.personnelAdministratif,
                              directionProvinciale: newValue
                            }
                          }
                        }));
                      }}
                      className="w-full text-center border-none focus:outline-none focus:ring-0"
                    />
                    <input
                      type="number"
                      value={formData.personnel.personnelAdministratif.inspectionPrincipale}
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value) || 0;
                        setFormData(prev => ({
                          ...prev,
                          personnel: {
                            ...prev.personnel,
                            personnelAdministratif: {
                              ...prev.personnel.personnelAdministratif,
                              inspectionPrincipale: newValue
                            }
                          }
                        }));
                      }}
                      className="w-full text-center border-none focus:outline-none focus:ring-0"
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