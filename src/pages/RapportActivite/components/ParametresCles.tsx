import React from 'react';
import { RapportActivite } from '../../../models/RapportActivite';

interface ParametresClesProps {
  formData: RapportActivite;
  setFormData: React.Dispatch<React.SetStateAction<RapportActivite>>;
}

const ParametresCles: React.FC<ParametresClesProps> = ({ formData, setFormData }) => {
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
                <th className="border border-gray-300 px-3 py-2 text-center">Effectif Garçons</th>
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
                    value={formData.parametresCles.niveauPrescolaire.espaceCommunautaireEveil.nombreEcoles}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value) || 0;
                      setFormData(prev => ({
                        ...prev,
                        parametresCles: {
                          ...prev.parametresCles,
                          niveauPrescolaire: {
                            ...prev.parametresCles.niveauPrescolaire,
                            espaceCommunautaireEveil: {
                              ...prev.parametresCles.niveauPrescolaire.espaceCommunautaireEveil,
                              nombreEcoles: newValue
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
                    type="number"
                    value={formData.parametresCles.niveauPrescolaire.espaceCommunautaireEveil.nombreClasses}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value) || 0;
                      setFormData(prev => ({
                        ...prev,
                        parametresCles: {
                          ...prev.parametresCles,
                          niveauPrescolaire: {
                            ...prev.parametresCles.niveauPrescolaire,
                            espaceCommunautaireEveil: {
                              ...prev.parametresCles.niveauPrescolaire.espaceCommunautaireEveil,
                              nombreClasses: newValue
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
                    type="number"
                    value={formData.parametresCles.niveauPrescolaire.espaceCommunautaireEveil.effectifGarcons}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value) || 0;
                      setFormData(prev => ({
                        ...prev,
                        parametresCles: {
                          ...prev.parametresCles,
                          niveauPrescolaire: {
                            ...prev.parametresCles.niveauPrescolaire,
                            espaceCommunautaireEveil: {
                              ...prev.parametresCles.niveauPrescolaire.espaceCommunautaireEveil,
                              effectifGarcons: newValue
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
                    type="number"
                    value={formData.parametresCles.niveauPrescolaire.espaceCommunautaireEveil.effectifFilles}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value) || 0;
                      setFormData(prev => ({
                        ...prev,
                        parametresCles: {
                          ...prev.parametresCles,
                          niveauPrescolaire: {
                            ...prev.parametresCles.niveauPrescolaire,
                            espaceCommunautaireEveil: {
                              ...prev.parametresCles.niveauPrescolaire.espaceCommunautaireEveil,
                              effectifFilles: newValue
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
                    type="number"
                    value={formData.parametresCles.niveauPrescolaire.espaceCommunautaireEveil.tauxAccroissement}
                    onChange={(e) => {
                      const newValue = parseFloat(e.target.value) || 0;
                      setFormData(prev => ({
                        ...prev,
                        parametresCles: {
                          ...prev.parametresCles,
                          niveauPrescolaire: {
                            ...prev.parametresCles.niveauPrescolaire,
                            espaceCommunautaireEveil: {
                              ...prev.parametresCles.niveauPrescolaire.espaceCommunautaireEveil,
                              tauxAccroissement: newValue
                            }
                          }
                        }
                      }));
                    }}
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
                    value={formData.parametresCles.niveauPrescolaire.maternel.nombreEcoles}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value) || 0;
                      setFormData(prev => ({
                        ...prev,
                        parametresCles: {
                          ...prev.parametresCles,
                          niveauPrescolaire: {
                            ...prev.parametresCles.niveauPrescolaire,
                            maternel: {
                              ...prev.parametresCles.niveauPrescolaire.maternel,
                              nombreEcoles: newValue
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
                    type="number"
                    value={formData.parametresCles.niveauPrescolaire.maternel.nombreClasses}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value) || 0;
                      setFormData(prev => ({
                        ...prev,
                        parametresCles: {
                          ...prev.parametresCles,
                          niveauPrescolaire: {
                            ...prev.parametresCles.niveauPrescolaire,
                            maternel: {
                              ...prev.parametresCles.niveauPrescolaire.maternel,
                              nombreClasses: newValue
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
                    type="number"
                    value={formData.parametresCles.niveauPrescolaire.maternel.effectifGarcons}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value) || 0;
                      setFormData(prev => ({
                        ...prev,
                        parametresCles: {
                          ...prev.parametresCles,
                          niveauPrescolaire: {
                            ...prev.parametresCles.niveauPrescolaire,
                            maternel: {
                              ...prev.parametresCles.niveauPrescolaire.maternel,
                              effectifGarcons: newValue
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
                    type="number"
                    value={formData.parametresCles.niveauPrescolaire.maternel.effectifFilles}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value) || 0;
                      setFormData(prev => ({
                        ...prev,
                        parametresCles: {
                          ...prev.parametresCles,
                          niveauPrescolaire: {
                            ...prev.parametresCles.niveauPrescolaire,
                            maternel: {
                              ...prev.parametresCles.niveauPrescolaire.maternel,
                              effectifFilles: newValue
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
                    type="number"
                    value={formData.parametresCles.niveauPrescolaire.maternel.tauxAccroissement}
                    onChange={(e) => {
                      const newValue = parseFloat(e.target.value) || 0;
                      setFormData(prev => ({
                        ...prev,
                        parametresCles: {
                          ...prev.parametresCles,
                          niveauPrescolaire: {
                            ...prev.parametresCles.niveauPrescolaire,
                            maternel: {
                              ...prev.parametresCles.niveauPrescolaire.maternel,
                              tauxAccroissement: newValue
                            }
                          }
                        }
                      }));
                    }}
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
                    value={formData.parametresCles.niveauPrescolaire.prePrimaire.nombreEcoles}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value) || 0;
                      setFormData(prev => ({
                        ...prev,
                        parametresCles: {
                          ...prev.parametresCles,
                          niveauPrescolaire: {
                            ...prev.parametresCles.niveauPrescolaire,
                            prePrimaire: {
                              ...prev.parametresCles.niveauPrescolaire.prePrimaire,
                              nombreEcoles: newValue
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
                    type="number"
                    value={formData.parametresCles.niveauPrescolaire.prePrimaire.nombreClasses}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value) || 0;
                      setFormData(prev => ({
                        ...prev,
                        parametresCles: {
                          ...prev.parametresCles,
                          niveauPrescolaire: {
                            ...prev.parametresCles.niveauPrescolaire,
                            prePrimaire: {
                              ...prev.parametresCles.niveauPrescolaire.prePrimaire,
                              nombreClasses: newValue
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
                    type="number"
                    value={formData.parametresCles.niveauPrescolaire.prePrimaire.effectifGarcons}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value) || 0;
                      setFormData(prev => ({
                        ...prev,
                        parametresCles: {
                          ...prev.parametresCles,
                          niveauPrescolaire: {
                            ...prev.parametresCles.niveauPrescolaire,
                            prePrimaire: {
                              ...prev.parametresCles.niveauPrescolaire.prePrimaire,
                              effectifGarcons: newValue
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
                    type="number"
                    value={formData.parametresCles.niveauPrescolaire.prePrimaire.effectifFilles}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value) || 0;
                      setFormData(prev => ({
                        ...prev,
                        parametresCles: {
                          ...prev.parametresCles,
                          niveauPrescolaire: {
                            ...prev.parametresCles.niveauPrescolaire,
                            prePrimaire: {
                              ...prev.parametresCles.niveauPrescolaire.prePrimaire,
                              effectifFilles: newValue
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
                    type="number"
                    value={formData.parametresCles.niveauPrescolaire.prePrimaire.tauxAccroissement}
                    onChange={(e) => {
                      const newValue = parseFloat(e.target.value) || 0;
                      setFormData(prev => ({
                        ...prev,
                        parametresCles: {
                          ...prev.parametresCles,
                          niveauPrescolaire: {
                            ...prev.parametresCles.niveauPrescolaire,
                            prePrimaire: {
                              ...prev.parametresCles.niveauPrescolaire.prePrimaire,
                              tauxAccroissement: newValue
                            }
                          }
                        }
                      }));
                    }}
                    className="w-full text-center border-none focus:outline-none focus:ring-0"
                  />
                </td>
              </tr>

              {/* d) Spécial (handicap) */}
              <tr>
                <td className="border border-gray-300 px-3 py-2 font-medium">d) Spécial (handicap)</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input
                    type="number"
                    value={formData.parametresCles.niveauPrescolaire.special.nombreEcoles}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value) || 0;
                      setFormData(prev => ({
                        ...prev,
                        parametresCles: {
                          ...prev.parametresCles,
                          niveauPrescolaire: {
                            ...prev.parametresCles.niveauPrescolaire,
                            special: {
                              ...prev.parametresCles.niveauPrescolaire.special,
                              nombreEcoles: newValue
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
                    type="number"
                    value={formData.parametresCles.niveauPrescolaire.special.nombreClasses}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value) || 0;
                      setFormData(prev => ({
                        ...prev,
                        parametresCles: {
                          ...prev.parametresCles,
                          niveauPrescolaire: {
                            ...prev.parametresCles.niveauPrescolaire,
                            special: {
                              ...prev.parametresCles.niveauPrescolaire.special,
                              nombreClasses: newValue
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
                    type="number"
                    value={formData.parametresCles.niveauPrescolaire.special.effectifGarcons}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value) || 0;
                      setFormData(prev => ({
                        ...prev,
                        parametresCles: {
                          ...prev.parametresCles,
                          niveauPrescolaire: {
                            ...prev.parametresCles.niveauPrescolaire,
                            special: {
                              ...prev.parametresCles.niveauPrescolaire.special,
                              effectifGarcons: newValue
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
                    type="number"
                    value={formData.parametresCles.niveauPrescolaire.special.effectifFilles}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value) || 0;
                      setFormData(prev => ({
                        ...prev,
                        parametresCles: {
                          ...prev.parametresCles,
                          niveauPrescolaire: {
                            ...prev.parametresCles.niveauPrescolaire,
                            special: {
                              ...prev.parametresCles.niveauPrescolaire.special,
                              effectifFilles: newValue
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
                    type="number"
                    value={formData.parametresCles.niveauPrescolaire.special.tauxAccroissement}
                    onChange={(e) => {
                      const newValue = parseFloat(e.target.value) || 0;
                      setFormData(prev => ({
                        ...prev,
                        parametresCles: {
                          ...prev.parametresCles,
                          niveauPrescolaire: {
                            ...prev.parametresCles.niveauPrescolaire,
                            special: {
                              ...prev.parametresCles.niveauPrescolaire.special,
                              tauxAccroissement: newValue
                            }
                          }
                        }
                      }));
                    }}
                    className="w-full text-center border-none focus:outline-none focus:ring-0"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ParametresCles; 