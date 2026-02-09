// Types pour les paramètres clés
interface NombreEcolesClasses {
  niveauPrescolaire: {
    espaceCommunautaireEveil: {
      nombreEcoles: number;
      nombreClasses: number;
    };
    maternel: {
      nombreEcoles: number;
      nombreClasses: number;
    };
    prePrimaire: {
      nombreEcoles: number;
      nombreClasses: number;
    };
    special: {
      nombreEcoles: number;
      nombreClasses: number;
    };
  };
  niveauPrimaire: {
    enseignementSpecial: {
      nombreEcoles: number;
      totalClassesSpecialesPrim: number;
      classesPlethoriques: number;
    };
    enseignementPrimaire: {
      nombreEcoles: number;
      totalClassesPrimaire: number;
      classesPlethoriques: number | string;
    };
  };
  niveauSecondaire: {
    enseignementSpecial: {
      nombreEcoles: number;
      totalClassesSpecialesSec: number;
    };
    enseignementSecondaire: {
      nombreEcoles: number;
      premierCycle: {
        classes7emeCTEB: number;
        classes8emeCTEB: number;
      };
      deuxiemeCycle: {
        totalClassesHumanites: number;
      };
      totalClasses1er2emeCycle: number;
    };
  };
}

interface EffectifScolaire {
  niveauPrescolaire: {
    espaceCommunautaireEveil: {
      effectifGarconsFilles: number;
      effectifFilles: number;
      tauxAccroissementGarconsFilles: number;
      tauxAccroissementFilles: number;
    };
    maternel: {
      effectifGarconsFilles: number;
      effectifFilles: number;
      tauxAccroissementGarconsFilles: number;
      tauxAccroissementFilles: number;
    };
    prePrimaire: {
      effectifGarconsFilles: number;
      effectifFilles: number;
      tauxAccroissementGarconsFilles: number;
      tauxAccroissementFilles: number;
    };
    special: {
      effectifGarconsFilles: number;
      effectifFilles: number;
      tauxAccroissementGarconsFilles: number;
      tauxAccroissementFilles: number;
    };
  };
  niveauPrimaire: {
    enseignementSpecial: {
      effectifGarconsFilles: number;
      effectifFilles: number;
      tauxAccroissementGarconsFilles: number;
      tauxAccroissementFilles: number;
    };
    enseignementPrimaire: {
      effectifGarconsFilles: number;
      effectifFilles: number;
      tauxAccroissementGarconsFilles: number;
      tauxAccroissementFilles: number;
    };
  };
  niveauSecondaire: {
    enseignementSpecial: {
      effectifGarcons: number;
      effectifFilles: number;
      tauxGarcons: number;
      tauxFilles: number;
    };
    enseignementSecondaire: {
      septiemeCTEB: {
        effectifGarcons: number;
        effectifFilles: number;
        tauxGarcons: number;
        tauxFilles: number;
      };
      huitiemeCTEB: {
        effectifGarcons: number;
        effectifFilles: number;
        tauxGarcons: number;
        tauxFilles: number;
      };
      premiereHumanite: {
        effectifGarcons: number;
        effectifFilles: number;
        tauxGarcons: number;
        tauxFilles: number;
      };
      quatriemeHumanite: {
        effectifGarcons: number;
        effectifFilles: number;
        tauxGarcons: number;
        tauxFilles: number;
      };
    };
  };
}

export interface RapportActivite {
  _id?: string;
  id?: string; // Ajouté pour compatibilité avec la réponse API
  identificationProved: {
    role?: string;
    _id?: string;
    provinceAdministrative: string;
    provinceEducationnelle: string;
    chefLieuProved: string;
    emailProfessionnel: string;
    telephone: string;
    statutOccupation: string;
    nombreTerritoires: number;
    nombreSousDivisions: number;
    directeurProvincial: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
  };
  introduction?: string;
  
    parametresCles: {
    nombreEcolesClasses: NombreEcolesClasses;
    effectifScolaire: EffectifScolaire;
  };

