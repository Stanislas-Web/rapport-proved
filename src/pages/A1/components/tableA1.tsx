import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../app/store';
import { fetchAllA1s, setA1store } from '../../../features/a1/a1Slice';
import moment from 'moment';
import { APIProvider } from '@vis.gl/react-google-maps';
import { Users, GraduationCap, Building2, UserCheck } from 'lucide-react';
import SchoolMap from './schoolMap';

// Utility functions
const calculatePersonnelTotals = (personnel: any[]) => {
  return personnel.reduce((acc, curr) => ({
    autorise: acc.autorise + (curr.autorise || 0),
    employe: acc.employe + (curr.employe || 0),
    manque: acc.manque + (curr.manque || 0),
  }), { autorise: 0, employe: 0, manque: 0 });
};

const calculateStructureTotals = (structure: any[]) => {
  return structure.reduce((acc, niveau) => {
    const niveauTotal = niveau.classes.reduce((classAcc: any, classe: any) => ({
      garcons: classAcc.garcons + (classe.nombreElevesGarcons || 0),
      filles: classAcc.filles + (classe.nombreElevesFilles || 0),
    }), { garcons: 0, filles: 0 });
    return {
      garcons: acc.garcons + niveauTotal.garcons,
      filles: acc.filles + niveauTotal.filles,
    };
  }, { garcons: 0, filles: 0 });
};

const calculateGlobalStats = (a1s: any[]) => {
  if (!a1s.length) return null;

  return a1s.reduce((acc, curr) => {
    const teachingStaff = calculatePersonnelTotals(curr.personnel.enseignant);
    const adminStaff = calculatePersonnelTotals(curr.personnel.administratif);
    const students = calculateStructureTotals(curr.structureEtPeuplement);

    return {
      totalSchools: acc.totalSchools + 1,
      totalStudents: acc.totalStudents + (students.garcons + students.filles),
      totalStaff: acc.totalStaff + teachingStaff.employe + adminStaff.employe,
      totalTeachers: acc.totalTeachers + teachingStaff.employe
    };
  }, {
    totalSchools: 0,
    totalStudents: 0,
    totalStaff: 0,
    totalTeachers: 0
  });
};

// Components
const TotalDisplay = ({ label, value }: { label: string; value: number | string }) => (
  <div className="text-sm">
    <span className="font-medium">{label}:</span> {value}
  </div>
);

const Loader = () => (
  <div className="flex justify-center items-center h-full">
    <svg className="animate-spin h-10 w-10 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
    </svg>
  </div>
);

const LocalsDisplay = ({ locaux }: { locaux: any }) => (
  <div className="space-y-1">
    <p>Classes: {locaux.classes}</p>
    <p>Bureaux: {locaux.bureaux}</p>
    <p>Ateliers: {locaux.ateliers}</p>
    <p>Laboratoires: {locaux.labo}</p>
    <p>Autres: {locaux.autres}</p>
  </div>
);

const LocationInfo = ({ idSousDirection, idDirection }: { idSousDirection: any; idDirection: any }) => (
  <div>
    <p>Proved: {idDirection.nom}</p>
    <p>Sous-division: {idSousDirection.nom}</p>
  </div>
);

const StatsCard = ({ Icon, value, label }: { Icon: any; value: number; label: string }) => (
  <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
    <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
      <Icon className="h-6 w-6 stroke-primary dark:stroke-white" strokeWidth={1.5} />
    </div>
    <div className="mt-4 flex items-end justify-between">
      <div>
        <h4 className="text-title-md font-bold text-black dark:text-white">
          {value}
        </h4>
        <span className="text-sm font-medium">{label}</span>
      </div>
    </div>
  </div>
);

