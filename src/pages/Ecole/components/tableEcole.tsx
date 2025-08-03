

// import { useEffect, useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { AppDispatch } from '../../../app/store';
// import { fetchAllEcoles, setEcoleStore } from '../../../features/ecole/ecoleSlice';
// import { Ecole } from '../../../types/ecole';
// import moment from 'moment';
// import { Edit, Eye, Trash2 } from 'lucide-react';

// // Loader Component
// const Loader = () => (
//   <div className="flex justify-center items-center h-full">
//     <svg className="animate-spin h-10 w-10 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
//     </svg>
//   </div>
// );

// // DetailModal Component
// const DetailModal = ({ isOpen, onClose, school }: { isOpen: boolean; onClose: () => void; school: any }) => {
//   if (!isOpen || !school) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 mt-20 flex items-center justify-center z-50">
//       <div className="bg-white dark:bg-boxdark rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-bold text-black dark:text-white">
//             Détails de l'école
//           </h2>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
//           >
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>

//         <div className="space-y-6">
//           {/* Basic Information */}
//           <div className="bg-gray-100 dark:bg-meta-4 p-4 rounded-lg">
//             <h3 className="font-semibold mb-4 text-black dark:text-white">Information de base</h3>
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <p><span className="font-medium">Nom:</span> {school.nom}</p>
//                 <p><span className="font-medium">SECOPE:</span> {school.secope}</p>
//                 <p><span className="font-medium">Matricule:</span> {school.matricule}</p>
//                 <p><span className="font-medium">Téléphone:</span> {school.tel}</p>
//                 <p><span className="font-medium">Boîte Postale:</span> {school.bp}</p>
//               </div>
//               <div>
//                 <p><span className="font-medium">Dénomination:</span> {school.denomination.appellation}</p>
//                 <p><span className="font-medium">Sigle:</span> {school.denomination.sigle}</p>
//                 <p><span className="font-medium">Code:</span> {school.denomination.code}</p>
//                 {school.arreteMinisteriel && (
//                   <p><span className="font-medium">Arrêté Ministériel:</span> {school.arreteMinisteriel}</p>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Location Information */}
//           <div className="bg-gray-100 dark:bg-meta-4 p-4 rounded-lg">
//             <h3 className="font-semibold mb-4 text-black dark:text-white">Localisation</h3>
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <p><span className="font-medium">Rue/Avenue:</span> {school.rueOuAvenue}</p>
//                 <p><span className="font-medium">Numéro:</span> {school.n}</p>
//                 <p><span className="font-medium">Quartier:</span> {school.quartier}</p>
//                 <p><span className="font-medium">Commune/Territoire:</span> {school.communeOuTerritoire}</p>
//               </div>
//               <div>
//                 <p><span className="font-medium">District:</span> {school.district}</p>
//                 <p><span className="font-medium">Ville:</span> {school.ville}</p>
//                 <p><span className="font-medium">Secteur:</span> {school.secteur}</p>
//                 <p><span className="font-medium">Village:</span> {school.village}</p>
//               </div>
//             </div>
//             <div className="mt-4">
//               <p><span className="font-medium">Coordonnées GPS:</span></p>
//               <p>Latitude: {school.localisation.latitude}</p>
//               <p>Longitude: {school.localisation.longitude}</p>
//             </div>
//           </div>

//           {/* Administrative Information */}
//           <div className="bg-gray-100 dark:bg-meta-4 p-4 rounded-lg">
//             <h3 className="font-semibold mb-4 text-black dark:text-white">Information Administrative</h3>
//             <div className="space-y-2">
//               <p><span className="font-medium">Sous-Direction:</span> {school.sousDirection.nom}</p>
//               <p><span className="font-medium">Créé par:</span> {`${school.createdBy.nom} ${school.createdBy.postnom} ${school.createdBy.prenom}`}</p>
//               <p><span className="font-medium">Date de création:</span> {moment(school.createdAt).format('DD-MM-YYYY à HH:mm:ss')}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// function TableEcole() {
//   const dispatch = useDispatch<AppDispatch>();
//   const [schools, setSchools] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedSchool, setSelectedSchool] = useState<any>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   useEffect(() => {
//     const fetchSchools = async () => {
//       const email = localStorage.getItem('email');
//       const password = localStorage.getItem('password');

