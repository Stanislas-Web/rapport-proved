
import { RootState } from '../../app/store';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useSelector } from 'react-redux';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import moment from 'moment';
import TableA1 from './components/tableA1';


const A1 = () => {
  const { a1s } = useSelector((state: RootState) => state.a1s);


  const exportAdminDataToExcel = () => {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const data = JSON.parse(localStorage.getItem('data') || '{}');

    // Formatage des données pour Excel
    const formattedData = a1s.map((item: any, index: any) => {
      const structureEtPeuplementDetails = item.structureEtPeuplement
        .map((structure: any) => {
          const classesDetails = structure.classes
            .map(
              (classe: any) =>
                `${classe.classe}: ${classe.nombreElevesGarcons} garçons, ${classe.nombreElevesFilles} filles`
            )
            .join('; ');
          return `${structure.niveau}: ${classesDetails}`;
        })
        .join('\n');

      const miseEnPlaceDetails = item.miseEnPlace
        .map(
          (person: any) =>
            `${person.nomPostNom} (${person.sexe}), Age: ${person.age}, Fonction: ${person.fonction
            }, Date d'entrée: ${person.dateEntree || 'Non spécifiée'}, Date de sortie: ${person.dateSortie || 'Non spécifiée'
            }`
        )
        .join('\n');

      return {
        N: index + 1,
        "Nom de l'Établissement": item.etablissement.nom,
        Adresse: item.etablissement.adresse,
        "Code de l'Établissement": item.code,
        "Personnel Administratif Autorisé": item.personnel.administratif[0]?.autorise || 0,
        "Personnel Administratif Employé": item.personnel.administratif[0]?.employe || 0,
        "Personnel Administratif Manquant": item.personnel.administratif[0]?.manque || 0,
        "Personnel Enseignant Autorisé": item.personnel.enseignant[0]?.autorise || 0,
        "Personnel Enseignant Employé": item.personnel.enseignant[0]?.employe || 0,
        "Personnel Enseignant Manquant": item.personnel.enseignant[0]?.manque || 0,
        "Structure et Peuplement": structureEtPeuplementDetails,
        "Mise en Place": miseEnPlaceDetails,
        "Créé Par": `${item.createdBy.nom} ${item.createdBy.postnom} ${item.createdBy.prenom}`,
        "Date de Création": moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      };
    });

    // Création de la feuille Excel
    const ws = XLSX.utils.aoa_to_sheet([
      ['FICHE ADMINISTRATIVE (A1)'], // Titre
      [], // Ligne vide
      ['Rapport généré par ' + data.nom + " " + data.postnom + " " + data.prenom + " le " + moment().format('DD/MM/YYYY à HH:mm')], // Date de génération
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
      { s: { r: 0, c: 0 }, e: { r: 0, c: 13 } }, // Titre
      { s: { r: 2, c: 0 }, e: { r: 2, c: 13 } }, // Date
    ];

    // Largeurs des colonnes
    ws['!cols'] = [
      { wch: 5 },  // N
      { wch: 30 }, // Nom de l'Établissement
      { wch: 30 }, // Adresse
      { wch: 20 }, // Code
      { wch: 40 }, // Personnel Admin Autorisé
      { wch: 40 }, // Personnel Admin Employé
      { wch: 40 }, // Personnel Admin Manquant
      { wch: 40 }, // Personnel Ens Autorisé
      { wch: 40 }, // Personnel Ens Employé
      { wch: 40 }, // Personnel Ens Manquant
      { wch: 50 }, // Structure et Peuplement
      { wch: 50 }, // Mise en Place
      { wch: 30 }, // Créé Par
      { wch: 20 }, // Date de Création
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
    XLSX.utils.book_append_sheet(wb, ws, 'Fiche Administrative');

    // Conversion en buffer
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    // Téléchargement du fichier
    const dataBlob = new Blob([excelBuffer], { type: fileType });
    saveAs(dataBlob, `Fiche-Administrative${fileExtension}`);
  };




  return (
    <>
      <div className="mx-auto max-w-270">

        <Breadcrumb pageName="Fiche administrative (A1)" />
        <div className='flex  md:justify-end  mb-10'>
          <div onClick={exportAdminDataToExcel} className='cursor-pointer'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48px" height="48px"><path fill="#4CAF50" d="M41,10H25v28h16c0.553,0,1-0.447,1-1V11C42,10.447,41.553,10,41,10z" /><path fill="#FFF" d="M32 15H39V18H32zM32 25H39V28H32zM32 30H39V33H32zM32 20H39V23H32zM25 15H30V18H25zM25 25H30V28H25zM25 30H30V33H25zM25 20H30V23H25z" /><path fill="#2E7D32" d="M27 42L6 38 6 10 27 6z" /><path fill="#FFF" d="M19.129,31l-2.411-4.561c-0.092-0.171-0.186-0.483-0.284-0.938h-0.037c-0.046,0.215-0.154,0.541-0.324,0.979L13.652,31H9.895l4.462-7.001L10.274,17h3.837l2.001,4.196c0.156,0.331,0.296,0.725,0.42,1.179h0.04c0.078-0.271,0.224-0.68,0.439-1.22L19.237,17h3.515l-4.199,6.939l4.316,7.059h-3.74V31z" /></svg>
          </div>
        </div>
        <TableA1 />
      </div>
    </>
  );
};

export default A1;