  personnel: {
    personnelEnseignant: {
      niveauPrescolaire: {
        enseignementPrescolaireSpecial: {
          hommes: number;
          femmes: number;
        };
        enseignementPrescolaire: {
          hommes: number;
          femmes: number;
        };
      };
      niveauPrimaire: {
        enseignementPrescolaireSpecial: {
          hommes: number;
          femmes: number;
        };
        enseignementPrimaire: {
          hommes: number;
          femmes: number;
        };
      };
      niveauSecondaire: {
        enseignementPrescolaireSpecial: {
          hommes: number;
          femmes: number;
        };
        enseignementSecondaire: {
          hommes: number;
          femmes: number;
        };
      };
    };
    personnelAdministratif: {
      directionProvinciale: {
        hommes: number;
        femmes: number;
      };
      inspectionPrincipale: {
        hommes: number;
        femmes: number;
      };
      dinacope: {
        hommes: number;
        femmes: number;
      };
      sernie: {
        hommes: number;
        femmes: number;
      };
      coordinationProvinciale: {
        hommes: number;
        femmes: number;
      };
      sousDivision: {
        hommes: number;
        femmes: number;
      };
      poolsInspectionPrimaire: {
        hommes: number;
        femmes: number;
      };
      poolsInspectionSecondaire: {
        hommes: number;
        femmes: number;
      };
      antenneDinacope: {
        hommes: number;
        femmes: number;
      };
      antenneSernie: {
        hommes: number;
        femmes: number;
      };
      coordinationDiocesaine: {
        hommes: number;
        femmes: number;
      };
      sousCoordinationConventionnees: {
        hommes: number;
        femmes: number;
      };
      conseillerieResidente: {
        hommes: number;
        femmes: number;
      };
    };
  };

  realisations: {
    accesAccessibiliteEquite: {
      nouvellesSallesClasses: {
        prescolaire: number;
        sourceFinancementPrescolaire?: string;
        primaire: number;
        sourceFinancementPrimaire?: string;
        secondaire: number;
        sourceFinancementSecondaire?: string;
      };
      nouveauxBancsTables: {
        prescolaire: number;
        sourceFinancementPrescolaire?: string;
        primaire: number;
        sourceFinancementPrimaire?: string;
        secondaire: number;
        sourceFinancementSecondaire?: string;
      };
      nouvellesLatrines: {
        prescolaire: number;
        sourceFinancementPrescolaire?: string;
        primaire: number;
        sourceFinancementPrimaire?: string;
        secondaire: number;
        sourceFinancementSecondaire?: string;
      };
      gratuitéEnseignementPrimaire?: string;
      sensibilisation: {
        filles: boolean;
        enfantsHorsEcole: boolean;
        peuplesAutochtones: boolean;
      };
      cantinesScolaires: {
        prescolaire: number;
        primaire: number;
        secondaire: number;
        commentaire?: string;
      };
      indicateursAcces: {
        proportionNouveauxInscrits: number;
        tauxTransitionPrimaireCTEB: number;
        tauxTransitionCTEBHumanites: number;
      };
    };
  };

