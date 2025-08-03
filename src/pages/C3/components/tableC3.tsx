import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../app/store';
import { fetchAllC3s, setC3store } from '../../../features/c3/c3Slice';
import moment from 'moment';
import { GraduationCap, ClipboardCheck, FileCheck, CheckSquare } from 'lucide-react';

// Components
// const TotalDisplay = ({ label, value }: { label: string; value: number | string }) => (
//   <div className="text-sm">
//     <span className="font-medium">{label}:</span> {value}
//   </div>
// );

const Loader = () => (
  <div className="flex justify-center items-center h-full">
    <svg className="animate-spin h-10 w-10 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
    </svg>
  </div>
);

const DetailModal = ({ isOpen, onClose, c3 }: { isOpen: boolean; onClose: () => void; c3: any }) => {
  if (!isOpen || !c3) return null;

  const evaluationSections = [
    {
      title: "Personnalité",
      data: c3.grilleEvaluation.personnalite,
      fields: {
        presentation: "Présentation",
        autorite: "Autorité",
        elocution: "Élocution",
        attitude: "Attitude",
        tenueSalle: "Tenue de la salle",
        tenueTableau: "Tenue du tableau",
        presenceEsprit: "Présence d'esprit"
      }
    },
    {
      title: "Maîtrise du Programme",
      data: c3.grilleEvaluation.maitriseProgramme,
      fields: {
        competence: "Compétence",
        conformite: "Conformité",
        progression: "Progression",
        adaptationMilieu: "Adaptation au milieu",
        decomposition: "Décomposition"
      }
    },
    {
      title: "Maîtrise de la Discipline",
      data: c3.grilleEvaluation.maitriseDiscipline,
      fields: {
        connaissanceMatiere: "Connaissance de la matière",
        exactitude: "Exactitude",
        dosage: "Dosage",
        formulation: "Formulation",
        adaptation: "Adaptation"
      }
    },
    {
      title: "Structure de la Leçon",
      data: c3.grilleEvaluation.structureLecon,
      fields: {
        preparation: "Préparation",
        motivation: "Motivation",
        verificationJournal: "Vérification du journal",
        developpement: "Développement",
        evaluation: "Évaluation",
        synthese: "Synthèse",
        application: "Application"
      }
    },
    {
      title: "Stratégie",
      data: c3.grilleEvaluation.strategie,
      fields: {
        didactiqueGenerale: "Didactique générale",
        distribution: "Distribution",
        integrationPedagogique: "Intégration pédagogique",
        facilitePedagogique: "Facilité pédagogique"
      }
    },
    {
      title: "Moyens d'Enseignement",
      data: c3.grilleEvaluation.moyensEnseignement,
      fields: {
        materielDidactique: "Matériel didactique",
        materielSpecifique: "Matériel spécifique",
        utilisationTableau: "Utilisation du tableau"
      }
    },
    {
      title: "Documents des Apprenants",
      data: c3.grilleEvaluation.documentsApprenants,
      fields: {
        cahierLecons: "Cahier de leçons",
        cahierExercices: "Cahier d'exercices",
        fiches: "Fiches"
      }
    },
    {
      title: "Documents de l'Enseignant",
      data: c3.grilleEvaluation.documentsEnseignant,
      fields: {
        previsions: "Prévisions",
        journalClasse: "Journal de classe",
        fichesPrep: "Fiches de préparation",
        cahierTextes: "Cahier de textes",
        cahierPoints: "Cahier de points",
        documentationEcrite: "Documentation écrite"
      }
    },
    {
      title: "Évaluation des Acquis",
      data: c3.grilleEvaluation.evaluationAcquis,
      fields: {
        assiduite: "Assiduité",
        evaluationDiagnostique: "Évaluation diagnostique",
        evaluationFormative: "Évaluation formative",
        rattrapage: "Rattrapage",
        evaluationSommative: "Évaluation sommative"
      }
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 mt-20 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-boxdark rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-black dark:text-white">
            Détails de l'inspection pédagogique (C3)
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-100 dark:bg-meta-4 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-black dark:text-white">Information de l'enseignant</h3>
            <div>
              <p>Nom: {c3.enseignant.nom}</p>
              <p>Postnom: {c3.enseignant.postnom}</p>
              <p>Prénom: {c3.enseignant.prenom}</p>
            </div>
          </div>

          <div className="bg-gray-100 dark:bg-meta-4 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-black dark:text-white">Activités inspectées</h3>
            {c3.activitesInspectees.map((activite: any, index: number) => (
              <div key={index} className="mb-2">
                <p>Discipline: {activite.discipline}</p>
                <p>Classe: {activite.classe}</p>
                <p>Leçon: {activite.lecon}</p>
                <p>Durée: {activite.duree}</p>
              </div>
            ))}
          </div>

          {evaluationSections.map((section, index) => (
            <div key={index} className="bg-gray-100 dark:bg-meta-4 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-black dark:text-white">{section.title}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(section.fields).map(([key, label]) => (
                  <div key={key} className="flex justify-between">
                    <span>{label}:</span>
                    <span className="font-medium">{section.data[key]}/5</span>
                  </div>
                ))}
                {section.data.conseils && (
                  <div className="col-span-2">
                    <p className="font-medium mt-2">Conseils:</p>
                    <p className="text-sm">{section.data.conseils || 'Aucun conseil'}</p>
                  </div>
                )}
              </div>
            </div>
          ))}

          <div className="bg-gray-100 dark:bg-meta-4 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-black dark:text-white">Évaluation synthétique</h3>
            <div>
              <p>Total: {c3.evaluationSynthetique.total}/100</p>
              <p>Niveau: {
                c3.evaluationSynthetique.grille.find((g: any) => 
                  c3.evaluationSynthetique.total >= g.min && 
                  c3.evaluationSynthetique.total <= g.max
                )?.niveau || 'Non défini'
              }</p>
            </div>
          </div>

          <div className="bg-gray-100 dark:bg-meta-4 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-black dark:text-white">Signatures</h3>
            <div>
              <p>Enseignant: {c3.signatureEnseignant}</p>
              <p>Chef d'établissement: {c3.signatureChefEtablissement}</p>
              <p>Inspecteur: {c3.signatureInspecteur}</p>
              <p>Date d'inspection: {moment(c3.dateInspection).format('DD-MM-YYYY')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }: { currentPage: number; totalPages: number; onPageChange: (page: number) => void }) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Page <span className="font-medium">{currentPage}</span> sur{' '}
            <span className="font-medium">{totalPages}</span>
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Previous</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
              </svg>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <button
                key={number}
                onClick={() => onPageChange(number)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                  currentPage === number
                    ? 'z-10 bg-primary text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
                    : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
                }`}
              >
                {number}
              </button>
            ))}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Next</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

const TableC3 = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [c3s, setC3s] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedC3, setSelectedC3] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchC3s = async () => {
      const email = localStorage.getItem('email');
      const password = localStorage.getItem('password');

      if (email && password) {
        try {
          setLoading(true);
          const result = await dispatch(fetchAllC3s({ route: 'inspections-pedagogique' })).unwrap();
          setC3s(result);
          dispatch(setC3store(result.reverse()));
        } catch (err) {
          console.error('get all inspections pedagogiques failed:', err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchC3s();
  }, [dispatch]);

  const openModal = (c3: any) => {
    setSelectedC3(c3);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedC3(null);
  };

  const totalPages = Math.ceil(c3s.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedC3s = c3s.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          {loading ? (
            <Loader />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 mb-10">
                <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
                  <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
                    <GraduationCap className="h-6 w-6 stroke-primary dark:stroke-white" strokeWidth={1.5} />
                  </div>
                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <h4 className="text-title-md font-bold text-black dark:text-white">
                        {c3s.length}
                      </h4>
                      <span className="text-sm font-medium">Total Inspections</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
                  <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
                    <ClipboardCheck className="h-6 w-6 stroke-primary dark:stroke-white" strokeWidth={1.5} />
                  </div>
                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <h4 className="text-title-md font-bold text-black dark:text-white">
                        {c3s.filter(c3 => c3.evaluationSynthetique.total >= 90).length}
                      </h4>
                      <span className="text-sm font-medium">Excellent</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
                  <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
                    <FileCheck className="h-6 w-6 stroke-primary dark:stroke-white" strokeWidth={1.5} />
                  </div>
                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <h4 className="text-title-md font-bold text-black dark:text-white">
                        {c3s.filter(c3 => c3.evaluationSynthetique.total >= 70 && c3.evaluationSynthetique.total < 90).length}
                      </h4>
                      <span className="text-sm font-medium">Très Bien/Bien</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
                  <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
                    <CheckSquare className="h-6 w-6 stroke-primary dark:stroke-white" strokeWidth={1.5} />
                  </div>
                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <h4 className="text-title-md font-bold text-black dark:text-white">
                        {c3s.filter(c3 => c3.evaluationSynthetique.total < 50).length}
                      </h4>
                      <span className="text-sm font-medium">Médiocre</span>
                    </div>
                  </div>
                </div>
              </div>

              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-2 text-left dark:bg-meta-4 border border-[#eee] dark:border-strokedark">
                    <th className="dark:border-strokedark border border-[#eee] min-w-[220px] px-4 py-2 font-medium text-black dark:text-white">
                      École
                    </th>
                    <th className="dark:border-strokedark border border-[#eee] min-w-[150px] px-4 py-2 font-medium text-black dark:text-white">
                      Enseignant
                    </th>
                    <th className="dark:border-strokedark border border-[#eee] min-w-[150px] px-4 py-2 font-medium text-black dark:text-white">
                      Discipline
                    </th>
                    <th className="dark:border-strokedark border border-[#eee] min-w-[100px] px-4 py-2 font-medium text-black dark:text-white">
                      Classe
                    </th>
                    <th className="dark:border-strokedark border border-[#eee] min-w-[100px] px-4 py-2 font-medium text-black dark:text-white">
                      Note
                    </th>
                    <th className="dark:border-strokedark border border-[#eee] min-w-[150px] px-4 py-2 font-medium text-black dark:text-white">
                      Niveau
                    </th>
                    <th className="dark:border-strokedark border border-[#eee] min-w-[150px] px-4 py-2 font-medium text-black dark:text-white">
                      Date d'inspection
                    </th>
                    <th className="dark:border-strokedark border border-[#eee] py-4 px-4 font-medium text-black dark:text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedC3s.map((c3, key) => (
                    <tr key={key} className='dark:border-strokedark border border-[#eee]'>
                      <td className="border dark:border-strokedark border-[#eee] px-4 py-2">
                        {c3.etablissement.nom}
                      </td>
                      <td className="border dark:border-strokedark border-[#eee] px-4 py-2">
                        {`${c3.enseignant.nom} ${c3.enseignant.postnom}`}
                      </td>
                      <td className="border dark:border-strokedark border-[#eee] px-4 py-2">
                        {c3.activitesInspectees[0]?.discipline}
                      </td>
                      <td className="border dark:border-strokedark border-[#eee] px-4 py-2">
                        {c3.activitesInspectees[0]?.classe}
                      </td>
                      <td className="border dark:border-strokedark border-[#eee] px-4 py-2">
                        {c3.evaluationSynthetique.total}/100
                      </td>
                      <td className="border dark:border-strokedark border-[#eee] px-4 py-2">
                        {c3.evaluationSynthetique.grille.find((g: any) => 
                          c3.evaluationSynthetique.total >= g.min && 
                          c3.evaluationSynthetique.total <= g.max
                        )?.niveau || 'Non défini'}
                      </td>
                      <td className="border dark:border-strokedark border-[#eee] px-4 py-2">
                        {moment(c3.dateInspection).format('DD-MM-YYYY')}
                      </td>
                      <td className="dark:border-strokedark border-b border-[#eee] py-5 px-4">
                        <div className="flex items-center space-x-3.5">
                          <button
                            className="hover:text-primary"
                            onClick={() => openModal(c3)}
                          >
                            <svg
                              className="fill-current"
                              width="18"
                              height="18"
                              viewBox="0 0 18 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z"
                                fill=""
                              />
                              <path
                                d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                                fill=""
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      </div>

      <DetailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        c3={selectedC3}
      />
    </>
  );
};

export default TableC3;