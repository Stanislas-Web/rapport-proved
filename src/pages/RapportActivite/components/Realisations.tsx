import React from 'react';
import { RapportActivite } from '../../../models/RapportActivite';

interface RealisationsProps {
  formData: RapportActivite;
  setFormData: React.Dispatch<React.SetStateAction<RapportActivite>>;
}

const Realisations: React.FC<RealisationsProps> = ({ formData, setFormData }) => {
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h3 className="text-lg font-medium mb-4 text-primary">IV. REALISATIONS DE LA PROVINCE EDUCATIONELLE PAR AXE STRATEGIQUE DE LA STRATEGIE SECTORIELLE DE L'EDUCATION ET DE LA FORMATION (SSEF) AINSI QUE DE L'EDUCATION EN SITUATION D'URGENCE (ESU)</h3>
      
      {/* IV.1. ACCES, ACCESSIBILITE & EQUITE */}
      <div className="mb-6">
        <h4 className="font-medium mb-3 text-blue-600">IV.1. ACCES, ACCESSIBILITE & EQUITE</h4>
        
        {/* IV.1.1. Nouvelles Salles de Classes */}
        <div className="mb-4">
          <h5 className="font-medium mb-2">IV.1.1. Nombre de Nouvelles Salles de Classes construites par niveau d'Enseignement:</h5>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left">Niveau d'Enseignement</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">Nombre</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">Source de Financement</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-3 py-2 font-medium">A. NIVEAU PRESCOLAIRE</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input
                      type="number"
                      value={formData.realisations.accesAccessibiliteEquite.nouvellesSallesClasses.prescolaire}
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value) || 0;
                        setFormData(prev => ({
                          ...prev,
                          realisations: {
                            ...prev.realisations,
                            accesAccessibiliteEquite: {
                              ...prev.realisations.accesAccessibiliteEquite,
                              nouvellesSallesClasses: {
                                ...prev.realisations.accesAccessibiliteEquite.nouvellesSallesClasses,
                                prescolaire: newValue
                              }
                            }
                          }
                        }));
                      }}
                      className="w-full text-center border-none focus:outline-none focus:ring-0"
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input
                      type="text"
                      value={formData.realisations.accesAccessibiliteEquite.nouvellesSallesClasses.sourceFinancement}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          realisations: {
                            ...prev.realisations,
                            accesAccessibiliteEquite: {
                              ...prev.realisations.accesAccessibiliteEquite,
                              nouvellesSallesClasses: {
                                ...prev.realisations.accesAccessibiliteEquite.nouvellesSallesClasses,
                                sourceFinancement: e.target.value
                              }
                            }
                          }
                        }));
                      }}
                      className="w-full text-center border-none focus:outline-none focus:ring-0"
                      placeholder="GVT, Projet, PTFS, ONG..."
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2 font-medium">B. NIVEAU PRIMAIRE</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input
                      type="number"
                      value={formData.realisations.accesAccessibiliteEquite.nouvellesSallesClasses.primaire}
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value) || 0;
                        setFormData(prev => ({
                          ...prev,
                          realisations: {
                            ...prev.realisations,
                            accesAccessibiliteEquite: {
                              ...prev.realisations.accesAccessibiliteEquite,
                              nouvellesSallesClasses: {
                                ...prev.realisations.accesAccessibiliteEquite.nouvellesSallesClasses,
                                primaire: newValue
                              }
                            }
                          }
                        }));
                      }}
                      className="w-full text-center border-none focus:outline-none focus:ring-0"
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input
                      type="text"
                      value={formData.realisations.accesAccessibiliteEquite.nouvellesSallesClasses.sourceFinancement}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          realisations: {
                            ...prev.realisations,
                            accesAccessibiliteEquite: {
                              ...prev.realisations.accesAccessibiliteEquite,
                              nouvellesSallesClasses: {
                                ...prev.realisations.accesAccessibiliteEquite.nouvellesSallesClasses,
                                sourceFinancement: e.target.value
                              }
                            }
                          }
                        }));
                      }}
                      className="w-full text-center border-none focus:outline-none focus:ring-0"
                      placeholder="GVT, Projet, PTFS, ONG..."
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2 font-medium">C. NIVEAU SECONDAIRE</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input
                      type="number"
                      value={formData.realisations.accesAccessibiliteEquite.nouvellesSallesClasses.secondaire}
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value) || 0;
                        setFormData(prev => ({
                          ...prev,
                          realisations: {
                            ...prev.realisations,
                            accesAccessibiliteEquite: {
                              ...prev.realisations.accesAccessibiliteEquite,
                              nouvellesSallesClasses: {
                                ...prev.realisations.accesAccessibiliteEquite.nouvellesSallesClasses,
                                secondaire: newValue
                              }
                            }
                          }
                        }));
                      }}
                      className="w-full text-center border-none focus:outline-none focus:ring-0"
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input
                      type="text"
                      value={formData.realisations.accesAccessibiliteEquite.nouvellesSallesClasses.sourceFinancement}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          realisations: {
                            ...prev.realisations,
                            accesAccessibiliteEquite: {
                              ...prev.realisations.accesAccessibiliteEquite,
                              nouvellesSallesClasses: {
                                ...prev.realisations.accesAccessibiliteEquite.nouvellesSallesClasses,
                                sourceFinancement: e.target.value
                              }
                            }
                          }
                        }));
                      }}
                      className="w-full text-center border-none focus:outline-none focus:ring-0"
                      placeholder="GVT, Projet, PTFS, ONG..."
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* IV.1.2. Nouveaux Bancs Tables */}
        <div className="mb-4">
          <h5 className="font-medium mb-2">IV.1.2. Nombre de Nouveaux Bancs Tables par niveau d'enseignement:</h5>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left">Niveau d'Enseignement</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">Nombre</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">Source de Financement</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-3 py-2 font-medium">A. NIVEAU PRESCOLAIRE</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="text" className="w-full text-center border-none focus:outline-none focus:ring-0" placeholder="GVT, Projet, PTFS, ONG..." />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2 font-medium">B. NIVEAU PRIMAIRE</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="text" className="w-full text-center border-none focus:outline-none focus:ring-0" placeholder="GVT, Projet, PTFS, ONG..." />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2 font-medium">C. NIVEAU SECONDAIRE</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="text" className="w-full text-center border-none focus:outline-none focus:ring-0" placeholder="GVT, Projet, PTFS, ONG..." />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* IV.1.3. Nouvelles Latrines */}
        <div className="mb-4">
          <h5 className="font-medium mb-2">IV.1.3. Nombre de Blocs de Nouvelles Latrines:</h5>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left">Niveau d'Enseignement</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">Nombre</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">Source de Financement</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-3 py-2 font-medium">A. NIVEAU PRESCOLAIRE</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="text" className="w-full text-center border-none focus:outline-none focus:ring-0" placeholder="GVT, Projet, PTFS, ONG..." />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2 font-medium">B. NIVEAU PRIMAIRE</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="text" className="w-full text-center border-none focus:outline-none focus:ring-0" placeholder="GVT, Projet, PTFS, ONG..." />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2 font-medium">C. NIVEAU SECONDAIRE</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="text" className="w-full text-center border-none focus:outline-none focus:ring-0" placeholder="GVT, Projet, PTFS, ONG..." />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* IV.4. Gratuité Enseignement Primaire */}
        <div className="mb-4">
          <h5 className="font-medium mb-2">IV.4. Gratuité Enseignement Primaire Public</h5>
          <textarea
            className="w-full h-20 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Décrivez l'état de la gratuité de l'enseignement primaire public..."
          />
        </div>

        {/* IV.5. Sensibilisation */}
        <div className="mb-4">
          <h5 className="font-medium mb-2">IV.5. Sensibilisation pour la scolarisation des:</h5>
          <div className="space-y-3">
            <div className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <label>Filles</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <label>Enfants et Adolescents en dehors de l'Ecole (EADE):</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <label>Enfants des Peuples Autochtones</label>
            </div>
          </div>
        </div>

        {/* IV.6. Cantines Scolaires */}
        <div className="mb-4">
          <h5 className="font-medium mb-2">IV.6. Etat de Lieux organisation des Cantines Scolaires:</h5>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left">Niveau</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">GVT:</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">Projet:</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">PTFS:</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">ONG</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-3 py-2 font-medium">A. NIVEAU PRESCOLAIRE</td>
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
                  <td className="border border-gray-300 px-3 py-2 font-medium">B. NIVEAU PRIMAIRE</td>
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
                  <td className="border border-gray-300 px-3 py-2 font-medium">C. NIVEAU SECONDAIRE</td>
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
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Bref Commentaire (5 lignes maximum)</label>
            <textarea
              className="w-full h-20 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Commentaire sur les cantines scolaires..."
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Total General Ecoles ayant des cantines Scolaires</label>
            <input type="number" className="w-20 p-2 border border-gray-300 rounded-md" />
          </div>
        </div>

        {/* IV.7. Indicateurs d'accès */}
        <div className="mb-4">
          <h5 className="font-medium mb-2">IV.7. Indicateurs d'accès: Proportion & Transition</h5>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left">Indicateur</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">% GF</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">F</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">a) % d'Elèves admis au primaire (Nouveaux Inscrits)</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">b) Taux de Transition du Primaire au CTEB</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input type="number" className="w-full text-center border-none focus:outline-none focus:ring-0" />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">c) Taux de Transition du CTEB aux Humanités (8eme en 1ere Hum)</td>
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

        {/* Note */}
        <p className="text-sm text-gray-600 mt-4">
          <strong>NB:</strong> Spécifier la dénomination du Projet, du PTF ou de l'ONG ayant appuyé le financement des réalisations.
        </p>
      </div>
    </div>
  );
};

export default Realisations; 