  ameliorationQualite: {
    disponibiliteMoyensEnseignement: {
      programmesScolaires: {
        prescolaire: 'TRES BON' | 'BON' | 'CARENCE';
        primaire: 'TRES BON' | 'BON' | 'CARENCE';
        secondaire: 'TRES BON' | 'BON' | 'CARENCE';
      };
      manuelsScolaires: {
        prescolaire: 'TRES BON' | 'BON' | 'CARENCE';
        primaire: 'TRES BON' | 'BON' | 'CARENCE';
        secondaire: 'TRES BON' | 'BON' | 'CARENCE';
      };
      materielsDidactiques: {
        prescolaire: 'TRES BON' | 'BON' | 'CARENCE';
        primaire: 'TRES BON' | 'BON' | 'CARENCE';
        secondaire: 'TRES BON' | 'BON' | 'CARENCE';
      };
      laboratoires: {
        chimie: 'TRES BON' | 'BON' | 'CARENCE';
        biologie: 'TRES BON' | 'BON' | 'CARENCE';
        physique: 'TRES BON' | 'BON' | 'CARENCE';
      };
      equipementsAteliers: {
        humanitesTechniques: 'TRES BON' | 'BON' | 'CARENCE';
      };
    };
    visitesEtReunions: {
      visitesClasses: {
        prescolaire: 'TRES BON' | 'BON' | 'ASSEZ BON';
        primaire: 'TRES BON' | 'BON' | 'ASSEZ BON';
        secondaire: 'TRES BON' | 'BON' | 'ASSEZ BON';
        special: 'TRES BON' | 'BON' | 'ASSEZ BON';
      };
      reunionsPedagogiques: {
        prescolaire: 'TRES BON' | 'BON' | 'ASSEZ BON';
        primaire: 'TRES BON' | 'BON' | 'ASSEZ BON';
        secondaire: 'TRES BON' | 'BON' | 'ASSEZ BON';
      };
      fonctionnementCelluleBase: {
        prescolaire: 'TRES BON' | 'BON' | 'ASSEZ BON';
        primaire: 'TRES BON' | 'BON' | 'ASSEZ BON';
        secondaire: 'TRES BON' | 'BON' | 'ASSEZ BON';
        special: 'TRES BON' | 'BON' | 'ASSEZ BON';
      };
    };
    activitesInspectorales: {
      inspectionsPedagogiquesC3: {
        prescolaire: {
          nombrePrevu: number;
          nombreRealise: number;
          pourcentageRealisation: number;
        };
        primaire: {
          nombrePrevu: number;
          nombreRealise: number;
          pourcentageRealisation: number;
        };
        secondaire: {
          nombrePrevu: number;
          nombreRealise: number;
          pourcentageRealisation: number;
        };
        special: {
          nombrePrevu: number;
          nombreRealise: number;
          pourcentageRealisation: number;
        };
      };
      inspectionsFormation: {
        prescolaire: {
          nombrePrevu: number;
          nombreRealise: number;
          pourcentageRealisation: number;
        };
        primaire: {
          nombrePrevu: number;
          nombreRealise: number;
          pourcentageRealisation: number;
        };
        secondaire: {
          nombrePrevu: number;
          nombreRealise: number;
          pourcentageRealisation: number;
        };
        special: {
          nombrePrevu: number;
          nombreRealise: number;
          pourcentageRealisation: number;
        };
      };
      formationContinue: {
        prescolaire: 'TRES BON' | 'BON' | 'CARENCE';
        primaire: 'TRES BON' | 'BON' | 'CARENCE';
        secondaire: 'TRES BON' | 'BON' | 'CARENCE';
        special: 'TRES BON' | 'BON' | 'CARENCE';
      };
    };
    indicateursRendement: {
      rendementInterne: {
        prescolaire: {
          tauxAbandon: number;
          tauxReussite: number;
          tauxEchec: number;
        };
        primaire: {
          tauxAbandon: number;
          tauxReussite: number;
          tauxEchec: number;
        };
        secondaire: {
          tauxAbandon: number;
          tauxReussite: number;
          tauxEchec: number;
        };
      };
      rendementExterne: {
        examensCertificatifs: {
          tauxDiplomes: number;
          tauxHumanitesScientifiques: number;
          tauxHumanitesTechniques: number;
        };
      };
    };
  };

