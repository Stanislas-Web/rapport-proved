import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { rapportActiviteService } from '../../services/rapportActivite/rapportActiviteService';
import { RapportActivite } from '../../models/RapportActivite';
import AutoFillBanner from './components/AutoFillBanner';
import BasicInfo from './components/BasicInfo';
import ParametresCles from './components/ParametresCles';
import ParametresClesComplete from './components/ParametresClesComplete';
import Personnel from './components/Personnel';
import EvaluationQualitative from './components/EvaluationQualitative';
import Realisations from './components/Realisations';
import Gouvernance from './components/Gouvernance';
import EducationUrgence from './components/EducationUrgence';
import EvaluationQualitativeComplete from './components/EvaluationQualitativeComplete';
import RealisationsComplete from './components/RealisationsComplete';
import Conclusion from './components/Conclusion';
import { useAutoSave } from '../../hooks/useAutoSave';
import DraftIndicator from '../../components/DraftIndicator';
import DraftRecoveryModal from '../../components/DraftRecoveryModal';
import { 
  loadDraft as loadDraftUtil, 
  saveDraft, 
  deleteDraft, 
  hasDraft,
  calculateCompletionPercentage 
} from '../../utils/draftUtils';

const CreateRapportActivite: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [existingDraft, setExistingDraft] = useState<any>(null);
  const [currentSection, setCurrentSection] = useState('I');
  
  // Charger les données du brouillon local au démarrage
  const loadDraft = (): RapportActivite => {
    // D'abord essayer avec le nouveau système
    const newDraft = loadDraftUtil();
    if (newDraft && newDraft.formData) {
      console.log('🔍 Nouveau brouillon chargé:', newDraft);
      return newDraft.formData;
    }

    // Sinon, essayer l'ancien système pour rétrocompatibilité
    const savedDraft = localStorage.getItem('rapportActiviteDraft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        console.log('🔍 Ancien brouillon chargé:', draft);
        
        // Nettoyer les anciennes valeurs "-" qui causent des erreurs
        if (draft.parametresCles?.nombreEcolesClasses?.niveauPrimaire?.enseignementPrimaire?.classesPlethoriques === '-') {
          draft.parametresCles.nombreEcolesClasses.niveauPrimaire.enseignementPrimaire.classesPlethoriques = 0;
        }
        if (draft.parametresCles?.nombreEcolesClasses?.niveauPrimaire?.enseignementSpecial?.classesPlethoriques === '-') {
          draft.parametresCles.nombreEcolesClasses.niveauPrimaire.enseignementSpecial.classesPlethoriques = 0;
        }
        
        return draft;
      } catch (error) {
        console.error('Erreur lors du chargement du brouillon:', error);
      }
    }
    
    // Données par défaut si pas de brouillon
    return {
      identificationProved: {
        provinceAdministrative: '',
        provinceEducationnelle: '',
        chefLieuProved: '',
        emailProfessionnel: '',
        telephone: '',
        statutOccupation: 'Propriétaire',
        nombreTerritoires: 0,
        nombreSousDivisions: 0,
        directeurProvincial: '',
        isActive: true
      },
      annee: `${new Date().getFullYear()-2}-${new Date().getFullYear() + 1}`,
      introduction: '',
      parametresCles: {
        nombreEcolesClasses: {
          niveauPrescolaire: {
            espaceCommunautaireEveil: {
              nombreEcoles: 0,
              nombreClasses: 0
            },
            maternel: {
              nombreEcoles: 0,
              nombreClasses: 0
            },
            prePrimaire: {
              nombreEcoles: 0,
              nombreClasses: 0
            },
            special: {
              nombreEcoles: 0,
              nombreClasses: 0
            }
          },
          niveauPrimaire: {
            enseignementSpecial: {
              nombreEcoles: 0,
              totalClassesSpecialesPrim: 0,
              classesPlethoriques: 0
            },
            enseignementPrimaire: {
              nombreEcoles: 0,
              totalClassesPrimaire: 0,
              classesPlethoriques: 0
            }
          },
          niveauSecondaire: {
            enseignementSpecial: {
              nombreEcoles: 0,
              totalClassesSpecialesSec: 0
            },
            enseignementSecondaire: {
              nombreEcoles: 0,
              premierCycle: {
                classes7emeCTEB: 0,
                classes8emeCTEB: 0
              },
              deuxiemeCycle: {
                totalClassesHumanites: 0
              },
              totalClasses1er2emeCycle: 0
            }
          }
        },
        effectifScolaire: {
          niveauPrescolaire: {
            espaceCommunautaireEveil: {
              effectifGarconsFilles: 0,
              effectifFilles: 0,
              tauxAccroissementGarconsFilles: 0,
              tauxAccroissementFilles: 0
            },
            maternel: {
              effectifGarconsFilles: 0,
              effectifFilles: 0,
              tauxAccroissementGarconsFilles: 0,
              tauxAccroissementFilles: 0
            },
            prePrimaire: {
              effectifGarconsFilles: 0,
              effectifFilles: 0,
              tauxAccroissementGarconsFilles: 0,
              tauxAccroissementFilles: 0
            },
            special: {
              effectifGarconsFilles: 0,
              effectifFilles: 0,
              tauxAccroissementGarconsFilles: 0,
              tauxAccroissementFilles: 0
            }
          },
          niveauPrimaire: {
            enseignementSpecial: {
              effectifGarconsFilles: 0,
              effectifFilles: 0,
              tauxAccroissementGarconsFilles: 0,
              tauxAccroissementFilles: 0
            },
            enseignementPrimaire: {
              effectifGarconsFilles: 0,
              effectifFilles: 0,
              tauxAccroissementGarconsFilles: 0,
              tauxAccroissementFilles: 0
            }
          },
          niveauSecondaire: {
            enseignementSpecial: {
              effectifGarcons: 0,
              effectifFilles: 0,
              tauxGarcons: 0,
              tauxFilles: 0
            },
            enseignementSecondaire: {
              septiemeCTEB: {
                effectifGarcons: 0,
                effectifFilles: 0,
                tauxGarcons: 0,
                tauxFilles: 0
              },
              huitiemeCTEB: {
                effectifGarcons: 0,
                effectifFilles: 0,
                tauxGarcons: 0,
                tauxFilles: 0
              },
              premiereHumanite: {
                effectifGarcons: 0,
                effectifFilles: 0,
                tauxGarcons: 0,
                tauxFilles: 0
              },
              quatriemeHumanite: {
                effectifGarcons: 0,
                effectifFilles: 0,
                tauxGarcons: 0,
                tauxFilles: 0
              }
            }
          }
        }
      },
      personnel: {
        personnelEnseignant: {
          niveauPrescolaire: {
            enseignementPrescolaireSpecial: {
              hommes: 0,
              femmes: 0
            },
            enseignementPrescolaire: {
              hommes: 0,
              femmes: 0
            }
          },
          niveauPrimaire: {
            enseignementPrescolaireSpecial: {
              hommes: 0,
              femmes: 0
            },
            enseignementPrimaire: {
              hommes: 0,
              femmes: 0
            }
          },
          niveauSecondaire: {
            enseignementPrescolaireSpecial: {
              hommes: 0,
              femmes: 0
            },
            enseignementSecondaire: {
              hommes: 0,
              femmes: 0
            }
          }
        },
        personnelAdministratif: {
          directionProvinciale: {
            hommes: 0,
            femmes: 0
          },
          inspectionPrincipale: {
            hommes: 0,
            femmes: 0
          },
          dinacope: {
            hommes: 0,
            femmes: 0
          },
          sernie: {
            hommes: 0,
            femmes: 0
          },
          coordinationProvinciale: {
            hommes: 0,
            femmes: 0
          },
          sousDivision: {
            hommes: 0,
            femmes: 0
          },
          poolsInspectionPrimaire: {
            hommes: 0,
            femmes: 0
          },
          poolsInspectionSecondaire: {
            hommes: 0,
            femmes: 0
          },
          antenneDinacope: {
            hommes: 0,
            femmes: 0
          },
          antenneSernie: {
            hommes: 0,
            femmes: 0
          },
          coordinationDiocesaine: {
            hommes: 0,
            femmes: 0
          },
          sousCoordinationConventionnees: {
            hommes: 0,
            femmes: 0
          },
          conseillerieResidente: {
            hommes: 0,
            femmes: 0
          }
        }
      },
      realisations: {
        accesAccessibiliteEquite: {
          nouvellesSallesClasses: {
            prescolaire: 0,
            sourceFinancementPrescolaire: '',
            primaire: 0,
            sourceFinancementPrimaire: '',
            secondaire: 0,
            sourceFinancementSecondaire: ''
          },
          nouveauxBancsTables: {
            prescolaire: 0,
            sourceFinancementPrescolaire: '',
            primaire: 0,
            sourceFinancementPrimaire: '',
            secondaire: 0,
            sourceFinancementSecondaire: ''
          },
          nouvellesLatrines: {
            prescolaire: 0,
            sourceFinancementPrescolaire: '',
            primaire: 0,
            sourceFinancementPrimaire: '',
            secondaire: 0,
            sourceFinancementSecondaire: ''
          },
          gratuitéEnseignementPrimaire: '',
          sensibilisation: {
            filles: false,
            enfantsHorsEcole: false,
            peuplesAutochtones: false
          },
          cantinesScolaires: {
            prescolaire: 0,
            primaire: 0,
            secondaire: 0,
            commentaire: ''
          },
          indicateursAcces: {
            proportionNouveauxInscrits: 0,
            tauxTransitionPrimaireCTEB: 0,
            tauxTransitionCTEBHumanites: 0
          }
        }
      },
      ameliorationQualite: {
        disponibiliteMoyensEnseignement: {
          programmesScolaires: {
            ece: 'BON',
            preprimaire: 'BON',
            maternel: 'BON',
            primaire: 'BON',
            secondaire: 'BON'
          },
          manuelsScolaires: {
            ece: 'BON',
            preprimaire: 'BON',
            maternel: 'BON',
            primaire: 'BON',
            secondaire: 'BON'
          },
          materielsDidactiques: {
            prescolaire: 'BON',
            primaire: 'BON',
            secondaire: 'BON'
          },
          laboratoires: {
            chimie: 'BON',
            biologie: 'BON',
            physique: 'BON'
          },
          equipementsAteliers: {
            humanitesTechniques: 'BON'
          }
        },
        visitesEtReunions: {
          visitesClasses: {
            prescolaire: 'BON',
            primaire: 'BON',
            secondaire: 'BON',
            special: 'BON'
          },
          reunionsPedagogiques: {
            prescolaire: 'BON',
            primaire: 'BON',
            secondaire: 'BON'
          },
          fonctionnementCelluleBase: {
            prescolaire: 'BON',
            primaire: 'BON',
            secondaire: 'BON',
            special: 'BON'
          }
        },
        activitesInspectorales: {
          inspectionsPedagogiquesC3: {
            prescolaire: {
              nombrePrevu: 0,
              nombreRealise: 0,
              pourcentageRealisation: 0
            },
            primaire: {
              nombrePrevu: 0,
              nombreRealise: 0,
              pourcentageRealisation: 0
            },
            secondaire: {
              nombrePrevu: 0,
              nombreRealise: 0,
              pourcentageRealisation: 0
            },
            special: {
              nombrePrevu: 0,
              nombreRealise: 0,
              pourcentageRealisation: 0
            }
          },
          inspectionsFormation: {
            prescolaire: {
              nombrePrevu: 0,
              nombreRealise: 0,
              pourcentageRealisation: 0
            },
            primaire: {
              nombrePrevu: 0,
              nombreRealise: 0,
              pourcentageRealisation: 0
            },
            secondaire: {
              nombrePrevu: 0,
              nombreRealise: 0,
              pourcentageRealisation: 0
            },
            special: {
              nombrePrevu: 0,
              nombreRealise: 0,
              pourcentageRealisation: 0
            }
          },
          formationContinue: {
            prescolaire: 'BON',
            primaire: 'BON',
            secondaire: 'BON',
            special: 'BON'
          }
        },
        indicateursRendement: {
          rendementInterne: {
            prescolaire: {
              tauxAbandon: 0,
              tauxReussite: 0,
              tauxEchec: 0
            },
            primaire: {
              tauxAbandon: 0,
              tauxReussite: 0,
              tauxEchec: 0
            },
            secondaire: {
              tauxAbandon: 0,
              tauxReussite: 0,
              tauxEchec: 0
            }
          },
          rendementExterne: {
            examensCertificatifs: {
              tauxDiplomes: 0,
              tauxHumanitesScientifiques: 0,
              tauxHumanitesTechniques: 0
            }
          }
        }
      },
      gouvernance: {
        miseEnOeuvreSSEF: {
          niveauProvinceEducationnelle: {
            elaborationPAO: '',
            miseEnOeuvre: '',
            evaluationMiParcours: '',
            evaluationFinale: ''
          },
          niveauProvinceAdministrative: {
            elaborationPAO: '',
            miseEnOeuvre: '',
            evaluationMiParcours: '',
            evaluationFinale: ''
          }
        },
        inspectionsAdministrativesC2B: {
          prescolaire: {
            nombrePrevu: 0,
            nombreRealise: 0,
            pourcentageRealisation: 0
          },
          primaire: {
            nombrePrevu: 0,
            nombreRealise: 0,
            pourcentageRealisation: 0
          },
          secondaire: {
            nombrePrevu: 0,
            nombreRealise: 0,
            pourcentageRealisation: 0
          },
          special: {
            nombrePrevu: 0,
            nombreRealise: 0,
            pourcentageRealisation: 0
          }
        },
        comitesProvinciaux: {
          comiteEDUNC: {
            frequenceReunions: '',
            pointsTraites: ''
          },
          comiteENAFP: {
            frequenceReunions: '',
            pointsTraites: ''
          },
          comiteTENASOSP: {
            frequenceReunions: '',
            pointsTraites: ''
          },
          comiteExamenEtat: {
            frequenceReunions: '',
            pointsTraites: ''
          }
        },
        remunerationPersonnel: {
          directionProvinciale: {
            totalAgents: 0,
            nonPayes: 0
          },
          inspectionPrincipale: {
            totalAgents: 0,
            nonPayes: 0
          },
          dinacope: {
            totalAgents: 0,
            nonPayes: 0
          },
          sernie: {
            totalAgents: 0,
            nonPayes: 0
          },
          coordinationProvinciale: {
            totalAgents: 0,
            nonPayes: 0
          },
          sousDivision: {
            totalAgents: 0,
            nonPayes: 0
          },
          poolsInspectionPrimaire: {
            totalAgents: 0,
            nonPayes: 0
          },
          poolsInspectionSecondaire: {
            totalAgents: 0,
            nonPayes: 0
          },
          antenneDinacope: {
            totalAgents: 0,
            nonPayes: 0
          },
          antenneSernie: {
            totalAgents: 0,
            nonPayes: 0
          },
          coordinationDiocesaine: {
            totalAgents: 0,
            nonPayes: 0
          },
          sousCoordinationConventionnees: {
            totalAgents: 0,
            nonPayes: 0
          },
          conseillerieResidente: {
            totalAgents: 0,
            nonPayes: 0
          }
        },
        vulgarisationInstructions: {
          instructionsOfficielles: '',
          nouvelleCitoyennete: ''
        },
        groupesAidesPsychopedagogiques: {
          nombreGAPMisEnPlace: 0,
          nombreGAPOperationnel: 0,
          nombreCasPrisEnCharge: 0,
          problemesIdentifies: '',
          solutionsPreconisees: ''
        },
        acquisitionsMateriels: {
          ecoles: {
            nature: '',
            sourceFinancement: {
              gvt: 0,
              projet: 0,
              ptfs: 0,
              ong: 0
            }
          },
          bureauxGestionnaires: {
            nature: '',
            sourceFinancement: {
              gvt: 0,
              projet: 0,
              ptfs: 0,
              ong: 0
            }
          }
        },
        infrastructureBureaux: {
          directionProvinciale: {
            proprietaire: 0,
            locataire: 0
          },
          inspectionPrincipale: {
            proprietaire: 0,
            locataire: 0
          },
          dinacope: {
            proprietaire: 0,
            locataire: 0
          },
          sernie: {
            proprietaire: 0,
            locataire: 0
          },
          coordinationProvinciale: {
            proprietaire: 0,
            locataire: 0
          },
          sousDivision: {
            proprietaire: 0,
            locataire: 0
          },
          poolsInspectionPrimaire: {
            proprietaire: 0,
            locataire: 0
          },
          poolsInspectionSecondaire: {
            proprietaire: 0,
            locataire: 0
          },
          antenneDinacope: {
            proprietaire: 0,
            locataire: 0
          },
          antenneSernie: {
            proprietaire: 0,
            locataire: 0
          },
          coordinationDiocesaine: {
            proprietaire: 0,
            locataire: 0
          },
          sousCoordinationConventionnees: {
            proprietaire: 0,
            locataire: 0
          },
          conseillerieResidente: {
            proprietaire: 0,
            locataire: 0
          }
        },
        totalInfrastructureBureaux: {
          totalProprietaire: 0,
          totalLocataire: 0
        }
      },
      educationUrgence: {
        planStockContingence: {
          plan: '',
          stock: ''
        },
        catastrophesNaturelles: {
          nature: '',
          effetsNegatifs: ''
        },
        destructionSDC: {
          forcesNegatives: ''
        },
        solutionsLocales: '',
        reunionsClusterEducation: {
          frequence: '',
          pointsTraites: ''
        },
        recommandations: {
          espacesTemporairesApprentissage: {
            nombre: 0,
            couts: ''
          },
          apprenantsScolarises: {
            cible: 0
          },
          formationEnseignantsESU: ''
        }
      },
      autresProblemes: {
        problemesSpecifiques: ''
      },
      conclusion: '',
      statut: 'brouillon'
    };
  };

  // Fonction pour s'assurer que toutes les propriétés sont initialisées
  const ensureCompleteInitialization = (data: RapportActivite): RapportActivite => {
    const defaultData = loadDraft();
    
    // Fusionner les données existantes avec les valeurs par défaut
    const mergedData = {
      ...defaultData,
      ...data,
      parametresCles: {
        ...defaultData.parametresCles,
        ...data.parametresCles,
        nombreEcolesClasses: {
          ...defaultData.parametresCles.nombreEcolesClasses,
          ...data.parametresCles?.nombreEcolesClasses,
          niveauPrescolaire: {
            ...defaultData.parametresCles.nombreEcolesClasses.niveauPrescolaire,
            ...data.parametresCles?.nombreEcolesClasses?.niveauPrescolaire,
            espaceCommunautaireEveil: {
              ...defaultData.parametresCles.nombreEcolesClasses.niveauPrescolaire.espaceCommunautaireEveil,
              ...data.parametresCles?.nombreEcolesClasses?.niveauPrescolaire?.espaceCommunautaireEveil
            },
            maternel: {
              ...defaultData.parametresCles.nombreEcolesClasses.niveauPrescolaire.maternel,
              ...data.parametresCles?.nombreEcolesClasses?.niveauPrescolaire?.maternel
            },
            prePrimaire: {
              ...defaultData.parametresCles.nombreEcolesClasses.niveauPrescolaire.prePrimaire,
              ...data.parametresCles?.nombreEcolesClasses?.niveauPrescolaire?.prePrimaire
            },
            special: {
              ...defaultData.parametresCles.nombreEcolesClasses.niveauPrescolaire.special,
              ...data.parametresCles?.nombreEcolesClasses?.niveauPrescolaire?.special
            }
          },
          niveauPrimaire: {
            ...defaultData.parametresCles.nombreEcolesClasses.niveauPrimaire,
            ...data.parametresCles?.nombreEcolesClasses?.niveauPrimaire,
            enseignementSpecial: {
              ...defaultData.parametresCles.nombreEcolesClasses.niveauPrimaire.enseignementSpecial,
              ...data.parametresCles?.nombreEcolesClasses?.niveauPrimaire?.enseignementSpecial
            },
            enseignementPrimaire: {
              ...defaultData.parametresCles.nombreEcolesClasses.niveauPrimaire.enseignementPrimaire,
              ...data.parametresCles?.nombreEcolesClasses?.niveauPrimaire?.enseignementPrimaire
            }
          },
          niveauSecondaire: {
            ...defaultData.parametresCles.nombreEcolesClasses.niveauSecondaire,
            ...data.parametresCles?.nombreEcolesClasses?.niveauSecondaire
          }
        },
        effectifScolaire: {
          ...defaultData.parametresCles.effectifScolaire,
          ...data.parametresCles?.effectifScolaire
        }
      },
      personnel: {
        ...defaultData.personnel,
        ...data.personnel
      }
    };
    
    console.log('🔍 Données complètes après fusion:', mergedData);
    return mergedData;
  };

  const [formData, setFormData] = useState<RapportActivite>(() => {
    console.log('🎯 INITIALISATION DU STATE formData');
    const initialData = loadDraft();
    console.log('🔍 Données chargées depuis loadDraft():', initialData);
    const completeData = ensureCompleteInitialization(initialData);
    console.log('🔍 Données complètes après fusion:', {
      hasIdentification: !!completeData.identificationProved,
      hasParametres: !!completeData.parametresCles?.nombreEcolesClasses,
      hasIntroduction: !!completeData.introduction,
      firstField: completeData.identificationProved
    });
    return completeData;
  });

  // État pour stocker les effectifs de l'année précédente
  const [previousYearEffectifs, setPreviousYearEffectifs] = useState<any>(null);

  // Fonction pour récupérer les effectifs de l'année précédente
  const fetchPreviousYearData = async () => {
    try {
      const userData = localStorage.getItem('data');
      
      if (!userData) {
        console.log('❌ Données utilisateur manquantes');
        return;
      }

      const user = JSON.parse(userData);
      const provedId = user._id;
      const currentYear = new Date().getFullYear();
      const anneeActuelle = `${currentYear}-${currentYear + 1}`;

      console.log('🔍 Récupération des effectifs de l\'année précédente...');
      console.log('🔍 PROVED ID:', provedId);
      console.log('🔍 Année actuelle:', anneeActuelle);

      const data = await rapportActiviteService.getPreviousYearEffectifs(provedId, anneeActuelle);
      console.log('✅ Effectifs de l\'année précédente récupérés:', data);

      // Stocker les effectifs de l'année précédente
      if (data.success && data.data?.effectifs) {
        setPreviousYearEffectifs(data.data.effectifs);
        toast.success('📊 Effectifs de l\'année précédente chargés avec succès !');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des effectifs:', error);
      toast.error('Erreur lors du chargement des effectifs de l\'année précédente');
    }
  };

  // Charger les effectifs de l'année précédente au montage du composant
  useEffect(() => {
    fetchPreviousYearData();
  }, []);

  // Vérifier l'existence d'un brouillon au montage
  useEffect(() => {
    const draft = loadDraftUtil();
    if (draft && draft.metadata) {
      console.log('🔍 Vérification du brouillon au montage:', {
        draftExists: !!draft,
        draftTimestamp: draft.metadata.lastSavedAt,
        formDataHasContent: !!(formData.identificationProved || formData.parametresCles?.nombreEcolesClasses || formData.introduction)
      });
      
      // Ne montrer le modal que si le brouillon n'a pas déjà été chargé
      // On vérifie si formData est encore la valeur par défaut
      const isDefaultData = !formData.identificationProved && 
                            !formData.parametresCles?.nombreEcolesClasses &&
                            !formData.introduction;
      
      // Si les données sont encore par défaut alors qu'on a un brouillon, afficher le modal
      if (isDefaultData) {
        console.log('⚠️ Données par défaut détectées malgré brouillon, affichage du modal');
        setExistingDraft(draft);
        setShowDraftModal(true);
      } else {
        console.log('✅ Brouillon déjà chargé dans formData');
      }
    }
  }, []); // Exécuter une seule fois au montage

  // Auto-save avec le hook personnalisé
  const autoSave = useAutoSave({
    key: 'rapport_draft',
    data: formData,
    delay: 30000, // 30 secondes
    enabled: true,
    customSave: (data) => {
      // Utiliser saveDraft pour maintenir la structure avec métadonnées
      saveDraft(data, currentSection);
    },
    onSave: () => {
      console.log('✅ Brouillon sauvegardé automatiquement');
    },
    onError: (error) => {
      console.error('❌ Erreur de sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde automatique');
    }
  });

  // Calculer le pourcentage de complétion
  const completionPercentage = calculateCompletionPercentage(formData);

  // Debug: afficher l'état du hook
  useEffect(() => {
    console.log('🔍 État AutoSave:', {
      lastSaved: autoSave.lastSaved,
      isSaving: autoSave.isSaving,
      hasUnsavedChanges: autoSave.hasUnsavedChanges,
      completionPercentage
    });
  }, [autoSave.lastSaved, autoSave.isSaving, autoSave.hasUnsavedChanges, completionPercentage]);

  // Debug: surveiller les changements de formData
  useEffect(() => {
    console.log('🔄 formData a changé:', {
      hasIdentification: !!formData.identificationProved,
      hasParametres: !!formData.parametresCles?.nombreEcolesClasses,
      hasIntroduction: !!formData.introduction,
      firstIdentificationField: formData.identificationProved,
      timestamp: new Date().toISOString()
    });
  }, [formData]);

  // Sauvegarder avant de quitter la page
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (autoSave.hasUnsavedChanges) {
        // Sauvegarder rapidement
        saveDraft(formData, currentSection);
        
        // Afficher le warning
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [formData, currentSection, autoSave.hasUnsavedChanges]);

  // Calculer automatiquement les taux d'accroissement quand les effectifs changent
  useEffect(() => {
    console.log('🔍 useEffect calcul taux - previousYearEffectifs:', previousYearEffectifs);
    console.log('🔍 useEffect calcul taux - effectifScolaire changé:', formData.parametresCles?.effectifScolaire);
    
    if (previousYearEffectifs) {
      // Délai pour s'assurer que setFormData a fini de s'exécuter
      setTimeout(() => {
        updateGrowthRates();
      }, 50);
    }
  }, [formData.parametresCles?.effectifScolaire, previousYearEffectifs]);

  // Surveiller TOUS les changements de formData pour détecter les modifications d'effectifs
  useEffect(() => {
    if (previousYearEffectifs) {
      // Délai pour éviter les boucles infinies
      const timeoutId = setTimeout(() => {
        updateGrowthRates();
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [formData]);

  // Sauvegarder automatiquement en brouillon toutes les 30 secondes (TEMPORAIREMENT DÉSACTIVÉ)
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     localStorage.setItem('rapportActiviteDraft', JSON.stringify(formData));
  //     console.log('🔍 Brouillon sauvegardé automatiquement');
  //   }, 30000); // 30 secondes

  //   return () => clearInterval(interval);
  // }, [formData]);

  // Sauvegarder en brouillon manuellement
  const saveDraftManually = async () => {
    console.log('🔍 Début de la sauvegarde du brouillon');
    setSavingDraft(true);
    
    try {
      const draftData = JSON.stringify(formData);
      console.log('🔍 Données à sauvegarder:', draftData);
      
      localStorage.setItem('rapportActiviteDraft', draftData);
      console.log('🔍 Brouillon sauvegardé dans localStorage');
      
      // Vérifier que la sauvegarde a fonctionné
      const savedData = localStorage.getItem('rapportActiviteDraft');
      console.log('🔍 Vérification - données sauvegardées:', savedData);
      
      if (savedData) {
        toast.success('✅ Brouillon sauvegardé localement !');
        console.log('🔍 Toast de succès affiché');
      } else {
        toast.error('❌ Erreur: Impossible de sauvegarder le brouillon');
        console.log('🔍 Toast d\'erreur affiché');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde du brouillon:', error);
      toast.error('❌ Erreur lors de la sauvegarde du brouillon');
    } finally {
      setSavingDraft(false);
      console.log('🔍 Fin de la sauvegarde du brouillon');
    }
  };

  // Effacer le brouillon
  const clearDraft = () => {
    console.log('🔍 Début de l\'effacement du brouillon');
    
    try {
      // Vérifier s'il y a un brouillon avant de l'effacer
      const existingDraft = localStorage.getItem('rapportActiviteDraft');
      console.log('🔍 Brouillon existant:', existingDraft ? 'Oui' : 'Non');
      
      localStorage.removeItem('rapportActiviteDraft');
      console.log('🔍 Brouillon supprimé de localStorage');
      
      // Vérifier que la suppression a fonctionné
      const checkDraft = localStorage.getItem('rapportActiviteDraft');
      console.log('🔍 Vérification - brouillon après suppression:', checkDraft ? 'Existe encore' : 'Supprimé');
      
      setFormData(loadDraft());
      console.log('🔍 Formulaire réinitialisé');
      
      if (!checkDraft) {
        toast.success('✅ Brouillon effacé avec succès !');
        console.log('🔍 Toast de succès affiché');
      } else {
        toast.error('❌ Erreur: Impossible d\'effacer le brouillon');
        console.log('🔍 Toast d\'erreur affiché');
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'effacement du brouillon:', error);
      toast.error('❌ Erreur lors de l\'effacement du brouillon');
    }
    
    console.log('🔍 Fin de l\'effacement du brouillon');
  };

  // Fonction globale pour mettre à jour les taux d'accroissement
  const updateGrowthRates = () => {
    if (!previousYearEffectifs) {
      console.log('❌ Pas de données année précédente pour le calcul');
      return;
    }

    console.log('🔄 Mise à jour des taux d\'accroissement...');
    console.log('🔍 Données année précédente COMPLÈTES:', previousYearEffectifs);
    console.log('🔍 Structure niveauPrescolaire:', previousYearEffectifs.niveauPrescolaire);
    console.log('🔍 Structure niveauPrimaire:', previousYearEffectifs.niveauPrimaire);
    console.log('🔍 Structure niveauSecondaire:', previousYearEffectifs.niveauSecondaire);

    setFormData(prev => {
      const updated = JSON.parse(JSON.stringify(prev)); // Deep clone
      let hasChanges = false;
      let changesCount = 0;

      // Niveau Préscolaire (y compris enseignement spécial)
      ['espaceCommunautaireEveil', 'maternel', 'prePrimaire', 'special'].forEach((niveau: string) => {
        const prevData = (previousYearEffectifs.niveauPrescolaire as any)?.[niveau];
        const currentData = (updated.parametresCles?.effectifScolaire?.niveauPrescolaire as any)?.[niveau];

        // Log spécial pour l'enseignement spécial
        if (niveau === 'special') {
          console.log('🎯 ENSEIGNEMENT SPÉCIAL PRÉSCOLAIRE DEBUG:');
          console.log('🔍 prevData:', prevData);
          console.log('🔍 currentData:', currentData);
          console.log('🔍 prevData exists:', !!prevData);
          console.log('🔍 currentData exists:', !!currentData);
        }

        if (prevData && currentData) {
          console.log(`🔍 Préscolaire ${niveau} - Prev:`, prevData, 'Current:', currentData);
          
          const prevGF = prevData.effectifGarconsFilles || 0;
          const currentGF = currentData.effectifGarconsFilles || 0;
          const prevF = prevData.effectifFilles || 0;
          const currentF = currentData.effectifFilles || 0;

          if (niveau === 'special') {
            console.log(`🎯 SPÉCIAL - prevGF: ${prevGF}, currentGF: ${currentGF}`);
            console.log(`🎯 SPÉCIAL - prevF: ${prevF}, currentF: ${currentF}`);
          }

          // Taux G+F
          if (prevGF > 0 && currentGF > 0) {
            const taux = Math.round(((currentGF - prevGF) / prevGF) * 100 * 1000) / 1000;
            if (currentData.tauxAccroissementGarconsFilles !== taux) {
              console.log(`✅ Préscolaire ${niveau} - Taux G+F: ${currentData.tauxAccroissementGarconsFilles}% → ${taux}% (${prevGF} → ${currentGF})`);
              currentData.tauxAccroissementGarconsFilles = taux;
              hasChanges = true;
              changesCount++;
            } else if (niveau === 'special') {
              console.log(`⚠️ SPÉCIAL - Taux G+F déjà correct: ${taux}%`);
            }
          } else if (niveau === 'special') {
            console.log(`⚠️ SPÉCIAL - Conditions non remplies: prevGF=${prevGF}, currentGF=${currentGF}`);
          }
          
          // Taux F
          if (prevF > 0 && currentF > 0) {
            const taux = Math.round(((currentF - prevF) / prevF) * 100 * 1000) / 1000;
            if (currentData.tauxAccroissementFilles !== taux) {
              console.log(`✅ Préscolaire ${niveau} - Taux F: ${currentData.tauxAccroissementFilles}% → ${taux}% (${prevF} → ${currentF})`);
              currentData.tauxAccroissementFilles = taux;
              hasChanges = true;
              changesCount++;
            } else if (niveau === 'special') {
              console.log(`⚠️ SPÉCIAL - Taux F déjà correct: ${taux}%`);
            }
          } else if (niveau === 'special') {
            console.log(`⚠️ SPÉCIAL - Conditions Taux F non remplies: prevF=${prevF}, currentF=${currentF}`);
          }
        } else {
          console.log(`❌ Préscolaire ${niveau} - Données manquantes - Prev:`, !!prevData, 'Current:', !!currentData);
          if (niveau === 'special') {
            console.log('❌ SPÉCIAL PRÉSCOLAIRE - Données manquantes!');
          }
        }
      });

      // Niveau Primaire (y compris enseignement spécial)
      ['enseignementSpecial', 'enseignementPrimaire'].forEach((niveau: string) => {
        const prevData = (previousYearEffectifs.niveauPrimaire as any)?.[niveau];
        const currentData = (updated.parametresCles?.effectifScolaire?.niveauPrimaire as any)?.[niveau];

        // Log spécial pour l'enseignement spécial primaire
        if (niveau === 'enseignementSpecial') {
          console.log('🎯 ENSEIGNEMENT SPÉCIAL PRIMAIRE DEBUG:');
          console.log('🔍 prevData:', prevData);
          console.log('🔍 currentData:', currentData);
          console.log('🔍 prevData exists:', !!prevData);
          console.log('🔍 currentData exists:', !!currentData);
        }

        if (prevData && currentData) {
          console.log(`🔍 Primaire ${niveau} - Prev:`, prevData, 'Current:', currentData);
          
          const prevGF = prevData.effectifGarconsFilles || 0;
          const currentGF = currentData.effectifGarconsFilles || 0;
          const prevF = prevData.effectifFilles || 0;
          const currentF = currentData.effectifFilles || 0;

          if (niveau === 'enseignementSpecial') {
            console.log(`🎯 SPÉCIAL PRIMAIRE - prevGF: ${prevGF}, currentGF: ${currentGF}`);
            console.log(`🎯 SPÉCIAL PRIMAIRE - prevF: ${prevF}, currentF: ${currentF}`);
          }

          // Taux G+F
          if (prevGF > 0 && currentGF > 0) {
            const taux = Math.round(((currentGF - prevGF) / prevGF) * 100 * 1000) / 1000;
            if (currentData.tauxAccroissementGarconsFilles !== taux) {
              console.log(`✅ Primaire ${niveau} - Taux G+F: ${currentData.tauxAccroissementGarconsFilles}% → ${taux}% (${prevGF} → ${currentGF})`);
              currentData.tauxAccroissementGarconsFilles = taux;
              hasChanges = true;
              changesCount++;
            } else if (niveau === 'enseignementSpecial') {
              console.log(`⚠️ SPÉCIAL PRIMAIRE - Taux G+F déjà correct: ${taux}%`);
            }
          } else if (niveau === 'enseignementSpecial') {
            console.log(`⚠️ SPÉCIAL PRIMAIRE - Conditions non remplies: prevGF=${prevGF}, currentGF=${currentGF}`);
          }
          
          // Taux F
          if (prevF > 0 && currentF > 0) {
            const taux = Math.round(((currentF - prevF) / prevF) * 100 * 1000) / 1000;
            if (currentData.tauxAccroissementFilles !== taux) {
              console.log(`✅ Primaire ${niveau} - Taux F: ${currentData.tauxAccroissementFilles}% → ${taux}% (${prevF} → ${currentF})`);
              currentData.tauxAccroissementFilles = taux;
              hasChanges = true;
              changesCount++;
            } else if (niveau === 'enseignementSpecial') {
              console.log(`⚠️ SPÉCIAL PRIMAIRE - Taux F déjà correct: ${taux}%`);
            }
          } else if (niveau === 'enseignementSpecial') {
            console.log(`⚠️ SPÉCIAL PRIMAIRE - Conditions Taux F non remplies: prevF=${prevF}, currentF=${currentF}`);
          }
        } else {
          console.log(`❌ Primaire ${niveau} - Données manquantes - Prev:`, !!prevData, 'Current:', !!currentData);
          if (niveau === 'enseignementSpecial') {
            console.log('❌ SPÉCIAL PRIMAIRE - Données manquantes!');
          }
        }
      });

      // Niveau Secondaire - Enseignement Spécial
      const prevSecSpecial = previousYearEffectifs.niveauSecondaire?.enseignementSpecial;
      const currentSecSpecial = updated.parametresCles?.effectifScolaire?.niveauSecondaire?.enseignementSpecial;

      console.log('🎯 ENSEIGNEMENT SPÉCIAL SECONDAIRE DEBUG:');
      console.log('🔍 prevSecSpecial:', prevSecSpecial);
      console.log('🔍 currentSecSpecial:', currentSecSpecial);
      console.log('🔍 prevSecSpecial exists:', !!prevSecSpecial);
      console.log('🔍 currentSecSpecial exists:', !!currentSecSpecial);

      if (prevSecSpecial && currentSecSpecial) {
        console.log(`🔍 Secondaire Enseignement Spécial - Prev:`, prevSecSpecial, 'Current:', currentSecSpecial);
        
        const prevG = prevSecSpecial.effectifGarcons || 0;
        const currentG = currentSecSpecial.effectifGarcons || 0;
        const prevF = prevSecSpecial.effectifFilles || 0;
        const currentF = currentSecSpecial.effectifFilles || 0;

        console.log(`🎯 SPÉCIAL SECONDAIRE - prevG: ${prevG}, currentG: ${currentG}`);
        console.log(`🎯 SPÉCIAL SECONDAIRE - prevF: ${prevF}, currentF: ${currentF}`);

        // Taux Garçons
        if (prevG > 0 && currentG > 0) {
          const taux = Math.round(((currentG - prevG) / prevG) * 100 * 1000) / 1000;
          if (currentSecSpecial.tauxGarcons !== taux) {
            console.log(`✅ Secondaire Enseignement Spécial - Taux G: ${currentSecSpecial.tauxGarcons}% → ${taux}% (${prevG} → ${currentG})`);
            currentSecSpecial.tauxGarcons = taux;
            hasChanges = true;
            changesCount++;
          } else {
            console.log(`⚠️ SPÉCIAL SECONDAIRE - Taux G déjà correct: ${taux}%`);
          }
        } else {
          console.log(`⚠️ SPÉCIAL SECONDAIRE - Conditions Taux G non remplies: prevG=${prevG}, currentG=${currentG}`);
        }
        
        // Taux Filles
        if (prevF > 0 && currentF > 0) {
          const taux = Math.round(((currentF - prevF) / prevF) * 100 * 1000) / 1000;
          if (currentSecSpecial.tauxFilles !== taux) {
            console.log(`✅ Secondaire Enseignement Spécial - Taux F: ${currentSecSpecial.tauxFilles}% → ${taux}% (${prevF} → ${currentF})`);
            currentSecSpecial.tauxFilles = taux;
            hasChanges = true;
            changesCount++;
          } else {
            console.log(`⚠️ SPÉCIAL SECONDAIRE - Taux F déjà correct: ${taux}%`);
          }
        } else {
          console.log(`⚠️ SPÉCIAL SECONDAIRE - Conditions Taux F non remplies: prevF=${prevF}, currentF=${currentF}`);
        }
      } else {
        console.log(`❌ Secondaire Enseignement Spécial - Données manquantes - Prev:`, !!prevSecSpecial, 'Current:', !!currentSecSpecial);
        console.log('❌ SPÉCIAL SECONDAIRE - Données manquantes!');
      }

      // Niveau Secondaire - Enseignement Secondaire
      ['septiemeCTEB', 'huitiemeCTEB', 'premiereHumanite', 'quatriemeHumanite'].forEach((classe: string) => {
        const prevData = (previousYearEffectifs.niveauSecondaire?.enseignementSecondaire as any)?.[classe];
        const currentData = (updated.parametresCles?.effectifScolaire?.niveauSecondaire?.enseignementSecondaire as any)?.[classe];

        if (prevData && currentData) {
          const prevG = prevData.effectifGarcons || 0;
          const currentG = currentData.effectifGarcons || 0;
          const prevF = prevData.effectifFilles || 0;
          const currentF = currentData.effectifFilles || 0;

          if (prevG > 0 && currentG > 0) {
            const taux = Math.round(((currentG - prevG) / prevG) * 100 * 1000) / 1000;
            if (currentData.tauxGarcons !== taux) {
              console.log(`✅ ${classe} - Taux G: ${currentData.tauxGarcons}% → ${taux}%`);
              currentData.tauxGarcons = taux;
              hasChanges = true;
              changesCount++;
            }
          }
          if (prevF > 0 && currentF > 0) {
            const taux = Math.round(((currentF - prevF) / prevF) * 100 * 1000) / 1000;
            if (currentData.tauxFilles !== taux) {
              console.log(`✅ ${classe} - Taux F: ${currentData.tauxFilles}% → ${taux}%`);
              currentData.tauxFilles = taux;
              hasChanges = true;
              changesCount++;
            }
          }
        }
      });

      console.log(`🎯 Calcul terminé - ${changesCount} taux mis à jour`);
      return hasChanges ? updated : prev;
    });
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => {
      const updated = { ...prev };
      
      // Arrondir les valeurs numériques à 2 décimales
      const finalValue = typeof value === 'number' ? Math.round(value * 100) / 100 : value;
      
      // Mettre à jour la valeur
      const keys = field.split('.');
      let current: any = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = finalValue;
      
      return updated;
    });
    
    // Recalculer les taux après mise à jour
    setTimeout(() => updateGrowthRates(), 100);
  };

  // Fonctions de gestion du brouillon
  const handleRestoreDraft = () => {
    if (existingDraft) {
      const restoredData = existingDraft.formData;
      
      // Corriger le format de l'année si nécessaire
      if (restoredData.annee && !restoredData.annee.toString().includes('-')) {
        const year = parseInt(restoredData.annee.toString());
        restoredData.annee = `${year}-${year + 1}`;
      }
      
      setFormData(restoredData);
      setCurrentSection(existingDraft.metadata.currentSection);
      setShowDraftModal(false);
      toast.success('Brouillon restauré avec succès !');
    }
  };

  const handleDiscardDraft = () => {
    deleteDraft();
    setShowDraftModal(false);
    setExistingDraft(null);
    toast.success('Brouillon supprimé');
  };

  const handleCancelDraftModal = () => {
    setShowDraftModal(false);
    // Ne pas charger le brouillon, continuer avec un formulaire vide
  };

  // DEBUG: Afficher le contenu du localStorage
  const debugLocalStorage = () => {
    console.log('=== DEBUG LOCALSTORAGE ===');
    const draft = localStorage.getItem('rapport_draft');
    const timestamp = localStorage.getItem('rapport_draft_timestamp');
    const oldDraft = localStorage.getItem('rapportActiviteDraft');
    
    console.log('rapport_draft existe:', !!draft);
    console.log('rapport_draft_timestamp:', timestamp);
    console.log('rapportActiviteDraft existe:', !!oldDraft);
    
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        console.log('Structure rapport_draft:', {
          hasFormData: !!parsed.formData,
          hasMetadata: !!parsed.metadata,
          formDataKeys: parsed.formData ? Object.keys(parsed.formData) : [],
          metadataKeys: parsed.metadata ? Object.keys(parsed.metadata) : []
        });
        console.log('Premier champ identificationProved:', parsed.formData?.identificationProved);
      } catch (e) {
        console.error('Erreur parsing rapport_draft:', e);
      }
    }
    
    console.log('=== FIN DEBUG ===');
  };

  const handleSaveDraftButton = () => {
    try {
      saveDraft(formData, currentSection);
      toast.success('Brouillon enregistré !');
      navigate('/rapport-activite');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du brouillon:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Récupérer l'ID de la PROVED depuis le token
      const token = localStorage.getItem('token');
      let provedId = '';
      
      if (token) {
        try {
          const tokenPayload = JSON.parse(atob(token.split('.')[1]));
          provedId = tokenPayload._id || '';
          console.log('🔍 ID PROVED extrait du token:', provedId);
        } catch (error) {
          console.error('Erreur lors du parsing du token:', error);
        }
      }

      // Corriger le format de l'année si nécessaire
      let anneeCorrigee = formData.annee;
      if (anneeCorrigee && !anneeCorrigee.toString().includes('-')) {
        const year = parseInt(anneeCorrigee.toString());
        anneeCorrigee = `${year}-${year + 1}`;
      }

      const createRequest = {
        identificationProved: provedId, // Envoyer l'ID comme string
        annee: anneeCorrigee,
        introduction: formData.introduction,
        parametresCles: formData.parametresCles,
        personnel: formData.personnel,
        realisations: formData.realisations,
        conclusion: formData.conclusion,
        statut: 'soumis' // Statut automatiquement défini à "soumis"
      };
      
      console.log('🔍 Données à envoyer:', createRequest);
      await rapportActiviteService.createRapport(createRequest);
      
      // Effacer le brouillon après envoi réussi
      deleteDraft();
      autoSave.clearDraft();
      
      toast.success('Rapport d\'activité créé avec succès !');
      navigate('/rapport-activite');
    } catch (error) {
      console.error('Erreur lors de la création du rapport:', error);
      toast.error('Erreur lors de la création du rapport d\'activité');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Modal de récupération de brouillon */}
      {showDraftModal && existingDraft && (
        <DraftRecoveryModal
          draft={existingDraft}
          onRestore={handleRestoreDraft}
          onDiscard={handleDiscardDraft}
          onCancel={handleCancelDraftModal}
        />
      )}

      {/* Indicateur de brouillon */}
      <DraftIndicator
        lastSaved={autoSave?.lastSaved || null}
        isSaving={autoSave?.isSaving || false}
        hasUnsavedChanges={autoSave?.hasUnsavedChanges || false}
        completionPercentage={completionPercentage || 0}
        onForceSave={autoSave?.forceSave}
        error={autoSave?.error || null}
      />

      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-title-md2 font-semibold text-black dark:text-white">
            Créer un rapport d'activité
          </h2>
          
          {/* Boutons de brouillon en haut */}
          {/* <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSaveDraftButton}
              disabled={savingDraft}
              className="inline-flex items-center justify-center rounded-md border border-blue-500 bg-blue-50 py-2 px-4 text-center font-medium text-blue-600 hover:bg-blue-100 disabled:opacity-50 gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              {savingDraft ? 'Sauvegarde...' : 'Continuer plus tard'}
            </button>
            <button
              type="button"
              onClick={clearDraft}
              className="inline-flex items-center justify-center rounded-md border border-red-500 bg-red-50 py-2 px-4 text-center font-medium text-red-600 hover:bg-red-100"
            >
              Effacer brouillon
            </button>
          </div> */}
        </div>

        {/* <AutoFillBanner formData={formData} setFormData={setFormData} /> */}

        {/* Bannière des effectifs de l'année précédente */}
        {previousYearEffectifs && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-green-800 font-semibold">Effectifs de l'année précédente chargés</h3>
                </div>
                <p className="text-green-700 text-sm">
                  Les taux d'accroissement seront calculés automatiquement lorsque vous saisirez les effectifs de l'année en cours.
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
                        <BasicInfo formData={formData} handleInputChange={handleInputChange} />
              <ParametresCles formData={formData} setFormData={setFormData} />
              <ParametresClesComplete formData={formData} setFormData={setFormData} />
              <Personnel formData={formData} setFormData={setFormData} />
              <EvaluationQualitative formData={formData} setFormData={setFormData} />
              <EvaluationQualitativeComplete formData={formData} setFormData={setFormData} autoSaveForceSave={autoSave?.forceSave} />
              <Realisations formData={formData} setFormData={setFormData} autoSaveForceSave={autoSave?.forceSave} />
              <RealisationsComplete formData={formData} setFormData={setFormData} />
              <Gouvernance formData={formData} setFormData={setFormData} autoSaveForceSave={autoSave?.forceSave} />
              <EducationUrgence formData={formData} setFormData={setFormData} />
              <Conclusion formData={formData} handleInputChange={handleInputChange} />

          {/* Boutons d'action en bas */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/rapport-activite')}
              className="inline-flex items-center justify-center rounded-md border border-stroke bg-white py-2 px-10 text-center font-medium text-black hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              Annuler
            </button>
      
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 disabled:opacity-50"
            >
              {loading ? 'Création...' : 'Soumettre le rapport'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateRapportActivite; 