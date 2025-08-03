import React, { useState, useEffect } from 'react';
import { rapportActiviteService } from '../../services/rapportActivite/rapportActiviteService';
import { RapportActivite } from '../../models/RapportActivite';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import toast from 'react-hot-toast';

const RapportActivitePage: React.FC = () => {
  const [rapports, setRapports] = useState<RapportActivite[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    loadRapports();
  }, [selectedYear, selectedStatus]);

  const loadRapports = async () => {
    try {
      setLoading(true);
      let rapportsData: RapportActivite[] = [];

      if (selectedStatus === 'all') {
        rapportsData = await rapportActiviteService.getRapportsByYear(selectedYear);
      } else {
        rapportsData = await rapportActiviteService.getRapportsByStatus(selectedStatus as any);
      }

      setRapports(rapportsData);
    } catch (error) {
      console.error('Erreur lors du chargement des rapports:', error);
      toast.error('Erreur lors du chargement des rapports');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce rapport ?')) {
      try {
        await rapportActiviteService.deleteRapport(id);
        toast.success('Rapport supprimé avec succès');
        loadRapports();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const handleSubmit = async (id: string) => {
    try {
      await rapportActiviteService.submitRapport(id);
      toast.success('Rapport soumis avec succès');
      loadRapports();
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      toast.error('Erreur lors de la soumission');
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await rapportActiviteService.approveRapport(id);
      toast.success('Rapport approuvé avec succès');
      loadRapports();
    } catch (error) {
      console.error('Erreur lors de l\'approbation:', error);
      toast.error('Erreur lors de l\'approbation');
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Raison du rejet:');
    if (reason) {
      try {
        await rapportActiviteService.rejectRapport(id, reason);
        toast.success('Rapport rejeté avec succès');
        loadRapports();
      } catch (error) {
        console.error('Erreur lors du rejet:', error);
        toast.error('Erreur lors du rejet');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      brouillon: 'bg-gray-100 text-gray-800',
      soumis: 'bg-blue-100 text-blue-800',
      approuve: 'bg-green-100 text-green-800',
      rejete: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status as keyof typeof statusClasses] || statusClasses.brouillon}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

  return (
    <>
      <Breadcrumb pageName="Rapports d'activité" />

      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-title-md2 font-semibold text-black dark:text-white">
            Rapports d'activité
          </h2>
          <button
            onClick={() => window.location.href = '/rapport-activite/create'}
            className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          >
            Nouveau rapport
          </button>
        </div>

        {/* Filtres */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-black dark:text-white">Année:</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="rounded border border-stroke bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-black dark:text-white">Statut:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded border border-stroke bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">Tous</option>
              <option value="brouillon">Brouillon</option>
              <option value="soumis">Soumis</option>
              <option value="approuve">Approuvé</option>
              <option value="rejete">Rejeté</option>
            </select>
          </div>
        </div>

        {/* Tableau des rapports */}
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                    Année
                  </th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    PROVED
                  </th>
                  <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Statut
                  </th>
                  <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Créé le
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-4 px-4 text-center">
                      Chargement...
                    </td>
                  </tr>
                ) : rapports.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-4 px-4 text-center text-gray-500">
                      Aucun rapport trouvé
                    </td>
                  </tr>
                ) : (
                  rapports.map((rapport) => (
                    <tr key={rapport._id} className="border-b border-[#eee] dark:border-strokedark">
                      <td className="py-5 px-4 pl-9 dark:bg-meta-4 xl:pl-11">
                        <h5 className="font-medium text-black dark:text-white">
                          {rapport.annee}
                        </h5>
                      </td>
                      <td className="py-5 px-4 dark:bg-meta-4">
                        <p className="text-black dark:text-white">
                          {rapport.identificationProved}
                        </p>
                      </td>
                      <td className="py-5 px-4 dark:bg-meta-4">
                        {getStatusBadge(rapport.statut)}
                      </td>
                      <td className="py-5 px-4 dark:bg-meta-4">
                        <p className="text-black dark:text-white">
                          {rapport.createdAt ? new Date(rapport.createdAt).toLocaleDateString() : '-'}
                        </p>
                      </td>
                      <td className="py-5 px-4 dark:bg-meta-4">
                        <div className="flex items-center space-x-3.5">
                          <button
                            onClick={() => window.location.href = `/rapport-activite/${rapport._id}`}
                            className="hover:text-primary"
                          >
                            <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.17812 8.99981 3.17812C14.5686 3.17812 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 9.00062C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 9.00062C15.5248 7.96062 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.96062 1.85605 9.00062Z" fill=""/>
                              <path d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z" fill=""/>
                            </svg>
                          </button>
                          <button
                            onClick={() => window.location.href = `/rapport-activite/${rapport._id}/edit`}
                            className="hover:text-primary"
                          >
                            <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.17812 8.99981 3.17812C14.5686 3.17812 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 9.00062C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 9.00062C15.5248 7.96062 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.96062 1.85605 9.00062Z" fill=""/>
                              <path d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z" fill=""/>
                            </svg>
                          </button>
                          {rapport.statut === 'brouillon' && (
                            <button
                              onClick={() => handleSubmit(rapport._id!)}
                              className="hover:text-primary"
                              title="Soumettre"
                            >
                              <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 0.75C4.17188 0.75 0.375 4.54688 0.375 9.375C0.375 14.2031 4.17188 18 9 18C13.8281 18 17.625 14.2031 17.625 9.375C17.625 4.54688 13.8281 0.75 9 0.75ZM13.5 9.75H9.75V13.5C9.75 13.9141 9.41406 14.25 9 14.25C8.58594 14.25 8.25 13.9141 8.25 13.5V9.75H4.5C4.08594 9.75 3.75 9.41406 3.75 9C3.75 8.58594 4.08594 8.25 4.5 8.25H8.25V4.5C8.25 4.08594 8.58594 3.75 9 3.75C9.41406 3.75 9.75 4.08594 9.75 4.5V8.25H13.5C13.9141 8.25 14.25 8.58594 14.25 9C14.25 9.41406 13.9141 9.75 13.5 9.75Z" fill=""/>
                              </svg>
                            </button>
                          )}
                          {rapport.statut === 'soumis' && (
                            <>
                              <button
                                onClick={() => handleApprove(rapport._id!)}
                                className="hover:text-green-600"
                                title="Approuver"
                              >
                                <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M9 0.75C4.17188 0.75 0.375 4.54688 0.375 9.375C0.375 14.2031 4.17188 18 9 18C13.8281 18 17.625 14.2031 17.625 9.375C17.625 4.54688 13.8281 0.75 9 0.75ZM13.5 7.5L8.25 12.75L4.5 9L5.25 8.25L8.25 11.25L12.75 6.75L13.5 7.5Z" fill=""/>
                                </svg>
                              </button>
                              <button
                                onClick={() => handleReject(rapport._id!)}
                                className="hover:text-red-600"
                                title="Rejeter"
                              >
                                <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M9 0.75C4.17188 0.75 0.375 4.54688 0.375 9.375C0.375 14.2031 4.17188 18 9 18C13.8281 18 17.625 14.2031 17.625 9.375C17.625 4.54688 13.8281 0.75 9 0.75ZM12.75 5.25L9 9L5.25 5.25L4.5 6L8.25 9.75L12 6L12.75 5.25Z" fill=""/>
                                </svg>
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDelete(rapport._id!)}
                            className="hover:text-danger"
                          >
                            <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z" fill=""/>
                              <path d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z" fill=""/>
                              <path d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.6033 10.2657V13.3313C10.6033 13.6688 10.8846 13.9782 11.2502 13.9782C11.5877 13.9782 11.8971 13.6969 11.8971 13.3313V10.2657C11.8971 9.90004 11.5877 9.64692 11.2502 9.67504Z" fill=""/>
                              <path d="M6.7502 9.67504C6.38458 9.64692 6.10333 9.90004 6.10333 10.2657V13.3313C6.10333 13.6688 6.38458 13.9782 6.7502 13.9782C7.0877 13.9782 7.39708 13.6969 7.39708 13.3313V10.2657C7.39708 9.90004 7.0877 9.64692 6.7502 9.67504Z" fill=""/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default RapportActivitePage; 