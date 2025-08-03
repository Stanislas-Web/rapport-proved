// exportToExcel.js

import XLSX from "sheetjs-style";
import * as FileSaver from "file-saver";

const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset-UTF-8';
const fileExtension = '.xlsx';

export const exportToExcel = async (tableData:any) => {
    // Convertir les données JSON en feuille Excel
    const ws = XLSX.utils.json_to_sheet(tableData);

    // Définir la largeur des colonnes
    ws['!cols'] = [
        { width: 20 },  // Colonne 1
        { width: 20 },  // Colonne 2
        { width: 20 },  // Colonne 3
        { width: 30 },  // Colonne 4
        { width: 20 },  // Colonne 5
        { width: 20 },  // Colonne 6
        { width: 50 },  // Colonne 7
        { width: 30 },  // Colonne 8
        { width: 20 },  // Colonne 9
        { width: 70 },  // Colonne 10
    ];

    // Appliquer des styles aux en-têtes
    const headerStyle = {
        font: { bold: true, color: { rgb: "FFFFFF" } }, // Texte en gras et blanc
        fill: { fgColor: { rgb: "4F81BD" } }, // Couleur de fond bleu
        alignment: { horizontal: "center", vertical: "center" }, // Centrer le texte
        border: { top: { style: "thin", color: { rgb: "000000" } }, bottom: { style: "thin", color: { rgb: "000000" } }, left: { style: "thin", color: { rgb: "000000" } }, right: { style: "thin", color: { rgb: "000000" } } }, // Ajouter des bordures
    };

    // Appliquer des styles aux cellules de la première ligne (en-tête)
    Object.keys(ws).forEach((key) => {
        if (key.startsWith("A1")) {  // Appliquer le style seulement à la première ligne
            ws[key].s = headerStyle;
        }
    });

    // Appliquer des styles aux lignes de données
    const rowStyle = {
        font: { color: { rgb: "000000" } }, // Texte noir
        fill: { fgColor: { rgb: "D9EAF7" } }, // Couleur de fond gris clair
        alignment: { horizontal: "left", vertical: "center" }, // Alignement à gauche
        border: { top: { style: "thin", color: { rgb: "000000" } }, bottom: { style: "thin", color: { rgb: "000000" } }, left: { style: "thin", color: { rgb: "000000" } }, right: { style: "thin", color: { rgb: "000000" } } }, // Bordures
    };

    // Appliquer le style aux lignes de données (en ignorant les en-têtes)
    Object.keys(ws).forEach((key) => {
        if (!key.startsWith("A1")) {  // Appliquer le style seulement aux lignes de données
            ws[key].s = rowStyle;
        }
    });

    // Créer un classeur et ajouter la feuille
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Liste des écoles");

    // Créer le fichier et le télécharger
    const data = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    FileSaver.saveAs(data, "Liste-Ecole" + fileExtension);
};

export const exportToExcelDeliverer = async (tableData:any) => {
    const ws = XLSX.utils.json_to_sheet(tableData);
    // Définir la largeur des colonnes pour les livreurs
    ws['!cols'] = [
        { width: 20 },  // Colonne 1
        { width: 20 },  // Colonne 2
        { width: 20 },  // Colonne 3
        { width: 30 },  // Colonne 4
        { width: 20 },  // Colonne 5
        { width: 20 },  // Colonne 6
        { width: 50 },  // Colonne 7
        { width: 30 },  // Colonne 8
        { width: 20 },  // Colonne 9
        { width: 70 },  // Colonne 10
    ];

    // Appliquer des styles comme dans la fonction précédente
    // ...
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Liste des livreurs");
    const data = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    FileSaver.saveAs(data, "Liste-livreurs" + fileExtension);
};

// Autres fonctions d'exportation ici...
