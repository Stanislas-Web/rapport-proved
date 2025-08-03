export interface RapportActivite {
  _id?: string;
  identificationProved: string; // ObjectId reference
  introduction?: string;
  
  parametresCles: {
    niveauPrescolaire: {
      espaceCommunautaireEveil: {
        nombreEcoles: number;
        nombreClasses: number;
        effectifGarcons: number;
        effectifFilles: number;
        tauxAccroissement: number;
      };
      maternel: {
        nombreEcoles: number;
        nombreClasses: number;
        effectifGarcons: number;
        effectifFilles: number;
        tauxAccroissement: number;
      };
      prePrimaire: {
        nombreEcoles: number;
        nombreClasses: number;
        effectifGarcons: number;
        effectifFilles: number;
        tauxAccroissement: number;
      };
      special: {
        nombreEcoles: number;
        nombreClasses: number;
        effectifGarcons: number;
        effectifFilles: number;
        tauxAccroissement: number;
      };
    };
    niveauPrimaire: {
      enseignementSpecial: {
        nombreClasses: number;
        effectifGarcons: number;
        effectifFilles: number;
        tauxAccroissement: number;
      };
      enseignementPrimaire: {
        nombreEcoles: number;
        nombreClasses: number;
        classesPlethoriques: number;
        effectifGarcons: number;
        effectifFilles: number;
        tauxAccroissement: number;
      };
    };
    niveauSecondaire: {
      enseignementSpecial: {
        nombreClasses: number;
        effectifGarcons: number;
        effectifFilles: number;
        tauxAccroissement: number;
      };
      enseignementSecondaire: {
        premierCycle: {
          classes7emeCTEB: number;
          classes8emeCTEB: number;
          effectifGarcons: number;
          effectifFilles: number;
          tauxAccroissement: number;
        };
        deuxiemeCycle: {
          classesHumanites: number;
          effectifGarcons: number;
          effectifFilles: number;
          tauxAccroissement: number;
        };
      };
    };
  };

  personnel: {
    personnelEnseignant: {
      prescolaire: { hommes: number; femmes: number };
      primaire: { hommes: number; femmes: number };
      secondaire: { hommes: number; femmes: number };
    };
    personnelAdministratif: {
      directionProvinciale: number;
      inspectionPrincipale: number;
      dinacope: number;
      sernie: number;
      coordinationProvinciale: number;
      sousDivision: number;
      poolsInspectionPrimaire: number;
      poolsInspectionSecondaire: number;
      antenneDinacope: number;
      antenneSernie: number;
      coordinationDiocesaine: number;
      sousCoordinationConventionnees: number;
      conseillerieResidente: number;
    };
  };

  realisations: {
    accesAccessibiliteEquite: {
      nouvellesSallesClasses: {
        prescolaire: number;
        primaire: number;
        secondaire: number;
        sourceFinancement?: string;
      };
      nouveauxBancsTables: {
        prescolaire: number;
        primaire: number;
        secondaire: number;
        sourceFinancement?: string;
      };
      nouvellesLatrines: {
        prescolaire: number;
        primaire: number;
        secondaire: number;
        sourceFinancement?: string;
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

  conclusion?: string;
  statut: 'brouillon' | 'soumis' | 'approuve' | 'rejete';
  annee: number;
  fichierJoint?: string;
  createdBy?: string; // ObjectId reference
  updatedBy?: string; // ObjectId reference
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface pour la création d'un nouveau rapport
export interface CreateRapportActiviteRequest {
  identificationProved: string;
  introduction?: string;
  parametresCles: RapportActivite['parametresCles'];
  personnel: RapportActivite['personnel'];
  realisations: RapportActivite['realisations'];
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
  conclusion?: string;
  statut?: RapportActivite['statut'];
  annee?: number;
  fichierJoint?: string;
}

// Valeurs par défaut pour initialiser un nouveau rapport
export const defaultRapportActivite: Omit<RapportActivite, 'identificationProved' | 'annee'> = {
  introduction: '',
  parametresCles: {
    niveauPrescolaire: {
      espaceCommunautaireEveil: {
        nombreEcoles: 0,
        nombreClasses: 0,
        effectifGarcons: 0,
        effectifFilles: 0,
        tauxAccroissement: 0,
      },
      maternel: {
        nombreEcoles: 0,
        nombreClasses: 0,
        effectifGarcons: 0,
        effectifFilles: 0,
        tauxAccroissement: 0,
      },
      prePrimaire: {
        nombreEcoles: 0,
        nombreClasses: 0,
        effectifGarcons: 0,
        effectifFilles: 0,
        tauxAccroissement: 0,
      },
      special: {
        nombreEcoles: 0,
        nombreClasses: 0,
        effectifGarcons: 0,
        effectifFilles: 0,
        tauxAccroissement: 0,
      },
    },
    niveauPrimaire: {
      enseignementSpecial: {
        nombreClasses: 0,
        effectifGarcons: 0,
        effectifFilles: 0,
        tauxAccroissement: 0,
      },
      enseignementPrimaire: {
        nombreEcoles: 0,
        nombreClasses: 0,
        classesPlethoriques: 0,
        effectifGarcons: 0,
        effectifFilles: 0,
        tauxAccroissement: 0,
      },
    },
    niveauSecondaire: {
      enseignementSpecial: {
        nombreClasses: 0,
        effectifGarcons: 0,
        effectifFilles: 0,
        tauxAccroissement: 0,
      },
      enseignementSecondaire: {
        premierCycle: {
          classes7emeCTEB: 0,
          classes8emeCTEB: 0,
          effectifGarcons: 0,
          effectifFilles: 0,
          tauxAccroissement: 0,
        },
        deuxiemeCycle: {
          classesHumanites: 0,
          effectifGarcons: 0,
          effectifFilles: 0,
          tauxAccroissement: 0,
        },
      },
    },
  },
  personnel: {
    personnelEnseignant: {
      prescolaire: { hommes: 0, femmes: 0 },
      primaire: { hommes: 0, femmes: 0 },
      secondaire: { hommes: 0, femmes: 0 },
    },
    personnelAdministratif: {
      directionProvinciale: 0,
      inspectionPrincipale: 0,
      dinacope: 0,
      sernie: 0,
      coordinationProvinciale: 0,
      sousDivision: 0,
      poolsInspectionPrimaire: 0,
      poolsInspectionSecondaire: 0,
      antenneDinacope: 0,
      antenneSernie: 0,
      coordinationDiocesaine: 0,
      sousCoordinationConventionnees: 0,
      conseillerieResidente: 0,
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
  conclusion: '',
  statut: 'brouillon',
  fichierJoint: '',
}; 