  gouvernance: {
    miseEnOeuvreSSEF: {
      niveauProvinceEducationnelle: {
        elaborationPAO: string;
        miseEnOeuvre: string;
        evaluationMiParcours: string;
        evaluationFinale: string;
      };
      niveauProvinceAdministrative: {
        elaborationPAO: string;
        miseEnOeuvre: string;
        evaluationMiParcours: string;
        evaluationFinale: string;
      };
    };
    inspectionsAdministrativesC2B: {
      prescolaire: {
        nombrePrevu: number;
        nombreRealise: number;
        pourcentageRealisation: number;
      };
      primaire: {
        nombrePrevu: number;
        nombreRealise: number;
        pourcentageRealisation: number;
      };
      secondaire: {
        nombrePrevu: number;
        nombreRealise: number;
        pourcentageRealisation: number;
      };
      special: {
        nombrePrevu: number;
        nombreRealise: number;
        pourcentageRealisation: number;
      };
    };
    comitesProvinciaux: {
      comiteEDUNC: {
        frequenceReunions: string;
        pointsTraites: string;
      };
      comiteENAFP: {
        frequenceReunions: string;
        pointsTraites: string;
      };
      comiteTENASOSP: {
        frequenceReunions: string;
        pointsTraites: string;
      };
      comiteExamenEtat: {
        frequenceReunions: string;
        pointsTraites: string;
      };
    };
    remunerationPersonnel: {
      directionProvinciale: {
        totalAgents: number;
        nonPayes: number;
      };
      inspectionPrincipale: {
        totalAgents: number;
        nonPayes: number;
      };
      dinacope: {
        totalAgents: number;
        nonPayes: number;
      };
      sernie: {
        totalAgents: number;
        nonPayes: number;
      };
      coordinationProvinciale: {
        totalAgents: number;
        nonPayes: number;
      };
      sousDivision: {
        totalAgents: number;
        nonPayes: number;
      };
      poolsInspectionPrimaire: {
        totalAgents: number;
        nonPayes: number;
      };
      poolsInspectionSecondaire: {
        totalAgents: number;
        nonPayes: number;
      };
      antenneDinacope: {
        totalAgents: number;
        nonPayes: number;
      };
      antenneSernie: {
        totalAgents: number;
        nonPayes: number;
      };
      coordinationDiocesaine: {
        totalAgents: number;
        nonPayes: number;
      };
      sousCoordinationConventionnees: {
        totalAgents: number;
        nonPayes: number;
      };
      conseillerieResidente: {
        totalAgents: number;
        nonPayes: number;
      };
    };
    vulgarisationInstructions: {
      instructionsOfficielles: string;
      nouvelleCitoyennete: string;
    };
    groupesAidesPsychopedagogiques: {
      nombreGAPMisEnPlace: number;
      nombreGAPOperationnel: number;
      nombreCasPrisEnCharge: number;
      problemesIdentifies: string;
      solutionsPreconisees: string;
    };
    acquisitionsMateriels: {
      ecoles: {
        nature: string;
        sourceFinancement: {
          gvt: number;
          projet: number;
          ptfs: number;
          ong: number;
        };
      };
      bureauxGestionnaires: {
        nature: string;
        sourceFinancement: {
          gvt: number;
          projet: number;
          ptfs: number;
          ong: number;
        };
      };
    };
    infrastructureBureaux: {
      directionProvinciale: {
        proprietaire: number;
        locataire: number;
      };
      inspectionPrincipale: {
        proprietaire: number;
        locataire: number;
      };
      dinacope: {
        proprietaire: number;
        locataire: number;
      };
      sernie: {
        proprietaire: number;
        locataire: number;
      };
      coordinationProvinciale: {
        proprietaire: number;
        locataire: number;
      };
      sousDivision: {
        proprietaire: number;
        locataire: number;
      };
      poolsInspectionPrimaire: {
        proprietaire: number;
        locataire: number;
      };
      poolsInspectionSecondaire: {
        proprietaire: number;
        locataire: number;
      };
      antenneDinacope: {
        proprietaire: number;
        locataire: number;
      };
      antenneSernie: {
        proprietaire: number;
        locataire: number;
      };
      coordinationDiocesaine: {
        proprietaire: number;
        locataire: number;
      };
      sousCoordinationConventionnees: {
        proprietaire: number;
        locataire: number;
      };
      conseillerieResidente: {
        proprietaire: number;
        locataire: number;
      };
    };
    totalInfrastructureBureaux: {
      totalProprietaire: number;
      totalLocataire: number;
    };
  };

  educationUrgence: {
    planStockContingence: {
      plan: string;
      stock: string;
    };
    catastrophesNaturelles: {
      nature: string;
      effetsNegatifs: string;
    };
    destructionSDC: {
      forcesNegatives: string;
    };
    solutionsLocales: string;
    reunionsClusterEducation: {
      frequence: string;
      pointsTraites: string;
    };
    recommandations: {
      espacesTemporairesApprentissage: {
        nombre: number;
        couts: string;
      };
      apprenantsScolarises: {
        cible: number;
      };
      formationEnseignantsESU: string;
    };
  };

  autresProblemes: {
    problemesSpecifiques: string;
  };

  conclusion?: string;
  statut: 'brouillon' | 'soumis' | 'approuve' | 'rejete';
  annee: number;
  fichierJoint?: string;
  createdBy?: string; // ObjectId reference
  updatedBy?: string; // ObjectId reference
  createdAt?: Date;
  updatedAt?: Date;
  totalEffectifs?: number; // Ajouté pour la réponse API
}

