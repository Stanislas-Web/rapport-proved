import { RapportActivite } from '../models/RapportActivite';
import { rapportActiviteService } from '../services/rapportActivite/rapportActiviteService';
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

const formatNumber = (num: number | undefined | null): string => {
  if (num === null || num === undefined) return '0';
  return num.toString();
};

// Fonction pour générer le HTML du rapport avec le design officiel
const generateRapportHTML = (rapport: RapportActivite): string => {
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>FICHE DE COLLECTE DES DONNEES SPECIFIQUES</title>
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
            .data-table {
                width: 100%;
                border-collapse: collapse;
                margin: 8px 0;
                font-size: 8px;
            }
            .data-table th, .data-table td {
                border: 1px solid #000;
                padding: 3px;
                text-align: center;
                vertical-align: middle;
            }
            .data-table th {
                background-color: #e6f3ff;
                font-weight: bold;
                font-size: 8px;
            }
            .colspan-4 {
                text-align: center;
                font-weight: bold;
            }
            .total-row {
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
            .page-break {
                page-break-before: always;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="republic">République Démocratique du Congo</div>
            <div class="logo-container">
                <div style="width: 80px; height: 80px; background-color: #f0f0f0; display: flex; align-items: center; justify-content: center; border: 1px solid #ccc; margin: 0 auto;"><span style="font-size: 8px; color: #666;">LOGO</span></div>
            </div>
            <div class="ministry">MINISTERE DE L'EDUCATION NATIONALE ET NOUVELLE CITOYENNETE</div>
            <div class="direction">PROVINCE EDUCATIONNELLE DU ${rapport.identificationProved?.provinceEducationnelle || 'Pas de province educationnelle'}</div>
            <div class="main-title">FICHE DE COLLECTE DES DONNEES SPECIFIQUES</div>
        </div>

        <div class="section">
            <div class="section-title">INFORMATIONS GENERALES</div>
            <table class="info-table">
                <tr>
                    <th style="width: 40%;">Province Administrative</th>
                    <td>${rapport.identificationProved?.provinceAdministrative || 'HAUT-UELE'}</td>
                </tr>
                <tr>
                    <th>Province Educationnelle</th>
                    <td>${rapport.identificationProved?.provinceEducationnelle || 'HAUT-UELE 2'}</td>
                </tr>
                <tr>
                    <th>Nom du PROVED</th>
                    <td>${rapport.identificationProved?.directeurProvincial || 'Alfred DJABIRI ASSANI'}</td>
                </tr>
                <tr>
                    <th>N° de Contact</th>
                    <td>${rapport.identificationProved?.telephone || '+243825189014 ; +243970950893'}</td>
                </tr>
                <tr>
                    <th>Adresse Mail</th>
                    <td>${rapport.identificationProved?.emailProfessionnel || 'kdjabiriassani@gmail.com'}</td>
                </tr>
                <tr>
                    <th>Numéro DINACOPE</th>
                    <td>1151828</td>
                </tr>
                <tr>
                    <th>Ville/Commune/Territoire</th>
                    <td>${rapport.identificationProved?.chefLieuProved || 'Watsa'}</td>
                </tr>
                <tr>
                    <th>Adresse (quartier, Avenue, N°)</th>
                    <td>l'adresse n'est pas renseignée</td>
                </tr>
            </table>
        </div>

        <div class="section">
            <div class="section-title">1. DONNEES SCOLAIRES PAR NIVEAU D'ETUDE PAR SECTEUR D'ENSEIGNEMENT</div>
            <table class="data-table">
                <thead>
                    <tr>
                        <th rowspan="2">Indicateurs</th>
                        <th colspan="4" class="colspan-4">Publique</th>
                        <th colspan="4" class="colspan-4">Privé</th>
                        <th rowspan="2">Total Général</th>
                    </tr>
                    <tr>
                        <th>Préscolaire</th>
                        <th>Primaire</th>
                        <th>Secondaire</th>
                        <th>Total</th>
                        <th>Préscolaire</th>
                        <th>Primaire</th>
                        <th>Secondaire</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Nombre d'écoles</strong></td>
                        <td>${formatNumber(rapport.parametresCles?.niveauPrescolaire?.espaceCommunautaireEveil?.nombreEcoles || 0)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.nombreEcoles || 0)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.classes7emeCTEB || 0)}</td>
                        <td class="total-row">${(rapport.parametresCles?.niveauPrescolaire?.espaceCommunautaireEveil?.nombreEcoles || 0) + (rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.nombreEcoles || 0) + (rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.classes7emeCTEB || 0)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauPrescolaire?.maternel?.nombreEcoles || 0)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.nombreEcoles || 0)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.classesHumanites || 0)}</td>
                        <td class="total-row">${(rapport.parametresCles?.niveauPrescolaire?.maternel?.nombreEcoles || 0) + (rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.nombreEcoles || 0) + (rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.classesHumanites || 0)}</td>
                        <td class="total-row"><strong>${(rapport.parametresCles?.niveauPrescolaire?.espaceCommunautaireEveil?.nombreEcoles || 0) + (rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.nombreEcoles || 0) + (rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.classes7emeCTEB || 0) + (rapport.parametresCles?.niveauPrescolaire?.maternel?.nombreEcoles || 0) + (rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.nombreEcoles || 0) + (rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.classesHumanites || 0)}</strong></td>
                    </tr>
                    <tr>
                        <td><strong>Nombre d'élèves</strong></td>
                        <td>${formatNumber((rapport.parametresCles?.niveauPrescolaire?.espaceCommunautaireEveil?.effectifGarcons || 0) + (rapport.parametresCles?.niveauPrescolaire?.espaceCommunautaireEveil?.effectifFilles || 0))}</td>
                        <td>${formatNumber((rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifGarcons || 0) + (rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifFilles || 0))}</td>
                        <td>${formatNumber((rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.effectifGarcons || 0) + (rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.effectifFilles || 0))}</td>
                        <td class="total-row">${((rapport.parametresCles?.niveauPrescolaire?.espaceCommunautaireEveil?.effectifGarcons || 0) + (rapport.parametresCles?.niveauPrescolaire?.espaceCommunautaireEveil?.effectifFilles || 0)) + ((rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifGarcons || 0) + (rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifFilles || 0)) + ((rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.effectifGarcons || 0) + (rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.effectifFilles || 0))}</td>
                        <td>${formatNumber((rapport.parametresCles?.niveauPrescolaire?.maternel?.effectifGarcons || 0) + (rapport.parametresCles?.niveauPrescolaire?.maternel?.effectifFilles || 0))}</td>
                        <td>${formatNumber((rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifGarcons || 0) + (rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifFilles || 0))}</td>
                        <td>${formatNumber((rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.effectifGarcons || 0) + (rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.effectifFilles || 0))}</td>
                        <td class="total-row">${((rapport.parametresCles?.niveauPrescolaire?.maternel?.effectifGarcons || 0) + (rapport.parametresCles?.niveauPrescolaire?.maternel?.effectifFilles || 0)) + ((rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifGarcons || 0) + (rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifFilles || 0)) + ((rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.effectifGarcons || 0) + (rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.effectifFilles || 0))}</td>
                        <td class="total-row"><strong>${((rapport.parametresCles?.niveauPrescolaire?.espaceCommunautaireEveil?.effectifGarcons || 0) + (rapport.parametresCles?.niveauPrescolaire?.espaceCommunautaireEveil?.effectifFilles || 0)) + ((rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifGarcons || 0) + (rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifFilles || 0)) + ((rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.effectifGarcons || 0) + (rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.effectifFilles || 0)) + ((rapport.parametresCles?.niveauPrescolaire?.maternel?.effectifGarcons || 0) + (rapport.parametresCles?.niveauPrescolaire?.maternel?.effectifFilles || 0)) + ((rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifGarcons || 0) + (rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifFilles || 0)) + ((rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.effectifGarcons || 0) + (rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.effectifFilles || 0))}</strong></td>
                    </tr>
                    <tr>
                        <td><strong>Nombre de filles</strong></td>
                        <td>${formatNumber(rapport.parametresCles?.niveauPrescolaire?.espaceCommunautaireEveil?.effectifFilles || 0)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifFilles || 0)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.effectifFilles || 0)}</td>
                        <td class="total-row">${(rapport.parametresCles?.niveauPrescolaire?.espaceCommunautaireEveil?.effectifFilles || 0) + (rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifFilles || 0) + (rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.effectifFilles || 0)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauPrescolaire?.maternel?.effectifFilles || 0)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifFilles || 0)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.effectifFilles || 0)}</td>
                        <td class="total-row">${(rapport.parametresCles?.niveauPrescolaire?.maternel?.effectifFilles || 0) + (rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifFilles || 0) + (rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.effectifFilles || 0)}</td>
                        <td class="total-row"><strong>${(rapport.parametresCles?.niveauPrescolaire?.espaceCommunautaireEveil?.effectifFilles || 0) + (rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifFilles || 0) + (rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.effectifFilles || 0) + (rapport.parametresCles?.niveauPrescolaire?.maternel?.effectifFilles || 0) + (rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifFilles || 0) + (rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.effectifFilles || 0)}</strong></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="section">
            <div class="section-title">2. NOMBRE D'ECOLES ET D'ELEVES DES FILIERES TECHNIQUES PAR SECTEUR D'ENSEIGNEMENT 2023-2024</div>
            <table class="data-table">
                <thead>
                    <tr>
                        <th rowspan="2">N°</th>
                        <th rowspan="2">Filières</th>
                        <th colspan="3" class="colspan-4">Public</th>
                        <th colspan="3" class="colspan-4">Privé</th>
                    </tr>
                    <tr>
                        <th>Nombre écoles</th>
                        <th>GF</th>
                        <th>F</th>
                        <th>Nombre écoles</th>
                        <th>GF</th>
                        <th>F</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>01</td>
                        <td>Agriculture</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.classes7emeCTEB || 0)}</td>
                        <td>${formatNumber((rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.effectifGarcons || 0) + (rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.effectifFilles || 0))}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.effectifFilles || 0)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.classesHumanites || 0)}</td>
                        <td>${formatNumber((rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.effectifGarcons || 0) + (rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.effectifFilles || 0))}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.effectifFilles || 0)}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        ${rapport.introduction ? `
        <div class="section">
            <div class="section-title">3. INTRODUCTION</div>
            <div style="text-align: justify; margin: 10px 0; font-size: 10px;">${rapport.introduction}</div>
        </div>
        ` : ''}

        <div class="section">
            <div class="section-title">4. PERSONNEL ENSEIGNANT</div>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Niveau</th>
                        <th>Hommes</th>
                        <th>Femmes</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Préscolaire</td>
                        <td>${formatNumber(rapport.personnel?.personnelEnseignant?.prescolaire?.hommes || 0)}</td>
                        <td>${formatNumber(rapport.personnel?.personnelEnseignant?.prescolaire?.femmes || 0)}</td>
                        <td class="total-row">${(rapport.personnel?.personnelEnseignant?.prescolaire?.hommes || 0) + (rapport.personnel?.personnelEnseignant?.prescolaire?.femmes || 0)}</td>
                    </tr>
                    <tr>
                        <td>Primaire</td>
                        <td>${formatNumber(rapport.personnel?.personnelEnseignant?.primaire?.hommes || 0)}</td>
                        <td>${formatNumber(rapport.personnel?.personnelEnseignant?.primaire?.femmes || 0)}</td>
                        <td class="total-row">${(rapport.personnel?.personnelEnseignant?.primaire?.hommes || 0) + (rapport.personnel?.personnelEnseignant?.primaire?.femmes || 0)}</td>
                    </tr>
                    <tr>
                        <td>Secondaire</td>
                        <td>${formatNumber(rapport.personnel?.personnelEnseignant?.secondaire?.hommes || 0)}</td>
                        <td>${formatNumber(rapport.personnel?.personnelEnseignant?.secondaire?.femmes || 0)}</td>
                        <td class="total-row">${(rapport.personnel?.personnelEnseignant?.secondaire?.hommes || 0) + (rapport.personnel?.personnelEnseignant?.secondaire?.femmes || 0)}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="section">
            <div class="section-title">5. PERSONNEL ADMINISTRATIF</div>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Service</th>
                        <th>Effectif</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>Direction Provinciale</td><td>${formatNumber(rapport.personnel?.personnelAdministratif?.directionProvinciale || 0)}</td></tr>
                    <tr><td>Inspection Principale</td><td>${formatNumber(rapport.personnel?.personnelAdministratif?.inspectionPrincipale || 0)}</td></tr>
                    <tr><td>DINACOPE</td><td>${formatNumber(rapport.personnel?.personnelAdministratif?.dinacope || 0)}</td></tr>
                    <tr><td>SERNIE</td><td>${formatNumber(rapport.personnel?.personnelAdministratif?.sernie || 0)}</td></tr>
                    <tr><td>Coordination Provinciale</td><td>${formatNumber(rapport.personnel?.personnelAdministratif?.coordinationProvinciale || 0)}</td></tr>
                    <tr><td>Sous-division</td><td>${formatNumber(rapport.personnel?.personnelAdministratif?.sousDivision || 0)}</td></tr>
                    <tr><td>Pools Inspection Primaire</td><td>${formatNumber(rapport.personnel?.personnelAdministratif?.poolsInspectionPrimaire || 0)}</td></tr>
                    <tr><td>Pools Inspection Secondaire</td><td>${formatNumber(rapport.personnel?.personnelAdministratif?.poolsInspectionSecondaire || 0)}</td></tr>
                    <tr><td>Antenne DINACOPE</td><td>${formatNumber(rapport.personnel?.personnelAdministratif?.antenneDinacope || 0)}</td></tr>
                    <tr><td>Antenne SERNIE</td><td>${formatNumber(rapport.personnel?.personnelAdministratif?.antenneSernie || 0)}</td></tr>
                    <tr><td>Coordination Diocésaine</td><td>${formatNumber(rapport.personnel?.personnelAdministratif?.coordinationDiocesaine || 0)}</td></tr>
                    <tr><td>Sous-coordination Conventionnées</td><td>${formatNumber(rapport.personnel?.personnelAdministratif?.sousCoordinationConventionnees || 0)}</td></tr>
                    <tr><td>Conseillerie Résidente</td><td>${formatNumber(rapport.personnel?.personnelAdministratif?.conseillerieResidente || 0)}</td></tr>
                </tbody>
            </table>
        </div>

        <div class="section">
            <div class="section-title">6. RÉALISATIONS - ACCÈS, ACCESSIBILITÉ ET ÉQUITÉ</div>
            ${rapport.realisations?.accesAccessibiliteEquite ? `
            <div style="margin: 10px 0;">
                ${rapport.realisations.accesAccessibiliteEquite.nouvellesSallesClasses ? `
                <div style="margin: 8px 0;">
                    <h4 style="font-size: 10px; margin: 3px 0;">Nouvelles Salles de Classes</h4>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Niveau</th>
                                <th>Nombre</th>
                                <th>Source de Financement</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Préscolaire</td>
                                <td>${formatNumber(rapport.realisations.accesAccessibiliteEquite.nouvellesSallesClasses.prescolaire || 0)}</td>
                                <td>${rapport.realisations.accesAccessibiliteEquite.nouvellesSallesClasses.sourceFinancement || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td>Primaire</td>
                                <td>${formatNumber(rapport.realisations.accesAccessibiliteEquite.nouvellesSallesClasses.primaire || 0)}</td>
                                <td>${rapport.realisations.accesAccessibiliteEquite.nouvellesSallesClasses.sourceFinancement || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td>Secondaire</td>
                                <td>${formatNumber(rapport.realisations.accesAccessibiliteEquite.nouvellesSallesClasses.secondaire || 0)}</td>
                                <td>${rapport.realisations.accesAccessibiliteEquite.nouvellesSallesClasses.sourceFinancement || 'N/A'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                ` : ''}

                ${rapport.realisations.accesAccessibiliteEquite.nouveauxBancsTables ? `
                <div style="margin: 8px 0;">
                    <h4 style="font-size: 10px; margin: 3px 0;">Nouveaux Bancs et Tables</h4>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Niveau</th>
                                <th>Nombre</th>
                                <th>Source de Financement</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Préscolaire</td>
                                <td>${formatNumber(rapport.realisations.accesAccessibiliteEquite.nouveauxBancsTables.prescolaire || 0)}</td>
                                <td>${rapport.realisations.accesAccessibiliteEquite.nouveauxBancsTables.sourceFinancement || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td>Primaire</td>
                                <td>${formatNumber(rapport.realisations.accesAccessibiliteEquite.nouveauxBancsTables.primaire || 0)}</td>
                                <td>${rapport.realisations.accesAccessibiliteEquite.nouveauxBancsTables.sourceFinancement || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td>Secondaire</td>
                                <td>${formatNumber(rapport.realisations.accesAccessibiliteEquite.nouveauxBancsTables.secondaire || 0)}</td>
                                <td>${rapport.realisations.accesAccessibiliteEquite.nouveauxBancsTables.sourceFinancement || 'N/A'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                ` : ''}

                ${rapport.realisations.accesAccessibiliteEquite.nouvellesLatrines ? `
                <div style="margin: 8px 0;">
                    <h4 style="font-size: 10px; margin: 3px 0;">Nouvelles Latrines</h4>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Niveau</th>
                                <th>Nombre</th>
                                <th>Source de Financement</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Préscolaire</td>
                                <td>${formatNumber(rapport.realisations.accesAccessibiliteEquite.nouvellesLatrines.prescolaire || 0)}</td>
                                <td>${rapport.realisations.accesAccessibiliteEquite.nouvellesLatrines.sourceFinancement || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td>Primaire</td>
                                <td>${formatNumber(rapport.realisations.accesAccessibiliteEquite.nouvellesLatrines.primaire || 0)}</td>
                                <td>${rapport.realisations.accesAccessibiliteEquite.nouvellesLatrines.sourceFinancement || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td>Secondaire</td>
                                <td>${formatNumber(rapport.realisations.accesAccessibiliteEquite.nouvellesLatrines.secondaire || 0)}</td>
                                <td>${rapport.realisations.accesAccessibiliteEquite.nouvellesLatrines.sourceFinancement || 'N/A'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                ` : ''}

                ${rapport.realisations.accesAccessibiliteEquite.gratuitéEnseignementPrimaire ? `
                <div style="margin: 8px 0;">
                    <h4 style="font-size: 10px; margin: 3px 0;">Gratuité Enseignement Primaire</h4>
                    <p style="font-size: 9px; margin: 3px 0;">${rapport.realisations.accesAccessibiliteEquite.gratuitéEnseignementPrimaire}</p>
                </div>
                ` : ''}

                ${rapport.realisations.accesAccessibiliteEquite.sensibilisation ? `
                <div style="margin: 8px 0;">
                    <h4 style="font-size: 10px; margin: 3px 0;">Sensibilisation</h4>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Réalisé</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Filles</td>
                                <td>${rapport.realisations.accesAccessibiliteEquite.sensibilisation.filles ? 'Oui' : 'Non'}</td>
                            </tr>
                            <tr>
                                <td>Enfants Hors École</td>
                                <td>${rapport.realisations.accesAccessibiliteEquite.sensibilisation.enfantsHorsEcole ? 'Oui' : 'Non'}</td>
                            </tr>
                            <tr>
                                <td>Peuples Autochtones</td>
                                <td>${rapport.realisations.accesAccessibiliteEquite.sensibilisation.peuplesAutochtones ? 'Oui' : 'Non'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                ` : ''}

                ${rapport.realisations.accesAccessibiliteEquite.cantinesScolaires ? `
                <div style="margin: 8px 0;">
                    <h4 style="font-size: 10px; margin: 3px 0;">Cantines Scolaires</h4>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Niveau</th>
                                <th>Nombre</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Préscolaire</td>
                                <td>${formatNumber(rapport.realisations.accesAccessibiliteEquite.cantinesScolaires.prescolaire || 0)}</td>
                            </tr>
                            <tr>
                                <td>Primaire</td>
                                <td>${formatNumber(rapport.realisations.accesAccessibiliteEquite.cantinesScolaires.primaire || 0)}</td>
                            </tr>
                            <tr>
                                <td>Secondaire</td>
                                <td>${formatNumber(rapport.realisations.accesAccessibiliteEquite.cantinesScolaires.secondaire || 0)}</td>
                            </tr>
                        </tbody>
                    </table>
                    ${rapport.realisations.accesAccessibiliteEquite.cantinesScolaires.commentaire ? `
                    <p style="font-size: 9px; margin: 3px 0;"><strong>Commentaire:</strong> ${rapport.realisations.accesAccessibiliteEquite.cantinesScolaires.commentaire}</p>
                    ` : ''}
                </div>
                ` : ''}

                ${rapport.realisations.accesAccessibiliteEquite.indicateursAcces ? `
                <div style="margin: 8px 0;">
                    <h4 style="font-size: 10px; margin: 3px 0;">Indicateurs d'Accès</h4>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Indicateur</th>
                                <th>Valeur (%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Proportion Nouveaux Inscrits</td>
                                <td>${formatNumber(rapport.realisations.accesAccessibiliteEquite.indicateursAcces.proportionNouveauxInscrits || 0)}</td>
                            </tr>
                            <tr>
                                <td>Taux Transition Primaire-CTEB</td>
                                <td>${formatNumber(rapport.realisations.accesAccessibiliteEquite.indicateursAcces.tauxTransitionPrimaireCTEB || 0)}</td>
                            </tr>
                            <tr>
                                <td>Taux Transition CTEB-Humanités</td>
                                <td>${formatNumber(rapport.realisations.accesAccessibiliteEquite.indicateursAcces.tauxTransitionCTEBHumanites || 0)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                ` : ''}
            </div>
            ` : ''}
        </div>

        ${rapport.conclusion ? `
        <div class="section">
            <div class="section-title">7. CONCLUSION</div>
            <div style="text-align: justify; margin: 10px 0; font-size: 10px;">${rapport.conclusion}</div>
        </div>
        ` : ''}

        <div class="section">
            <div class="section-title">8. INFORMATIONS GÉNÉRALES</div>
            <table class="info-table">
                <tr>
                    <th style="width: 40%;">Année du rapport</th>
                    <td>${rapport.annee || 'N/A'}</td>
                </tr>
                <tr>
                    <th>Statut</th>
                    <td>${rapport.statut || 'N/A'}</td>
                </tr>
                <tr>
                    <th>Date de création</th>
                    <td>${formatDate(rapport.createdAt)}</td>
                </tr>
                <tr>
                    <th>Dernière modification</th>
                    <td>${formatDate(rapport.updatedAt)}</td>
                </tr>
                ${rapport.fichierJoint ? `
                <tr>
                    <th>Fichier joint</th>
                    <td>${rapport.fichierJoint}</td>
                </tr>
                ` : ''}
            </table>
        </div>

        <div style="margin-top: 30px; display: flex; justify-content: space-between;">
            <div style="text-align: center; width: 200px;">
                <div style="border-top: 1px solid #000; margin-top: 40px; padding-top: 5px;">
                    <p style="font-size: 9px; margin: 2px 0;"><strong>Signature du Directeur Provincial</strong></p>
                    <p style="font-size: 9px; margin: 2px 0;">${rapport.identificationProved?.directeurProvincial || 'N/A'}</p>
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
        <div class="page-break"></div>
        <div class="page-number">2</div>
    </body>
    </html>
  `;
};

// Fonction pour générer et télécharger le PDF via l'endpoint backend
export const generateAndDownloadPDF = async (rapport: RapportActivite) => {
  try {
    toast.loading('Génération du PDF en cours...');
    
    // Utiliser le service backend pour générer le PDF
    const pdfBlob = await rapportActiviteService.generatePDF(rapport._id!);
    
    // Créer un lien de téléchargement
    const url = window.URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rapport-activite-${rapport.annee}-${rapport.identificationProved?.provinceAdministrative || 'province'}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    toast.success('PDF généré et téléchargé avec succès');
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    toast.error('Erreur lors de la génération du PDF');
    throw error;
  }
};

// Fonction pour générer et afficher le PDF côté frontend (alternative avec le même design)
export const generateAndShowPDFFrontend = async (rapport: RapportActivite) => {
  try {
    toast.loading('Génération du PDF côté frontend...');
    
    // Générer le HTML avec le même design
    const htmlContent = generateRapportHTML(rapport);
    
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
    
    toast.success('PDF généré côté frontend');
  } catch (error) {
    console.error('Erreur lors de la génération du PDF côté frontend:', error);
    toast.error('Erreur lors de la génération du PDF côté frontend');
    throw error;
  }
};

// Fonction pour générer et afficher le PDF côté frontend (alternative)
export const generateAndShowPDF = async (rapport: RapportActivite) => {
  try {
    // Générer le HTML
    const htmlContent = generateRapportHTML(rapport);
    
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
