import React, { useState, useEffect } from 'react';
import { ficheAutoEvaluationService } from '../../services/ficheAutoEvaluation/ficheAutoEvaluationService';
import { FicheAutoEvaluation } from '../../models/FicheAutoEvaluation';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import moment from 'moment';

const FicheAutoEvaluationPage: React.FC = () => {
  const [fiches, setFiches] = useState<FicheAutoEvaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFiche, setSelectedFiche] = useState<FicheAutoEvaluation | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    loadUserRole();
  }, []);

  useEffect(() => {
    if (userRole) {
      loadFiches();
    }
  }, [userRole]);

  const loadUserRole = () => {
    try {
      // Essayer de récupérer depuis localStorage
      const userData = localStorage.getItem('data');
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        setUserRole(parsedUserData.role || '');
        return;
      }

      // Essayer de récupérer depuis sessionStorage
      const sessionData = sessionStorage.getItem('data');
      if (sessionData) {
        const parsedSessionData = JSON.parse(sessionData);
        setUserRole(parsedSessionData.role || '');
        return;
      }

      // Fallback pour les tests
      setUserRole('admin');
    } catch (error) {
      console.error('Erreur lors du chargement du rôle utilisateur:', error);
      setUserRole('user');
    }
  };

  const loadFiches = async () => {
    try {
      setLoading(true);
      const data = await ficheAutoEvaluationService.getAllFiches();
      
      // Filtrer les données selon le rôle de l'utilisateur
      if (userRole !== 'admin' && userRole !== 'Administrateur' && userRole !== 'ADMIN') {
        // Pour les utilisateurs normaux, ne montrer que leurs propres fiches
        const userData = JSON.parse(localStorage.getItem('data') || '{}');
        
        // Note: identificationProved est maintenant un objet, donc on ne peut pas filtrer par ID
        // Les utilisateurs normaux verront toutes les fiches pour l'instant
        // TODO: Implémenter un système de filtrage basé sur l'ID utilisateur si nécessaire
        setFiches(data);
      } else {
        // Pour les admins, montrer toutes les fiches
        setFiches(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des fiches:', error);
      toast.error('Erreur lors du chargement des fiches d\'auto-évaluation');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette fiche d\'auto-évaluation ?')) {
      try {
        await ficheAutoEvaluationService.deleteFiche(id);
        toast.success('Fiche d\'auto-évaluation supprimée avec succès');
        loadFiches();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const handleExportExcel = async () => {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const data = JSON.parse(localStorage.getItem('data') || '{}');

    // Fonction pour obtenir le nom de la personne connectée
    const getUserName = () => {
      if (data.prenom && data.nom) {
        return `${data.prenom} ${data.nom}`;
      }
      if (data.prenom && data.nom && data.postnom) {
        return `${data.prenom} ${data.nom} ${data.postnom}`;
      }
      if (data.nom && data.postnom) {
        return `${data.nom} ${data.postnom}`;
      }
      if (data.fullName) {
        return data.fullName;
      }
      if (data.name) {
        return data.name;
      }
      if (data.nom) {
        return data.nom;
      }
      if (data.prenom) {
        return data.prenom;
      }
      if (data.nomProved) {
        return data.nomProved;
      }
      return 'Utilisateur';
    };

    const userName = getUserName();

    // Formatage des données pour Excel
    const formattedData = fiches.map((fiche: any, index: any) => {
      return {
        N: index + 1,
        "Intitulé Formation": fiche.intituleFormation,
        "Contenu Clair": fiche.contenuComprehension?.contenuClair || '',
        "Nouvelles Connaissances": fiche.contenuComprehension?.nouvellesConnaissances || '',
        "Participation Active": fiche.participationImplication?.participationActive || '',
        "Rythme Adapté": fiche.participationImplication?.rythmeAdapte || '',
        "Thèmes Utiles": fiche.pertinenceUtilite?.themesUtiles || '',
        "Capacité Application": fiche.pertinenceUtilite?.capaciteApplication || '',
        "Ce qui est apprécié": fiche.suggestionsCommentaires?.ceQuiApprecie || '',
        "Améliorations": fiche.suggestionsCommentaires?.ameliorations || '',
        "Autres Commentaires": fiche.suggestionsCommentaires?.autresCommentaires || '',
        "Statut": fiche.statut,
        "Créé le": fiche.createdAt ? moment(fiche.createdAt).format('DD/MM/YYYY') : '-',
        "Modifié le": fiche.updatedAt ? moment(fiche.updatedAt).format('DD/MM/YYYY') : '-',
      };
    });

    // Création de la feuille Excel
    const ws = XLSX.utils.aoa_to_sheet([
      ['FICHES D\'AUTO-ÉVALUATION'], // Titre
      [''], // Ligne vide
      ['Exporté par:', userName], // Informations sur l'exportateur
      ['Date d\'export:', moment().format('DD/MM/YYYY à HH:mm')], // Date d'export
      ['Total des fiches:', formattedData.length], // Nombre total
      [''], // Ligne vide
      // En-têtes des colonnes
      Object.keys(formattedData[0] || {}),
      // Données
      ...formattedData.map(row => Object.values(row))
    ]);

    // Style pour le titre
    ws['A1'] = { v: 'FICHES D\'AUTO-ÉVALUATION', s: { font: { bold: true, size: 16 } } };
    ws['A3'] = { v: 'Exporté par:', s: { font: { bold: true } } };
    ws['B3'] = { v: userName };
    ws['A4'] = { v: 'Date d\'export:', s: { font: { bold: true } } };
    ws['B4'] = { v: moment().format('DD/MM/YYYY à HH:mm') };
    ws['A5'] = { v: 'Total des fiches:', s: { font: { bold: true } } };
    ws['B5'] = { v: formattedData.length };

    // Ajuster la largeur des colonnes
    const columnWidths = [
      { wch: 5 },   // N
      { wch: 30 },  // Intitulé Formation
      { wch: 20 },  // Contenu Clair
      { wch: 25 },  // Nouvelles Connaissances
      { wch: 20 },  // Participation Active
      { wch: 20 },  // Rythme Adapté
      { wch: 25 },  // Thèmes Utiles
      { wch: 25 },  // Capacité Application
      { wch: 30 },  // Ce qui est apprécié
      { wch: 30 },  // Améliorations
      { wch: 30 },  // Autres Commentaires
      { wch: 15 },  // Statut
      { wch: 15 },  // Créé le
      { wch: 15 },  // Modifié le
    ];

    ws['!cols'] = columnWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Fiches Auto-évaluation');

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: fileType });
    saveAs(dataBlob, `fiches-auto-evaluation-${moment().format('YYYY-MM-DD')}.xlsx`);
    toast.success('Export Excel réussi');
  };

  const openDetailModal = (fiche: FicheAutoEvaluation) => {
    setSelectedFiche(fiche);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setSelectedFiche(null);
    setShowDetailModal(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'brouillon': return 'bg-gray-100 text-gray-800';
      case 'soumis': return 'bg-blue-100 text-blue-800';
      case 'approuve': return 'bg-green-100 text-green-800';
      case 'rejete': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'brouillon': return 'Brouillon';
      case 'soumis': return 'Soumis';
      case 'approuve': return 'Approuvé';
      case 'rejete': return 'Rejeté';
      default: return status;
    }
  };

  const filteredFiches = fiches.filter(fiche => {
    const matchesSearch = 
      fiche.intituleFormation.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || fiche.statut === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      {/* <Breadcrumb pageName="Fiches Auto-évaluation" /> */}

      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-title-md2 font-semibold text-black dark:text-white">
            Fiches d'Auto-évaluation
          </h2>
          <div className="flex items-center gap-3">
            {(userRole === 'admin' || userRole === 'Administrateur' || userRole === 'ADMIN') && (
              <div onClick={handleExportExcel} className="cursor-pointer" title="Exporter en Excel">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48px" height="48px">
                  <path fill="#4CAF50" d="M41,10H25v28h16c0.553,0,1-0.447,1-1V11C42,10.447,41.553,10,41,10z" />
                  <path fill="#FFF" d="M32 15H39V18H32zM32 25H39V28H32zM32 30H39V33H32zM32 20H39V23H32zM25 15H30V18H25zM25 25H30V28H25zM25 30H30V33H25zM25 20H30V23H25z" />
                  <path fill="#2E7D32" d="M27 42L6 38 6 10 27 6z" />
                  <path fill="#FFF" d="M19.129,31l-2.411-4.561c-0.092-0.171-0.186-0.483-0.284-0.938h-0.037c-0.046,0.215-0.154,0.541-0.324,0.979L13.652,31H9.895l4.462-7.001L10.274,17h3.837l2.001,4.196c0.156,0.331,0.296,0.725,0.42,1.179h0.04c0.078-0.271,0.224-0.68,0.439-1.22L19.237,17h3.515l-4.199,6.939l4.316,7.059h-3.74V31z" />
                </svg>
              </div>
            )}
            {(() => {
              console.log('🔍 userRole actuel:', userRole);
              console.log('🔍 Condition bouton:', userRole !== 'admin' && userRole !== 'Administrateur' && userRole !== 'ADMIN');
              return (userRole !== 'admin' && userRole !== 'Administrateur' && userRole !== 'ADMIN') && (
                <button
                  onClick={() => window.location.href = '/fiche-auto-evaluation/create'}
                  className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                >
                  Nouvelle Fiche
                </button>
              );
            })()}
          </div>
        </div>

        {/* Message pour les utilisateurs normaux */}
        {userRole !== 'admin' && userRole !== 'Administrateur' && userRole !== 'ADMIN' && (
          <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
            Vous voyez uniquement vos propres fiches d'auto-évaluation.
          </div>
        )}

        {/* Filtres */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-10 pr-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.7 14.3L11.5 10.1C12.4 9.1 13 7.8 13 6.3C13 2.8 10.2 0 6.7 0C3.2 0 0.4 2.8 0.4 6.3C0.4 9.8 3.2 12.6 6.7 12.6C8.2 12.6 9.5 12 10.5 11.1L14.7 15.3C14.9 15.5 15.2 15.5 15.4 15.3C15.6 15.1 15.6 14.8 15.4 14.6L15.7 14.3ZM6.7 11.6C4.1 11.6 2 9.5 2 6.9C2 4.3 4.1 2.2 6.7 2.2C9.3 2.2 11.4 4.3 11.4 6.9C11.4 9.5 9.3 11.6 6.7 11.6Z" fill="currentColor"/>
              </svg>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-stroke bg-transparent py-2 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            >
              <option value="all">Tous les statuts</option>
              <option value="brouillon">Brouillon</option>
              <option value="soumis">Soumis</option>
              <option value="approuve">Approuvé</option>
              <option value="rejete">Rejeté</option>
            </select>
          </div>
          <div className="text-sm text-gray-500">
            {filteredFiches.length} fiche(s) trouvée(s)
          </div>
        </div>

        {/* Table */}
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                    Intitulé Formation
                  </th>

                  <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Statut
                  </th>
                  <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Date
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredFiches.map((fiche) => (
                  <tr key={fiche._id}>
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                      <h5 className="font-medium text-black dark:text-white">
                        {fiche.intituleFormation}
                      </h5>
                    </td>

                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <span className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${getStatusColor(fiche.statut)}`}>
                        {getStatusLabel(fiche.statut)}
                      </span>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {moment(fiche.createdAt).format('DD/MM/YYYY')}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <div className="flex items-center space-x-3.5">
                        <button
                          onClick={() => openDetailModal(fiche)}
                          className="hover:text-primary"
                        >
                          <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.17812 8.99981 3.17812C14.5686 3.17812 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 9.00001C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 9.00001C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 9.00001Z" fill=""/>
                            <path d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z" fill=""/>
                          </svg>
                        </button>
                        {fiche.statut === 'soumis' && (userRole === 'admin' || userRole === 'Administrateur' || userRole === 'ADMIN') && (
                          <>
                            <button
                              onClick={async () => {
                                try {
                                  await ficheAutoEvaluationService.approveFiche(fiche._id!);
                                  toast.success('Fiche approuvée avec succès');
                                  loadFiches();
                                } catch (error) {
                                  toast.error('Erreur lors de l\'approbation');
                                }
                              }}
                              className="hover:text-success"
                              title="Approuver"
                            >
                              <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 0.75C4.17157 0.75 0.25 4.67157 0.25 9.5C0.25 14.3284 4.17157 18.25 9 18.25C13.8284 18.25 17.75 14.3284 17.75 9.5C17.75 4.67157 13.8284 0.75 9 0.75ZM12.4393 6.43934C12.7318 6.14685 13.2067 6.14685 13.4992 6.43934C13.7917 6.73183 13.7917 7.2067 13.4992 7.49919L8.24919 12.7492C7.9567 13.0417 7.48183 13.0417 7.18934 12.7492L4.49919 10.0591C4.2067 9.76661 4.2067 9.29174 4.49919 8.99925C4.79168 8.70676 5.26655 8.70676 5.55904 8.99925L7.71927 11.1595L12.4393 6.43934Z" fill=""/>
                              </svg>
                            </button>
                            <button
                              onClick={async () => {
                                const reason = prompt('Raison du rejet:');
                                if (reason !== null) {
                                  try {
                                    await ficheAutoEvaluationService.rejectFiche(fiche._id!, reason);
                                    toast.success('Fiche rejetée avec succès');
                                    loadFiches();
                                  } catch (error) {
                                    toast.error('Erreur lors du rejet');
                                  }
                                }
                              }}
                              className="hover:text-danger"
                              title="Rejeter"
                            >
                              <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 0.75C4.17157 0.75 0.25 4.67157 0.25 9.5C0.25 14.3284 4.17157 18.25 9 18.25C13.8284 18.25 17.75 14.3284 17.75 9.5C17.75 4.67157 13.8284 0.75 9 0.75ZM12.4393 6.43934C12.7318 6.14685 13.2067 6.14685 13.4992 6.43934C13.7917 6.73183 13.7917 7.2067 13.4992 7.49919L8.24919 12.7492C7.9567 13.0417 7.48183 13.0417 7.18934 12.7492L4.49919 10.0591C4.2067 9.76661 4.2067 9.29174 4.49919 8.99925C4.79168 8.70676 5.26655 8.70676 5.55904 8.99925L7.71927 11.1595L12.4393 6.43934Z" fill=""/>
                              </svg>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de détails */}
      {showDetailModal && selectedFiche && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-boxdark rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-black dark:text-white">
                Détails de la Fiche d'Auto-évaluation
              </h3>
              <button
                onClick={closeDetailModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Informations générales */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-lg mb-3 text-blue-800">Informations Générales</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><span className="font-medium">Intitulé Formation:</span> {selectedFiche.intituleFormation}</div>
                  <div><span className="font-medium">Statut:</span> 
                    <span className={`ml-2 inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${getStatusColor(selectedFiche.statut)}`}>
                      {getStatusLabel(selectedFiche.statut)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contenu et Compréhension */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-lg mb-3 text-green-800">Contenu et Compréhension</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><span className="font-medium">Contenu Clair:</span> {selectedFiche.contenuComprehension.contenuClair}</div>
                  <div><span className="font-medium">Nouvelles Connaissances:</span> {selectedFiche.contenuComprehension.nouvellesConnaissances}</div>
                </div>
              </div>

              {/* Participation et Implication */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-lg mb-3 text-purple-800">Participation et Implication</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><span className="font-medium">Participation Active:</span> {selectedFiche.participationImplication.participationActive}</div>
                  <div><span className="font-medium">Rythme Adapté:</span> {selectedFiche.participationImplication.rythmeAdapte}</div>
                </div>
              </div>

              {/* Pertinence et Utilité */}
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-lg mb-3 text-orange-800">Pertinence et Utilité</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><span className="font-medium">Thèmes Utiles:</span> {selectedFiche.pertinenceUtilite.themesUtiles}</div>
                  <div><span className="font-medium">Capacité d'Application:</span> {selectedFiche.pertinenceUtilite.capaciteApplication}</div>
                </div>
              </div>

              {/* Suggestions et Commentaires */}
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-lg mb-3 text-yellow-800">Suggestions et Commentaires</h4>
                <div className="space-y-3 text-sm">
                  {selectedFiche.suggestionsCommentaires.ceQuiApprecie && (
                    <div>
                      <span className="font-medium">Ce qui est apprécié:</span>
                      <p className="mt-1 text-gray-700">{selectedFiche.suggestionsCommentaires.ceQuiApprecie}</p>
                    </div>
                  )}
                  {selectedFiche.suggestionsCommentaires.ameliorations && (
                    <div>
                      <span className="font-medium">Améliorations suggérées:</span>
                      <p className="mt-1 text-gray-700">{selectedFiche.suggestionsCommentaires.ameliorations}</p>
                    </div>
                  )}
                  {selectedFiche.suggestionsCommentaires.autresCommentaires && (
                    <div>
                      <span className="font-medium">Autres commentaires:</span>
                      <p className="mt-1 text-gray-700">{selectedFiche.suggestionsCommentaires.autresCommentaires}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Métadonnées */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-lg mb-3 text-gray-800">Métadonnées</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><span className="font-medium">Date de création:</span> {moment(selectedFiche.createdAt).format('DD/MM/YYYY HH:mm')}</div>
                  {selectedFiche.updatedAt && (
                    <div><span className="font-medium">Dernière modification:</span> {moment(selectedFiche.updatedAt).format('DD/MM/YYYY HH:mm')}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={closeDetailModal}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Fermer
              </button>
              <a
                href={`/fiche-auto-evaluation/edit/${selectedFiche._id}`}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Modifier
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FicheAutoEvaluationPage;