// Interface pour la création d'un nouveau rapport
export interface CreateRapportActiviteRequest {
  identificationProved: string; // ID de la PROVED pour la création
  introduction?: string;
  parametresCles: RapportActivite['parametresCles'];
  personnel: RapportActivite['personnel'];
  realisations: RapportActivite['realisations'];
  ameliorationQualite?: RapportActivite['ameliorationQualite'];
  gouvernance?: RapportActivite['gouvernance'];
  educationUrgence?: RapportActivite['educationUrgence'];
  autresProblemes?: RapportActivite['autresProblemes'];
  conclusion?: string;
  annee: number;
  fichierJoint?: string;
}

// Interface pour la mise à jour d'un rapport
export interface UpdateRapportActiviteRequest {
  introduction?: string;
  parametresCles?: Partial<RapportActivite['parametresCles']>;
  personnel?: Partial<RapportActivite['personnel']>;
  realisations?: Partial<RapportActivite['realisations']>;
  ameliorationQualite?: Partial<RapportActivite['ameliorationQualite']>;
  gouvernance?: Partial<RapportActivite['gouvernance']>;
  educationUrgence?: Partial<RapportActivite['educationUrgence']>;
  autresProblemes?: Partial<RapportActivite['autresProblemes']>;
  conclusion?: string;
  statut?: RapportActivite['statut'];
  annee?: number;
  fichierJoint?: string;
}

