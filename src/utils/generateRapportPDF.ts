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
                        <td>${formatNumber(rapport.parametresCles?.niveauPrescolaire?.espaceCommunautaireEveil?.effectifGarconsFilles || 0)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifGarconsFilles || 0)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.septiemeCTEB?.effectifGarcons + rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.huitiemeCTEB?.effectifGarcons || 0)}</td>
                        <td class="total-row">${(rapport.parametresCles?.niveauPrescolaire?.espaceCommunautaireEveil?.effectifGarconsFilles || 0) + (rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifGarconsFilles || 0) + (rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.septiemeCTEB?.effectifGarcons + rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.huitiemeCTEB?.effectifGarcons || 0)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauPrescolaire?.maternel?.effectifGarconsFilles || 0)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifGarconsFilles || 0)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premiereHumanite?.effectifGarcons + rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.quatriemeHumanite?.effectifGarcons || 0)}</td>
                        <td class="total-row">${(rapport.parametresCles?.niveauPrescolaire?.maternel?.effectifGarconsFilles || 0) + (rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifGarconsFilles || 0) + (rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premiereHumanite?.effectifGarcons + rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.quatriemeHumanite?.effectifGarcons || 0)}</td>
                        <td class="total-row"><strong>${(rapport.parametresCles?.niveauPrescolaire?.espaceCommunautaireEveil?.effectifGarconsFilles || 0) + (rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifGarconsFilles || 0) + (rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.septiemeCTEB?.effectifGarcons + rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.huitiemeCTEB?.effectifGarcons || 0) + (rapport.parametresCles?.niveauPrescolaire?.maternel?.effectifGarconsFilles || 0) + (rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifGarconsFilles || 0) + (rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premiereHumanite?.effectifGarcons + rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.quatriemeHumanite?.effectifGarcons || 0)}</strong></td>
                    </tr>
                    <tr>
                        <td><strong>Nombre de filles</strong></td>
                        <td>${formatNumber(rapport.parametresCles?.niveauPrescolaire?.espaceCommunautaireEveil?.effectifFilles || 0)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifFilles || 0)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.septiemeCTEB?.effectifFilles + rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.huitiemeCTEB?.effectifFilles || 0)}</td>
                        <td class="total-row">${(rapport.parametresCles?.niveauPrescolaire?.espaceCommunautaireEveil?.effectifFilles || 0) + (rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifFilles || 0) + (rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.septiemeCTEB?.effectifFilles + rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.huitiemeCTEB?.effectifFilles || 0)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauPrescolaire?.maternel?.effectifFilles || 0)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifFilles || 0)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premiereHumanite?.effectifFilles + rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.quatriemeHumanite?.effectifFilles || 0)}</td>
                        <td class="total-row">${(rapport.parametresCles?.niveauPrescolaire?.maternel?.effectifFilles || 0) + (rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifFilles || 0) + (rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premiereHumanite?.effectifFilles + rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.quatriemeHumanite?.effectifFilles || 0)}</td>
                        <td class="total-row"><strong>${(rapport.parametresCles?.niveauPrescolaire?.espaceCommunautaireEveil?.effectifFilles || 0) + (rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifFilles || 0) + (rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.septiemeCTEB?.effectifFilles + rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.huitiemeCTEB?.effectifFilles || 0) + (rapport.parametresCles?.niveauPrescolaire?.maternel?.effectifFilles || 0) + (rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifFilles || 0) + (rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premiereHumanite?.effectifFilles + rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.quatriemeHumanite?.effectifFilles || 0)}</strong></td>
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
                        <td>${formatNumber(rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.septiemeCTEB?.effectifGarcons + rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.septiemeCTEB?.effectifFilles || 0)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.septiemeCTEB?.effectifFilles || 0)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.totalClassesHumanites || 0)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premiereHumanite?.effectifGarcons + rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premiereHumanite?.effectifFilles || 0)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premiereHumanite?.effectifFilles || 0)}</td>
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
                    <tr><td>Direction Provinciale</td><td>${formatNumber((rapport.personnel?.personnelAdministratif?.directionProvinciale?.hommes || 0) + (rapport.personnel?.personnelAdministratif?.directionProvinciale?.femmes || 0))}</td></tr>
                    <tr><td>Inspection Principale</td><td>${formatNumber((rapport.personnel?.personnelAdministratif?.inspectionPrincipale?.hommes || 0) + (rapport.personnel?.personnelAdministratif?.inspectionPrincipale?.femmes || 0))}</td></tr>
                    <tr><td>DINACOPE</td><td>${formatNumber((rapport.personnel?.personnelAdministratif?.dinacope?.hommes || 0) + (rapport.personnel?.personnelAdministratif?.dinacope?.femmes || 0))}</td></tr>
                    <tr><td>SERNIE</td><td>${formatNumber((rapport.personnel?.personnelAdministratif?.sernie?.hommes || 0) + (rapport.personnel?.personnelAdministratif?.sernie?.femmes || 0))}</td></tr>
                    <tr><td>Coordination Provinciale</td><td>${formatNumber((rapport.personnel?.personnelAdministratif?.coordinationProvinciale?.hommes || 0) + (rapport.personnel?.personnelAdministratif?.coordinationProvinciale?.femmes || 0))}</td></tr>
                    <tr><td>Sous-division</td><td>${formatNumber((rapport.personnel?.personnelAdministratif?.sousDivision?.hommes || 0) + (rapport.personnel?.personnelAdministratif?.sousDivision?.femmes || 0))}</td></tr>
                    <tr><td>Pools Inspection Primaire</td><td>${formatNumber((rapport.personnel?.personnelAdministratif?.poolsInspectionPrimaire?.hommes || 0) + (rapport.personnel?.personnelAdministratif?.poolsInspectionPrimaire?.femmes || 0))}</td></tr>
                    <tr><td>Pools Inspection Secondaire</td><td>${formatNumber((rapport.personnel?.personnelAdministratif?.poolsInspectionSecondaire?.hommes || 0) + (rapport.personnel?.personnelAdministratif?.poolsInspectionSecondaire?.femmes || 0))}</td></tr>
                    <tr><td>Antenne DINACOPE</td><td>${formatNumber((rapport.personnel?.personnelAdministratif?.antenneDinacope?.hommes || 0) + (rapport.personnel?.personnelAdministratif?.antenneDinacope?.femmes || 0))}</td></tr>
                    <tr><td>Antenne SERNIE</td><td>${formatNumber((rapport.personnel?.personnelAdministratif?.antenneSernie?.hommes || 0) + (rapport.personnel?.personnelAdministratif?.antenneSernie?.femmes || 0))}</td></tr>
                    <tr><td>Coordination Diocésaine</td><td>${formatNumber((rapport.personnel?.personnelAdministratif?.coordinationDiocesaine?.hommes || 0) + (rapport.personnel?.personnelAdministratif?.coordinationDiocesaine?.femmes || 0))}</td></tr>
                    <tr><td>Sous-coordination Conventionnées</td><td>${formatNumber((rapport.personnel?.personnelAdministratif?.sousCoordinationConventionnees?.hommes || 0) + (rapport.personnel?.personnelAdministratif?.sousCoordinationConventionnees?.femmes || 0))}</td></tr>
                    <tr><td>Conseillerie Résidente</td><td>${formatNumber((rapport.personnel?.personnelAdministratif?.conseillerieResidente?.hommes || 0) + (rapport.personnel?.personnelAdministratif?.conseillerieResidente?.femmes || 0))}</td></tr>
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
                    <h4 style="font-size: 9px; margin: 3px 0 8px 0;">Gratuité Enseignement Primaire</h4>
                    <p style="font-size: 6px; margin: 0; padding-top: 0; line-height: 1.3;">${rapport.realisations.accesAccessibiliteEquite.gratuitéEnseignementPrimaire}</p>
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
                            <tr style="background-color: #f0f0f0; font-weight: bold;">
                                <td><strong>Total Général</strong></td>
                                <td><strong>${formatNumber((rapport.realisations.accesAccessibiliteEquite.cantinesScolaires.prescolaire || 0) + (rapport.realisations.accesAccessibiliteEquite.cantinesScolaires.primaire || 0) + (rapport.realisations.accesAccessibiliteEquite.cantinesScolaires.secondaire || 0))}</strong></td>
                            </tr>
                        </tbody>
                    </table>
                    
                    ${rapport.realisations.accesAccessibiliteEquite.cantinesScolaires.cantinesScolairesDetail ? `
                    <div style="margin-top: 8px;">
                        <p style="font-size: 9px; font-weight: bold; margin: 3px 0;">Répartition par Source de Financement:</p>
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Niveau</th>
                                    <th>GVT</th>
                                    <th>Projet</th>
                                    <th>PTFS</th>
                                    <th>ONG</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Préscolaire</td>
                                    <td>${rapport.realisations.accesAccessibiliteEquite.cantinesScolaires.cantinesScolairesDetail.prescolaire?.gvt || 0}</td>
                                    <td>${rapport.realisations.accesAccessibiliteEquite.cantinesScolaires.cantinesScolairesDetail.prescolaire?.projet || 0}</td>
                                    <td>${rapport.realisations.accesAccessibiliteEquite.cantinesScolaires.cantinesScolairesDetail.prescolaire?.ptfs || 0}</td>
                                    <td>${rapport.realisations.accesAccessibiliteEquite.cantinesScolaires.cantinesScolairesDetail.prescolaire?.ong || 0}</td>
                                </tr>
                                <tr>
                                    <td>Primaire</td>
                                    <td>${rapport.realisations.accesAccessibiliteEquite.cantinesScolaires.cantinesScolairesDetail.primaire?.gvt || 0}</td>
                                    <td>${rapport.realisations.accesAccessibiliteEquite.cantinesScolaires.cantinesScolairesDetail.primaire?.projet || 0}</td>
                                    <td>${rapport.realisations.accesAccessibiliteEquite.cantinesScolaires.cantinesScolairesDetail.primaire?.ptfs || 0}</td>
                                    <td>${rapport.realisations.accesAccessibiliteEquite.cantinesScolaires.cantinesScolairesDetail.primaire?.ong || 0}</td>
                                </tr>
                                <tr>
                                    <td>Secondaire</td>
                                    <td>${rapport.realisations.accesAccessibiliteEquite.cantinesScolaires.cantinesScolairesDetail.secondaire?.gvt || 0}</td>
                                    <td>${rapport.realisations.accesAccessibiliteEquite.cantinesScolaires.cantinesScolairesDetail.secondaire?.projet || 0}</td>
                                    <td>${rapport.realisations.accesAccessibiliteEquite.cantinesScolaires.cantinesScolairesDetail.secondaire?.ptfs || 0}</td>
                                    <td>${rapport.realisations.accesAccessibiliteEquite.cantinesScolaires.cantinesScolairesDetail.secondaire?.ong || 0}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    ` : ''}
                    
                    ${rapport.realisations.accesAccessibiliteEquite.cantinesScolaires.commentaire ? `
                    <p style="font-size: 7px; margin: 5px 0 0 0; padding-top: 3px;"><strong>Commentaire:</strong> ${rapport.realisations.accesAccessibiliteEquite.cantinesScolaires.commentaire}</p>
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

        ${rapport.ameliorationQualite ? `
        <div class="section">
            <div class="section-title">6. AMÉLIORATION DE LA QUALITÉ</div>
            ${rapport.ameliorationQualite.disponibiliteMoyensEnseignement ? `
            <h4 style="font-size: 10px; margin: 8px 0;">Disponibilité des Moyens d'Enseignement</h4>
            <table class="info-table">
                <thead>
                    <tr>
                        <th>Niveau</th>
                        <th>Programmes</th>
                        <th>Manuels</th>
                        <th>Matériels</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>ECE</td>
                        <td>${rapport.ameliorationQualite.disponibiliteMoyensEnseignement.programmesScolaires?.ece || '-'}</td>
                        <td>${rapport.ameliorationQualite.disponibiliteMoyensEnseignement.manuelsScolaires?.ece || '-'}</td>
                        <td>${rapport.ameliorationQualite.disponibiliteMoyensEnseignement.materielsDidactiques?.ece || '-'}</td>
                    </tr>
                    <tr>
                        <td>Préprimaire</td>
                        <td>${rapport.ameliorationQualite.disponibiliteMoyensEnseignement.programmesScolaires?.preprimaire || '-'}</td>
                        <td>${rapport.ameliorationQualite.disponibiliteMoyensEnseignement.manuelsScolaires?.preprimaire || '-'}</td>
                        <td>${rapport.ameliorationQualite.disponibiliteMoyensEnseignement.materielsDidactiques?.preprimaire || '-'}</td>
                    </tr>
                    <tr>
                        <td>Primaire</td>
                        <td>${rapport.ameliorationQualite.disponibiliteMoyensEnseignement.programmesScolaires?.primaire || '-'}</td>
                        <td>${rapport.ameliorationQualite.disponibiliteMoyensEnseignement.manuelsScolaires?.primaire || '-'}</td>
                        <td>${rapport.ameliorationQualite.disponibiliteMoyensEnseignement.materielsDidactiques?.primaire || '-'}</td>
                    </tr>
                    <tr>
                        <td>Secondaire</td>
                        <td>${rapport.ameliorationQualite.disponibiliteMoyensEnseignement.programmesScolaires?.secondaire || '-'}</td>
                        <td>${rapport.ameliorationQualite.disponibiliteMoyensEnseignement.manuelsScolaires?.secondaire || '-'}</td>
                        <td>${rapport.ameliorationQualite.disponibiliteMoyensEnseignement.materielsDidactiques?.secondaire || '-'}</td>
                    </tr>
                </tbody>
            </table>
            ` : ''}
            ${rapport.ameliorationQualite.activitesInspectorales?.inspectionsPedagogiquesC3 ? `
            <h4 style="font-size: 10px; margin: 8px 0;">Inspections Pédagogiques C3</h4>
            <table class="info-table">
                <thead>
                    <tr>
                        <th>Niveau</th>
                        <th>Prévu</th>
                        <th>Réalisé</th>
                        <th>%</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Préscolaire</td>
                        <td>${rapport.ameliorationQualite.activitesInspectorales.inspectionsPedagogiquesC3?.prescolaire?.nombrePrevu || 0}</td>
                        <td>${rapport.ameliorationQualite.activitesInspectorales.inspectionsPedagogiquesC3?.prescolaire?.nombreRealise || 0}</td>
                        <td>${rapport.ameliorationQualite.activitesInspectorales.inspectionsPedagogiquesC3?.prescolaire?.pourcentageRealisation || 0}%</td>
                    </tr>
                    <tr>
                        <td>Primaire</td>
                        <td>${rapport.ameliorationQualite.activitesInspectorales.inspectionsPedagogiquesC3?.primaire?.nombrePrevu || 0}</td>
                        <td>${rapport.ameliorationQualite.activitesInspectorales.inspectionsPedagogiquesC3?.primaire?.nombreRealise || 0}</td>
                        <td>${rapport.ameliorationQualite.activitesInspectorales.inspectionsPedagogiquesC3?.primaire?.pourcentageRealisation || 0}%</td>
                    </tr>
                    <tr>
                        <td>Secondaire</td>
                        <td>${rapport.ameliorationQualite.activitesInspectorales.inspectionsPedagogiquesC3?.secondaire?.nombrePrevu || 0}</td>
                        <td>${rapport.ameliorationQualite.activitesInspectorales.inspectionsPedagogiquesC3?.secondaire?.nombreRealise || 0}</td>
                        <td>${rapport.ameliorationQualite.activitesInspectorales.inspectionsPedagogiquesC3?.secondaire?.pourcentageRealisation || 0}%</td>
                    </tr>
                </tbody>
            </table>
            ` : ''}
            
            ${rapport.ameliorationQualite.activitesInspectorales?.themesExploites ? `
            <h4 style="font-size: 10px; margin: 8px 0;">Thèmes Exploités lors des Formations</h4>
            <table class="info-table">
                <tbody>
                    ${rapport.ameliorationQualite.activitesInspectorales.themesExploites.ece ? `
                    <tr>
                        <th style="width: 20%;">ECE</th>
                        <td style="font-size: 8px;">${rapport.ameliorationQualite.activitesInspectorales.themesExploites.ece}</td>
                    </tr>
                    ` : ''}
                    ${rapport.ameliorationQualite.activitesInspectorales.themesExploites.maternel ? `
                    <tr>
                        <th style="width: 20%;">Maternel</th>
                        <td style="font-size: 8px;">${rapport.ameliorationQualite.activitesInspectorales.themesExploites.maternel}</td>
                    </tr>
                    ` : ''}
                </tbody>
            </table>
            ` : ''}
        </div>
        ` : ''}

        ${rapport.gouvernance ? `
        <div class="section">
            <div class="section-title">7. GOUVERNANCE</div>
            
            ${rapport.gouvernance.miseEnOeuvreSSEF ? `
            <h4 style="font-size: 10px; margin: 8px 0;">Mise en Œuvre du SSEF</h4>
            ${rapport.gouvernance.miseEnOeuvreSSEF.niveauProvinceEducationnelle ? `
            <div style="margin: 8px 0;">
                <p style="font-size: 9px; font-weight: bold; margin: 3px 0;">Province Éducationnelle:</p>
                <table class="info-table">
                    <tbody>
                        ${rapport.gouvernance.miseEnOeuvreSSEF.niveauProvinceEducationnelle.elaborationPAO ? `
                        <tr>
                            <th style="width: 25%;">Élaboration PAO</th>
                            <td style="font-size: 8px;">${rapport.gouvernance.miseEnOeuvreSSEF.niveauProvinceEducationnelle.elaborationPAO}</td>
                        </tr>
                        ` : ''}
                        ${rapport.gouvernance.miseEnOeuvreSSEF.niveauProvinceEducationnelle.miseEnOeuvre ? `
                        <tr>
                            <th>Mise en Œuvre</th>
                            <td style="font-size: 8px;">${rapport.gouvernance.miseEnOeuvreSSEF.niveauProvinceEducationnelle.miseEnOeuvre}</td>
                        </tr>
                        ` : ''}
                        ${rapport.gouvernance.miseEnOeuvreSSEF.niveauProvinceEducationnelle.evaluationMiParcours ? `
                        <tr>
                            <th>Évaluation Mi-Parcours</th>
                            <td style="font-size: 8px;">${rapport.gouvernance.miseEnOeuvreSSEF.niveauProvinceEducationnelle.evaluationMiParcours}</td>
                        </tr>
                        ` : ''}
                        ${rapport.gouvernance.miseEnOeuvreSSEF.niveauProvinceEducationnelle.evaluationFinale ? `
                        <tr>
                            <th>Évaluation Finale</th>
                            <td style="font-size: 8px;">${rapport.gouvernance.miseEnOeuvreSSEF.niveauProvinceEducationnelle.evaluationFinale}</td>
                        </tr>
                        ` : ''}
                    </tbody>
                </table>
            </div>
            ` : ''}
            ${rapport.gouvernance.miseEnOeuvreSSEF.niveauProvinceAdministrative ? `
            <div style="margin: 8px 0;">
                <p style="font-size: 9px; font-weight: bold; margin: 3px 0;">Province Administrative:</p>
                <table class="info-table">
                    <tbody>
                        ${rapport.gouvernance.miseEnOeuvreSSEF.niveauProvinceAdministrative.elaborationPAO ? `
                        <tr>
                            <th style="width: 25%;">Élaboration PAO</th>
                            <td style="font-size: 8px;">${rapport.gouvernance.miseEnOeuvreSSEF.niveauProvinceAdministrative.elaborationPAO}</td>
                        </tr>
                        ` : ''}
                        ${rapport.gouvernance.miseEnOeuvreSSEF.niveauProvinceAdministrative.miseEnOeuvre ? `
                        <tr>
                            <th>Mise en Œuvre</th>
                            <td style="font-size: 8px;">${rapport.gouvernance.miseEnOeuvreSSEF.niveauProvinceAdministrative.miseEnOeuvre}</td>
                        </tr>
                        ` : ''}
                        ${rapport.gouvernance.miseEnOeuvreSSEF.niveauProvinceAdministrative.evaluationMiParcours ? `
                        <tr>
                            <th>Évaluation Mi-Parcours</th>
                            <td style="font-size: 8px;">${rapport.gouvernance.miseEnOeuvreSSEF.niveauProvinceAdministrative.evaluationMiParcours}</td>
                        </tr>
                        ` : ''}
                        ${rapport.gouvernance.miseEnOeuvreSSEF.niveauProvinceAdministrative.evaluationFinale ? `
                        <tr>
                            <th>Évaluation Finale</th>
                            <td style="font-size: 8px;">${rapport.gouvernance.miseEnOeuvreSSEF.niveauProvinceAdministrative.evaluationFinale}</td>
                        </tr>
                        ` : ''}
                    </tbody>
                </table>
            </div>
            ` : ''}
            ` : ''}
            
            ${rapport.gouvernance.comitesProvinciaux ? `
            <h4 style="font-size: 10px; margin: 8px 0;">Comités Provinciaux</h4>
            <table class="info-table">
                <tbody>
                    <tr>
                        <th>Comité EDUNC</th>
                        <td style="font-size: 7px; padding: 5px 8px;">Fréquence: ${rapport.gouvernance.comitesProvinciaux.comiteEDUNC?.frequenceReunions || '-'}${rapport.gouvernance.comitesProvinciaux.comiteEDUNC?.pointsTraites ? ` | Points: ${rapport.gouvernance.comitesProvinciaux.comiteEDUNC.pointsTraites}` : ''}</td>
                    </tr>
                    <tr>
                        <th>Comité ENAFP</th>
                        <td style="font-size: 7px; padding: 5px 8px;">Fréquence: ${rapport.gouvernance.comitesProvinciaux.comiteENAFP?.frequenceReunions || '-'}${rapport.gouvernance.comitesProvinciaux.comiteENAFP?.pointsTraites ? ` | Points: ${rapport.gouvernance.comitesProvinciaux.comiteENAFP.pointsTraites}` : ''}</td>
                    </tr>
                    <tr>
                        <th>Comité TENASOSSP</th>
                        <td style="font-size: 7px; padding: 5px 8px;">Fréquence: ${rapport.gouvernance.comitesProvinciaux.comiteTENASOSP?.frequenceReunions || '-'}${rapport.gouvernance.comitesProvinciaux.comiteTENASOSP?.pointsTraites ? ` | Points: ${rapport.gouvernance.comitesProvinciaux.comiteTENASOSP.pointsTraites}` : ''}</td>
                    </tr>
                    <tr>
                        <th>Comité Examen État</th>
                        <td style="font-size: 7px; padding: 5px 8px;">Fréquence: ${rapport.gouvernance.comitesProvinciaux.comiteExamenEtat?.frequenceReunions || '-'}${rapport.gouvernance.comitesProvinciaux.comiteExamenEtat?.pointsTraites ? ` | Points: ${rapport.gouvernance.comitesProvinciaux.comiteExamenEtat.pointsTraites}` : ''}</td>
                    </tr>
                </tbody>
            </table>
            ` : ''}
            
            ${rapport.gouvernance.vulgarisationInstructions ? `
            <h4 style="font-size: 10px; margin: 8px 0;">Vulgarisation des Instructions</h4>
            <table class="info-table">
                <tbody>
                    ${rapport.gouvernance.vulgarisationInstructions.instructionsOfficielles ? `
                    <tr>
                        <th style="width: 25%;">Instructions Officielles</th>
                        <td style="font-size: 8px;">${rapport.gouvernance.vulgarisationInstructions.instructionsOfficielles}</td>
                    </tr>
                    ` : ''}
                    ${rapport.gouvernance.vulgarisationInstructions.nouvelleCitoyennete ? `
                    <tr>
                        <th>Nouvelle Citoyenneté</th>
                        <td style="font-size: 8px;">${rapport.gouvernance.vulgarisationInstructions.nouvelleCitoyennete}</td>
                    </tr>
                    ` : ''}
                </tbody>
            </table>
            ` : ''}
            
            ${rapport.gouvernance.groupesAidesPsychopedagogiques ? `
            <h4 style="font-size: 10px; margin: 8px 0;">Groupes d'Aides Psychopédagogiques</h4>
            <table class="info-table">
                <tbody>
                    <tr>
                        <th style="width: 25%;">GAP Mis en Place</th>
                        <td>${rapport.gouvernance.groupesAidesPsychopedagogiques.nombreGAPMisEnPlace || 0}</td>
                    </tr>
                    <tr>
                        <th>GAP Opérationnel</th>
                        <td>${rapport.gouvernance.groupesAidesPsychopedagogiques.nombreGAPOperationnel || 0}</td>
                    </tr>
                    <tr>
                        <th>Cas Pris en Charge</th>
                        <td>${rapport.gouvernance.groupesAidesPsychopedagogiques.nombreCasPrisEnCharge || 0}</td>
                    </tr>
                    ${rapport.gouvernance.groupesAidesPsychopedagogiques.problemesIdentifies ? `
                    <tr>
                        <th>Problèmes Identifiés</th>
                        <td style="font-size: 8px;">${rapport.gouvernance.groupesAidesPsychopedagogiques.problemesIdentifies}</td>
                    </tr>
                    ` : ''}
                    ${rapport.gouvernance.groupesAidesPsychopedagogiques.solutionsPreconisees ? `
                    <tr>
                        <th>Solutions Préconisées</th>
                        <td style="font-size: 8px;">${rapport.gouvernance.groupesAidesPsychopedagogiques.solutionsPreconisees}</td>
                    </tr>
                    ` : ''}
                </tbody>
            </table>
            ` : ''}
            
            ${rapport.gouvernance.acquisitionsMateriels ? `
            <h4 style="font-size: 10px; margin: 8px 0;">Acquisitions de Matériels</h4>
            ${rapport.gouvernance.acquisitionsMateriels.ecoles ? `
            <div style="margin: 8px 0;">
                <p style="font-size: 9px; font-weight: bold; margin: 3px 0;">Pour les Écoles:</p>
                <table class="info-table">
                    <tbody>
                        <tr>
                            <th style="width: 25%;">Nature</th>
                            <td style="font-size: 8px;">${rapport.gouvernance.acquisitionsMateriels.ecoles.nature}</td>
                        </tr>
                        ${rapport.gouvernance.acquisitionsMateriels.ecoles.sourceFinancement ? `
                        <tr>
                            <th>Sources de Financement</th>
                            <td style="font-size: 8px;">GVT: ${rapport.gouvernance.acquisitionsMateriels.ecoles.sourceFinancement.gvt}% | Projet: ${rapport.gouvernance.acquisitionsMateriels.ecoles.sourceFinancement.projet}% | PTFS: ${rapport.gouvernance.acquisitionsMateriels.ecoles.sourceFinancement.ptfs}% | ONG: ${rapport.gouvernance.acquisitionsMateriels.ecoles.sourceFinancement.ong}%</td>
                        </tr>
                        ` : ''}
                    </tbody>
                </table>
            </div>
            ` : ''}
            ${rapport.gouvernance.acquisitionsMateriels.bureauxGestionnaires ? `
            <div style="margin: 8px 0;">
                <p style="font-size: 9px; font-weight: bold; margin: 3px 0;">Pour les Bureaux Gestionnaires:</p>
                <table class="info-table">
                    <tbody>
                        <tr>
                            <th style="width: 25%;">Nature</th>
                            <td style="font-size: 8px;">${rapport.gouvernance.acquisitionsMateriels.bureauxGestionnaires.nature}</td>
                        </tr>
                        ${rapport.gouvernance.acquisitionsMateriels.bureauxGestionnaires.sourceFinancement ? `
                        <tr>
                            <th>Sources de Financement</th>
                            <td style="font-size: 8px;">GVT: ${rapport.gouvernance.acquisitionsMateriels.bureauxGestionnaires.sourceFinancement.gvt}% | Projet: ${rapport.gouvernance.acquisitionsMateriels.bureauxGestionnaires.sourceFinancement.projet}% | PTFS: ${rapport.gouvernance.acquisitionsMateriels.bureauxGestionnaires.sourceFinancement.ptfs}% | ONG: ${rapport.gouvernance.acquisitionsMateriels.bureauxGestionnaires.sourceFinancement.ong}%</td>
                        </tr>
                        ` : ''}
                    </tbody>
                </table>
            </div>
            ` : ''}
            ` : ''}
        </div>
        ` : ''}

        ${rapport.educationUrgence ? `
        <div class="section">
            <div class="section-title">8. ÉDUCATION EN SITUATION D'URGENCE</div>
            ${rapport.educationUrgence.planStockContingence ? `
            <table class="info-table">
                <tbody>
                    <tr>
                        <th style="width: 40%;">Plan d'Urgence</th>
                        <td>${rapport.educationUrgence.planStockContingence.plan || '-'}</td>
                    </tr>
                    <tr>
                        <th>Stock de Fournitures</th>
                        <td>${rapport.educationUrgence.planStockContingence.stock || '-'}</td>
                    </tr>
                    ${rapport.educationUrgence.catastrophesNaturelles ? `
                    <tr>
                        <th>Catastrophes</th>
                        <td style="font-size: 7px; padding: 5px 8px;">${rapport.educationUrgence.catastrophesNaturelles.nature || '-'}</td>
                    </tr>
                    ` : ''}
                </tbody>
            </table>
            ` : ''}
        </div>
        ` : ''}

        ${rapport.autresProblemes ? `
        <div class="section">
            <div class="section-title">9. AUTRES PROBLÈMES</div>
            <div style="text-align: justify; margin: 10px 0; font-size: 10px;">${rapport.autresProblemes.problemesSpecifiques || '-'}</div>
        </div>
        ` : ''}

        ${rapport.conclusion ? `
        <div class="section">
            <div class="section-title">10. CONCLUSION</div>
            <div style="text-align: justify; margin: 10px 0; font-size: 10px;">${rapport.conclusion}</div>
        </div>
        ` : ''}

        <div class="section">
            <div class="section-title">11. INFORMATIONS GÉNÉRALES</div>
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