//       if (email && password) {
//         try {
//           setLoading(true);
//           const result = await dispatch(fetchAllEcoles({ route: 'ecoles' })).unwrap();
//           setSchools(result.data);
//           dispatch(setEcoleStore(result.data));
//         } catch (err) {
//           console.error('get all ecoles failed:', err);
//         } finally {
//           setLoading(false);
//         }
//       }
//     };
//     fetchSchools();
//   }, [dispatch]);

//   const openModal = (school: any) => {
//     setSelectedSchool(school);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedSchool(null);
//   };

//   return (
//     <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
//       <div className="max-w-full overflow-x-auto">
//         {loading ? (
//           <Loader />
//         ) : (
//           <table className="w-full table-auto">
//             <thead>
//               <tr className="bg-gray-2 text-left dark:bg-meta-4">
//                 <th className="min-w-[250px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">Nom de l'école</th>
//                 <th className="min-w-[250px] py-4 px-4 font-medium text-black dark:text-white">Sous-Direction</th>
//                 <th className="min-w-[250px] py-4 px-4 font-medium text-black dark:text-white">Créé par</th>
//                 <th className="min-w-[250px] py-4 px-4 font-medium text-black dark:text-white">Date de Création</th>
//                 <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {schools.map((school, key) => (
//                 <tr key={key}>
//                   <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
//                     {school.nom}
//                   </td>
//                   <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
//                     {school.sousDirection.nom}
//                   </td>
//                   <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
//                     {`${school.createdBy.nom} ${school.createdBy.postnom} ${school.createdBy.prenom}`}
//                   </td>
//                   <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
//                     {moment(school.createdAt).format('DD-MM-YYYY à HH:mm:ss')}
//                   </td>
//                   <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
//                     <div className="flex items-center space-x-3.5">
//                       <button className="hover:text-primary" onClick={() => openModal(school)}>
//                         <Eye className="h-5 w-5" />
//                       </button>
//                       <button className="hover:text-success">
//                         <Edit className="h-5 w-5" />
//                       </button>
//                       <button className="hover:text-danger">
//                         <Trash2 className="h-5 w-5" />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>

//       <DetailModal
//         isOpen={isModalOpen}
//         onClose={closeModal}
//         school={selectedSchool}
//       />
//     </div>
//   );
// }

// export default TableEcole;

import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../app/store';
import { fetchAllEcoles, setEcoleStore } from '../../../features/ecole/ecoleSlice';
import { Ecole } from '../../../types/ecole';
import moment from 'moment';
import { Building2, Edit, Eye, GraduationCap, MapPin, Trash2, Users } from 'lucide-react';