// Valeurs par défaut pour initialiser un nouveau rapport
export const defaultRapportActivite: Omit<RapportActivite, 'identificationProved' | 'annee'> = {
  introduction: '',
  parametresCles: {
    // 1.1. Nbre d'Ecole / Nbre de Classe
    nombreEcolesClasses: {
      niveauPrescolaire: {
        espaceCommunautaireEveil: {
          nombreEcoles: 0,
          nombreClasses: 0,
        },
        maternel: {
          nombreEcoles: 0,
          nombreClasses: 0,
        },
        prePrimaire: {
          nombreEcoles: 0,
          nombreClasses: 0,
        },
        special: {
          nombreEcoles: 0,
          nombreClasses: 0,
        },
      },
      niveauPrimaire: {
        enseignementSpecial: {
          nombreEcoles: 0,
          totalClassesSpecialesPrim: 0,
          classesPlethoriques: 0,
        },
        enseignementPrimaire: {
          nombreEcoles: 0,
          totalClassesPrimaire: 0,
          classesPlethoriques: '-',
        },
      },
      niveauSecondaire: {
        enseignementSpecial: {
          nombreEcoles: 0,
          totalClassesSpecialesSec: 0,
        },
        enseignementSecondaire: {
          nombreEcoles: 0,
          premierCycle: {
            classes7emeCTEB: 0,
            classes8emeCTEB: 0,
          },
          deuxiemeCycle: {
            totalClassesHumanites: 0,
          },
          totalClasses1er2emeCycle: 0,
        },
      },
    },
    // 1.2. Effectif Scolaire et Taux d'accroissement
    effectifScolaire: {
      niveauPrescolaire: {
        espaceCommunautaireEveil: {
          effectifGarconsFilles: 0,
          effectifFilles: 0,
          tauxAccroissementGarconsFilles: 0,
          tauxAccroissementFilles: 0,
        },
        maternel: {
          effectifGarconsFilles: 0,
          effectifFilles: 0,
          tauxAccroissementGarconsFilles: 0,
          tauxAccroissementFilles: 0,
        },
        prePrimaire: {
          effectifGarconsFilles: 0,
          effectifFilles: 0,
          tauxAccroissementGarconsFilles: 0,
          tauxAccroissementFilles: 0,
        },
        special: {
          effectifGarconsFilles: 0,
          effectifFilles: 0,
          tauxAccroissementGarconsFilles: 0,
          tauxAccroissementFilles: 0,
        },
      },
      niveauPrimaire: {
        enseignementSpecial: {
          effectifGarconsFilles: 0,
          effectifFilles: 0,
          tauxAccroissementGarconsFilles: 0,
          tauxAccroissementFilles: 0,
        },
        enseignementPrimaire: {
          effectifGarconsFilles: 0,
          effectifFilles: 0,
          tauxAccroissementGarconsFilles: 0,
          tauxAccroissementFilles: 0,
        },
      },
      niveauSecondaire: {
        enseignementSpecial: {
          effectifGarcons: 0,
          effectifFilles: 0,
          tauxGarcons: 0,
          tauxFilles: 0,
        },
        enseignementSecondaire: {
          septiemeCTEB: {
            effectifGarcons: 0,
            effectifFilles: 0,
            tauxGarcons: 0,
            tauxFilles: 0,
          },
          huitiemeCTEB: {
            effectifGarcons: 0,
            effectifFilles: 0,
            tauxGarcons: 0,
            tauxFilles: 0,
          },
          premiereHumanite: {
            effectifGarcons: 0,
            effectifFilles: 0,
            tauxGarcons: 0,
            tauxFilles: 0,
          },
          quatriemeHumanite: {
            effectifGarcons: 0,
            effectifFilles: 0,
            tauxGarcons: 0,
            tauxFilles: 0,
          },
        },
      },
    },
  },
  personnel: {
    personnelEnseignant: {
      niveauPrescolaire: {
        enseignementPrescolaireSpecial: {
          hommes: 0,
          femmes: 0,
        },
        enseignementPrescolaire: {
          hommes: 0,
          femmes: 0,
        },
      },
      niveauPrimaire: {
        enseignementPrescolaireSpecial: {
          hommes: 0,
          femmes: 0,
        },
        enseignementPrimaire: {
          hommes: 0,
          femmes: 0,
        },
      },
      niveauSecondaire: {
        enseignementPrescolaireSpecial: {
          hommes: 0,
          femmes: 0,
        },
        enseignementSecondaire: {
          hommes: 0,
          femmes: 0,
        },
      },
    },
    personnelAdministratif: {
      directionProvinciale: {
        hommes: 0,
        femmes: 0,
      },
      inspectionPrincipale: {
        hommes: 0,
        femmes: 0,
      },
      dinacope: {
        hommes: 0,
        femmes: 0,
      },
      sernie: {
        hommes: 0,
        femmes: 0,
      },
      coordinationProvinciale: {
        hommes: 0,
        femmes: 0,
      },
      sousDivision: {
        hommes: 0,
        femmes: 0,
      },
      poolsInspectionPrimaire: {
        hommes: 0,
        femmes: 0,
      },
      poolsInspectionSecondaire: {
        hommes: 0,
        femmes: 0,
      },
      antenneDinacope: {
        hommes: 0,
        femmes: 0,
      },
      antenneSernie: {
        hommes: 0,
        femmes: 0,
      },
      coordinationDiocesaine: {
        hommes: 0,
        femmes: 0,
      },
      sousCoordinationConventionnees: {
        hommes: 0,
        femmes: 0,
      },
      conseillerieResidente: {
        hommes: 0,
        femmes: 0,
      },
    },
  },
  realisations: {
    accesAccessibiliteEquite: {
      nouvellesSallesClasses: {
        prescolaire: 0,
        primaire: 0,
        secondaire: 0,
        sourceFinancement: '',
      },
      nouveauxBancsTables: {
        prescolaire: 0,
        primaire: 0,
        secondaire: 0,
        sourceFinancement: '',
      },
      nouvellesLatrines: {
        prescolaire: 0,
        primaire: 0,
        secondaire: 0,
        sourceFinancement: '',
      },
      gratuitéEnseignementPrimaire: '',
      sensibilisation: {
        filles: false,
        enfantsHorsEcole: false,
        peuplesAutochtones: false,
      },
      cantinesScolaires: {
        prescolaire: 0,
        primaire: 0,
        secondaire: 0,
        commentaire: '',
      },
      indicateursAcces: {
        proportionNouveauxInscrits: 0,
        tauxTransitionPrimaireCTEB: 0,
        tauxTransitionCTEBHumanites: 0,
      },
    },
  },
  ameliorationQualite: {
    disponibiliteMoyensEnseignement: {
      programmesScolaires: {
        prescolaire: 'BON',
        primaire: 'BON',
        secondaire: 'BON',
      },
      manuelsScolaires: {
        prescolaire: 'BON',
        primaire: 'BON',
        secondaire: 'BON',
      },
      materielsDidactiques: {
        prescolaire: 'BON',
        primaire: 'BON',
        secondaire: 'BON',
      },
      laboratoires: {
        chimie: 'BON',
        biologie: 'BON',
        physique: 'BON',
      },
      equipementsAteliers: {
        humanitesTechniques: 'BON',
      },
    },
    visitesEtReunions: {
      visitesClasses: {
        prescolaire: 'BON',
        primaire: 'BON',
        secondaire: 'BON',
        special: 'BON',
      },
      reunionsPedagogiques: {
        prescolaire: 'BON',
        primaire: 'BON',
        secondaire: 'BON',
      },
      fonctionnementCelluleBase: {
        prescolaire: 'BON',
        primaire: 'BON',
        secondaire: 'BON',
        special: 'BON',
      },
    },
    activitesInspectorales: {
      inspectionsPedagogiquesC3: {
        prescolaire: {
          nombrePrevu: 0,
          nombreRealise: 0,
          pourcentageRealisation: 0,
        },
        primaire: {
          nombrePrevu: 0,
          nombreRealise: 0,
          pourcentageRealisation: 0,
        },
        secondaire: {
          nombrePrevu: 0,
          nombreRealise: 0,
          pourcentageRealisation: 0,
        },
        special: {
          nombrePrevu: 0,
          nombreRealise: 0,
          pourcentageRealisation: 0,
        },
      },
      inspectionsFormation: {
        prescolaire: {
          nombrePrevu: 0,
          nombreRealise: 0,
          pourcentageRealisation: 0,
        },
        primaire: {
          nombrePrevu: 0,
          nombreRealise: 0,
          pourcentageRealisation: 0,
        },
        secondaire: {
          nombrePrevu: 0,
          nombreRealise: 0,
          pourcentageRealisation: 0,
        },
        special: {
          nombrePrevu: 0,
          nombreRealise: 0,
          pourcentageRealisation: 0,
        },
      },
      formationContinue: {
        prescolaire: 'BON',
        primaire: 'BON',
        secondaire: 'BON',
        special: 'BON',
      },
    },
    indicateursRendement: {
      rendementInterne: {
        prescolaire: {
          tauxAbandon: 0,
          tauxReussite: 0,
          tauxEchec: 0,
        },
        primaire: {
          tauxAbandon: 0,
          tauxReussite: 0,
          tauxEchec: 0,
        },
        secondaire: {
          tauxAbandon: 0,
          tauxReussite: 0,
          tauxEchec: 0,
        },
      },
      rendementExterne: {
        examensCertificatifs: {
          tauxDiplomes: 0,
          tauxHumanitesScientifiques: 0,
          tauxHumanitesTechniques: 0,
        },
      },
    },
  },
  gouvernance: {
    miseEnOeuvreSSEF: {
      niveauProvinceEducationnelle: {
        elaborationPAO: '',
        miseEnOeuvre: '',
        evaluationMiParcours: '',
        evaluationFinale: '',
      },
      niveauProvinceAdministrative: {
        elaborationPAO: '',
        miseEnOeuvre: '',
        evaluationMiParcours: '',
        evaluationFinale: '',
      },
    },
    inspectionsAdministrativesC2B: {
      prescolaire: {
        nombrePrevu: 0,
        nombreRealise: 0,
        pourcentageRealisation: 0,
      },
      primaire: {
        nombrePrevu: 0,
        nombreRealise: 0,
        pourcentageRealisation: 0,
      },
      secondaire: {
        nombrePrevu: 0,
        nombreRealise: 0,
        pourcentageRealisation: 0,
      },
      special: {
        nombrePrevu: 0,
        nombreRealise: 0,
        pourcentageRealisation: 0,
      },
    },
    comitesProvinciaux: {
      comiteEDUNC: {
        frequenceReunions: '',
        pointsTraites: '',
      },
      comiteENAFP: {
        frequenceReunions: '',
        pointsTraites: '',
      },
      comiteTENASOSP: {
        frequenceReunions: '',
        pointsTraites: '',
      },
      comiteExamenEtat: {
        frequenceReunions: '',
        pointsTraites: '',
      },
    },
    remunerationPersonnel: {
      directionProvinciale: {
        totalAgents: 0,
        nonPayes: 0,
      },
      inspectionPrincipale: {
        totalAgents: 0,
        nonPayes: 0,
      },
      dinacope: {
        totalAgents: 0,
        nonPayes: 0,
      },
      sernie: {
        totalAgents: 0,
        nonPayes: 0,
      },
      coordinationProvinciale: {
        totalAgents: 0,
        nonPayes: 0,
      },
      sousDivision: {
        totalAgents: 0,
        nonPayes: 0,
      },
      poolsInspectionPrimaire: {
        totalAgents: 0,
        nonPayes: 0,
      },
      poolsInspectionSecondaire: {
        totalAgents: 0,
        nonPayes: 0,
      },
      antenneDinacope: {
        totalAgents: 0,
        nonPayes: 0,
      },
      antenneSernie: {
        totalAgents: 0,
        nonPayes: 0,
      },
      coordinationDiocesaine: {
        totalAgents: 0,
        nonPayes: 0,
      },
      sousCoordinationConventionnees: {
        totalAgents: 0,
        nonPayes: 0,
      },
      conseillerieResidente: {
        totalAgents: 0,
        nonPayes: 0,
      },
    },
    vulgarisationInstructions: {
      instructionsOfficielles: '',
      nouvelleCitoyennete: '',
    },
    groupesAidesPsychopedagogiques: {
      nombreGAPMisEnPlace: 0,
      nombreGAPOperationnel: 0,
      nombreCasPrisEnCharge: 0,
      problemesIdentifies: '',
      solutionsPreconisees: '',
    },
    acquisitionsMateriels: {
      ecoles: {
        nature: '',
        sourceFinancement: {
          gvt: 0,
          projet: 0,
          ptfs: 0,
          ong: 0,
        },
      },
      bureauxGestionnaires: {
        nature: '',
        sourceFinancement: {
          gvt: 0,
          projet: 0,
          ptfs: 0,
          ong: 0,
        },
      },
    },
    infrastructureBureaux: {
      directionProvinciale: {
        proprietaire: 0,
        locataire: 0,
      },
      inspectionPrincipale: {
        proprietaire: 0,
        locataire: 0,
      },
      dinacope: {
        proprietaire: 0,
        locataire: 0,
      },
      sernie: {
        proprietaire: 0,
        locataire: 0,
      },
      coordinationProvinciale: {
        proprietaire: 0,
        locataire: 0,
      },
      sousDivision: {
        proprietaire: 0,
        locataire: 0,
      },
      poolsInspectionPrimaire: {
        proprietaire: 0,
        locataire: 0,
      },
      poolsInspectionSecondaire: {
        proprietaire: 0,
        locataire: 0,
      },
      antenneDinacope: {
        proprietaire: 0,
        locataire: 0,
      },
      antenneSernie: {
        proprietaire: 0,
        locataire: 0,
      },
      coordinationDiocesaine: {
        proprietaire: 0,
        locataire: 0,
      },
      sousCoordinationConventionnees: {
        proprietaire: 0,
        locataire: 0,
      },
      conseillerieResidente: {
        proprietaire: 0,
        locataire: 0,
      },
    },
    totalInfrastructureBureaux: {
      totalProprietaire: 0,
      totalLocataire: 0,
    },
  },
  educationUrgence: {
    planStockContingence: {
      plan: '',
      stock: '',
    },
    catastrophesNaturelles: {
      nature: '',
      effetsNegatifs: '',
    },
    destructionSDC: {
      forcesNegatives: '',
    },
    solutionsLocales: '',
    reunionsClusterEducation: {
      frequence: '',
      pointsTraites: '',
    },
    recommandations: {
      espacesTemporairesApprentissage: {
        nombre: 0,
        couts: '',
      },
      apprenantsScolarises: {
        cible: 0,
      },
      formationEnseignantsESU: '',
    },
  },
  autresProblemes: {
    problemesSpecifiques: '',
  },
  conclusion: '',
  statut: 'brouillon',
  fichierJoint: '',
}; 