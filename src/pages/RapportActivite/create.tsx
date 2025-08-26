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

const CreateRapportActivite: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  
  // Charger les données du brouillon local au démarrage
  const loadDraft = (): RapportActivite => {
    const savedDraft = localStorage.getItem('rapportActiviteDraft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        console.log('🔍 Brouillon chargé:', draft);
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
      annee: new Date().getFullYear(),
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
              classesPlethoriques: '-'
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
            primaire: 0,
            secondaire: 0,
            sourceFinancement: ''
          },
          nouveauxBancsTables: {
            prescolaire: 0,
            primaire: 0,
            secondaire: 0,
            sourceFinancement: ''
          },
          nouvellesLatrines: {
            prescolaire: 0,
            primaire: 0,
            secondaire: 0,
            sourceFinancement: ''
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
            prescolaire: 'BON',
            primaire: 'BON',
            secondaire: 'BON'
          },
          manuelsScolaires: {
            prescolaire: 'BON',
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
    const initialData = loadDraft();
    const completeData = ensureCompleteInitialization(initialData);
    console.log('🔍 Données initiales complètes chargées:', completeData);
    return completeData;
  });

  // Sauvegarder automatiquement en brouillon toutes les 30 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      localStorage.setItem('rapportActiviteDraft', JSON.stringify(formData));
      console.log('🔍 Brouillon sauvegardé automatiquement');
    }, 30000); // 30 secondes

    return () => clearInterval(interval);
  }, [formData]);

  // Sauvegarder en brouillon manuellement
  const saveDraft = async () => {
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

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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

      const createRequest = {
        identificationProved: provedId, // Envoyer l'ID comme string
        annee: formData.annee,
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
      localStorage.removeItem('rapportActiviteDraft');
      
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
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-title-md2 font-semibold text-black dark:text-white">
            Créer un rapport d'activité
          </h2>
          
          {/* Boutons de brouillon en haut */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={saveDraft}
              disabled={savingDraft}
              className="inline-flex items-center justify-center rounded-md border border-blue-500 bg-blue-50 py-2 px-4 text-center font-medium text-blue-600 hover:bg-blue-100 disabled:opacity-50"
            >
              {savingDraft ? 'Sauvegarde...' : 'Sauvegarder brouillon'}
            </button>
            <button
              type="button"
              onClick={clearDraft}
              className="inline-flex items-center justify-center rounded-md border border-red-500 bg-red-50 py-2 px-4 text-center font-medium text-red-600 hover:bg-red-100"
            >
              Effacer brouillon
            </button>
          </div>
        </div>

        <AutoFillBanner formData={formData} setFormData={setFormData} />

        <form onSubmit={handleSubmit} className="space-y-6">
                        <BasicInfo formData={formData} handleInputChange={handleInputChange} />
              <ParametresCles formData={formData} setFormData={setFormData} />
              <ParametresClesComplete formData={formData} setFormData={setFormData} />
              <Personnel formData={formData} setFormData={setFormData} />
              <EvaluationQualitative />
              <EvaluationQualitativeComplete />
              <Realisations formData={formData} setFormData={setFormData} />
              <RealisationsComplete formData={formData} setFormData={setFormData} />
              <Gouvernance formData={formData} setFormData={setFormData} />
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