import React, { useState, useEffect } from 'react';
import { rapportActiviteService } from '../../services/rapportActivite/rapportActiviteService';
import { RapportActivite } from '../../models/RapportActivite';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import moment from 'moment';
import { generateAndDownloadPDF } from '../../utils/generateRapportPDF';

// Fonction helper pour formater l'affichage du personnel
const formatPersonnelDisplay = (rapport: RapportActivite) => {
  const prescolaireTotal = 
    (rapport.personnel?.personnelEnseignant?.niveauPrescolaire?.enseignementPrescolaireSpecial?.hommes || 0) +
    (rapport.personnel?.personnelEnseignant?.niveauPrescolaire?.enseignementPrescolaireSpecial?.femmes || 0) +
    (rapport.personnel?.personnelEnseignant?.niveauPrescolaire?.enseignementPrescolaire?.hommes || 0) +
    (rapport.personnel?.personnelEnseignant?.niveauPrescolaire?.enseignementPrescolaire?.femmes || 0);
    
  const primaireTotal = 
    (rapport.personnel?.personnelEnseignant?.niveauPrimaire?.enseignementPrescolaireSpecial?.hommes || 0) +
    (rapport.personnel?.personnelEnseignant?.niveauPrimaire?.enseignementPrescolaireSpecial?.femmes || 0) +
    (rapport.personnel?.personnelEnseignant?.niveauPrimaire?.enseignementPrimaire?.hommes || 0) +
    (rapport.personnel?.personnelEnseignant?.niveauPrimaire?.enseignementPrimaire?.femmes || 0);
    
  const secondaireTotal = 
    (rapport.personnel?.personnelEnseignant?.niveauSecondaire?.enseignementPrescolaireSpecial?.hommes || 0) +
    (rapport.personnel?.personnelEnseignant?.niveauSecondaire?.enseignementPrescolaireSpecial?.femmes || 0) +
    (rapport.personnel?.personnelEnseignant?.niveauSecondaire?.enseignementSecondaire?.hommes || 0) +
    (rapport.personnel?.personnelEnseignant?.niveauSecondaire?.enseignementSecondaire?.femmes || 0);
    
  return `${prescolaireTotal} / ${primaireTotal} / ${secondaireTotal}`;
};

// Fonction helper pour calculer le total du personnel enseignant par niveau
const calculatePersonnelEnseignantTotal = (rapport: RapportActivite, niveau: 'prescolaire' | 'primaire' | 'secondaire') => {
  if (niveau === 'prescolaire') {
    return (rapport.personnel?.personnelEnseignant?.niveauPrescolaire?.enseignementPrescolaireSpecial?.hommes || 0) +
           (rapport.personnel?.personnelEnseignant?.niveauPrescolaire?.enseignementPrescolaireSpecial?.femmes || 0) +
           (rapport.personnel?.personnelEnseignant?.niveauPrescolaire?.enseignementPrescolaire?.hommes || 0) +
           (rapport.personnel?.personnelEnseignant?.niveauPrescolaire?.enseignementPrescolaire?.femmes || 0);
  } else if (niveau === 'primaire') {
    return (rapport.personnel?.personnelEnseignant?.niveauPrimaire?.enseignementPrescolaireSpecial?.hommes || 0) +
           (rapport.personnel?.personnelEnseignant?.niveauPrimaire?.enseignementPrescolaireSpecial?.femmes || 0) +
           (rapport.personnel?.personnelEnseignant?.niveauPrimaire?.enseignementPrimaire?.hommes || 0) +
           (rapport.personnel?.personnelEnseignant?.niveauPrimaire?.enseignementPrimaire?.femmes || 0);
  } else if (niveau === 'secondaire') {
    return (rapport.personnel?.personnelEnseignant?.niveauSecondaire?.enseignementPrescolaireSpecial?.hommes || 0) +
           (rapport.personnel?.personnelEnseignant?.niveauSecondaire?.enseignementPrescolaireSpecial?.femmes || 0) +
           (rapport.personnel?.personnelEnseignant?.niveauSecondaire?.enseignementSecondaire?.hommes || 0) +
           (rapport.personnel?.personnelEnseignant?.niveauSecondaire?.enseignementSecondaire?.femmes || 0);
  }
  return 0;
};

