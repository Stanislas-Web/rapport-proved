import { FicheAutoEvaluation } from '../models/FicheAutoEvaluation';
import toast from 'react-hot-toast';

// Fonctions utilitaires
const formatDate = (date: Date | string | undefined): string => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Fonction pour convertir les scores en texte
const formatScore = (score: string | undefined): string => {
  if (!score) return 'Non évalué';
  return score;
};

// Fonction pour générer le HTML de la fiche avec le design officiel
const generateFicheHTML = (fiche: FicheAutoEvaluation): string => {
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>FICHE D'AUTO-ÉVALUATION</title>
        <style>
            @page {
                size: A4;
                margin: 20mm;
            }
            body {
                font-family: 'Times New Roman', serif;
                font-size: 10px;
                line-height: 1.2;
                margin: 0;
                padding: 0;
                color: #000;
                background: white;
            }
            .header {
                text-align: center;
                margin-bottom: 20px;
                padding-bottom: 10px;
            }
            .republic {
                font-size: 14px;
                font-weight: bold;
                margin: 0;
                text-transform: uppercase;
            }
                    .logo-container {
            text-align: center;
            margin: 10px 0;
        }
        .header-logo {
            width: 80px;
            height: 80px;
            object-fit: contain;
            margin: 0 auto;
            display: block;
        }
            .ministry {
                font-size: 12px;
                font-weight: bold;
                margin: 5px 0;
                text-transform: uppercase;
            }
            .direction {
                font-size: 12px;
                font-weight: bold;
                margin: 5px 0;
                text-transform: uppercase;
            }
            .main-title {
                font-size: 14px;
                font-weight: bold;
                margin: 15px 0;
                text-transform: uppercase;
                text-align: center;
            }
            .section {
                margin-bottom: 15px;
            }
            .section-title {
                font-size: 11px;
                font-weight: bold;
                margin-bottom: 8px;
                text-align: left;
                background-color: #e6f3ff;
                padding: 5px;
                border-left: 3px solid #0066cc;
            }
            .info-table {
                width: 100%;
                border-collapse: collapse;
                margin: 8px 0;
                font-size: 9px;
            }
            .info-table th, .info-table td {
                border: 1px solid #000;
                padding: 4px;
                text-align: left;
                vertical-align: top;
            }
            .info-table th {
                background-color: #f0f0f0;
                font-weight: bold;
                font-size: 9px;
            }
            .evaluation-table {
                width: 100%;
                border-collapse: collapse;
                margin: 8px 0;
                font-size: 9px;
            }
            .evaluation-table th, .evaluation-table td {
                border: 1px solid #000;
                padding: 4px;
                text-align: center;
                vertical-align: middle;
            }
            .evaluation-table th {
                background-color: #e6f3ff;
                font-weight: bold;
                font-size: 9px;
            }
            .score-cell {
                background-color: #f9f9f9;
                font-weight: bold;
            }
            .page-number {
                position: fixed;
                bottom: 10mm;
                right: 10mm;
                font-size: 8px;
                color: #666;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="republic">République Démocratique du Congo</div>
            <div class="logo-container">
                <img src="/image.png" alt="Logo Ministère" class="header-logo">
            </div>
            <div class="ministry">MINISTERE DE L'EDUCATION NATIONALE ET NOUVELLE CITOYENNETE</div>
            <div class="direction">PROVINCE EDUCATIONNELLE DU ${fiche.identificationProved?.provinceAdministrative || 'Non spécifiée'}</div>
            <div class="main-title">FICHE D'AUTO-ÉVALUATION</div>
        </div>

        <div class="section">
            <div class="section-title">INFORMATIONS GÉNÉRALES</div>
            <table class="info-table">
                <tr>
                    <th style="width: 40%;">Province Administrative</th>
                    <td>${fiche.identificationProved?.provinceAdministrative || 'Non spécifiée'}</td>
                </tr>
                <tr>
                    <th>Directeur Provincial</th>
                    <td>${fiche.identificationProved?.directeurProvincial || 'Non spécifié'}</td>
                </tr>
                <tr>
                    <th>Intitulé de la Formation</th>
                    <td>${fiche.intituleFormation || 'Non spécifié'}</td>
                </tr>
                <tr>
                    <th>Date de création</th>
                    <td>${formatDate(fiche.createdAt)}</td>
                </tr>
                <tr>
                    <th>Statut</th>
                    <td>${fiche.statut || 'Non spécifié'}</td>
                </tr>
            </table>
        </div>

        <div class="section">
            <div class="section-title">1. CONTENU ET COMPRÉHENSION</div>
            <table class="evaluation-table">
                <thead>
                    <tr>
                        <th>Critère d'évaluation</th>
                        <th>Niveau de satisfaction</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Le contenu était-il clair et compréhensible ?</strong></td>
                        <td class="score-cell">${formatScore(fiche.contenuComprehension?.contenuClair)}</td>
                    </tr>
                    <tr>
                        <td><strong>Avez-vous acquis de nouvelles connaissances ?</strong></td>
                        <td class="score-cell">${formatScore(fiche.contenuComprehension?.nouvellesConnaissances)}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="section">
            <div class="section-title">2. PARTICIPATION ET IMPLICATION</div>
            <table class="evaluation-table">
                <thead>
                    <tr>
                        <th>Critère d'évaluation</th>
                        <th>Niveau de satisfaction</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Votre participation était-elle active ?</strong></td>
                        <td class="score-cell">${formatScore(fiche.participationImplication?.participationActive)}</td>
                    </tr>
                    <tr>
                        <td><strong>Le rythme était-il adapté à votre niveau ?</strong></td>
                        <td class="score-cell">${formatScore(fiche.participationImplication?.rythmeAdapte)}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="section">
            <div class="section-title">3. PERTINENCE ET UTILITÉ</div>
            <table class="evaluation-table">
                <thead>
                    <tr>
                        <th>Critère d'évaluation</th>
                        <th>Niveau de satisfaction</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Les thèmes abordés sont-ils utiles pour votre travail ?</strong></td>
                        <td class="score-cell">${formatScore(fiche.pertinenceUtilite?.themesUtiles)}</td>
                    </tr>
                    <tr>
                        <td><strong>Pensez-vous pouvoir appliquer ces connaissances ?</strong></td>
                        <td class="score-cell">${formatScore(fiche.pertinenceUtilite?.capaciteApplication)}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="section">
            <div class="section-title">4. SUGGESTIONS ET COMMENTAIRES</div>
            <table class="info-table">
                <tr>
                    <th style="width: 30%;">Ce que vous avez apprécié</th>
                    <td>${fiche.suggestionsCommentaires?.ceQuiApprecie || 'Aucun commentaire'}</td>
                </tr>
                <tr>
                    <th>Suggestions d'amélioration</th>
                    <td>${fiche.suggestionsCommentaires?.ameliorations || 'Aucune suggestion'}</td>
                </tr>
                <tr>
                    <th>Autres commentaires</th>
                    <td>${fiche.suggestionsCommentaires?.autresCommentaires || 'Aucun commentaire'}</td>
                </tr>
            </table>
        </div>

        ${fiche.scoreGlobal ? `
        <div class="section">
            <div class="section-title">5. SCORE GLOBAL</div>
            <table class="evaluation-table">
                <thead>
                    <tr>
                        <th>Évaluation globale</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Score global de la formation</strong></td>
                        <td class="score-cell">${fiche.scoreGlobal}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        ` : ''}

        <div style="margin-top: 30px; display: flex; justify-content: space-between;">
            <div style="text-align: center; width: 200px;">
                <div style="border-top: 1px solid #000; margin-top: 40px; padding-top: 5px;">
                    <p style="font-size: 9px; margin: 2px 0;"><strong>Signature du Participant</strong></p>
                    <p style="font-size: 9px; margin: 2px 0;">${fiche.identificationProved?.directeurProvincial || 'N/A'}</p>
                </div>
            </div>
            <div style="text-align: center; width: 200px;">
                <div style="border-top: 1px solid #000; margin-top: 40px; padding-top: 5px;">
                    <p style="font-size: 9px; margin: 2px 0;"><strong>Cachet et Signature</strong></p>
                    <p style="font-size: 9px; margin: 2px 0;">Date: ${formatDate(new Date())}</p>
                </div>
            </div>
        </div>

        <div class="page-number">1</div>
    </body>
    </html>
  `;
};

// Fonction pour générer et afficher le PDF côté frontend
export const generateAndShowFichePDF = async (fiche: FicheAutoEvaluation) => {
  try {
    // Générer le HTML avec le même design
    const htmlContent = generateFicheHTML(fiche);
    
    // Créer une nouvelle fenêtre pour l'impression
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('Impossible d\'ouvrir une nouvelle fenêtre');
    }
    
    // Écrire le contenu HTML
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Attendre que le contenu soit chargé
    printWindow.onload = () => {
      // Imprimer en PDF
      printWindow.print();
      
      // Fermer la fenêtre après un délai
      setTimeout(() => {
        printWindow.close();
      }, 1000);
    };
    
    toast.success('PDF de la fiche d\'auto-évaluation généré');
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    toast.error('Erreur lors de la génération du PDF');
    throw error;
  }
};

// Fonction pour générer et afficher le PDF (alternative)
export const generateAndShowFichePDFAlt = async (fiche: FicheAutoEvaluation) => {
  try {
    // Générer le HTML
    const htmlContent = generateFicheHTML(fiche);
    
    // Créer une nouvelle fenêtre pour l'impression
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('Impossible d\'ouvrir une nouvelle fenêtre');
    }
    
    // Écrire le contenu HTML
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Attendre que le contenu soit chargé
    printWindow.onload = () => {
      // Imprimer en PDF
      printWindow.print();
      
      // Fermer la fenêtre après un délai
      setTimeout(() => {
        printWindow.close();
      }, 1000);
    };
    
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    throw error;
  }
};