const DetailModal = ({ isOpen, onClose, a1 }: { isOpen: boolean; onClose: () => void; a1: any }) => {
  if (!isOpen || !a1) return null;

  const API_KEY = "AIzaSyD4vv69gzEDLUzHeD_vfZBVD2IQ8pinsOw";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 mt-20 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-boxdark rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-black dark:text-white">
            Détails de la fiche administrative (A1)
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
            <h3 className="font-semibold mb-2 text-black dark:text-white">Localisation</h3>
            <LocationInfo idSousDirection={a1.idSousDirection} idDirection={a1.idDirection} />
          </div>

          <div className="bg-gray-100 dark:bg-meta-4 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-black dark:text-white">Information de l'établissement</h3>
            <div className="flex justify-between pb-10">
              {/* <div>
                <p>Nom: {a1.etablissement.nom}</p>
                <p>Appellation: {a1.etablissement.denomination.appellation}</p>
                <p>Sigle: {a1.etablissement.denomination.sigle}</p>
              </div> */}
              <div className="">
                <div className="space-y-2">
                  <p><span className="font-medium">Nom:</span> {a1.etablissement.nom}</p>
                  <p><span className="font-medium">SECOPE:</span> {a1.etablissement.secope}</p>
                  <p><span className="font-medium">Appellation:</span> {a1.etablissement.denomination.appellation}</p>
                  <p><span className="font-medium">Sigle:</span> {a1.etablissement.denomination.sigle}</p>
                  <p><span className="font-medium">Matricule:</span> {a1.etablissement.matricule}</p>
                  <p><span className="font-medium">Boîte Postale:</span> {a1.etablissement.bp}</p>
                  <p><span className="font-medium">Téléphone:</span> {a1.etablissement.tel}</p>
                </div>
                <div className="space-y-2">
                  <p><span className="font-medium">Rue/Avenue:</span> {a1.etablissement.rueOuAvenue}</p>
                  <p><span className="font-medium">Numéro:</span> {a1.etablissement.n}</p>
                  <p><span className="font-medium">Quartier:</span> {a1.etablissement.quartier}</p>
                  <p><span className="font-medium">Commune/Territoire:</span> {a1.etablissement.communeOuTerritoire}</p>
                  <p><span className="font-medium">District:</span> {a1.etablissement.district}</p>
                  <p><span className="font-medium">Ville:</span> {a1.etablissement.ville}</p>
                  <p><span className="font-medium">Secteur:</span> {a1.etablissement.secteur}</p>
                  <p><span className="font-medium">Village:</span> {a1.etablissement.village}</p>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <APIProvider apiKey={API_KEY}>
                  <SchoolMap etablissement={a1.etablissement} />
                </APIProvider>
              </div>
            </div>
          </div>

          <div className="bg-gray-100 dark:bg-meta-4 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-black dark:text-white">Locaux</h3>
            <LocalsDisplay locaux={a1.locaux} />
          </div>

          <div className="bg-gray-100 dark:bg-meta-4 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-black dark:text-white">Personnel</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium">Administratif</h4>
                {a1.personnel.administratif.map((admin: any, index: number) => (
                  <div key={index}>
                    <p>Autorisé: {admin.autorise}</p>
                    <p>Employé: {admin.employe}</p>
                    <p>Manque: {admin.manque}</p>
                  </div>
                ))}
              </div>
              <div>
                <h4 className="font-medium">Enseignant</h4>
                {a1.personnel.enseignant.map((teacher: any, index: number) => (
                  <div key={index}>
                    <p>Autorisé: {teacher.autorise}</p>
                    <p>Employé: {teacher.employe}</p>
                    <p>Manque: {teacher.manque}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gray-100 dark:bg-meta-4 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-black dark:text-white">Structure et Peuplement</h3>
            {a1.structureEtPeuplement.map((niveau: any, index: number) => (
              <div key={index} className="mb-4">
                <h4 className="font-medium">Niveau: {niveau.niveau}</h4>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {niveau.classes.map((classe: any, idx: number) => (
                    <div key={idx} className="bg-white dark:bg-boxdark p-3 rounded">
                      <p>Classe: {classe.classe}</p>
                      <p>Garçons: {classe.nombreElevesGarcons}</p>
                      <p>Filles: {classe.nombreElevesFilles}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-100 dark:bg-meta-4 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-black dark:text-white">Mise en Place</h3>
            <div className="grid grid-cols-2 gap-4">
              {a1.miseEnPlace.map((mise: any, index: number) => (
                <div key={index} className="bg-white dark:bg-boxdark p-3 rounded">
                  <p>Nom et Postnom: {mise.nomPostNom}</p>
                  <p>Sexe: {mise.sexe}</p>
                  <p>Âge: {mise.age}</p>
                  <p>SECOPE: {mise.secope}</p>
                  <p>Qualification: {mise.qualif}</p>
                  <p>CIN: {mise.cin}</p>
                  <p>Diplôme Principal: {mise.diplomePrincipal ? 'Oui' : 'Non'}</p>
                  <p>Fonction: {mise.fonction}</p>
                  <p>Date d'entrée: {moment(mise.dateEntree).format('DD-MM-YYYY')}</p>
                  <p>Date de sortie: {moment(mise.dateSortie).format('DD-MM-YYYY')}</p>
                  <div className="mt-2">
                    <p className="font-medium">Autres Informations:</p>
                    <p>Dernier Ancien: {mise.autresInfos.dernierAncien}</p>
                    <p>Motif Mutation: {mise.autresInfos.motifMutation}</p>
                    <p>Autres: {mise.autresInfos.autres}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-100 dark:bg-meta-4 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-black dark:text-white">Informations de création</h3>
            <p>Créé par: {`${a1.createdBy.nom} ${a1.createdBy.postnom} ${a1.createdBy.prenom}`}</p>
            <p>Date de création: {moment(a1.createdAt).format('DD-MM-YYYY à HH:mm:ss')}</p>
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
          Précedent
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Suivant
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
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${currentPage === number
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

const TableA1 = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [a1s, setA1s] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedA1, setSelectedA1] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchA1s = async () => {
      const email = localStorage.getItem('email');
      const password = localStorage.getItem('password');

      if (email && password) {
        try {
          setLoading(true);
          const result = await dispatch(fetchAllA1s({ route: 'fiches-administratives' })).unwrap();
          setA1s(result);
          dispatch(setA1store(result.reverse()));
        } catch (err) {
          console.error('get all ecoles failed:', err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchA1s();
  }, [dispatch]);

  const openModal = (a1: any) => {
    setSelectedA1(a1);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedA1(null);
  };

  const globalStats = calculateGlobalStats(a1s);
  const totalPages = Math.ceil(a1s.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedA1s = a1s.slice(startIndex, startIndex + itemsPerPage);

  const statsCards = [
    { Icon: Building2, value: globalStats?.totalSchools, label: 'Total Écoles' },
    { Icon: GraduationCap, value: globalStats?.totalStudents, label: 'Total Élèves' },
    { Icon: Users, value: globalStats?.totalStaff, label: 'Total Personnel' },
    { Icon: UserCheck, value: globalStats?.totalTeachers, label: 'Total Enseignants' }
  ];

  return (
    <>
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          {loading ? (
            <Loader />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 mb-10">
                {statsCards.map((card, index) => (
                  <StatsCard
                    key={index}
                    Icon={card.Icon}
                    value={card.value || 0}
                    label={card.label}
                  />
                ))}
              </div>

              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-2 text-left dark:bg-meta-4 border border-[#eee] dark:border-strokedark">
                    <th className="dark:border-strokedark border border-[#eee] min-w-[250px] px-4 py-2 font-medium text-black dark:text-white">
                      Localisation
                    </th>
                    <th className="dark:border-strokedark border border-[#eee] min-w-[250px] px-4 py-2 font-medium text-black dark:text-white">
                      Nom de l'école
                    </th>
                    <th className="dark:border-strokedark border border-[#eee] min-w-[250px] px-4 py-2 font-medium text-black dark:text-white">
                      Locaux
                    </th>
                    <th className="dark:border-strokedark border border-[#eee] min-w-[250px] px-4 py-2 font-medium text-black dark:text-white">
                      Personnel Enseignant
                    </th>
                    <th className="dark:border-strokedark border border-[#eee] min-w-[250px] px-4 py-2 font-medium text-black dark:text-white">
                      Personnel Administratif
                    </th>
                    <th className="dark:border-strokedark border border-[#eee] min-w-[250px] px-4 py-2 font-medium text-black dark:text-white">
                      Structure et Peuplement
                    </th>
                    <th className="dark:border-strokedark border border-[#eee] min-w-[250px] px-4 py-2 font-medium text-black dark:text-white">
                      Mise en Place
                    </th>
                    <th className="dark:border-strokedark border border-[#eee] min-w-[250px] px-4 py-2 font-medium text-black dark:text-white">
                      Créé par
                    </th>
                    <th className="dark:border-strokedark border border-[#eee] min-w-[250px] px-4 py-2 font-medium text-black dark:text-white">
                      Date de Création
                    </th>
                    <th className="dark:border-strokedark border border-[#eee] py-4 px-4 font-medium text-black dark:text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedA1s.map((a1sItem, key) => (
                    <tr key={key} className='dark:border-strokedark border border-[#eee]'>
                      <td className="border dark:border-strokedark border-[#eee] px-4 py-2">
                        <LocationInfo
                          idSousDirection={a1sItem.idSousDirection}
                          idDirection={a1sItem.idDirection}
                        />
                      </td>
                      <td className="border dark:border-strokedark border-[#eee] px-4 py-2">
                        {a1sItem.etablissement.nom}
                      </td>
                      <td className="border dark:border-strokedark border-[#eee] px-4 py-2">
                        <LocalsDisplay locaux={a1sItem.locaux} />
                      </td>
                      <td className="border dark:border-strokedark border-[#eee] px-4 py-2">
                        {a1sItem.personnel.enseignant.map((teacher: any, index: number) => (
                          <div key={index}>
                            <p>Autorisé: {teacher.autorise}</p>
                            <p>Employé: {teacher.employe}</p>
                            <p>Manque: {teacher.manque}</p>
                          </div>
                        ))}
                      </td>
                      <td className="border dark:border-strokedark border-[#eee] px-4 py-2">
                        {a1sItem.personnel.administratif.map((admin: any, index: number) => (
                          <div key={index}>
                            <p>Autorisé: {admin.autorise}</p>
                            <p>Employé: {admin.employe}</p>
                            <p>Manque: {admin.manque}</p>
                          </div>
                        ))}
                      </td>
                      <td className="border dark:border-strokedark border-[#eee] px-4 py-2">
                        <div className="mt-2 pt-2 dark:border-strokedark border-gray-200">
                          {(() => {
                            const totals = calculateStructureTotals(a1sItem.structureEtPeuplement);
                            return (
                              <>
                                <TotalDisplay label="Total Garçons" value={totals.garcons} />
                                <TotalDisplay label="Total Filles" value={totals.filles} />
                                <TotalDisplay label="Total Élèves" value={totals.garcons + totals.filles} />
                              </>
                            );
                          })()}
                        </div>
                      </td>
                      <td className="border dark:border-strokedark border-[#eee] px-4 py-2">
                        <div className="mt-2 pt-2 dark:border-strokedark border-gray-200">
                          <TotalDisplay
                            label="Total Personnel"
                            value={a1sItem.miseEnPlace.length}
                          />
                        </div>
                      </td>
                      <td className="border dark:border-strokedark border-[#eee] px-4 py-2">
                        {`${a1sItem.createdBy.nom} ${a1sItem.createdBy.postnom} ${a1sItem.createdBy.prenom}`}
                      </td>
                      <td className="border dark:border-strokedark border-[#eee] px-4 py-2">
                        {moment(a1sItem.createdAt).format('DD-MM-YYYY à HH:mm:ss')}
                      </td>
                      <td className="border dark:border-strokedark border-[#eee] py-5 px-4">
                        <div className="flex items-center space-x-3.5">
                          <button
                            className="hover:text-primary"
                            onClick={() => openModal(a1sItem)}
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
        a1={selectedA1}
      />
    </>
  );
};

export default TableA1;