// Fonction pour générer un PDF beau et impressionnant sans packages externes
const generateBeautifulPDF = (rapport: RapportActivite) => {
  // Créer un nouveau document
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    toast.error('Impossible d\'ouvrir la fenêtre d\'impression');
    return;
  }

  // Calculer les totaux
  const totalEcoles = 
    (rapport.parametresCles?.nombreEcolesClasses?.niveauPrescolaire?.espaceCommunautaireEveil?.nombreEcoles || 0) +
    (rapport.parametresCles?.nombreEcolesClasses?.niveauPrescolaire?.maternel?.nombreEcoles || 0) +
    (rapport.parametresCles?.nombreEcolesClasses?.niveauPrescolaire?.prePrimaire?.nombreEcoles || 0) +
    (rapport.parametresCles?.nombreEcolesClasses?.niveauPrescolaire?.special?.nombreEcoles || 0) +
    (rapport.parametresCles?.nombreEcolesClasses?.niveauPrimaire?.enseignementPrimaire?.nombreEcoles || 0) +
    (rapport.parametresCles?.nombreEcolesClasses?.niveauSecondaire?.enseignementSecondaire?.nombreEcoles || 0);

  const totalClasses = 
    (rapport.parametresCles?.nombreEcolesClasses?.niveauPrescolaire?.espaceCommunautaireEveil?.nombreClasses || 0) +
    (rapport.parametresCles?.nombreEcolesClasses?.niveauPrescolaire?.maternel?.nombreClasses || 0) +
    (rapport.parametresCles?.nombreEcolesClasses?.niveauPrescolaire?.prePrimaire?.nombreClasses || 0) +
    (rapport.parametresCles?.nombreEcolesClasses?.niveauPrescolaire?.special?.nombreClasses || 0) +
    (rapport.parametresCles?.nombreEcolesClasses?.niveauPrimaire?.enseignementSpecial?.totalClassesSpecialesPrim || 0) +
    (rapport.parametresCles?.nombreEcolesClasses?.niveauPrimaire?.enseignementPrimaire?.totalClassesPrimaire || 0) +
    (rapport.parametresCles?.nombreEcolesClasses?.niveauSecondaire?.enseignementSpecial?.totalClassesSpecialesSec || 0) +
    (rapport.parametresCles?.nombreEcolesClasses?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.classes7emeCTEB || 0) +
    (rapport.parametresCles?.nombreEcolesClasses?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.classes8emeCTEB || 0) +
    (rapport.parametresCles?.nombreEcolesClasses?.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.totalClassesHumanites || 0);

  const totalPersonnel = 
    // Personnel Enseignant - Niveau Prescolaire
    (rapport.personnel?.personnelEnseignant?.niveauPrescolaire?.enseignementPrescolaireSpecial?.hommes || 0) +
    (rapport.personnel?.personnelEnseignant?.niveauPrescolaire?.enseignementPrescolaireSpecial?.femmes || 0) +
    (rapport.personnel?.personnelEnseignant?.niveauPrescolaire?.enseignementPrescolaire?.hommes || 0) +
    (rapport.personnel?.personnelEnseignant?.niveauPrescolaire?.enseignementPrescolaire?.femmes || 0) +
    // Personnel Enseignant - Niveau Primaire
    (rapport.personnel?.personnelEnseignant?.niveauPrimaire?.enseignementPrescolaireSpecial?.hommes || 0) +
    (rapport.personnel?.personnelEnseignant?.niveauPrimaire?.enseignementPrescolaireSpecial?.femmes || 0) +
    (rapport.personnel?.personnelEnseignant?.niveauPrimaire?.enseignementPrimaire?.hommes || 0) +
    (rapport.personnel?.personnelEnseignant?.niveauPrimaire?.enseignementPrimaire?.femmes || 0) +
    // Personnel Enseignant - Niveau Secondaire
    (rapport.personnel?.personnelEnseignant?.niveauSecondaire?.enseignementPrescolaireSpecial?.hommes || 0) +
    (rapport.personnel?.personnelEnseignant?.niveauSecondaire?.enseignementPrescolaireSpecial?.femmes || 0) +
    (rapport.personnel?.personnelEnseignant?.niveauSecondaire?.enseignementSecondaire?.hommes || 0) +
    (rapport.personnel?.personnelEnseignant?.niveauSecondaire?.enseignementSecondaire?.femmes || 0) +
    // Personnel Administratif
    (rapport.personnel?.personnelAdministratif?.directionProvinciale?.hommes || 0) +
    (rapport.personnel?.personnelAdministratif?.directionProvinciale?.femmes || 0) +
    (rapport.personnel?.personnelAdministratif?.inspectionPrincipale?.hommes || 0) +
    (rapport.personnel?.personnelAdministratif?.inspectionPrincipale?.femmes || 0) +
    (rapport.personnel?.personnelAdministratif?.coordinationProvinciale?.hommes || 0) +
    (rapport.personnel?.personnelAdministratif?.coordinationProvinciale?.femmes || 0) +
    (rapport.personnel?.personnelAdministratif?.sousDivision?.hommes || 0) +
    (rapport.personnel?.personnelAdministratif?.sousDivision?.femmes || 0);

  // HTML pour le PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Rapport d'Activités ${rapport.annee}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Inter', sans-serif;
          line-height: 1.6;
          color: #333;
          background: #fff;
          font-size: 15px;
        }
        
        .pdf-container {
          max-width: 210mm;
          margin: 0 auto;
          padding: 20mm;
          background: white;
        }
        
                 .header {
           text-align: center;
           margin-bottom: 30px;
           border-bottom: 3px solid #1e40af;
           padding-bottom: 20px;
         }
         
         .logo-center {
           text-align: center;
           margin: 15px 0;
         }
         
         .header-logo {
           width: 100px;
           height: 100px;
           object-fit: contain;
         }
        
                         .republic {
          font-size: 18px;
          font-weight: 700;
          color: #666;
          margin-bottom: 10px;
          text-align: center;
        }
        
        .ministry {
          font-size: 20px;
          font-weight: 700;
          text-transform: uppercase;
          color: #1e40af;
          margin-bottom: 5px;
        }
        
        .direction {
          font-size: 18px;
          font-weight: 600;
          text-transform: uppercase;
          color: #374151;
          margin-bottom: 10px;
        }
        
        .main-title {
          font-size: 26px;
          font-weight: 700;
          text-transform: uppercase;
          color: #1e40af;
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
          padding: 15px;
          border-radius: 8px;
          margin: 20px 0;
          text-align: center;
          border: 2px solid #1e40af;
        }
        
        .info-section {
          margin: 25px 0;
        }
        
        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #1e40af;
          margin-bottom: 15px;
          padding: 10px;
          background: #f3f4f6;
          border-left: 4px solid #1e40af;
          border-radius: 4px;
        }
        
        .info-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 15px;
          margin-bottom: 20px;
        }
        
        .info-card {
          background: #f8fafc;
          padding: 15px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }
        
        .info-card h4 {
          font-size: 16px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
        }
        
        .info-card p {
          font-size: 15px;
          color: #6b7280;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
          margin: 20px 0;
        }
        
        .stat-card {
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          color: white;
          padding: 20px;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .stat-number {
          font-size: 26px;
          font-weight: 700;
          margin-bottom: 5px;
        }
        
        .stat-label {
          font-size: 14px;
          opacity: 0.9;
        }
        
        .table-container {
          margin: 25px 0;
          overflow-x: auto;
        }
        
        .data-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .data-table th {
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          color: white;
          padding: 12px;
          text-align: left;
          font-weight: 600;
          font-size: 15px;
        }
        
        .data-table td {
          padding: 12px;
          border-bottom: 1px solid #e5e7eb;
          font-size: 15px;
        }
        
        .data-table tr:nth-child(even) {
          background: #f9fafb;
        }
        
        .data-table tr:hover {
          background: #f3f4f6;
        }
        
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 2px solid #e5e7eb;
          text-align: center;
          color: #6b7280;
          font-size: 14px;
        }
        
        .signature-section {
          margin-top: 40px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }
        
        .signature-box {
          text-align: center;
          padding: 20px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
        }
        
                 .signature-line {
           width: 200px;
           height: 2px;
           background: #374151;
           margin: 40px auto 10px;
         }
         
         .personnel-details, .realisation-details, .resume-details {
           display: flex;
           flex-direction: column;
           gap: 8px;
         }
         
         .personnel-item, .realisation-item, .resume-item, .detail-item {
           display: flex;
           justify-content: space-between;
           align-items: center;
           padding: 6px 0;
           border-bottom: 1px solid #f1f5f9;
         }
         
         .personnel-item:last-child, .realisation-item:last-child, .resume-item:last-child, .detail-item:last-child {
           border-bottom: none;
         }
         
         .label {
           font-weight: 500;
           color: #374151;
           font-size: 14px;
         }
         
         .value {
           font-weight: 600;
           color: #1e40af;
           font-size: 14px;
         }
        
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
          
          .pdf-container {
            max-width: none;
            margin: 0;
            padding: 15mm;
          }
        }
      </style>
    </head>
    <body>
      <div class="pdf-container">
        <!-- En-tête avec logo -->
        <div class="header">
          <div class="republic">République Démocratique du Congo</div>
          <div class="logo-center">
            <img src="/image.png" alt="Logo Ministère" class="header-logo" />
          </div>
          <div class="ministry">Ministère de l'Éducation Nationale et Nouvelle Citoyenneté</div>
          <div class="direction">PROVINCE EDUCATIONNELLE ${rapport.identificationProved?.provinceEducationnelle || 'N/A'}</div>
        </div>
        
        <!-- Titre principal -->
        <div class="main-title">
          Rapport d'Activités
        </div>
        
        <!-- Informations générales -->
        <div class="info-section">
          <div class="section-title">Informations Générales</div>
          <div class="info-grid">
            <div class="info-card">
              <h4>Province Administrative</h4>
              <p>${rapport.identificationProved?.provinceAdministrative || 'Non spécifié'}</p>
            </div>
            <div class="info-card">
              <h4>Province Éducationnelle</h4>
              <p>${rapport.identificationProved?.provinceEducationnelle || 'Non spécifié'}</p>
            </div>
            <div class="info-card">
              <h4>Chef-lieu PROVED</h4>
              <p>${rapport.identificationProved?.chefLieuProved || 'Non spécifié'}</p>
            </div>
            <div class="info-card">
              <h4>Proved</h4>
              <p>${rapport.identificationProved?.directeurProvincial || 'Non spécifié'}</p>
            </div>
            <div class="info-card">
              <h4>Email Professionnel</h4>
              <p>${rapport.identificationProved?.emailProfessionnel || 'Non spécifié'}</p>
            </div>
            <div class="info-card">
              <h4>Téléphone</h4>
              <p>${rapport.identificationProved?.telephone || 'Non spécifié'}</p>
            </div>
            <div class="info-card">
              <h4>Statut d'Occupation</h4>
              <p>${rapport.identificationProved?.statutOccupation || 'Non spécifié'}</p>
            </div>
            <div class="info-card">
              <h4>Nombre de Territoires</h4>
              <p>${rapport.identificationProved?.nombreTerritoires || 0}</p>
            </div>
            <div class="info-card">
              <h4>Nombre de Sous-divisions</h4>
              <p>${rapport.identificationProved?.nombreSousDivisions || 0}</p>
            </div>
            <div class="info-card">
              <h4>Statut du Rapport</h4>
              <p style="color: ${rapport.statut === 'approuve' ? '#059669' : rapport.statut === 'rejete' ? '#dc2626' : '#d97706'}; font-weight: 600;">
                ${rapport.statut?.charAt(0).toUpperCase() + rapport.statut?.slice(1) || 'Brouillon'}
              </p>
            </div>
          </div>
        </div>
        
        <!-- Statistiques principales -->
        <div class="info-section">
          <div class="section-title">Statistiques Principales</div>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-number">${totalEcoles.toLocaleString()}</div>
              <div class="stat-label">Écoles</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${totalClasses.toLocaleString()}</div>
              <div class="stat-label">Classes</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${rapport.totalEffectifs ? rapport.totalEffectifs.toLocaleString() : 'N/A'}</div>
              <div class="stat-label">Effectifs</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${totalPersonnel.toLocaleString()}</div>
              <div class="stat-label">Personnel</div>
            </div>
          </div>
        </div>
        
        <!-- Détails par niveau -->
        <div class="info-section">
          <div class="section-title">Détails par Niveau d'Enseignement</div>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Niveau</th>
                  <th>Écoles</th>
                  <th>Classes</th>
                  <th>Personnel</th>
                  <th>Effectifs</th>
                  <th>Détails</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Préscolaire</strong></td>
                  <td>${(rapport.parametresCles?.niveauPrescolaire?.espaceCommunautaireEveil?.nombreEcoles || 0) + (rapport.parametresCles?.niveauPrescolaire?.maternel?.nombreEcoles || 0) + (rapport.parametresCles?.niveauPrescolaire?.prePrimaire?.nombreEcoles || 0)}</td>
                  <td>${(rapport.parametresCles?.niveauPrescolaire?.espaceCommunautaireEveil?.nombreClasses || 0) + (rapport.parametresCles?.niveauPrescolaire?.maternel?.nombreClasses || 0) + (rapport.parametresCles?.niveauPrescolaire?.prePrimaire?.nombreClasses || 0)}</td>
                  <td>${(rapport.personnel?.personnelEnseignant?.prescolaire?.hommes || 0) + (rapport.personnel?.personnelEnseignant?.prescolaire?.femmes || 0)}</td>
                  <td>${((rapport.parametresCles?.niveauPrescolaire?.espaceCommunautaireEveil?.effectifGarcons || 0) + (rapport.parametresCles?.niveauPrescolaire?.espaceCommunautaireEveil?.effectifFilles || 0) + (rapport.parametresCles?.niveauPrescolaire?.maternel?.effectifGarcons || 0) + (rapport.parametresCles?.niveauPrescolaire?.maternel?.effectifFilles || 0) + (rapport.parametresCles?.niveauPrescolaire?.prePrimaire?.effectifGarcons || 0) + (rapport.parametresCles?.niveauPrescolaire?.prePrimaire?.effectifFilles || 0)).toLocaleString()}</td>
                  <td>Maternel, Pré-primaire, Spécial</td>
                </tr>
                <tr>
                  <td><strong>Primaire</strong></td>
                  <td>${rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.nombreEcoles || 0}</td>
                  <td>${(rapport.parametresCles?.niveauPrimaire?.enseignementSpecial?.nombreClasses || 0) + (rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.nombreClasses || 0)}</td>
                  <td>${(rapport.personnel?.personnelEnseignant?.primaire?.hommes || 0) + (rapport.personnel?.personnelEnseignant?.primaire?.femmes || 0)}</td>
                  <td>${((rapport.parametresCles?.niveauPrimaire?.enseignementSpecial?.effectifGarcons || 0) + (rapport.parametresCles?.niveauPrimaire?.enseignementSpecial?.effectifFilles || 0) + (rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifGarcons || 0) + (rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifFilles || 0)).toLocaleString()}</td>
                  <td>Primaire, Spécial</td>
                </tr>
                <tr>
                  <td><strong>Secondaire</strong></td>
                  <td>-</td>
                  <td>${(rapport.parametresCles?.niveauSecondaire?.enseignementSpecial?.nombreClasses || 0) + (rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.classes7emeCTEB || 0) + (rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.classes8emeCTEB || 0) + (rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.classesHumanites || 0)}</td>
                  <td>${(rapport.personnel?.personnelEnseignant?.secondaire?.hommes || 0) + (rapport.personnel?.personnelEnseignant?.secondaire?.femmes || 0)}</td>
                  <td>${((rapport.parametresCles?.niveauSecondaire?.enseignementSpecial?.effectifGarcons || 0) + (rapport.parametresCles?.niveauSecondaire?.enseignementSpecial?.effectifFilles || 0) + (rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.effectifGarcons || 0) + (rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.effectifFilles || 0) + (rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.effectifGarcons || 0) + (rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.effectifFilles || 0)).toLocaleString()}</td>
                  <td>CTEB, Humanités, Spécial</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- Détails Préscolaire -->
        <div class="info-section">
          <div class="section-title">Détails Préscolaire</div>
          <div class="info-grid">
            <div class="info-card">
              <h4>Espace Communautaire d'Éveil</h4>
              <div class="detail-item">
                <span class="label">Écoles:</span>
                <span class="value">${rapport.parametresCles?.niveauPrescolaire?.espaceCommunautaireEveil?.nombreEcoles || 0}</span>
              </div>
              <div class="detail-item">
                <span class="label">Classes:</span>
                <span class="value">${rapport.parametresCles?.niveauPrescolaire?.espaceCommunautaireEveil?.nombreClasses || 0}</span>
              </div>
              <div class="detail-item">
                <span class="label">Garçons:</span>
                <span class="value">${rapport.parametresCles?.niveauPrescolaire?.espaceCommunautaireEveil?.effectifGarcons || 0}</span>
              </div>
              <div class="detail-item">
                <span class="label">Filles:</span>
                <span class="value">${rapport.parametresCles?.niveauPrescolaire?.espaceCommunautaireEveil?.effectifFilles || 0}</span>
              </div>
              <div class="detail-item">
                <span class="label">Taux d'accroissement:</span>
                <span class="value">${rapport.parametresCles?.niveauPrescolaire?.espaceCommunautaireEveil?.tauxAccroissement || 0}%</span>
              </div>
            </div>
            <div class="info-card">
              <h4>Maternel</h4>
              <div class="detail-item">
                <span class="label">Écoles:</span>
                <span class="value">${rapport.parametresCles?.niveauPrescolaire?.maternel?.nombreEcoles || 0}</span>
              </div>
              <div class="detail-item">
                <span class="label">Classes:</span>
                <span class="value">${rapport.parametresCles?.niveauPrescolaire?.maternel?.nombreClasses || 0}</span>
              </div>
              <div class="detail-item">
                <span class="label">Garçons:</span>
                <span class="value">${rapport.parametresCles?.niveauPrescolaire?.maternel?.effectifGarcons || 0}</span>
              </div>
              <div class="detail-item">
                <span class="label">Filles:</span>
                <span class="value">${rapport.parametresCles?.niveauPrescolaire?.maternel?.effectifFilles || 0}</span>
              </div>
              <div class="detail-item">
                <span class="label">Taux d'accroissement:</span>
                <span class="value">${rapport.parametresCles?.niveauPrescolaire?.maternel?.tauxAccroissement || 0}%</span>
              </div>
            </div>
            <div class="info-card">
              <h4>Pré-primaire</h4>
              <div class="detail-item">
                <span class="label">Écoles:</span>
                <span class="value">${rapport.parametresCles?.niveauPrescolaire?.prePrimaire?.nombreEcoles || 0}</span>
              </div>
              <div class="detail-item">
                <span class="label">Classes:</span>
                <span class="value">${rapport.parametresCles?.niveauPrescolaire?.prePrimaire?.nombreClasses || 0}</span>
              </div>
              <div class="detail-item">
                <span class="label">Garçons:</span>
                <span class="value">${rapport.parametresCles?.niveauPrescolaire?.prePrimaire?.effectifGarcons || 0}</span>
              </div>
              <div class="detail-item">
                <span class="label">Filles:</span>
                <span class="value">${rapport.parametresCles?.niveauPrescolaire?.prePrimaire?.effectifFilles || 0}</span>
              </div>
              <div class="detail-item">
                <span class="label">Taux d'accroissement:</span>
                <span class="value">${rapport.parametresCles?.niveauPrescolaire?.prePrimaire?.tauxAccroissement || 0}%</span>
              </div>
            </div>
            <div class="info-card">
              <h4>Spécial</h4>
              <div class="detail-item">
                <span class="label">Écoles:</span>
                <span class="value">${rapport.parametresCles?.niveauPrescolaire?.special?.nombreEcoles || 0}</span>
              </div>
              <div class="detail-item">
                <span class="label">Classes:</span>
                <span class="value">${rapport.parametresCles?.niveauPrescolaire?.special?.nombreClasses || 0}</span>
              </div>
              <div class="detail-item">
                <span class="label">Garçons:</span>
                <span class="value">${rapport.parametresCles?.niveauPrescolaire?.special?.effectifGarcons || 0}</span>
              </div>
              <div class="detail-item">
                <span class="label">Filles:</span>
                <span class="value">${rapport.parametresCles?.niveauPrescolaire?.special?.effectifFilles || 0}</span>
              </div>
              <div class="detail-item">
                <span class="label">Taux d'accroissement:</span>
                <span class="value">${rapport.parametresCles?.niveauPrescolaire?.special?.tauxAccroissement || 0}%</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Détails Primaire -->
        <div class="info-section">
          <div class="section-title">Détails Primaire</div>
          <div class="info-grid">
            <div class="info-card">
              <h4>Enseignement Primaire</h4>
              <div class="detail-item">
                <span class="label">Écoles:</span>
                <span class="value">${rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.nombreEcoles || 0}</span>
              </div>
              <div class="detail-item">
                <span class="label">Classes:</span>
                <span class="value">${rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.nombreClasses || 0}</span>
              </div>
              <div class="detail-item">
                <span class="label">Classes Pléthoriques:</span>
                <span class="value">${rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.classesPlethoriques || 0}</span>
              </div>
              <div class="detail-item">
                <span class="label">Garçons:</span>
                <span class="value">${rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifGarcons || 0}</span>
              </div>
              <div class="detail-item">
                <span class="label">Filles:</span>
                <span class="value">${rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifFilles || 0}</span>
              </div>
              <div class="detail-item">
                <span class="label">Taux d'accroissement:</span>
                <span class="value">${rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.tauxAccroissement || 0}%</span>
              </div>
            </div>
            <div class="info-card">
              <h4>Enseignement Spécial</h4>
              <div class="detail-item">
                <span class="label">Classes:</span>
                <span class="value">${rapport.parametresCles?.niveauPrimaire?.enseignementSpecial?.nombreClasses || 0}</span>
              </div>
              <div class="detail-item">
                <span class="label">Garçons:</span>
                <span class="value">${rapport.parametresCles?.niveauPrimaire?.enseignementSpecial?.effectifGarcons || 0}</span>
              </div>
              <div class="detail-item">
                <span class="label">Filles:</span>
                <span class="value">${rapport.parametresCles?.niveauPrimaire?.enseignementSpecial?.effectifFilles || 0}</span>
              </div>
              <div class="detail-item">
                <span class="label">Taux d'accroissement:</span>
                <span class="value">${rapport.parametresCles?.niveauPrimaire?.enseignementSpecial?.tauxAccroissement || 0}%</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Détails Secondaire -->
        <div class="info-section">
          <div class="section-title">Détails Secondaire</div>
          <div class="info-grid">
            <div class="info-card">
              <h4>Enseignement Spécial</h4>
              <div class="detail-item">
                <span class="label">Classes:</span>
                <span class="value">${rapport.parametresCles?.niveauSecondaire?.enseignementSpecial?.nombreClasses || 0}</span>
              </div>
              <div class="detail-item">
                <span class="label">Garçons:</span>
                <span class="value">${rapport.parametresCles?.niveauSecondaire?.enseignementSpecial?.effectifGarcons || 0}</span>
              </div>
              <div class="detail-item">
                <span class="label">Filles:</span>
                <span class="value">${rapport.parametresCles?.niveauSecondaire?.enseignementSpecial?.effectifFilles || 0}</span>
              </div>
              <div class="detail-item">
                <span class="label">Taux d'accroissement:</span>
                <span class="value">${rapport.parametresCles?.niveauSecondaire?.enseignementSpecial?.tauxAccroissement || 0}%</span>
              </div>
            </div>
            <div class="info-card">
              <h4>Premier Cycle (CTEB)</h4>
              <div class="detail-item">
                <span class="label">Classes 7ème CTEB:</span>
                <span class="value">${rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.classes7emeCTEB || 0}</span>
              </div>
              <div class="detail-item">
                <span class="label">Classes 8ème CTEB:</span>
                <span class="value">${rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.classes8emeCTEB || 0}</span>
              </div>
              <div class="detail-item">
                <span class="label">Garçons:</span>
                <span class="value">${rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.effectifGarcons || 0}</span>
              </div>
              <div class="detail-item">
                <span class="label">Filles:</span>
                <span class="value">${rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.effectifFilles || 0}</span>
              </div>
              <div class="detail-item">
                <span class="label">Taux d'accroissement:</span>
                <span class="value">${rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.tauxAccroissement || 0}%</span>
              </div>
            </div>
            <div class="info-card">
              <h4>Deuxième Cycle (Humanités)</h4>
              <div class="detail-item">
                <span class="label">Classes Humanités:</span>
                <span class="value">${rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.classesHumanites || 0}</span>
              </div>
              <div class="detail-item">
                <span class="label">Garçons:</span>
                <span class="value">${rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.effectifGarcons || 0}</span>
              </div>
              <div class="detail-item">
                <span class="label">Filles:</span>
                <span class="value">${rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.effectifFilles || 0}</span>
              </div>
              <div class="detail-item">
                <span class="label">Taux d'accroissement:</span>
                <span class="value">${rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.tauxAccroissement || 0}%</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Détails du Personnel -->
        <div class="info-section">
          <div class="section-title">Détails du Personnel</div>
          <div class="info-grid">
            <div class="info-card">
              <h4>Personnel Enseignant</h4>
              <div class="personnel-details">
                <div class="personnel-item">
                  <span class="label">Préscolaire:</span>
                  <span class="value">${rapport.personnel?.personnelEnseignant?.prescolaire?.hommes || 0}H / ${rapport.personnel?.personnelEnseignant?.prescolaire?.femmes || 0}F</span>
                </div>
                <div class="personnel-item">
                  <span class="label">Primaire:</span>
                  <span class="value">${rapport.personnel?.personnelEnseignant?.primaire?.hommes || 0}H / ${rapport.personnel?.personnelEnseignant?.primaire?.femmes || 0}F</span>
                </div>
                <div class="personnel-item">
                  <span class="label">Secondaire:</span>
                  <span class="value">${rapport.personnel?.personnelEnseignant?.secondaire?.hommes || 0}H / ${rapport.personnel?.personnelEnseignant?.secondaire?.femmes || 0}F</span>
                </div>
              </div>
            </div>
            <div class="info-card">
              <h4>Personnel Administratif</h4>
              <div class="personnel-details">
                <div class="personnel-item">
                  <span class="label">Direction Provinciale:</span>
                  <span class="value">${rapport.personnel?.personnelAdministratif?.directionProvinciale || 0}</span>
                </div>
                <div class="personnel-item">
                  <span class="label">Inspection Principale:</span>
                  <span class="value">${rapport.personnel?.personnelAdministratif?.inspectionPrincipale || 0}</span>
                </div>
                <div class="personnel-item">
                  <span class="label">DINACOPE:</span>
                  <span class="value">${rapport.personnel?.personnelAdministratif?.dinacope || 0}</span>
                </div>
                <div class="personnel-item">
                  <span class="label">SERNIE:</span>
                  <span class="value">${rapport.personnel?.personnelAdministratif?.sernie || 0}</span>
                </div>
                <div class="personnel-item">
                  <span class="label">Coordination Provinciale:</span>
                  <span class="value">${rapport.personnel?.personnelAdministratif?.coordinationProvinciale || 0}</span>
                </div>
                <div class="personnel-item">
                  <span class="label">Sous-division:</span>
                  <span class="value">${rapport.personnel?.personnelAdministratif?.sousDivision || 0}</span>
                </div>
                <div class="personnel-item">
                  <span class="label">Pools Inspection Primaire:</span>
                  <span class="value">${rapport.personnel?.personnelAdministratif?.poolsInspectionPrimaire || 0}</span>
                </div>
                <div class="personnel-item">
                  <span class="label">Pools Inspection Secondaire:</span>
                  <span class="value">${rapport.personnel?.personnelAdministratif?.poolsInspectionSecondaire || 0}</span>
                </div>
                <div class="personnel-item">
                  <span class="label">Antenne DINACOPE:</span>
                  <span class="value">${rapport.personnel?.personnelAdministratif?.antenneDinacope || 0}</span>
                </div>
                <div class="personnel-item">
                  <span class="label">Antenne SERNIE:</span>
                  <span class="value">${rapport.personnel?.personnelAdministratif?.antenneSernie || 0}</span>
                </div>
                <div class="personnel-item">
                  <span class="label">Coordination Diocésaine:</span>
                  <span class="value">${rapport.personnel?.personnelAdministratif?.coordinationDiocesaine || 0}</span>
                </div>
                <div class="personnel-item">
                  <span class="label">Sous-coordination Conventionnées:</span>
                  <span class="value">${rapport.personnel?.personnelAdministratif?.sousCoordinationConventionnees || 0}</span>
                </div>
                <div class="personnel-item">
                  <span class="label">Conseillerie Résidente:</span>
                  <span class="value">${rapport.personnel?.personnelAdministratif?.conseillerieResidente || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Réalisations -->
        <div class="info-section">
          <div class="section-title">Réalisations et Infrastructures</div>
          <div class="info-grid">
            <div class="info-card">
              <h4>Nouvelles Infrastructures</h4>
              <div class="realisation-details">
                <div class="realisation-item">
                  <span class="label">Salles de classe (Préscolaire):</span>
                  <span class="value">${rapport.realisations?.accesAccessibiliteEquite?.nouvellesSallesClasses?.prescolaire || 0}</span>
                </div>
                <div class="realisation-item">
                  <span class="label">Salles de classe (Primaire):</span>
                  <span class="value">${rapport.realisations?.accesAccessibiliteEquite?.nouvellesSallesClasses?.primaire || 0}</span>
                </div>
                <div class="realisation-item">
                  <span class="label">Salles de classe (Secondaire):</span>
                  <span class="value">${rapport.realisations?.accesAccessibiliteEquite?.nouvellesSallesClasses?.secondaire || 0}</span>
                </div>
                <div class="realisation-item">
                  <span class="label">Bancs et tables (Préscolaire):</span>
                  <span class="value">${rapport.realisations?.accesAccessibiliteEquite?.nouveauxBancsTables?.prescolaire || 0}</span>
                </div>
                <div class="realisation-item">
                  <span class="label">Bancs et tables (Primaire):</span>
                  <span class="value">${rapport.realisations?.accesAccessibiliteEquite?.nouveauxBancsTables?.primaire || 0}</span>
                </div>
                <div class="realisation-item">
                  <span class="label">Bancs et tables (Secondaire):</span>
                  <span class="value">${rapport.realisations?.accesAccessibiliteEquite?.nouveauxBancsTables?.secondaire || 0}</span>
                </div>
                <div class="realisation-item">
                  <span class="label">Latrines (Préscolaire):</span>
                  <span class="value">${rapport.realisations?.accesAccessibiliteEquite?.nouvellesLatrines?.prescolaire || 0}</span>
                </div>
                <div class="realisation-item">
                  <span class="label">Latrines (Primaire):</span>
                  <span class="value">${rapport.realisations?.accesAccessibiliteEquite?.nouvellesLatrines?.primaire || 0}</span>
                </div>
                <div class="realisation-item">
                  <span class="label">Latrines (Secondaire):</span>
                  <span class="value">${rapport.realisations?.accesAccessibiliteEquite?.nouvellesLatrines?.secondaire || 0}</span>
                </div>
              </div>
            </div>
            <div class="info-card">
              <h4>Autres Réalisations</h4>
              <div class="realisation-details">
                <div class="realisation-item">
                  <span class="label">Gratuité Enseignement Primaire:</span>
                  <span class="value">${rapport.realisations?.accesAccessibiliteEquite?.gratuitéEnseignementPrimaire || 'Non spécifié'}</span>
                </div>
                <div class="realisation-item">
                  <span class="label">Sensibilisation Filles:</span>
                  <span class="value">${rapport.realisations?.accesAccessibiliteEquite?.sensibilisation?.filles ? 'Oui' : 'Non'}</span>
                </div>
                <div class="realisation-item">
                  <span class="label">Sensibilisation Enfants Hors École:</span>
                  <span class="value">${rapport.realisations?.accesAccessibiliteEquite?.sensibilisation?.enfantsHorsEcole ? 'Oui' : 'Non'}</span>
                </div>
                <div class="realisation-item">
                  <span class="label">Sensibilisation Peuples Autochtones:</span>
                  <span class="value">${rapport.realisations?.accesAccessibiliteEquite?.sensibilisation?.peuplesAutochtones ? 'Oui' : 'Non'}</span>
                </div>
                <div class="realisation-item">
                  <span class="label">Cantines Scolaires (Préscolaire):</span>
                  <span class="value">${rapport.realisations?.accesAccessibiliteEquite?.cantinesScolaires?.prescolaire || 0}</span>
                </div>
                <div class="realisation-item">
                  <span class="label">Cantines Scolaires (Primaire):</span>
                  <span class="value">${rapport.realisations?.accesAccessibiliteEquite?.cantinesScolaires?.primaire || 0}</span>
                </div>
                <div class="realisation-item">
                  <span class="label">Cantines Scolaires (Secondaire):</span>
                  <span class="value">${rapport.realisations?.accesAccessibiliteEquite?.cantinesScolaires?.secondaire || 0}</span>
                </div>
                <div class="realisation-item">
                  <span class="label">Commentaire Cantines:</span>
                  <span class="value">${rapport.realisations?.accesAccessibiliteEquite?.cantinesScolaires?.commentaire || 'Aucun commentaire'}</span>
                </div>
              </div>
            </div>
            <div class="info-card">
              <h4>Sources de Financement</h4>
              <div class="realisation-details">
                <div class="realisation-item">
                  <span class="label">Salles de classe:</span>
                  <span class="value">${rapport.realisations?.accesAccessibiliteEquite?.nouvellesSallesClasses?.sourceFinancement || 'Non spécifié'}</span>
                </div>
                <div class="realisation-item">
                  <span class="label">Bancs et tables:</span>
                  <span class="value">${rapport.realisations?.accesAccessibiliteEquite?.nouveauxBancsTables?.sourceFinancement || 'Non spécifié'}</span>
                </div>
                <div class="realisation-item">
                  <span class="label">Latrines:</span>
                  <span class="value">${rapport.realisations?.accesAccessibiliteEquite?.nouvellesLatrines?.sourceFinancement || 'Non spécifié'}</span>
                </div>
              </div>
            </div>
            <div class="info-card">
              <h4>Indicateurs d'Accès</h4>
              <div class="realisation-details">
                <div class="realisation-item">
                  <span class="label">Nouveaux inscrits:</span>
                  <span class="value">${rapport.realisations?.accesAccessibiliteEquite?.indicateursAcces?.proportionNouveauxInscrits || 0}%</span>
                </div>
                <div class="realisation-item">
                  <span class="label">Transition Primaire-CTEB:</span>
                  <span class="value">${rapport.realisations?.accesAccessibiliteEquite?.indicateursAcces?.tauxTransitionPrimaireCTEB || 0}%</span>
                </div>
                <div class="realisation-item">
                  <span class="label">Transition CTEB-Humanités:</span>
                  <span class="value">${rapport.realisations?.accesAccessibiliteEquite?.indicateursAcces?.tauxTransitionCTEBHumanites || 0}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
                         <!-- Résumé Exécutif -->
        <div class="info-section">
          <div class="section-title">Résumé Exécutif</div>
           <div class="info-grid">
             <div class="info-card">
               <h4>Points Clés</h4>
               <div class="resume-details">
                 <div class="resume-item">
                   <span class="label">Total Écoles:</span>
                   <span class="value">${totalEcoles.toLocaleString()}</span>
                 </div>
                 <div class="resume-item">
                   <span class="label">Total Classes:</span>
                   <span class="value">${totalClasses.toLocaleString()}</span>
                 </div>
                 <div class="resume-item">
                   <span class="label">Total Effectifs:</span>
                   <span class="value">${rapport.totalEffectifs ? rapport.totalEffectifs.toLocaleString() : 'N/A'}</span>
                 </div>
                 <div class="resume-item">
                   <span class="label">Total Personnel:</span>
                   <span class="value">${totalPersonnel.toLocaleString()}</span>
                 </div>
               </div>
             </div>
             <div class="info-card">
               <h4>Indicateurs de Performance</h4>
               <div class="resume-details">
                 <div class="resume-item">
                   <span class="label">Ratio Élèves/Classe:</span>
                   <span class="value">${rapport.totalEffectifs && totalClasses ? (rapport.totalEffectifs / totalClasses).toFixed(1) : 'N/A'}</span>
                 </div>
                 <div class="resume-item">
                   <span class="label">Ratio Personnel/Élève:</span>
                   <span class="value">${rapport.totalEffectifs && totalPersonnel ? (totalPersonnel / rapport.totalEffectifs * 100).toFixed(1) + '%' : 'N/A'}</span>
                 </div>
                 <div class="resume-item">
                   <span class="label">Taux de Couverture:</span>
                   <span class="value">${totalEcoles > 0 ? '100%' : '0%'}</span>
                 </div>
               </div>
             </div>
           </div>
         </div>
        
        <!-- Introduction -->
        ${rapport.introduction ? `
        <div class="info-section">
          <div class="section-title">Introduction</div>
          <div class="info-card">
            <p>${rapport.introduction}</p>
          </div>
        </div>
        ` : ''}
        
        <!-- Conclusion -->
        ${rapport.conclusion ? `
        <div class="info-section">
          <div class="section-title">Conclusion</div>
          <div class="info-card">
            <p>${rapport.conclusion}</p>
          </div>
        </div>
        ` : ''}
        
        <!-- Signatures -->
        <div class="signature-section">
          <div class="signature-box">
            <div class="signature-line"></div>
            <p><strong>Directeur Provincial</strong></p>
            <p style="font-size: 12px; color: #6b7280;">Signature et cachet</p>
          </div>
          <div class="signature-box">
            <div class="signature-line"></div>
            <p><strong>Date</strong></p>
            <p style="font-size: 12px; color: #6b7280;">${new Date().toLocaleDateString('fr-FR')}</p>
          </div>
        </div>
        
        <!-- Pied de page -->
        <div class="footer">
          <p>Rapport généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
          <p>Ministère de l'Éducation Nationale et Nouvelle Citoyenneté - RDC</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Écrire le contenu dans la nouvelle fenêtre
  printWindow.document.write(htmlContent);
  printWindow.document.close();

  // Attendre que le contenu soit chargé puis imprimer
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };
};

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

  const handleGeneratePDF = async (rapport: RapportActivite) => {
    try {
      await generateAndDownloadPDF(rapport);
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
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
                      (rapport.parametresCles?.nombreEcolesClasses?.niveauPrescolaire?.espaceCommunautaireEveil?.nombreEcoles || 0) +
                      (rapport.parametresCles?.nombreEcolesClasses?.niveauPrescolaire?.maternel?.nombreEcoles || 0) +
                      (rapport.parametresCles?.nombreEcolesClasses?.niveauPrescolaire?.prePrimaire?.nombreEcoles || 0) +
                      (rapport.parametresCles?.nombreEcolesClasses?.niveauPrescolaire?.special?.nombreEcoles || 0) +
                      (rapport.parametresCles?.nombreEcolesClasses?.niveauPrimaire?.enseignementPrimaire?.nombreEcoles || 0) +
                      (rapport.parametresCles?.nombreEcolesClasses?.niveauSecondaire?.enseignementSecondaire?.nombreEcoles || 0);

                    const totalClasses = 
                      (rapport.parametresCles?.nombreEcolesClasses?.niveauPrescolaire?.espaceCommunautaireEveil?.nombreClasses || 0) +
                      (rapport.parametresCles?.nombreEcolesClasses?.niveauPrescolaire?.maternel?.nombreClasses || 0) +
                      (rapport.parametresCles?.nombreEcolesClasses?.niveauPrescolaire?.prePrimaire?.nombreClasses || 0) +
                      (rapport.parametresCles?.nombreEcolesClasses?.niveauPrescolaire?.special?.nombreClasses || 0) +
                      (rapport.parametresCles?.nombreEcolesClasses?.niveauPrimaire?.enseignementSpecial?.totalClassesSpecialesPrim || 0) +
                      (rapport.parametresCles?.nombreEcolesClasses?.niveauPrimaire?.enseignementPrimaire?.totalClassesPrimaire || 0) +
                      (rapport.parametresCles?.nombreEcolesClasses?.niveauSecondaire?.enseignementSpecial?.totalClassesSpecialesSec || 0) +
                      (rapport.parametresCles?.nombreEcolesClasses?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.classes7emeCTEB || 0) +
                      (rapport.parametresCles?.nombreEcolesClasses?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.classes8emeCTEB || 0) +
                      (rapport.parametresCles?.nombreEcolesClasses?.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.totalClassesHumanites || 0);

                    const totalPersonnel = 
                      // Personnel Enseignant - Niveau Prescolaire
                      (rapport.personnel?.personnelEnseignant?.niveauPrescolaire?.enseignementPrescolaireSpecial?.hommes || 0) +
                      (rapport.personnel?.personnelEnseignant?.niveauPrescolaire?.enseignementPrescolaireSpecial?.femmes || 0) +
                      (rapport.personnel?.personnelEnseignant?.niveauPrescolaire?.enseignementPrescolaire?.hommes || 0) +
                      (rapport.personnel?.personnelEnseignant?.niveauPrescolaire?.enseignementPrescolaire?.femmes || 0) +
                      // Personnel Enseignant - Niveau Primaire
                      (rapport.personnel?.personnelEnseignant?.niveauPrimaire?.enseignementPrescolaireSpecial?.hommes || 0) +
                      (rapport.personnel?.personnelEnseignant?.niveauPrimaire?.enseignementPrescolaireSpecial?.femmes || 0) +
                      (rapport.personnel?.personnelEnseignant?.niveauPrimaire?.enseignementPrimaire?.hommes || 0) +
                      (rapport.personnel?.personnelEnseignant?.niveauPrimaire?.enseignementPrimaire?.femmes || 0) +
                      // Personnel Enseignant - Niveau Secondaire
                      (rapport.personnel?.personnelEnseignant?.niveauSecondaire?.enseignementPrescolaireSpecial?.hommes || 0) +
                      (rapport.personnel?.personnelEnseignant?.niveauSecondaire?.enseignementPrescolaireSpecial?.femmes || 0) +
                      (rapport.personnel?.personnelEnseignant?.niveauSecondaire?.enseignementSecondaire?.hommes || 0) +
                      (rapport.personnel?.personnelEnseignant?.niveauSecondaire?.enseignementSecondaire?.femmes || 0) +
                      // Personnel Administratif
                      (rapport.personnel?.personnelAdministratif?.directionProvinciale?.hommes || 0) +
                      (rapport.personnel?.personnelAdministratif?.directionProvinciale?.femmes || 0) +
                      (rapport.personnel?.personnelAdministratif?.inspectionPrincipale?.hommes || 0) +
                      (rapport.personnel?.personnelAdministratif?.inspectionPrincipale?.femmes || 0) +
                      (rapport.personnel?.personnelAdministratif?.coordinationProvinciale?.hommes || 0) +
                      (rapport.personnel?.personnelAdministratif?.coordinationProvinciale?.femmes || 0) +
                      (rapport.personnel?.personnelAdministratif?.sousDivision?.hommes || 0) +
                      (rapport.personnel?.personnelAdministratif?.sousDivision?.femmes || 0);

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
                                    <circle cx="9" cy="9" r="8.25" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                                    <text x="9" y="12" textAnchor="middle" fontSize="12" fontWeight="bold" fill="currentColor">-</text>
                                  </svg>
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => generateBeautifulPDF(rapport)}
                              className="hover:text-blue-600"
                              title="Générer PDF Beau"
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
                    <div><span className="font-medium">Préscolaire:</span> {(selectedRapport.parametresCles?.nombreEcolesClasses?.niveauPrescolaire?.espaceCommunautaireEveil?.nombreEcoles || 0) + (selectedRapport.parametresCles?.nombreEcolesClasses?.niveauPrescolaire?.maternel?.nombreEcoles || 0) + (selectedRapport.parametresCles?.nombreEcolesClasses?.niveauPrescolaire?.prePrimaire?.nombreEcoles || 0) + (selectedRapport.parametresCles?.nombreEcolesClasses?.niveauPrescolaire?.special?.nombreEcoles || 0)} écoles</div>
                    <div><span className="font-medium">Primaire:</span> {selectedRapport.parametresCles?.nombreEcolesClasses?.niveauPrimaire?.enseignementPrimaire?.nombreEcoles || 0} écoles</div>
                    <div><span className="font-medium">Secondaire:</span> {selectedRapport.parametresCles?.nombreEcolesClasses?.niveauSecondaire?.enseignementSecondaire?.nombreEcoles || 0} écoles</div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-3 text-green-800">Résumé des Classes</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Préscolaire:</span> {(selectedRapport.parametresCles?.nombreEcolesClasses?.niveauPrescolaire?.espaceCommunautaireEveil?.nombreClasses || 0) + (selectedRapport.parametresCles?.nombreEcolesClasses?.niveauPrescolaire?.maternel?.nombreClasses || 0) + (selectedRapport.parametresCles?.nombreEcolesClasses?.niveauPrescolaire?.prePrimaire?.nombreClasses || 0) + (selectedRapport.parametresCles?.nombreEcolesClasses?.niveauPrescolaire?.special?.nombreClasses || 0)} classes</div>
                    <div><span className="font-medium">Primaire:</span> {(selectedRapport.parametresCles?.nombreEcolesClasses?.niveauPrimaire?.enseignementSpecial?.totalClassesSpecialesPrim || 0) + (selectedRapport.parametresCles?.nombreEcolesClasses?.niveauPrimaire?.enseignementPrimaire?.totalClassesPrimaire || 0)} classes</div>
                    <div><span className="font-medium">Secondaire:</span> {(selectedRapport.parametresCles?.nombreEcolesClasses?.niveauSecondaire?.enseignementSpecial?.totalClassesSpecialesSec || 0) + (selectedRapport.parametresCles?.nombreEcolesClasses?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.classes7emeCTEB || 0) + (selectedRapport.parametresCles?.nombreEcolesClasses?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.classes8emeCTEB || 0) + (selectedRapport.parametresCles?.nombreEcolesClasses?.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.totalClassesHumanites || 0)} classes</div>
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-3 text-purple-800">Personnel</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Enseignants:</span> {formatPersonnelDisplay(selectedRapport)}</div>
                    <div><span className="font-medium">Administratifs:</span> {Object.values(selectedRapport.personnel?.personnelAdministratif || {}).reduce((total: number, current: any) => {
                      if (typeof current === 'object' && current.hommes !== undefined && current.femmes !== undefined) {
                        return total + (current.hommes || 0) + (current.femmes || 0);
                      }
                      return total + (current || 0);
                    }, 0)} personnes</div>
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
                    <div>Écoles: {selectedRapport.parametresCles?.nombreEcolesClasses?.niveauPrescolaire?.espaceCommunautaireEveil?.nombreEcoles || 0}</div>
                    <div>Classes: {selectedRapport.parametresCles?.nombreEcolesClasses?.niveauPrescolaire?.espaceCommunautaireEveil?.nombreClasses || 0}</div>
                    <div>Garçons: {selectedRapport.parametresCles?.effectifScolaire?.niveauPrescolaire?.espaceCommunautaireEveil?.effectifGarconsFilles || 0}</div>
                    <div>Filles: {selectedRapport.parametresCles?.effectifScolaire?.niveauPrescolaire?.espaceCommunautaireEveil?.effectifFilles || 0}</div>
                    <div>Taux: {selectedRapport.parametresCles?.effectifScolaire?.niveauPrescolaire?.espaceCommunautaireEveil?.tauxAccroissementGarconsFilles || 0}%</div>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <h4 className="font-medium text-indigo-700 mb-2">Maternel</h4>
                    <div>Écoles: {selectedRapport.parametresCles?.nombreEcolesClasses?.niveauPrescolaire?.maternel?.nombreEcoles || 0}</div>
                    <div>Classes: {selectedRapport.parametresCles?.nombreEcolesClasses?.niveauPrescolaire?.maternel?.nombreClasses || 0}</div>
                    <div>Garçons: {selectedRapport.parametresCles?.effectifScolaire?.niveauPrescolaire?.maternel?.effectifGarconsFilles || 0}</div>
                    <div>Filles: {selectedRapport.parametresCles?.effectifScolaire?.niveauPrescolaire?.maternel?.effectifFilles || 0}</div>
                    <div>Taux: {selectedRapport.parametresCles?.effectifScolaire?.niveauPrescolaire?.maternel?.tauxAccroissementGarconsFilles || 0}%</div>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <h4 className="font-medium text-indigo-700 mb-2">Pré-primaire</h4>
                    <div>Écoles: {selectedRapport.parametresCles?.nombreEcolesClasses?.niveauPrescolaire?.prePrimaire?.nombreEcoles || 0}</div>
                    <div>Classes: {selectedRapport.parametresCles?.nombreEcolesClasses?.niveauPrescolaire?.prePrimaire?.nombreClasses || 0}</div>
                    <div>Garçons: {selectedRapport.parametresCles?.effectifScolaire?.niveauPrescolaire?.prePrimaire?.effectifGarconsFilles || 0}</div>
                    <div>Filles: {selectedRapport.parametresCles?.effectifScolaire?.niveauPrescolaire?.prePrimaire?.effectifFilles || 0}</div>
                    <div>Taux: {selectedRapport.parametresCles?.effectifScolaire?.niveauPrescolaire?.prePrimaire?.tauxAccroissementGarconsFilles || 0}%</div>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <h4 className="font-medium text-indigo-700 mb-2">Spécial</h4>
                    <div>Écoles: {selectedRapport.parametresCles?.nombreEcolesClasses?.niveauPrescolaire?.special?.nombreEcoles || 0}</div>
                    <div>Classes: {selectedRapport.parametresCles?.nombreEcolesClasses?.niveauPrescolaire?.special?.nombreClasses || 0}</div>
                    <div>Garçons: {selectedRapport.parametresCles?.effectifScolaire?.niveauPrescolaire?.special?.effectifGarconsFilles || 0}</div>
                    <div>Filles: {selectedRapport.parametresCles?.effectifScolaire?.niveauPrescolaire?.special?.effectifFilles || 0}</div>
                    <div>Taux: {selectedRapport.parametresCles?.effectifScolaire?.niveauPrescolaire?.special?.tauxAccroissementGarconsFilles || 0}%</div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 text-green-800">Détails Niveau Primaire</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-white p-3 rounded">
                    <h4 className="font-medium text-green-700 mb-2">Enseignement Spécial</h4>
                    <div>Classes: {selectedRapport.parametresCles?.nombreEcolesClasses?.niveauPrimaire?.enseignementSpecial?.totalClassesSpecialesPrim || 0}</div>
                    <div>Garçons: {selectedRapport.parametresCles?.effectifScolaire?.niveauPrimaire?.enseignementSpecial?.effectifGarconsFilles || 0}</div>
                    <div>Filles: {selectedRapport.parametresCles?.effectifScolaire?.niveauPrimaire?.enseignementSpecial?.effectifFilles || 0}</div>
                    <div>Taux: {selectedRapport.parametresCles?.effectifScolaire?.niveauPrimaire?.enseignementSpecial?.tauxAccroissementGarconsFilles || 0}%</div>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <h4 className="font-medium text-green-700 mb-2">Enseignement Primaire</h4>
                    <div>Écoles: {selectedRapport.parametresCles?.nombreEcolesClasses?.niveauPrimaire?.enseignementPrimaire?.nombreEcoles || 0}</div>
                    <div>Classes: {selectedRapport.parametresCles?.nombreEcolesClasses?.niveauPrimaire?.enseignementPrimaire?.totalClassesPrimaire || 0}</div>
                    <div>Classes Pléthoriques: {selectedRapport.parametresCles?.nombreEcolesClasses?.niveauPrimaire?.enseignementPrimaire?.classesPlethoriques || 0}</div>
                    <div>Garçons: {selectedRapport.parametresCles?.effectifScolaire?.niveauPrimaire?.enseignementPrimaire?.effectifGarconsFilles || 0}</div>
                    <div>Filles: {selectedRapport.parametresCles?.effectifScolaire?.niveauPrimaire?.enseignementPrimaire?.effectifFilles || 0}</div>
                    <div>Taux: {selectedRapport.parametresCles?.effectifScolaire?.niveauPrimaire?.enseignementPrimaire?.tauxAccroissementGarconsFilles || 0}%</div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 text-blue-800">Détails Niveau Secondaire</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white p-3 rounded">
                    <h4 className="font-medium text-blue-700 mb-2">Enseignement Spécial</h4>
                    <div>Classes: {selectedRapport.parametresCles?.nombreEcolesClasses?.niveauSecondaire?.enseignementSpecial?.totalClassesSpecialesSec || 0}</div>
                    <div>Garçons: {selectedRapport.parametresCles?.effectifScolaire?.niveauSecondaire?.enseignementSpecial?.effectifGarcons || 0}</div>
                    <div>Filles: {selectedRapport.parametresCles?.effectifScolaire?.niveauSecondaire?.enseignementSpecial?.effectifFilles || 0}</div>
                    <div>Taux: {selectedRapport.parametresCles?.effectifScolaire?.niveauSecondaire?.enseignementSpecial?.tauxGarcons || 0}%</div>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <h4 className="font-medium text-blue-700 mb-2">Premier Cycle</h4>
                    <div>Classes 7ème CTEB: {selectedRapport.parametresCles?.nombreEcolesClasses?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.classes7emeCTEB || 0}</div>
                    <div>Classes 8ème CTEB: {selectedRapport.parametresCles?.nombreEcolesClasses?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.classes8emeCTEB || 0}</div>
                    <div>Garçons: {selectedRapport.parametresCles?.effectifScolaire?.niveauSecondaire?.enseignementSecondaire?.septiemeCTEB?.effectifGarcons || 0}</div>
                    <div>Filles: {selectedRapport.parametresCles?.effectifScolaire?.niveauSecondaire?.enseignementSecondaire?.septiemeCTEB?.effectifFilles || 0}</div>
                    <div>Taux: {selectedRapport.parametresCles?.effectifScolaire?.niveauSecondaire?.enseignementSecondaire?.septiemeCTEB?.tauxGarcons || 0}%</div>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <h4 className="font-medium text-blue-700 mb-2">Deuxième Cycle</h4>
                    <div>Classes Humanités: {selectedRapport.parametresCles?.nombreEcolesClasses?.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.totalClassesHumanites || 0}</div>
                    <div>Garçons: {selectedRapport.parametresCles?.effectifScolaire?.niveauSecondaire?.enseignementSecondaire?.premiereHumanite?.effectifGarcons || 0}</div>
                    <div>Filles: {selectedRapport.parametresCles?.effectifScolaire?.niveauSecondaire?.enseignementSecondaire?.premiereHumanite?.effectifFilles || 0}</div>
                    <div>Taux: {selectedRapport.parametresCles?.effectifScolaire?.niveauSecondaire?.enseignementSecondaire?.premiereHumanite?.tauxGarcons || 0}%</div>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 text-purple-800">Détails Personnel</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-white p-3 rounded">
                    <h4 className="font-medium text-purple-700 mb-2">Personnel Enseignant</h4>
                    <div className="space-y-1">
                      <div><span className="font-medium">Préscolaire:</span> {formatPersonnelDisplay(selectedRapport)}</div>
                      <div><span className="font-medium">Primaire:</span> {formatPersonnelDisplay(selectedRapport)}</div>
                      <div><span className="font-medium">Secondaire:</span> {formatPersonnelDisplay(selectedRapport)}</div>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <h4 className="font-medium text-purple-700 mb-2">Personnel Administratif</h4>
                    <div className="space-y-1">
                      <div>Direction Provinciale: {(selectedRapport.personnel?.personnelAdministratif?.directionProvinciale?.hommes || 0) + (selectedRapport.personnel?.personnelAdministratif?.directionProvinciale?.femmes || 0)}</div>
                      <div>Inspection Principale: {(selectedRapport.personnel?.personnelAdministratif?.inspectionPrincipale?.hommes || 0) + (selectedRapport.personnel?.personnelAdministratif?.inspectionPrincipale?.femmes || 0)}</div>
                      <div>Coordination Provinciale: {(selectedRapport.personnel?.personnelAdministratif?.coordinationProvinciale?.hommes || 0) + (selectedRapport.personnel?.personnelAdministratif?.coordinationProvinciale?.femmes || 0)}</div>
                      <div>Sous-division: {(selectedRapport.personnel?.personnelAdministratif?.sousDivision?.hommes || 0) + (selectedRapport.personnel?.personnelAdministratif?.sousDivision?.femmes || 0)}</div>
                      <div>Pools Inspection: {(selectedRapport.personnel?.personnelAdministratif?.poolsInspectionPrimaire?.hommes || 0) + (selectedRapport.personnel?.personnelAdministratif?.poolsInspectionPrimaire?.femmes || 0) + (selectedRapport.personnel?.personnelAdministratif?.poolsInspectionSecondaire?.hommes || 0) + (selectedRapport.personnel?.personnelAdministratif?.poolsInspectionSecondaire?.femmes || 0)}</div>
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
                onClick={() => generateBeautifulPDF(selectedRapport)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2"
              >
                <svg className="fill-current" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 1.5H4C3.44772 1.5 3 1.94772 3 2.5V13.5C3 14.0523 3.44772 14.5 4 14.5H12C12.5523 14.5 13 14.0523 13 13.5V2.5C13 1.94772 12.5523 1.5 12 1.5Z" stroke="currentColor" strokeWidth="1" fill="none"/>
                  <path d="M5 5H11" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                  <path d="M5 7H11" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                  <path d="M5 9H8" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                  <path d="M9 1.5V4C9 4.27614 9.22386 4.5 9.5 4.5H12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Générer PDF Beau
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