// Stats Card Component
const StatsCard = ({ Icon, value, label }: { Icon: any; value: number | string; label: string }) => (
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

// Loader Component
const Loader = () => (
  <div className="flex justify-center items-center h-full">
    <svg className="animate-spin h-10 w-10 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
    </svg>
  </div>
);

// Detail Modal Component
const DetailModal = ({ isOpen, onClose, school }: { isOpen: boolean; onClose: () => void; school: any }) => {
  if (!isOpen || !school) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 mt-20 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-boxdark rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-black dark:text-white">
            Détails de l'école
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
          {/* Basic Information */}
          <div className="bg-gray-100 dark:bg-meta-4 p-4 rounded-lg">
            <h3 className="font-semibold mb-4 text-black dark:text-white">Information de base</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p><span className="font-medium">Nom:</span> {school.nom}</p>
                <p><span className="font-medium">SECOPE:</span> {school.secope}</p>
                <p><span className="font-medium">Matricule:</span> {school.matricule}</p>
                <p><span className="font-medium">Téléphone:</span> {school.tel}</p>
                <p><span className="font-medium">Boîte Postale:</span> {school.bp}</p>
              </div>
              <div>
                <p><span className="font-medium">Dénomination:</span> {school.denomination.appellation}</p>
                <p><span className="font-medium">Sigle:</span> {school.denomination.sigle}</p>
                <p><span className="font-medium">Code:</span> {school.denomination.code}</p>
                {school.arreteMinisteriel && (
                  <p><span className="font-medium">Arrêté Ministériel:</span> {school.arreteMinisteriel}</p>
                )}
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="bg-gray-100 dark:bg-meta-4 p-4 rounded-lg">
            <h3 className="font-semibold mb-4 text-black dark:text-white">Localisation</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p><span className="font-medium">Rue/Avenue:</span> {school.rueOuAvenue}</p>
                <p><span className="font-medium">Numéro:</span> {school.n}</p>
                <p><span className="font-medium">Quartier:</span> {school.quartier}</p>
                <p><span className="font-medium">Commune/Territoire:</span> {school.communeOuTerritoire}</p>
              </div>
              <div>
                <p><span className="font-medium">District:</span> {school.district}</p>
                <p><span className="font-medium">Ville:</span> {school.ville}</p>
                <p><span className="font-medium">Secteur:</span> {school.secteur}</p>
                <p><span className="font-medium">Village:</span> {school.village}</p>
              </div>
            </div>
            <div className="mt-4">
              <p><span className="font-medium">Coordonnées GPS:</span></p>
              <p>Latitude: {school.localisation.latitude}</p>
              <p>Longitude: {school.localisation.longitude}</p>
            </div>
          </div>

          {/* Administrative Information */}
          <div className="bg-gray-100 dark:bg-meta-4 p-4 rounded-lg">
            <h3 className="font-semibold mb-4 text-black dark:text-white">Information Administrative</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Sous-Direction:</span> {school.sousDirection.nom}</p>
              <p><span className="font-medium">Créé par:</span> {`${school.createdBy.nom} ${school.createdBy.postnom} ${school.createdBy.prenom}`}</p>
              <p><span className="font-medium">Date de création:</span> {moment(school.createdAt).format('DD-MM-YYYY à HH:mm:ss')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function TableEcole() {
  const dispatch = useDispatch<AppDispatch>();
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSchool, setSelectedSchool] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchSchools = async () => {
      const email = localStorage.getItem('email');
      const password = localStorage.getItem('password');

      if (email && password) {
        try {
          setLoading(true);
          const result = await dispatch(fetchAllEcoles({ route: 'ecoles' })).unwrap();
          setSchools(result.data);
          dispatch(setEcoleStore(result.data));
        } catch (err) {
          console.error('get all ecoles failed:', err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchSchools();
  }, [dispatch]);

  const openModal = (school: any) => {
    setSelectedSchool(school);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSchool(null);
  };

  // Calculate statistics
  const calculateStats = () => {
    const stats = {
      totalSchools: schools.length,
      totalSousDirections: new Set(schools.map(school => school.sousDirection.nom)).size,
      activeSchools: schools.filter(school => school.status === 'active').length || schools.length, // Assuming all schools are active if status is not specified
      totalLocations: new Set(schools.map(school => school.communeOuTerritoire)).size
    };
    return stats;
  };

  const stats = calculateStats();

  const statsCards = [
    { Icon: Building2, value: stats.totalSchools, label: 'Total Écoles' },
    { Icon: Users, value: stats.totalSousDirections, label: 'Sous-Directions' },
    { Icon: GraduationCap, value: stats.activeSchools, label: 'Écoles Actives' },
    { Icon: MapPin, value: stats.totalLocations, label: 'Communes/Territoires' }
  ];

  return (
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
                  value={card.value}
                  label={card.label}
                />
              ))}
            </div>

            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="min-w-[250px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">Nom de l'école</th>
                  <th className="min-w-[250px] py-4 px-4 font-medium text-black dark:text-white">Sous-Direction</th>
                  <th className="min-w-[250px] py-4 px-4 font-medium text-black dark:text-white">Créé par</th>
                  <th className="min-w-[250px] py-4 px-4 font-medium text-black dark:text-white">Date de Création</th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {schools.map((school, key) => (
                  <tr key={key}>
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                      {school.nom}
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      {school.sousDirection.nom}
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      {`${school.createdBy.nom} ${school.createdBy.postnom} ${school.createdBy.prenom}`}
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      {moment(school.createdAt).format('DD-MM-YYYY à HH:mm:ss')}
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <div className="flex items-center space-x-3.5">
                        <button className="hover:text-primary" onClick={() => openModal(school)}>
                          <Eye className="h-5 w-5" />
                        </button>
                        <button className="hover:text-success">
                          <Edit className="h-5 w-5" />
                        </button>
                        <button className="hover:text-danger">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>

      <DetailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        school={selectedSchool}
      />
    </div>
  );
}

export default TableEcole;

