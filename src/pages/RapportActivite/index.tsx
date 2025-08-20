import React, { useState, useEffect } from 'react';
import { rapportActiviteService } from '../../services/rapportActivite/rapportActiviteService';
import { RapportActivite } from '../../models/RapportActivite';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import moment from 'moment';

const RapportActivitePage: React.FC = () => {
  const [rapports, setRapports] = useState<RapportActivite[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedRapport, setSelectedRapport] = useState<RapportActivite | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    // Récupérer le rôle de l'utilisateur connecté
    const userData = localStorage.getItem('userData');
    const sessionData = localStorage.getItem('sessionData');
    
    console.log('🔍 Vérification du rôle - userData:', userData);
    console.log('🔍 Vérification du rôle - sessionData:', sessionData);
    
    if (userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        console.log('🔍 Rôle trouvé dans userData:', parsedUserData.role);
        setUserRole(parsedUserData.role || '');
      } catch (error) {
        console.error('Erreur lors du parsing des données utilisateur:', error);
      }
    } else if (sessionData) {
      try {
        const parsedSessionData = JSON.parse(sessionData);
        console.log('🔍 Rôle trouvé dans sessionData:', parsedSessionData.role);
        setUserRole(parsedSessionData.role || '');
      } catch (error) {
        console.error('Erreur lors du parsing des données de session:', error);
      }
    }
    
    // Vérifier aussi dans les données de connexion
    const telephone = localStorage.getItem('telephone');
    console.log('🔍 Téléphone connecté:', telephone);
    
    // Vérifier le token pour extraire les informations
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        console.log('🔍 Rôle dans le token:', tokenPayload);
        if (tokenPayload.type === 'ADMIN' || tokenPayload.role === 'admin') {
          console.log('🔍 Admin détecté dans le token');
          setUserRole('admin');
        }
      } catch (error) {
        console.error('Erreur lors du parsing du token:', error);
      }
    }
  }, []);

  useEffect(() => {
    loadRapports();
  }, [selectedYear, selectedStatus]);

  const loadRapports = async () => {
    try {
      setLoading(true);
      console.log('🔍 RapportActivitePage - Début du chargement des rapports');
      console.log('🔍 RapportActivitePage - userRole:', userRole);
      
      // Vérifier l'authentification
      const token = localStorage.getItem('token');
      console.log('🔍 RapportActivitePage - Token présent:', !!token);
      
      if (!token) {
        console.error('🔍 RapportActivitePage - Aucun token trouvé');
        toast.error('Veuillez vous connecter');
        return;
      }
      
      let rapportsData = await rapportActiviteService.getAllRapports();
      console.log('🔍 RapportActivitePage - Données brutes reçues:', rapportsData);
      console.log('🔍 RapportActivitePage - Type de données:', typeof rapportsData);
      console.log('🔍 RapportActivitePage - Est un tableau:', Array.isArray(rapportsData));
      
      // Si l'utilisateur n'est pas admin, filtrer ses rapports
      if (userRole !== 'admin' && userRole !== 'Administrateur' && userRole !== 'ADMIN') {
        console.log('🔍 RapportActivitePage - Filtrage pour utilisateur non-admin');
        // Récupérer l'ID de l'utilisateur connecté depuis le token
        if (token) {
          try {
            const tokenPayload = JSON.parse(atob(token.split('.')[1]));
            const userId = tokenPayload._id;
            console.log('🔍 Filtrage pour l\'utilisateur:', userId);
            
            // TEMPORAIREMENT DÉSACTIVÉ - Filtrer les rapports de l'utilisateur connecté
            /*
            const rapportsFiltres = rapportsData.filter(rapport => {
              console.log('🔍 Rapport createdBy:', rapport.createdBy, 'User ID:', userId);
              return rapport.createdBy === userId;
            });
            
            console.log('🔍 RapportActivitePage - Rapports filtrés:', rapportsFiltres);
            rapportsData = rapportsFiltres;
            */
            console.log('🔍 RapportActivitePage - Filtrage temporairement désactivé');
          } catch (error) {
            console.error('Erreur lors du parsing du token:', error);
          }
        }
      }
      
      console.log('🔍 RapportActivitePage - Rapports finaux à afficher:', rapportsData);
      
      setRapports(rapportsData);
    } catch (error) {
      console.error('Erreur lors du chargement des rapports:', error);
      console.error('Erreur complète:', JSON.stringify(error, null, 2));
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

  const handleGeneratePDF = async (id: string) => {
    try {
      const pdfBlob = await rapportActiviteService.generatePDF(id);
      
      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `rapport-activite-${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('PDF généré et téléchargé avec succès');
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      toast.error('Erreur lors de la génération du PDF');
    }
  };



  const handleViewDetail = (rapport: RapportActivite) => {
    setSelectedRapport(rapport);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedRapport(null);
  };

  const exportRapportsToExcel = () => {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const data = JSON.parse(localStorage.getItem('data') || '{}');

    // Fonction pour obtenir le nom de la personne connectée (même logique que DropdownUser)
    const getUserName = () => {
      // Nom complet avec prénom et nom
      if (data.prenom && data.nom) {
        return `${data.prenom} ${data.nom}`;
      }

      // Nom complet avec prénom, nom et postnom
      if (data.prenom && data.nom && data.postnom) {
        return `${data.prenom} ${data.nom} ${data.postnom}`;
      }

      // Nom complet avec nom et postnom
      if (data.nom && data.postnom) {
        return `${data.nom} ${data.postnom}`;
      }

      // Champs individuels
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
    const formattedData = rapports.map((rapport: any, index: any) => {
      // Calculer les totaux
      const totalEcoles = 
        (rapport.parametresCles?.niveauPrescolaire?.espaceCommunautaireEveil?.nombreEcoles || 0) +
        (rapport.parametresCles?.niveauPrescolaire?.maternel?.nombreEcoles || 0) +
        (rapport.parametresCles?.niveauPrescolaire?.prePrimaire?.nombreEcoles || 0) +
        (rapport.parametresCles?.niveauPrescolaire?.special?.nombreEcoles || 0) +
        (rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.nombreEcoles || 0);

      const totalClasses = 
        (rapport.parametresCles?.niveauPrescolaire?.espaceCommunautaireEveil?.nombreClasses || 0) +
        (rapport.parametresCles?.niveauPrescolaire?.maternel?.nombreClasses || 0) +
        (rapport.parametresCles?.niveauPrescolaire?.prePrimaire?.nombreClasses || 0) +
        (rapport.parametresCles?.niveauPrescolaire?.special?.nombreClasses || 0) +
        (rapport.parametresCles?.niveauPrimaire?.enseignementSpecial?.nombreClasses || 0) +
        (rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.nombreClasses || 0) +
        (rapport.parametresCles?.niveauSecondaire?.enseignementSpecial?.nombreClasses || 0) +
        (rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.classes7emeCTEB || 0) +
        (rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.classes8emeCTEB || 0) +
        (rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.classesHumanites || 0);

      const totalPersonnel = 
        (rapport.personnel?.personnelEnseignant?.prescolaire?.hommes || 0) +
        (rapport.personnel?.personnelEnseignant?.prescolaire?.femmes || 0) +
        (rapport.personnel?.personnelEnseignant?.primaire?.hommes || 0) +
        (rapport.personnel?.personnelEnseignant?.primaire?.femmes || 0) +
        (rapport.personnel?.personnelEnseignant?.secondaire?.hommes || 0) +
        (rapport.personnel?.personnelEnseignant?.secondaire?.femmes || 0) +
        (rapport.personnel?.personnelAdministratif?.directionProvinciale || 0) +
        (rapport.personnel?.personnelAdministratif?.inspectionPrincipale || 0) +
        (rapport.personnel?.personnelAdministratif?.coordinationProvinciale || 0) +
        (rapport.personnel?.personnelAdministratif?.sousDivision || 0);

      return {
        N: index + 1,
        "Année": rapport.annee,
        "Province Administrative": rapport.identificationProved?.provinceAdministrative || '',
        "Province Educationnelle": rapport.identificationProved?.provinceEducationnelle || '',
        "Directeur Provincial": rapport.identificationProved?.directeurProvincial || '',
        "Total Écoles": totalEcoles,
        "Total Classes": totalClasses,
        "Total Effectifs": rapport.totalEffectifs || 0,
        "Total Personnel": totalPersonnel,
        "Statut": rapport.statut,
        "Créé le": rapport.createdAt ? moment(rapport.createdAt).format('DD/MM/YYYY') : '-',
        "Modifié le": rapport.updatedAt ? moment(rapport.updatedAt).format('DD/MM/YYYY') : '-',
      };
    });

    // Création de la feuille Excel
    const ws = XLSX.utils.aoa_to_sheet([
      ['RAPPORTS D\'ACTIVITÉ'], // Titre
      [], // Ligne vide
      ['Rapport généré par ' + userName + " le " + moment().format('DD/MM/YYYY à HH:mm')], // Date de génération
      [], // Ligne vide
      Object.keys(formattedData[0] || {}) // En-têtes
    ]);

    // Ajouter les données après les en-têtes
    XLSX.utils.sheet_add_json(ws, formattedData, { origin: 5, skipHeader: true });

    // Appliquer les styles
    ws['A1'].s = {
      font: { bold: true, color: { rgb: "FFFFFF" }, sz: 16 },
      fill: { fgColor: { rgb: "2E7D32" } }, // Vert foncé
      alignment: { horizontal: "center", vertical: "center" },
    };
    ws['A3'].s = {
      font: { italic: true, color: { rgb: "666666" } },
      alignment: { horizontal: "center" },
    };

    // Fusionner les cellules pour le titre et la date
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 11 } }, // Titre
      { s: { r: 2, c: 0 }, e: { r: 2, c: 11 } }, // Date
    ];

    // Largeurs des colonnes
    ws['!cols'] = [
      { wch: 5 },   // N
      { wch: 10 },  // Année
      { wch: 25 },  // Province Administrative
      { wch: 25 },  // Province Educationnelle
      { wch: 25 },  // Directeur Provincial
      { wch: 15 },  // Total Écoles
      { wch: 15 },  // Total Classes
      { wch: 15 },  // Total Effectifs
      { wch: 15 },  // Total Personnel
      { wch: 15 },  // Statut
      { wch: 15 },  // Créé le
      { wch: 15 },  // Modifié le
    ];

    // Hauteurs des lignes
    ws['!rows'] = [
      { hpt: 40 }, // Titre
      { hpt: 20 }, // Ligne vide
      { hpt: 25 }, // Date
      { hpt: 20 }, // Ligne vide
      { hpt: 35 }, // En-têtes
      ...Array(formattedData.length).fill({ hpt: 30 }), // Données
    ];

    // Création du workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Rapports d\'Activité');

    // Conversion en buffer
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    // Téléchargement du fichier
    const dataBlob = new Blob([excelBuffer], { type: fileType });
    saveAs(dataBlob, `Rapports-Activite${fileExtension}`);
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

  const years = [2025];

  return (
    <>
      {/* <Breadcrumb pageName="Rapports d'activité" /> */}

      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-title-md2 font-semibold text-black dark:text-white">
            Rapports d'activité
          </h2>
          <div className="flex items-center gap-3">
            {(userRole === 'admin' || userRole === 'Administrateur' || userRole === 'ADMIN') && (
              <div onClick={exportRapportsToExcel} className="cursor-pointer" title="Exporter en Excel">
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
                  onClick={() => window.location.href = '/rapport-activite/create'}
                  className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                >
                  Nouveau rapport
                </button>
              );
            })()}
          </div>
        </div>

        {/* Message pour les utilisateurs normaux */}
        {userRole !== 'admin' && userRole !== 'Administrateur' && userRole !== 'ADMIN' && (
          <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
            Vous voyez uniquement vos propres rapports d'activité.
          </div>
        )}

        {/* Filtres */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
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
                  <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                    Année
                  </th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    PROVED
                  </th>
                  <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white">
                    Introduction
                  </th>
                  <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Écoles
                  </th>
                  <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Classes
                  </th>
                  <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Effectifs
                  </th>
                  <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Personnel
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
                    <td colSpan={10} className="py-4 px-4 text-center">
                      Chargement...
                    </td>
                  </tr>
                ) : rapports.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-4 px-4 text-center text-gray-500">
                      Aucun rapport trouvé
                    </td>
                  </tr>
                ) : (
                  rapports
                    .filter((rapport) => {
                      // Filtre par statut uniquement
                      if (selectedStatus !== 'all' && rapport.statut !== selectedStatus) {
                        return false;
                      }
                      return true;
                    })
                    .map((rapport) => {
                    // Calculer les totaux
                    const totalEcoles = 
                      (rapport.parametresCles?.niveauPrescolaire?.espaceCommunautaireEveil?.nombreEcoles || 0) +
                      (rapport.parametresCles?.niveauPrescolaire?.maternel?.nombreEcoles || 0) +
                      (rapport.parametresCles?.niveauPrescolaire?.prePrimaire?.nombreEcoles || 0) +
                      (rapport.parametresCles?.niveauPrescolaire?.special?.nombreEcoles || 0) +
                      (rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.nombreEcoles || 0);

                    const totalClasses = 
                      (rapport.parametresCles?.niveauPrescolaire?.espaceCommunautaireEveil?.nombreClasses || 0) +
                      (rapport.parametresCles?.niveauPrescolaire?.maternel?.nombreClasses || 0) +
                      (rapport.parametresCles?.niveauPrescolaire?.prePrimaire?.nombreClasses || 0) +
                      (rapport.parametresCles?.niveauPrescolaire?.special?.nombreClasses || 0) +
                      (rapport.parametresCles?.niveauPrimaire?.enseignementSpecial?.nombreClasses || 0) +
                      (rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.nombreClasses || 0) +
                      (rapport.parametresCles?.niveauSecondaire?.enseignementSpecial?.nombreClasses || 0) +
                      (rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.classes7emeCTEB || 0) +
                      (rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.classes8emeCTEB || 0) +
                      (rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.classesHumanites || 0);

                    const totalPersonnel = 
                      (rapport.personnel?.personnelEnseignant?.prescolaire?.hommes || 0) +
                      (rapport.personnel?.personnelEnseignant?.prescolaire?.femmes || 0) +
                      (rapport.personnel?.personnelEnseignant?.primaire?.hommes || 0) +
                      (rapport.personnel?.personnelEnseignant?.primaire?.femmes || 0) +
                      (rapport.personnel?.personnelEnseignant?.secondaire?.hommes || 0) +
                      (rapport.personnel?.personnelEnseignant?.secondaire?.femmes || 0) +
                      (rapport.personnel?.personnelAdministratif?.directionProvinciale || 0) +
                      (rapport.personnel?.personnelAdministratif?.inspectionPrincipale || 0) +
                      (rapport.personnel?.personnelAdministratif?.coordinationProvinciale || 0) +
                      (rapport.personnel?.personnelAdministratif?.sousDivision || 0);

                    return (
                      <tr key={rapport._id} className="border-b border-[#eee] dark:border-strokedark">
                        <td className="py-5 px-4 pl-9 dark:bg-meta-4 xl:pl-11">
                          <h5 className="font-medium text-black dark:text-white">
                            {rapport.annee}
                          </h5>
                        </td>
                        <td className="py-5 px-4 dark:bg-meta-4">
                          <p className="text-black dark:text-white text-sm">
                            {rapport.identificationProved ? 
                              `${rapport.identificationProved.provinceAdministrative} - ${rapport.identificationProved.provinceEducationnelle}` : 
                              'Non spécifié'
                            }
                          </p>
                          <p className="text-gray-500 text-xs">
                            {rapport.identificationProved?.directeurProvincial || ''}
                          </p>
                        </td>
                        <td className="py-5 px-4 dark:bg-meta-4">
                          <p className="text-black dark:text-white text-sm">
                            {rapport.introduction ? rapport.introduction.substring(0, 80) + '...' : 'Aucune introduction'}
                          </p>
                        </td>
                        <td className="py-5 px-4 dark:bg-meta-4">
                          <p className="text-black dark:text-white font-medium">
                            {totalEcoles.toLocaleString()}
                          </p>
                        </td>
                        <td className="py-5 px-4 dark:bg-meta-4">
                          <p className="text-black dark:text-white font-medium">
                            {totalClasses.toLocaleString()}
                          </p>
                        </td>
                        <td className="py-5 px-4 dark:bg-meta-4">
                          <p className="text-black dark:text-white font-medium">
                            {rapport.totalEffectifs ? rapport.totalEffectifs.toLocaleString() : 'N/A'}
                          </p>
                        </td>
                        <td className="py-5 px-4 dark:bg-meta-4">
                          <p className="text-black dark:text-white font-medium">
                            {totalPersonnel.toLocaleString()}
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
                              onClick={() => handleViewDetail(rapport)}
                              className="hover:text-primary"
                              title="Voir le détail"
                            >
                              <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.17812 8.99981 3.17812C14.5686 3.17812 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 9.00062C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 9.00062C15.5248 7.96062 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.96062 1.85605 9.00062Z" fill=""/>
                                <path d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z" fill=""/>
                              </svg>
                            </button>
                            <button
                              onClick={() => window.location.href = `/rapport-activite/edit/${rapport._id}`}
                              className="hover:text-primary"
                              title="Modifier"
                            >
                              <svg width="25px" height="25px" viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M17.7 5.12758L19.266 6.37458C19.4172 6.51691 19.5025 6.71571 19.5013 6.92339C19.5002 7.13106 19.4128 7.32892 19.26 7.46958L18.07 8.89358L14.021 13.7226C13.9501 13.8037 13.8558 13.8607 13.751 13.8856L11.651 14.3616C11.3755 14.3754 11.1356 14.1751 11.1 13.9016V11.7436C11.1071 11.6395 11.149 11.5409 11.219 11.4636L15.193 6.97058L16.557 5.34158C16.8268 4.98786 17.3204 4.89545 17.7 5.12758Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M12.033 7.61865C12.4472 7.61865 12.783 7.28287 12.783 6.86865C12.783 6.45444 12.4472 6.11865 12.033 6.11865V7.61865ZM9.23301 6.86865V6.11865L9.23121 6.11865L9.23301 6.86865ZM5.50001 10.6187H6.25001L6.25001 10.617L5.50001 10.6187ZM5.50001 16.2437L6.25001 16.2453V16.2437H5.50001ZM9.23301 19.9937L9.23121 20.7437H9.23301V19.9937ZM14.833 19.9937V20.7437L14.8348 20.7437L14.833 19.9937ZM18.566 16.2437H17.816L17.816 16.2453L18.566 16.2437ZM19.316 12.4937C19.316 12.0794 18.9802 11.7437 18.566 11.7437C18.1518 11.7437 17.816 12.0794 17.816 12.4937H19.316ZM15.8863 6.68446C15.7282 6.30159 15.2897 6.11934 14.9068 6.2774C14.5239 6.43546 14.3417 6.87397 14.4998 7.25684L15.8863 6.68446ZM18.2319 9.62197C18.6363 9.53257 18.8917 9.13222 18.8023 8.72777C18.7129 8.32332 18.3126 8.06792 17.9081 8.15733L18.2319 9.62197ZM8.30001 16.4317C7.8858 16.4317 7.55001 16.7674 7.55001 17.1817C7.55001 17.5959 7.8858 17.9317 8.30001 17.9317V16.4317ZM15.767 17.9317C16.1812 17.9317 16.517 17.5959 16.517 17.1817C16.517 16.7674 16.1812 16.4317 15.767 16.4317V17.9317ZM12.033 6.11865H9.23301V7.61865H12.033V6.11865ZM9.23121 6.11865C6.75081 6.12461 4.7447 8.13986 4.75001 10.6203L6.25001 10.617C6.24647 8.96492 7.58269 7.62262 9.23481 7.61865L9.23121 6.11865ZM4.75001 10.6187V16.2437H6.25001V10.6187H4.75001ZM4.75001 16.242C4.7447 18.7224 6.75081 20.7377 9.23121 20.7437L9.23481 19.2437C7.58269 19.2397 6.24647 17.8974 6.25001 16.2453L4.75001 16.242ZM9.23301 20.7437H14.833V19.2437H9.23301V20.7437ZM14.8348 20.7437C17.3152 20.7377 19.3213 18.7224 19.316 16.242L17.816 16.2453C17.8195 17.8974 16.4833 19.2397 14.8312 19.2437L14.8348 20.7437ZM19.316 16.2437V12.4937H17.816V16.2437H19.316ZM14.4998 7.25684C14.6947 7.72897 15.0923 8.39815 15.6866 8.91521C16.2944 9.44412 17.1679 9.85718 18.2319 9.62197L17.9081 8.15733C17.4431 8.26012 17.0391 8.10369 16.6712 7.7836C16.2897 7.45165 16.0134 6.99233 15.8863 6.68446L14.4998 7.25684ZM8.30001 17.9317H15.767V16.4317H8.30001V17.9317Z" fill="#000000" />
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
                            {rapport.statut === 'soumis' && (userRole === 'admin' || userRole === 'Administrateur' || userRole === 'ADMIN') && (
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
                              onClick={() => handleGeneratePDF(rapport._id!)}
                              className="hover:text-blue-600"
                              title="Exporter en PDF"
                            >
                              <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13.5 2.25H4.5C3.67157 2.25 3 2.92157 3 3.75V14.25C3 15.0784 3.67157 15.75 4.5 15.75H13.5C14.3284 15.75 15 15.0784 15 14.25V3.75C15 2.92157 14.3284 2.25 13.5 2.25Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                                <path d="M6 6H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                <path d="M6 9H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                <path d="M6 12H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                <path d="M10.5 2.25V5.25C10.5 5.66421 10.8358 6 11.25 6H13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
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
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de détail */}
      {showDetailModal && selectedRapport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto relative z-[10000]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Détail du Rapport d'Activité - {selectedRapport.annee}
              </h2>
              <button
                onClick={closeDetailModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Informations générales */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-3 text-gray-800">Informations PROVED</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Province Administrative:</span> {selectedRapport.identificationProved.provinceAdministrative}</div>
                    <div><span className="font-medium">Province Educationnelle:</span> {selectedRapport.identificationProved.provinceEducationnelle}</div>
                    <div><span className="font-medium">Chef Lieu PROVED:</span> {selectedRapport.identificationProved.chefLieuProved}</div>
                    <div><span className="font-medium">Directeur Provincial:</span> {selectedRapport.identificationProved.directeurProvincial}</div>
                    <div><span className="font-medium">Email:</span> {selectedRapport.identificationProved.emailProfessionnel}</div>
                    <div><span className="font-medium">Téléphone:</span> {selectedRapport.identificationProved.telephone}</div>
                    <div><span className="font-medium">Territoires:</span> {selectedRapport.identificationProved.nombreTerritoires}</div>
                    <div><span className="font-medium">Sous-divisions:</span> {selectedRapport.identificationProved.nombreSousDivisions}</div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-3 text-gray-800">Informations générales</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Statut:</span> {getStatusBadge(selectedRapport.statut)}</div>
                    <div><span className="font-medium">Total Effectifs:</span> {selectedRapport.totalEffectifs?.toLocaleString() || 'N/A'}</div>
                    <div><span className="font-medium">Créé le:</span> {selectedRapport.createdAt ? new Date(selectedRapport.createdAt).toLocaleDateString() : '-'}</div>
                    <div><span className="font-medium">Modifié le:</span> {selectedRapport.updatedAt ? new Date(selectedRapport.updatedAt).toLocaleDateString() : '-'}</div>
                  </div>
                </div>
              </div>

              {/* Résumé des données */}
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-3 text-blue-800">Résumé des Écoles</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Préscolaire:</span> {selectedRapport.parametresCles.niveauPrescolaire.espaceCommunautaireEveil.nombreEcoles + selectedRapport.parametresCles.niveauPrescolaire.maternel.nombreEcoles + selectedRapport.parametresCles.niveauPrescolaire.prePrimaire.nombreEcoles + selectedRapport.parametresCles.niveauPrescolaire.special.nombreEcoles} écoles</div>
                    <div><span className="font-medium">Primaire:</span> {selectedRapport.parametresCles.niveauPrimaire.enseignementPrimaire.nombreEcoles} écoles</div>
                    <div><span className="font-medium">Secondaire:</span> Classes 7ème/8ème + Humanités</div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-3 text-green-800">Résumé des Classes</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Préscolaire:</span> {selectedRapport.parametresCles.niveauPrescolaire.espaceCommunautaireEveil.nombreClasses + selectedRapport.parametresCles.niveauPrescolaire.maternel.nombreClasses + selectedRapport.parametresCles.niveauPrescolaire.prePrimaire.nombreClasses + selectedRapport.parametresCles.niveauPrescolaire.special.nombreClasses} classes</div>
                    <div><span className="font-medium">Primaire:</span> {selectedRapport.parametresCles.niveauPrimaire.enseignementPrimaire.nombreClasses + selectedRapport.parametresCles.niveauPrimaire.enseignementSpecial.nombreClasses} classes</div>
                    <div><span className="font-medium">Secondaire:</span> {selectedRapport.parametresCles.niveauSecondaire.enseignementSecondaire.premierCycle.classes7emeCTEB + selectedRapport.parametresCles.niveauSecondaire.enseignementSecondaire.premierCycle.classes8emeCTEB + selectedRapport.parametresCles.niveauSecondaire.enseignementSecondaire.deuxiemeCycle.classesHumanites + selectedRapport.parametresCles.niveauSecondaire.enseignementSpecial.nombreClasses} classes</div>
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-3 text-purple-800">Personnel</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Enseignants:</span> {selectedRapport.personnel.personnelEnseignant.prescolaire.hommes + selectedRapport.personnel.personnelEnseignant.prescolaire.femmes + selectedRapport.personnel.personnelEnseignant.primaire.hommes + selectedRapport.personnel.personnelEnseignant.primaire.femmes + selectedRapport.personnel.personnelEnseignant.secondaire.hommes + selectedRapport.personnel.personnelEnseignant.secondaire.femmes} personnes</div>
                    <div><span className="font-medium">Administratifs:</span> {selectedRapport.personnel.personnelAdministratif.directionProvinciale + selectedRapport.personnel.personnelAdministratif.inspectionPrincipale + selectedRapport.personnel.personnelAdministratif.coordinationProvinciale + selectedRapport.personnel.personnelAdministratif.sousDivision} personnes</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Détails complets par niveau */}
            <div className="mt-6 space-y-4">
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 text-indigo-800">Détails Niveau Préscolaire</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div className="bg-white p-3 rounded">
                    <h4 className="font-medium text-indigo-700 mb-2">Espace Communautaire Éveil</h4>
                    <div>Écoles: {selectedRapport.parametresCles.niveauPrescolaire.espaceCommunautaireEveil.nombreEcoles}</div>
                    <div>Classes: {selectedRapport.parametresCles.niveauPrescolaire.espaceCommunautaireEveil.nombreClasses}</div>
                    <div>Garçons: {selectedRapport.parametresCles.niveauPrescolaire.espaceCommunautaireEveil.effectifGarcons}</div>
                    <div>Filles: {selectedRapport.parametresCles.niveauPrescolaire.espaceCommunautaireEveil.effectifFilles}</div>
                    <div>Taux: {selectedRapport.parametresCles.niveauPrescolaire.espaceCommunautaireEveil.tauxAccroissement}%</div>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <h4 className="font-medium text-indigo-700 mb-2">Maternel</h4>
                    <div>Écoles: {selectedRapport.parametresCles.niveauPrescolaire.maternel.nombreEcoles}</div>
                    <div>Classes: {selectedRapport.parametresCles.niveauPrescolaire.maternel.nombreClasses}</div>
                    <div>Garçons: {selectedRapport.parametresCles.niveauPrescolaire.maternel.effectifGarcons}</div>
                    <div>Filles: {selectedRapport.parametresCles.niveauPrescolaire.maternel.effectifFilles}</div>
                    <div>Taux: {selectedRapport.parametresCles.niveauPrescolaire.maternel.tauxAccroissement}%</div>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <h4 className="font-medium text-indigo-700 mb-2">Pré-primaire</h4>
                    <div>Écoles: {selectedRapport.parametresCles.niveauPrescolaire.prePrimaire.nombreEcoles}</div>
                    <div>Classes: {selectedRapport.parametresCles.niveauPrescolaire.prePrimaire.nombreClasses}</div>
                    <div>Garçons: {selectedRapport.parametresCles.niveauPrescolaire.prePrimaire.effectifGarcons}</div>
                    <div>Filles: {selectedRapport.parametresCles.niveauPrescolaire.prePrimaire.effectifFilles}</div>
                    <div>Taux: {selectedRapport.parametresCles.niveauPrescolaire.prePrimaire.tauxAccroissement}%</div>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <h4 className="font-medium text-indigo-700 mb-2">Spécial</h4>
                    <div>Écoles: {selectedRapport.parametresCles.niveauPrescolaire.special.nombreEcoles}</div>
                    <div>Classes: {selectedRapport.parametresCles.niveauPrescolaire.special.nombreClasses}</div>
                    <div>Garçons: {selectedRapport.parametresCles.niveauPrescolaire.special.effectifGarcons}</div>
                    <div>Filles: {selectedRapport.parametresCles.niveauPrescolaire.special.effectifFilles}</div>
                    <div>Taux: {selectedRapport.parametresCles.niveauPrescolaire.special.tauxAccroissement}%</div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 text-green-800">Détails Niveau Primaire</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-white p-3 rounded">
                    <h4 className="font-medium text-green-700 mb-2">Enseignement Spécial</h4>
                    <div>Classes: {selectedRapport.parametresCles.niveauPrimaire.enseignementSpecial.nombreClasses}</div>
                    <div>Garçons: {selectedRapport.parametresCles.niveauPrimaire.enseignementSpecial.effectifGarcons}</div>
                    <div>Filles: {selectedRapport.parametresCles.niveauPrimaire.enseignementSpecial.effectifFilles}</div>
                    <div>Taux: {selectedRapport.parametresCles.niveauPrimaire.enseignementSpecial.tauxAccroissement}%</div>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <h4 className="font-medium text-green-700 mb-2">Enseignement Primaire</h4>
                    <div>Écoles: {selectedRapport.parametresCles.niveauPrimaire.enseignementPrimaire.nombreEcoles}</div>
                    <div>Classes: {selectedRapport.parametresCles.niveauPrimaire.enseignementPrimaire.nombreClasses}</div>
                    <div>Classes Pléthoriques: {selectedRapport.parametresCles.niveauPrimaire.enseignementPrimaire.classesPlethoriques}</div>
                    <div>Garçons: {selectedRapport.parametresCles.niveauPrimaire.enseignementPrimaire.effectifGarcons}</div>
                    <div>Filles: {selectedRapport.parametresCles.niveauPrimaire.enseignementPrimaire.effectifFilles}</div>
                    <div>Taux: {selectedRapport.parametresCles.niveauPrimaire.enseignementPrimaire.tauxAccroissement}%</div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 text-blue-800">Détails Niveau Secondaire</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white p-3 rounded">
                    <h4 className="font-medium text-blue-700 mb-2">Enseignement Spécial</h4>
                    <div>Classes: {selectedRapport.parametresCles.niveauSecondaire.enseignementSpecial.nombreClasses}</div>
                    <div>Garçons: {selectedRapport.parametresCles.niveauSecondaire.enseignementSpecial.effectifGarcons}</div>
                    <div>Filles: {selectedRapport.parametresCles.niveauSecondaire.enseignementSpecial.effectifFilles}</div>
                    <div>Taux: {selectedRapport.parametresCles.niveauSecondaire.enseignementSpecial.tauxAccroissement}%</div>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <h4 className="font-medium text-blue-700 mb-2">Premier Cycle</h4>
                    <div>Classes 7ème CTEB: {selectedRapport.parametresCles.niveauSecondaire.enseignementSecondaire.premierCycle.classes7emeCTEB}</div>
                    <div>Classes 8ème CTEB: {selectedRapport.parametresCles.niveauSecondaire.enseignementSecondaire.premierCycle.classes8emeCTEB}</div>
                    <div>Garçons: {selectedRapport.parametresCles.niveauSecondaire.enseignementSecondaire.premierCycle.effectifGarcons}</div>
                    <div>Filles: {selectedRapport.parametresCles.niveauSecondaire.enseignementSecondaire.premierCycle.effectifFilles}</div>
                    <div>Taux: {selectedRapport.parametresCles.niveauSecondaire.enseignementSecondaire.premierCycle.tauxAccroissement}%</div>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <h4 className="font-medium text-blue-700 mb-2">Deuxième Cycle</h4>
                    <div>Classes Humanités: {selectedRapport.parametresCles.niveauSecondaire.enseignementSecondaire.deuxiemeCycle.classesHumanites}</div>
                    <div>Garçons: {selectedRapport.parametresCles.niveauSecondaire.enseignementSecondaire.deuxiemeCycle.effectifGarcons}</div>
                    <div>Filles: {selectedRapport.parametresCles.niveauSecondaire.enseignementSecondaire.deuxiemeCycle.effectifFilles}</div>
                    <div>Taux: {selectedRapport.parametresCles.niveauSecondaire.enseignementSecondaire.deuxiemeCycle.tauxAccroissement}%</div>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 text-purple-800">Détails Personnel</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-white p-3 rounded">
                    <h4 className="font-medium text-purple-700 mb-2">Personnel Enseignant</h4>
                    <div className="space-y-1">
                      <div><span className="font-medium">Préscolaire:</span> {selectedRapport.personnel.personnelEnseignant.prescolaire.hommes}H / {selectedRapport.personnel.personnelEnseignant.prescolaire.femmes}F</div>
                      <div><span className="font-medium">Primaire:</span> {selectedRapport.personnel.personnelEnseignant.primaire.hommes}H / {selectedRapport.personnel.personnelEnseignant.primaire.femmes}F</div>
                      <div><span className="font-medium">Secondaire:</span> {selectedRapport.personnel.personnelEnseignant.secondaire.hommes}H / {selectedRapport.personnel.personnelEnseignant.secondaire.femmes}F</div>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <h4 className="font-medium text-purple-700 mb-2">Personnel Administratif</h4>
                    <div className="space-y-1">
                      <div>Direction Provinciale: {selectedRapport.personnel.personnelAdministratif.directionProvinciale}</div>
                      <div>Inspection Principale: {selectedRapport.personnel.personnelAdministratif.inspectionPrincipale}</div>
                      <div>Coordination Provinciale: {selectedRapport.personnel.personnelAdministratif.coordinationProvinciale}</div>
                      <div>Sous-division: {selectedRapport.personnel.personnelAdministratif.sousDivision}</div>
                      <div>Pools Inspection: {selectedRapport.personnel.personnelAdministratif.poolsInspectionPrimaire + selectedRapport.personnel.personnelAdministratif.poolsInspectionSecondaire}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 text-orange-800">Réalisations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-white p-3 rounded">
                    <h4 className="font-medium text-orange-700 mb-2">Infrastructures</h4>
                    <div className="space-y-1">
                      <div>Nouvelles salles: {selectedRapport.realisations.accesAccessibiliteEquite.nouvellesSallesClasses.primaire + selectedRapport.realisations.accesAccessibiliteEquite.nouvellesSallesClasses.secondaire}</div>
                      <div>Nouveaux bancs: {selectedRapport.realisations.accesAccessibiliteEquite.nouveauxBancsTables.primaire + selectedRapport.realisations.accesAccessibiliteEquite.nouveauxBancsTables.secondaire}</div>
                      <div>Nouvelles latrines: {selectedRapport.realisations.accesAccessibiliteEquite.nouvellesLatrines.primaire + selectedRapport.realisations.accesAccessibiliteEquite.nouvellesLatrines.secondaire}</div>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <h4 className="font-medium text-orange-700 mb-2">Indicateurs d'Accès</h4>
                    <div className="space-y-1">
                      <div>Nouveaux inscrits: {selectedRapport.realisations.accesAccessibiliteEquite.indicateursAcces.proportionNouveauxInscrits}%</div>
                      <div>Transition Primaire-CTEB: {selectedRapport.realisations.accesAccessibiliteEquite.indicateursAcces.tauxTransitionPrimaireCTEB}%</div>
                      <div>Transition CTEB-Humanités: {selectedRapport.realisations.accesAccessibiliteEquite.indicateursAcces.tauxTransitionCTEBHumanites}%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Introduction et Conclusion */}
            <div className="mt-6 space-y-4">
              {selectedRapport.introduction && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2 text-yellow-800">Introduction</h3>
                  <p className="text-sm text-gray-700">{selectedRapport.introduction}</p>
                </div>
              )}

              {selectedRapport.conclusion && (
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2 text-orange-800">Conclusion</h3>
                  <p className="text-sm text-gray-700">{selectedRapport.conclusion}</p>
                </div>
              )}
            </div>

            {/* Boutons d'action */}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={closeDetailModal}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Fermer
              </button>
              <button
                onClick={() => handleGeneratePDF(selectedRapport._id!)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2"
              >
                <svg className="fill-current" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 1.5H4C3.44772 1.5 3 1.94772 3 2.5V13.5C3 14.0523 3.44772 14.5 4 14.5H12C12.5523 14.5 13 14.0523 13 13.5V2.5C13 1.94772 12.5523 1.5 12 1.5Z" stroke="currentColor" strokeWidth="1" fill="none"/>
                  <path d="M5 5H11" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                  <path d="M5 7H11" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                  <path d="M5 9H8" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                  <path d="M9 1.5V4C9 4.27614 9.22386 4.5 9.5 4.5H12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Exporter PDF
              </button>
              <button
                onClick={() => window.location.href = `/rapport-activite/edit/${selectedRapport._id}`}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Modifier
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RapportActivitePage; 