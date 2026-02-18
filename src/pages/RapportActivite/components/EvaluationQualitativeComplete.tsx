import React, { useState, useEffect } from 'react';

interface EvaluationQualitativeCompleteProps {
  formData?: any;
  setFormData?: React.Dispatch<React.SetStateAction<any>>;
  autoSaveForceSave?: () => void;
}

const EvaluationQualitativeComplete: React.FC<EvaluationQualitativeCompleteProps> = ({ formData, setFormData, autoSaveForceSave }) => {
  // DEBUG: Log des données au chargement
  useEffect(() => {
    console.log('🔍 [EvaluationQualitativeComplete] formData chargé:', {
      hasFormData: !!formData,
      hasAmeliorationQualite: !!formData?.ameliorationQualite,
      hasIndicateursRendement: !!formData?.ameliorationQualite?.indicateursRendement,
      efficacitePrimaire: formData?.ameliorationQualite?.indicateursRendement?.efficacitePrimaire,
      rendementInterne: formData?.ameliorationQualite?.indicateursRendement?.rendementInterne,
      rendementExterne: formData?.ameliorationQualite?.indicateursRendement?.rendementExterne
    });
  }, [formData?._id]);

  // Helper pour gérer setFormData en toute sécurité
  const safeSetFormData = (updater: (prev: any) => any) => {
    if (setFormData) {
      setFormData(updater);
    }
  };

  // Helper pour mapper les inspections depuis formData
  const mapInspectionsFromFormData = (data?: any) => {
    if (!data) {
      return {
        maternel: { prevu: 0, realise: 0, pourcentage: 0 },
        primaire: { prevu: 0, realise: 0, pourcentage: 0 },
        secondaire: { prevu: 0, realise: 0, pourcentage: 0 },
        special: { prevu: 0, realise: 0, pourcentage: 0 }
      };
    }
    return {
      maternel: {
        prevu: data.prescolaire?.nombrePrevu || 0,
        realise: data.prescolaire?.nombreRealise || 0,
        pourcentage: data.prescolaire?.pourcentageRealisation || 0
      },
      primaire: {
        prevu: data.primaire?.nombrePrevu || 0,
        realise: data.primaire?.nombreRealise || 0,
        pourcentage: data.primaire?.pourcentageRealisation || 0
      },
      secondaire: {
        prevu: data.secondaire?.nombrePrevu || 0,
        realise: data.secondaire?.nombreRealise || 0,
        pourcentage: data.secondaire?.pourcentageRealisation || 0
      },
      special: {
        prevu: data.special?.nombrePrevu || 0,
        realise: data.special?.nombreRealise || 0,
        pourcentage: data.special?.pourcentageRealisation || 0
      }
    };
  };

  // État pour les inspections pédagogiques C3
  const [inspectionsC3, setInspectionsC3] = useState(() => 
    mapInspectionsFromFormData(formData?.ameliorationQualite?.activitesInspectorales?.inspectionsPedagogiquesC3)
  );

  // État pour les inspections de formation
  const [inspectionsFormation, setInspectionsFormation] = useState(() => 
    mapInspectionsFromFormData(formData?.ameliorationQualite?.activitesInspectorales?.inspectionsFormation)
  );

  // Recharger les inspections C3 et Formation quand le rapport change
  useEffect(() => {
    const inspectionsC3Data = formData?.ameliorationQualite?.activitesInspectorales?.inspectionsPedagogiquesC3;
    if (inspectionsC3Data) {
      console.log('🔄 [EvaluationQualitativeComplete] Chargement inspectionsC3 depuis formData:', inspectionsC3Data);
      const mapped = mapInspectionsFromFormData(inspectionsC3Data);
      setInspectionsC3(prev => JSON.stringify(prev) === JSON.stringify(mapped) ? prev : mapped);
    }

    const inspectionsFormationData = formData?.ameliorationQualite?.activitesInspectorales?.inspectionsFormation;
    if (inspectionsFormationData) {
      console.log('🔄 [EvaluationQualitativeComplete] Chargement inspectionsFormation depuis formData:', inspectionsFormationData);
      const mapped = mapInspectionsFromFormData(inspectionsFormationData);
      setInspectionsFormation(prev => JSON.stringify(prev) === JSON.stringify(mapped) ? prev : mapped);
    }
  }, [formData?._id]);

  // État pour les thèmes exploités
  const [themesExploites, setThemesExploites] = useState(() => ({
    ece: formData?.ameliorationQualite?.activitesInspectorales?.themesExploites?.ece || '',
    maternel: formData?.ameliorationQualite?.activitesInspectorales?.themesExploites?.maternel || ''
  }));
  
  // Flag pour éviter la boucle infinie de chargement des thèmes
  const [themesExploitesLoaded, setThemesExploitesLoaded] = useState(false);
  
  // Réinitialiser le flag thèmes exploités quand le rapport change
  useEffect(() => {
    console.log('🔄 [EvaluationQualitativeComplete] Reset themesExploitesLoaded pour nouveau rapport:', formData?._id);
    setThemesExploitesLoaded(false);
  }, [formData?._id]);
  
  // Flag pour éviter la boucle infinie de chargement du rendement interne
  const [rendementInterneLoaded, setRendementInterneLoaded] = useState(false);
  
  // Réinitialiser le flag quand le rapport change (formData._id change)
  useEffect(() => {
    setRendementInterneLoaded(false);
  }, [formData?._id]);

  // État pour les indicateurs du rendement interne - CHARGER depuis formData
  const [rendementInterne, setRendementInterne] = useState({
    sixiemePrimaire: { abandon: 0, reussite: 0, echec: 0 },
    huitiemeCETB: { abandon: 0, reussite: 0, echec: 0 },
    quatriemeHumanite: { abandon: 0, reussite: 0, echec: 0 },
    diplomesMathematiques: { abandon: 0, reussite: 0, echec: 0 },
    diplomesFiliereTechniques: { abandon: 0, reussite: 0, echec: 0 }
  });
  
  // Flag pour éviter la boucle infinie de chargement du rendement externe
  const [rendementExterneLoaded, setRendementExterneLoaded] = useState(false);
  
  // Réinitialiser le flag rendementExterne quand le rapport change
  useEffect(() => {
    setRendementExterneLoaded(false);
  }, [formData?._id]);

  // Charger le rendement interne depuis formData au montage
  useEffect(() => {
    const data = formData?.ameliorationQualite?.indicateursRendement?.rendementInterne;
    if (data && !rendementInterneLoaded) {
      console.log('🔍 [Rendement Interne] Chargement depuis backend:', data);
      
      // Mapper les données du backend (nouvelle structure avec 5 niveaux)
      setRendementInterne({
        sixiemePrimaire: {
          abandon: data.sixiemePrimaire?.abandon || 0,
          reussite: data.sixiemePrimaire?.reussite || 0,
          echec: data.sixiemePrimaire?.echec || 0
        },
        huitiemeCETB: {
          abandon: data.huitiemeCETB?.abandon || 0,
          reussite: data.huitiemeCETB?.reussite || 0,
          echec: data.huitiemeCETB?.echec || 0
        },
        quatriemeHumanite: {
          abandon: data.quatriemeHumanite?.abandon || 0,
          reussite: data.quatriemeHumanite?.reussite || 0,
          echec: data.quatriemeHumanite?.echec || 0
        },
        diplomesMathematiques: {
          abandon: data.diplomesMathematiques?.abandon || 0,
          reussite: data.diplomesMathematiques?.reussite || 0,
          echec: data.diplomesMathematiques?.echec || 0
        },
        diplomesFiliereTechniques: {
          abandon: data.diplomesFiliereTechniques?.abandon || 0,
          reussite: data.diplomesFiliereTechniques?.reussite || 0,
          echec: data.diplomesFiliereTechniques?.echec || 0
        }
      });
      setRendementInterneLoaded(true);
      console.log('✅ [Rendement Interne] Chargé avec succès');
    }
  }, [formData?.ameliorationQualite?.indicateursRendement?.rendementInterne, rendementInterneLoaded]);

  // Charger le rendement externe depuis formData au montage
  useEffect(() => {
    const data = formData?.ameliorationQualite?.indicateursRendement?.rendementExterne;
    if (data && !rendementExterneLoaded) {
      console.log('🔍 [Rendement Externe] Chargement depuis backend:', data);
      
      setRendementExterne({
        prescolaire: {
          tauxGF: data.prescolaire?.tauxGF || 0,
          tauxFilles: data.prescolaire?.tauxFilles || 0
        },
        espaceCommunautaireEveil: {
          tauxGF: data.espaceCommunautaireEveil?.tauxGF || 0,
          tauxFilles: data.espaceCommunautaireEveil?.tauxFilles || 0
        },
        classePreprimaire: {
          tauxGF: data.classePreprimaire?.tauxGF || 0,
          tauxFilles: data.classePreprimaire?.tauxFilles || 0
        },
        maternel: {
          tauxGF: data.maternel?.tauxGF || 0,
          tauxFilles: data.maternel?.tauxFilles || 0
        },
        primaire: {
          tauxGF: data.primaire?.tauxGF || 0,
          tauxFilles: data.primaire?.tauxFilles || 0
        },
        enseignementSpecialPrimaire: {
          tauxGF: data.enseignementSpecialPrimaire?.tauxGF || 0,
          tauxFilles: data.enseignementSpecialPrimaire?.tauxFilles || 0
        },
        enseignementPrimaire: {
          tauxGF: data.enseignementPrimaire?.tauxGF || 0,
          tauxFilles: data.enseignementPrimaire?.tauxFilles || 0
        },
        secondaire: {
          tauxGF: data.secondaire?.tauxGF || 0,
          tauxFilles: data.secondaire?.tauxFilles || 0
        },
        enseignementSpecialSecondaire: {
          tauxGF: data.enseignementSpecialSecondaire?.tauxGF || 0,
          tauxFilles: data.enseignementSpecialSecondaire?.tauxFilles || 0
        },
        enseignementSecondaireNormal: {
          tauxGF: data.enseignementSecondaireNormal?.tauxGF || 0,
          tauxFilles: data.enseignementSecondaireNormal?.tauxFilles || 0
        }
      });
      setRendementExterneLoaded(true);
      console.log('✅ [Rendement Externe] Chargé avec succès');
    }
  }, [formData?.ameliorationQualite?.indicateursRendement?.rendementExterne, rendementExterneLoaded]);

  // Flag pour éviter la boucle infinie de chargement de l'efficacité primaire
  const [efficacitePrimaireLoaded, setEfficacitePrimaireLoaded] = useState(false);
  
  // Réinitialiser le flag efficacitePrimaire quand le rapport change
  useEffect(() => {
    setEfficacitePrimaireLoaded(false);
  }, [formData?._id]);

  // Charger l'efficacité primaire depuis formData au montage
  useEffect(() => {
    const data = formData?.ameliorationQualite?.indicateursRendement?.efficacitePrimaire;
    if (data && !efficacitePrimaireLoaded) {
      console.log('🔍 [Efficacité Primaire] Chargement depuis backend:', data);
      
      setEfficacitePrimaire({
        tauxAbandon: {
          tauxGF: data.tauxAbandon?.tauxGF || 0,
          tauxFilles: data.tauxAbandon?.tauxFilles || 0
        },
        tauxReussite: {
          tauxGF: data.tauxReussite?.tauxGF || 0,
          tauxFilles: data.tauxReussite?.tauxFilles || 0
        },
        tauxEchec: {
          tauxGF: data.tauxEchec?.tauxGF || 0,
          tauxFilles: data.tauxEchec?.tauxFilles || 0
        }
      });
      setEfficacitePrimaireLoaded(true);
      console.log('✅ [Efficacité Primaire] Chargé avec succès');
    }
  }, [formData?.ameliorationQualite?.indicateursRendement?.efficacitePrimaire, efficacitePrimaireLoaded]);

  // Flag pour éviter la boucle infinie de chargement de l'efficacité secondaire
  const [efficaciteSecondaireLoaded, setEfficaciteSecondaireLoaded] = useState(false);
  
  // Réinitialiser le flag efficaciteSecondaire quand le rapport change
  useEffect(() => {
    setEfficaciteSecondaireLoaded(false);
  }, [formData?._id]);

  // Charger l'efficacité secondaire depuis formData au montage
  useEffect(() => {
    const data = formData?.ameliorationQualite?.indicateursRendement?.efficaciteSecondaire;
    if (data && !efficaciteSecondaireLoaded) {
      console.log('🔍 [Efficacité Secondaire] Chargement depuis backend:', data);
      
      setEfficaciteSecondaire({
        tauxAbandon: {
          tauxGF: data.tauxAbandon?.tauxGF || 0,
          tauxFilles: data.tauxAbandon?.tauxFilles || 0
        },
        tauxReussite: {
          tauxGF: data.tauxReussite?.tauxGF || 0,
          tauxFilles: data.tauxReussite?.tauxFilles || 0
        },
        tauxEchec: {
          tauxGF: data.tauxEchec?.tauxGF || 0,
          tauxFilles: data.tauxEchec?.tauxFilles || 0
        }
      });
      setEfficaciteSecondaireLoaded(true);
      console.log('✅ [Efficacité Secondaire] Chargé avec succès');
    }
  }, [formData?.ameliorationQualite?.indicateursRendement?.efficaciteSecondaire, efficaciteSecondaireLoaded]);

  // Flag pour éviter la boucle infinie de chargement des taux diplômés OCDE
  const [tauxDiplomesOCDELoaded, setTauxDiplomesOCDELoaded] = useState(false);
  
  // Réinitialiser le flag tauxDiplomesOCDE quand le rapport change
  useEffect(() => {
    setTauxDiplomesOCDELoaded(false);
  }, [formData?._id]);

  // Charger les taux diplômés OCDE depuis formData au montage
  useEffect(() => {
    const data = formData?.ameliorationQualite?.indicateursRendement?.tauxDiplomesOCDE;
    if (data && !tauxDiplomesOCDELoaded) {
      console.log('🔍 [Taux Diplômés OCDE] Chargement depuis backend:', data);
      
      setTauxDiplomesOCDE({
        humanitesScientifiques: {
          tauxGF: data.humanitesScientifiques?.tauxGF || 0,
          tauxFilles: data.humanitesScientifiques?.tauxFilles || 0
        },
        humanitesTechniques: {
          tauxGF: data.humanitesTechniques?.tauxGF || 0,
          tauxFilles: data.humanitesTechniques?.tauxFilles || 0
        }
      });
      setTauxDiplomesOCDELoaded(true);
      console.log('✅ [Taux Diplômés OCDE] Chargé avec succès');
    }
  }, [formData?.ameliorationQualite?.indicateursRendement?.tauxDiplomesOCDE, tauxDiplomesOCDELoaded]);

  // État pour le modal de calcul
  const [showCalculModal, setShowCalculModal] = useState(false);
  const [showCalculModalExternes, setShowCalculModalExternes] = useState(false);
  const [showCalculModalPrimaire, setShowCalculModalPrimaire] = useState(false);
  const [showCalculModalSecondaire, setShowCalculModalSecondaire] = useState(false);
  const [showCalculModalOCDE, setShowCalculModalOCDE] = useState(false);
  
  // Fonction pour vérifier si le rendement interne a des données
  const hasRendementInterneData = () => {
    // Vérifier d'abord dans formData (source de vérité)
    const dataFromForm = formData?.ameliorationQualite?.indicateursRendement?.rendementInterne;
    if (dataFromForm) {
      const hasDataInForm = Object.values(dataFromForm).some((niveau: any) => 
        niveau?.abandon > 0 || niveau?.reussite > 0 || niveau?.echec > 0 ||
        niveau?.tauxAbandon > 0 || niveau?.tauxReussite > 0 || niveau?.tauxEchec > 0
      );
      if (hasDataInForm) return true;
    }
    
    // Sinon vérifier dans l'état local
    const data = rendementInterne;
    return Object.values(data).some(niveau => 
      niveau.abandon > 0 || niveau.reussite > 0 || niveau.echec > 0
    );
  };

  // Fonction pour vérifier si le rendement externe a des données
  const hasRendementExterneData = () => {
    const data = rendementExterne;
    return Object.values(data).some(niveau => 
      niveau.tauxGF > 0 || niveau.tauxFilles > 0
    );
  };

  // Fonction pour vérifier si l'efficacité primaire a des données
  const hasEfficacitePrimaireData = () => {
    // Vérifier d'abord dans formData (source de vérité)
    const dataFromForm = formData?.ameliorationQualite?.indicateursRendement?.efficacitePrimaire;
    if (dataFromForm) {
      const hasDataInForm = Object.values(dataFromForm).some((indicateur: any) => 
        indicateur?.tauxGF > 0 || indicateur?.tauxFilles > 0
      );
      if (hasDataInForm) return true;
    }
    
    // Sinon vérifier dans l'état local
    const data = efficacitePrimaire;
    return Object.values(data).some(indicateur => 
      indicateur.tauxGF > 0 || indicateur.tauxFilles > 0
    );
  };

  // Fonction pour vérifier si l'efficacité secondaire a des données
  const hasEfficaciteSecondaireData = () => {
    // Vérifier d'abord si les données existent dans formData (même avec valeurs à 0)
    const backendData = formData?.ameliorationQualite?.indicateursRendement?.efficaciteSecondaire;
    if (backendData && (
      backendData.tauxAbandon || 
      backendData.tauxReussite || 
      backendData.tauxEchec
    )) {
      return true;
    }
    // Sinon, vérifier l'état local (pour les nouvelles saisies)
    const data = efficaciteSecondaire;
    return Object.values(data).some(indicateur => 
      indicateur.tauxGF > 0 || indicateur.tauxFilles > 0
    );
  };

  // Fonction pour vérifier si les taux OCDE ont des données
  const hasEfficaciteOCDEData = () => {
    // Vérifier d'abord si les données existent dans formData (même avec valeurs à 0)
    const backendData = formData?.ameliorationQualite?.indicateursRendement?.tauxDiplomesOCDE;
    if (backendData && (
      backendData.humanitesScientifiques || 
      backendData.humanitesTechniques
    )) {
      return true;
    }
    // Sinon, vérifier l'état local (pour les nouvelles saisies)
    const data = tauxDiplomesOCDE;
    return Object.values(data).some(filiere => 
      filiere.tauxGF > 0 || filiere.tauxFilles > 0
    );
  };

  // État pour les données brutes de calcul
  const [calculData, setCalculData] = useState({
    sixiemePrimaire: { inscrits: 0, abandons: 0, reussites: 0, echecs: 0 },
    huitiemeCETB: { inscrits: 0, abandons: 0, reussites: 0, echecs: 0 },
    quatriemeHumanite: { inscrits: 0, abandons: 0, reussites: 0, echecs: 0 },
    diplomesMathematiques: { inscrits: 0, abandons: 0, reussites: 0, echecs: 0 },
    diplomesFiliereTechniques: { inscrits: 0, abandons: 0, reussites: 0, echecs: 0 }
  });

  // État pour les indicateurs du rendement externe - CHARGER depuis formData
  const [rendementExterne, setRendementExterne] = useState(() => {
    const data = formData?.ameliorationQualite?.indicateursRendement?.rendementExterne;
    if (data) {
      return {
        prescolaire: data.prescolaire || { tauxGF: 0, tauxFilles: 0 },
        espaceCommunautaireEveil: data.espaceCommunautaireEveil || { tauxGF: 0, tauxFilles: 0 },
        classePreprimaire: data.classePreprimaire || { tauxGF: 0, tauxFilles: 0 },
        maternel: data.maternel || { tauxGF: 0, tauxFilles: 0 },
        primaire: data.primaire || { tauxGF: 0, tauxFilles: 0 },
        enseignementSpecialPrimaire: data.enseignementSpecialPrimaire || { tauxGF: 0, tauxFilles: 0 },
        enseignementPrimaire: data.enseignementPrimaire || { tauxGF: 0, tauxFilles: 0 },
        secondaire: data.secondaire || { tauxGF: 0, tauxFilles: 0 },
        enseignementSpecialSecondaire: data.enseignementSpecialSecondaire || { tauxGF: 0, tauxFilles: 0 },
        enseignementSecondaireNormal: data.enseignementSecondaireNormal || { tauxGF: 0, tauxFilles: 0 }
      };
    }
    return {
      prescolaire: { tauxGF: 0, tauxFilles: 0 },
      espaceCommunautaireEveil: { tauxGF: 0, tauxFilles: 0 },
      classePreprimaire: { tauxGF: 0, tauxFilles: 0 },
      maternel: { tauxGF: 0, tauxFilles: 0 },
      primaire: { tauxGF: 0, tauxFilles: 0 },
      enseignementSpecialPrimaire: { tauxGF: 0, tauxFilles: 0 },
      enseignementPrimaire: { tauxGF: 0, tauxFilles: 0 },
      secondaire: { tauxGF: 0, tauxFilles: 0 },
      enseignementSpecialSecondaire: { tauxGF: 0, tauxFilles: 0 },
      enseignementSecondaireNormal: { tauxGF: 0, tauxFilles: 0 }
    };
  });

  // État pour les données brutes de calcul externe
  const [calculDataExternes, setCalculDataExternes] = useState({
    prescolaire: { total: 0, garcons: 0, filles: 0 },
    espaceCommunautaireEveil: { total: 0, garcons: 0, filles: 0 },
    classePreprimaire: { total: 0, garcons: 0, filles: 0 },
    maternel: { total: 0, garcons: 0, filles: 0 },
    primaire: { total: 0, garcons: 0, filles: 0 },
    enseignementSpecialPrimaire: { total: 0, garcons: 0, filles: 0 },
    enseignementPrimaire: { total: 0, garcons: 0, filles: 0 },
    secondaire: { total: 0, garcons: 0, filles: 0 },
    enseignementSpecialSecondaire: { total: 0, garcons: 0, filles: 0 },
    enseignementSecondaireNormal: { total: 0, garcons: 0, filles: 0 }
  });

  // État pour les indicateurs du niveau primaire (III.8) - CHARGER depuis formData
  const [efficacitePrimaire, setEfficacitePrimaire] = useState(() => {
    const data = formData?.ameliorationQualite?.indicateursRendement?.efficacitePrimaire;
    if (data) {
      return {
        tauxAbandon: data.tauxAbandon || { tauxGF: 0, tauxFilles: 0 },
        tauxReussite: data.tauxReussite || { tauxGF: 0, tauxFilles: 0 },
        tauxEchec: data.tauxEchec || { tauxGF: 0, tauxFilles: 0 }
      };
    }
    return {
      tauxAbandon: { tauxGF: 0, tauxFilles: 0 },
      tauxReussite: { tauxGF: 0, tauxFilles: 0 },
      tauxEchec: { tauxGF: 0, tauxFilles: 0 }
    };
  });

  // État pour les données brutes de calcul primaire
  const [calculDataPrimaire, setCalculDataPrimaire] = useState({
    tauxAbandon: { inscrits: 0, abandons: 0, garcons: 0, filles: 0 },
    tauxReussite: { inscrits: 0, reussites: 0, garcons: 0, filles: 0 },
    tauxEchec: { inscrits: 0, echecs: 0, garcons: 0, filles: 0 }
  });

  // État pour les indicateurs du niveau secondaire (III.8) - CHARGER depuis formData
  const [efficaciteSecondaire, setEfficaciteSecondaire] = useState(() => {
    const data = formData?.ameliorationQualite?.indicateursRendement?.efficaciteSecondaire;
    if (data) {
      return {
        tauxAbandon: data.tauxAbandon || { tauxGF: 0, tauxFilles: 0 },
        tauxReussite: data.tauxReussite || { tauxGF: 0, tauxFilles: 0 },
        tauxEchec: data.tauxEchec || { tauxGF: 0, tauxFilles: 0 }
      };
    }
    return {
      tauxAbandon: { tauxGF: 0, tauxFilles: 0 },
      tauxReussite: { tauxGF: 0, tauxFilles: 0 },
      tauxEchec: { tauxGF: 0, tauxFilles: 0 }
    };
  });

  // État pour les données brutes de calcul secondaire
  const [calculDataSecondaire, setCalculDataSecondaire] = useState({
    tauxAbandon: { inscrits: 0, abandons: 0, garcons: 0, filles: 0 },
    tauxReussite: { inscrits: 0, reussites: 0, garcons: 0, filles: 0 },
    tauxEchec: { inscrits: 0, echecs: 0, garcons: 0, filles: 0 }
  });

  // État pour les taux de diplômes OCDE - CHARGER depuis formData
  const [tauxDiplomesOCDE, setTauxDiplomesOCDE] = useState(() => {
    const data = formData?.ameliorationQualite?.indicateursRendement?.tauxDiplomesOCDE;
    if (data) {
      return {
        humanitesScientifiques: data.humanitesScientifiques || { tauxGF: 0, tauxFilles: 0 },
        humanitesTechniques: data.humanitesTechniques || { tauxGF: 0, tauxFilles: 0 }
      };
    }
    return {
      humanitesScientifiques: { tauxGF: 0, tauxFilles: 0 },
      humanitesTechniques: { tauxGF: 0, tauxFilles: 0 }
    };
  });

  // Synchroniser inspectionsC3 avec formData.ameliorationQualite
  useEffect(() => {
    if (setFormData) {
      setFormData((prev: any) => ({
        ...prev,
        ameliorationQualite: {
          ...prev.ameliorationQualite,
          activitesInspectorales: {
            ...prev.ameliorationQualite?.activitesInspectorales,
            inspectionsPedagogiquesC3: {
              prescolaire: {
                nombrePrevu: inspectionsC3.maternel.prevu,
                nombreRealise: inspectionsC3.maternel.realise,
                pourcentageRealisation: inspectionsC3.maternel.pourcentage
              },
              primaire: {
                nombrePrevu: inspectionsC3.primaire.prevu,
                nombreRealise: inspectionsC3.primaire.realise,
                pourcentageRealisation: inspectionsC3.primaire.pourcentage
              },
              secondaire: {
                nombrePrevu: inspectionsC3.secondaire.prevu,
                nombreRealise: inspectionsC3.secondaire.realise,
                pourcentageRealisation: inspectionsC3.secondaire.pourcentage
              },
              special: {
                nombrePrevu: inspectionsC3.special.prevu,
                nombreRealise: inspectionsC3.special.realise,
                pourcentageRealisation: inspectionsC3.special.pourcentage
              }
            }
          }
        }
      }));
    }
  }, [inspectionsC3, setFormData]);

  // Synchroniser inspectionsFormation avec formData.ameliorationQualite
  useEffect(() => {
    if (setFormData) {
      setFormData((prev: any) => ({
        ...prev,
        ameliorationQualite: {
          ...prev.ameliorationQualite,
          activitesInspectorales: {
            ...prev.ameliorationQualite?.activitesInspectorales,
            inspectionsFormation: {
              prescolaire: {
                nombrePrevu: inspectionsFormation.maternel.prevu,
                nombreRealise: inspectionsFormation.maternel.realise,
                pourcentageRealisation: inspectionsFormation.maternel.pourcentage
              },
              primaire: {
                nombrePrevu: inspectionsFormation.primaire.prevu,
                nombreRealise: inspectionsFormation.primaire.realise,
                pourcentageRealisation: inspectionsFormation.primaire.pourcentage
              },
              secondaire: {
                nombrePrevu: inspectionsFormation.secondaire.prevu,
                nombreRealise: inspectionsFormation.secondaire.realise,
                pourcentageRealisation: inspectionsFormation.secondaire.pourcentage
              },
              special: {
                nombrePrevu: inspectionsFormation.special.prevu,
                nombreRealise: inspectionsFormation.special.realise,
                pourcentageRealisation: inspectionsFormation.special.pourcentage
              }
            }
          }
        }
      }));
    }
  }, [inspectionsFormation, setFormData]);

  // Mettre à jour themesExploites depuis formData quand les données changent
  useEffect(() => {
    const backendThemes = formData?.ameliorationQualite?.activitesInspectorales?.themesExploites;
    
    // Charger seulement si les données existent ET qu'on ne les a pas encore chargées
    if (backendThemes && !themesExploitesLoaded && (backendThemes.ece || backendThemes.maternel)) {
      console.log('🔍 Chargement themesExploites depuis backend:', backendThemes);
      setThemesExploites({
        ece: backendThemes.ece || '',
        maternel: backendThemes.maternel || ''
      });
      setThemesExploitesLoaded(true);
      console.log('✅ Thèmes exploités chargés');
    }
  }, [formData?.ameliorationQualite?.activitesInspectorales?.themesExploites, themesExploitesLoaded]);

  // Synchroniser themesExploites avec formData.ameliorationQualite
  useEffect(() => {
    if (setFormData) {
      setFormData((prev: any) => ({
        ...prev,
        ameliorationQualite: {
          ...prev.ameliorationQualite,
          activitesInspectorales: {
            ...prev.ameliorationQualite?.activitesInspectorales,
            themesExploites: {
              ece: themesExploites.ece,
              maternel: themesExploites.maternel
            }
          }
        }
      }));
    }
  }, [themesExploites, setFormData]);

  // Synchroniser rendementInterne vers formData
  useEffect(() => {
    if (setFormData) {
      setFormData((prev: any) => ({
        ...prev,
        ameliorationQualite: {
          ...prev.ameliorationQualite,
          indicateursRendement: {
            ...prev.ameliorationQualite?.indicateursRendement,
            rendementInterne
          }
        }
      }));
    }
  }, [rendementInterne, setFormData]);

  // Synchroniser rendementExterne vers formData - IMPORTANT pour sauvegarder les 10 lignes du tableau
  useEffect(() => {
    if (setFormData) {
      setFormData((prev: any) => ({
        ...prev,
        ameliorationQualite: {
          ...prev.ameliorationQualite,
          indicateursRendement: {
            ...prev.ameliorationQualite?.indicateursRendement,
            rendementExterne
          }
        }
      }));
    }
  }, [rendementExterne, setFormData]);

  // Synchroniser rendementExterne vers formData
  useEffect(() => {
    if (setFormData) {
      setFormData((prev: any) => ({
        ...prev,
        ameliorationQualite: {
          ...prev.ameliorationQualite,
          indicateursRendement: {
            ...prev.ameliorationQualite?.indicateursRendement,
            rendementExterne
          }
        }
      }));
    }
  }, [rendementExterne, setFormData]);

  // Synchroniser efficacitePrimaire vers formData
  useEffect(() => {
    if (setFormData) {
      setFormData((prev: any) => ({
        ...prev,
        ameliorationQualite: {
          ...prev.ameliorationQualite,
          indicateursRendement: {
            ...prev.ameliorationQualite?.indicateursRendement,
            efficacitePrimaire
          }
        }
      }));
    }
  }, [efficacitePrimaire, setFormData]);

  // Synchroniser efficaciteSecondaire vers formData
  useEffect(() => {
    if (setFormData) {
      setFormData((prev: any) => ({
        ...prev,
        ameliorationQualite: {
          ...prev.ameliorationQualite,
          indicateursRendement: {
            ...prev.ameliorationQualite?.indicateursRendement,
            efficaciteSecondaire
          }
        }
      }));
    }
  }, [efficaciteSecondaire, setFormData]);

  // Synchroniser tauxDiplomesOCDE vers formData
  useEffect(() => {
    if (setFormData) {
      setFormData((prev: any) => ({
        ...prev,
        ameliorationQualite: {
          ...prev.ameliorationQualite,
          indicateursRendement: {
            ...prev.ameliorationQualite?.indicateursRendement,
            tauxDiplomesOCDE
          }
        }
      }));
    }
  }, [tauxDiplomesOCDE, setFormData]);

  // État pour les données brutes de calcul OCDE
  const [calculDataOCDE, setCalculDataOCDE] = useState({
    humanitesScientifiques: { finalistes: 0, diplomes: 0, garcons: 0, filles: 0 },
    humanitesTechniques: { finalistes: 0, diplomes: 0, garcons: 0, filles: 0 }
  });

  // Fonction pour calculer le pourcentage
  const calculatePercentage = (realise: number, prevu: number): number => {
    if (prevu === 0) return 0;
    return Math.round((realise / prevu) * 100 * 100) / 100;
  };

  // Fonction pour mettre à jour les valeurs des inspections C3
  const updateInspection = (niveau: string, field: 'prevu' | 'realise', value: number) => {
    setInspectionsC3(prev => {
      const updated = { ...prev };
      const currentNiveau = updated[niveau as keyof typeof updated];
      
      if (field === 'prevu') {
        // Si on met à jour le nombre prévu
        currentNiveau.prevu = value;
        // Vérifier que le réalisé ne dépasse pas le prévu
        if (currentNiveau.realise > value) {
          currentNiveau.realise = value;
        }
      } else if (field === 'realise') {
        // Si on met à jour le nombre réalisé
        const prevuValue = currentNiveau.prevu;
        // Limiter le réalisé au maximum du prévu
        currentNiveau.realise = Math.min(value, prevuValue);
      }
      
      // Recalculer le pourcentage
      currentNiveau.pourcentage = 
        calculatePercentage(currentNiveau.realise, currentNiveau.prevu);
      
      return updated;
    });
  };

  // Fonction pour mettre à jour les valeurs des inspections de formation
  const updateInspectionFormation = (niveau: string, field: 'prevu' | 'realise', value: number) => {
    setInspectionsFormation(prev => {
      const updated = { ...prev };
      const currentNiveau = updated[niveau as keyof typeof updated];
      
      if (field === 'prevu') {
        // Si on met à jour le nombre prévu
        currentNiveau.prevu = value;
        // Vérifier que le réalisé ne dépasse pas le prévu
        if (currentNiveau.realise > value) {
          currentNiveau.realise = value;
        }
      } else if (field === 'realise') {
        // Si on met à jour le nombre réalisé
        const prevuValue = currentNiveau.prevu;
        // Limiter le réalisé au maximum du prévu
        currentNiveau.realise = Math.min(value, prevuValue);
      }
      
      // Recalculer le pourcentage
      currentNiveau.pourcentage = 
        calculatePercentage(currentNiveau.realise, currentNiveau.prevu);
      
      return updated;
    });
  };

  // Fonction pour mettre à jour un indicateur de rendement interne
  const updateRendementInterne = (niveau: string, field: 'abandon' | 'reussite' | 'echec', value: number) => {
    setRendementInterne(prev => {
      const updated = { ...prev };
      const currentNiveau = updated[niveau as keyof typeof updated];
      currentNiveau[field] = Math.max(0, Math.min(100, value)); // Limiter entre 0 et 100
      return updated;
    });
  };

  // Fonction pour ouvrir le modal de calcul
  const openCalculModal = () => {
    setShowCalculModal(true);
  };

  // Fonction pour mettre à jour les données de calcul avec validation intelligente
  const updateCalculData = (niveau: string, field: string, value: number) => {
    // Empêcher les valeurs négatives
    const validatedValue = Math.max(0, value);
    
    setCalculData(prev => {
      const currentData = { ...prev[niveau as keyof typeof prev] };
      
      // Si on modifie les inscrits, permettre la saisie mais ajuster les autres si nécessaire
      if (field === 'inscrits') {
        const totalAutres = (currentData.abandons || 0) + (currentData.reussites || 0) + (currentData.echecs || 0);
        const updatedData = { ...currentData, [field]: validatedValue };
        
        // Si les inscrits sont réduits et dépassent le total des autres
        if (validatedValue < totalAutres && totalAutres > 0) {
          // Ajuster proportionnellement les autres champs
          const ratio = validatedValue / totalAutres;
          updatedData.abandons = Math.round((currentData.abandons || 0) * ratio);
          updatedData.reussites = Math.round((currentData.reussites || 0) * ratio);
          updatedData.echecs = Math.round((currentData.echecs || 0) * ratio);
        }
        
        return {
          ...prev,
          [niveau]: updatedData
        };
      } else {
        // Pour les autres champs (abandons, reussites, echecs), empêcher le dépassement
        const inscrits = currentData.inscrits || 0;
        const abandons = currentData.abandons || 0;
        const reussites = currentData.reussites || 0;
        const echecs = currentData.echecs || 0;
        
        // Calculer le total des autres champs (sans celui qu'on modifie)
        const totalAutres = (field === 'abandons' ? reussites + echecs : 
                           field === 'reussites' ? abandons + echecs : 
                           abandons + reussites);
        
        // Si les inscrits ne sont pas définis, permettre la saisie
        if (inscrits === 0) {
          return {
            ...prev,
            [niveau]: { ...currentData, [field]: validatedValue }
          };
        }
        
        // Empêcher la saisie si cela dépasserait les inscrits
        if (validatedValue + totalAutres > inscrits) {
          // Ne pas mettre à jour, garder la valeur précédente
          return prev;
        }
        
        // Si la saisie est valide, mettre à jour
        return {
          ...prev,
          [niveau]: { ...currentData, [field]: validatedValue }
        };
      }
    });
  };

  // Fonction pour vérifier la validité d'un niveau
  const isNiveauValid = (niveau: string) => {
    const data = calculData[niveau as keyof typeof calculData];
    const inscrits = data.inscrits || 0;
    const abandons = data.abandons || 0;
    const reussites = data.reussites || 0;
    const echecs = data.echecs || 0;
    const total = abandons + reussites + echecs;
    
    return inscrits >= total && inscrits > 0;
  };

  // Fonction pour obtenir le statut d'un niveau
  const getNiveauStatus = (niveau: string) => {
    const data = calculData[niveau as keyof typeof calculData];
    const inscrits = data.inscrits || 0;
    const abandons = data.abandons || 0;
    const reussites = data.reussites || 0;
    const echecs = data.echecs || 0;
    const total = abandons + reussites + echecs;
    
    if (inscrits === 0) {
      return { status: 'empty', message: 'Veuillez saisir le nombre d\'inscrits', color: 'text-gray-500' };
    } else if (inscrits < total) {
      return { status: 'invalid', message: `Total (${total}) dépasse les inscrits (${inscrits})`, color: 'text-red-500' };
    } else if (inscrits === total) {
      return { status: 'perfect', message: 'Données cohérentes', color: 'text-green-500' };
    } else {
      return { status: 'valid', message: `Reste ${inscrits - total} élèves non classés`, color: 'text-blue-500' };
    }
  };

  // Fonction pour obtenir la valeur maximale autorisée pour un champ
  const getMaxValue = (niveau: string, field: string) => {
    const data = calculData[niveau as keyof typeof calculData];
    const inscrits = data.inscrits || 0;
    
    if (field === 'inscrits') {
      return undefined; // Pas de limite pour les inscrits
    }
    
    if (inscrits === 0) {
      return undefined; // Pas de limite si pas d'inscrits
    }
    
    const abandons = data.abandons || 0;
    const reussites = data.reussites || 0;
    const echecs = data.echecs || 0;
    
    // Calculer le maximum pour le champ en cours
    if (field === 'abandons') {
      return inscrits - (reussites + echecs);
    } else if (field === 'reussites') {
      return inscrits - (abandons + echecs);
    } else if (field === 'echecs') {
      return inscrits - (abandons + reussites);
    }
    
    return undefined;
  };

  // Fonction pour vérifier si tous les niveaux sont valides
  const areAllNiveauxValid = () => {
    const niveaux = ['sixiemePrimaire', 'huitiemeCETB', 'quatriemeHumanite', 'diplomesMathematiques', 'diplomesFiliereTechniques'];
    return niveaux.every(niveau => isNiveauValid(niveau));
  };

  // Fonction pour obtenir le statut global
  const getGlobalStatus = () => {
    const niveaux = ['sixiemePrimaire', 'huitiemeCETB', 'quatriemeHumanite', 'diplomesMathematiques', 'diplomesFiliereTechniques'];
    const validCount = niveaux.filter(niveau => isNiveauValid(niveau)).length;
    const totalCount = niveaux.length;
    
    if (validCount === 0) {
      return { status: 'empty', message: 'Aucun niveau saisi', color: 'text-gray-500', bgColor: 'bg-gray-50' };
    } else if (validCount === totalCount) {
      return { status: 'perfect', message: 'Tous les niveaux sont valides', color: 'text-green-600', bgColor: 'bg-green-50' };
    } else {
      return { status: 'partial', message: `${validCount}/${totalCount} niveaux valides`, color: 'text-orange-600', bgColor: 'bg-orange-50' };
    }
  };

  // Fonctions pour le modal externe
  const isNiveauExterneValid = (niveau: string) => {
    const data = calculDataExternes[niveau as keyof typeof calculDataExternes];
    const total = data.total || 0;
    const garcons = data.garcons || 0;
    const filles = data.filles || 0;
    const totalGarconsFilles = garcons + filles;
    
    return total >= totalGarconsFilles && total > 0;
  };

  const getNiveauExterneStatus = (niveau: string) => {
    const data = calculDataExternes[niveau as keyof typeof calculDataExternes];
    const total = data.total || 0;
    const garcons = data.garcons || 0;
    const filles = data.filles || 0;
    const totalGarconsFilles = garcons + filles;
    
    if (total === 0) {
      return { status: 'empty', message: 'Veuillez saisir le total (GF)', color: 'text-gray-500' };
    } else if (total < totalGarconsFilles) {
      return { status: 'invalid', message: `Total garçons+filles (${totalGarconsFilles}) dépasse le total (${total})`, color: 'text-red-500' };
    } else if (total === totalGarconsFilles) {
      return { status: 'perfect', message: 'Données cohérentes', color: 'text-green-500' };
    } else {
      return { status: 'valid', message: `Reste ${total - totalGarconsFilles} élèves non classés`, color: 'text-blue-500' };
    }
  };

  const getMaxValueExterne = (niveau: string, field: string) => {
    const data = calculDataExternes[niveau as keyof typeof calculDataExternes];
    const total = data.total || 0;
    
    if (field === 'total') {
      return undefined; // Pas de limite pour le total
    }
    
    if (total === 0) {
      return undefined; // Pas de limite si pas de total
    }
    
    const garcons = data.garcons || 0;
    const filles = data.filles || 0;
    
    // Calculer le maximum pour le champ en cours
    if (field === 'garcons') {
      return total - filles;
    } else if (field === 'filles') {
      return total - garcons;
    }
    
    return undefined;
  };

  const areAllNiveauxExternesValid = () => {
    const niveaux = ['prescolaire', 'espaceCommunautaireEveil', 'classePreprimaire', 'maternel', 'primaire', 'enseignementSpecialPrimaire', 'enseignementPrimaire', 'secondaire', 'enseignementSpecialSecondaire', 'enseignementSecondaireNormal'];
    return niveaux.every(niveau => isNiveauExterneValid(niveau));
  };


  // Fonction pour calculer les taux à partir des nombres
  const calculerTaux = () => {
    const nouveauxTaux: any = {};
    
    Object.keys(calculData).forEach((niveau) => {
      const data = calculData[niveau as keyof typeof calculData];
      const inscrits = data.inscrits || 0;
      
      if (inscrits > 0) {
        const tauxAbandon = Math.round((data.abandons / inscrits) * 100 * 100) / 100;
        const tauxReussite = Math.round((data.reussites / inscrits) * 100 * 100) / 100;
        const tauxEchec = Math.round((data.echecs / inscrits) * 100 * 100) / 100;
        
        nouveauxTaux[niveau] = {
          abandon: tauxAbandon,
          reussite: tauxReussite,
          echec: tauxEchec
        };
      } else {
        nouveauxTaux[niveau] = { abandon: 0, reussite: 0, echec: 0 };
      }
    });
    
    setRendementInterne(nouveauxTaux);
    setShowCalculModal(false);
    
    // Sauvegarder immédiatement dans le brouillon
    setTimeout(() => {
      if (autoSaveForceSave) {
        autoSaveForceSave();
      }
    }, 500);
  };

  // Fonction pour ouvrir le modal de calcul externe
  const openCalculModalExternes = () => {
    setShowCalculModalExternes(true);
  };

  // Fonction pour mettre à jour les données de calcul externe
  const updateCalculDataExternes = (niveau: string, field: string, value: number) => {
    // Empêcher les valeurs négatives
    const validatedValue = Math.max(0, value);
    
    setCalculDataExternes(prev => {
      const currentData = { ...prev[niveau as keyof typeof prev] };
      
      // Si on modifie les inscrits, permettre la saisie mais ajuster les autres si nécessaire
      if (field === 'total') {
        const totalAutres = (currentData.garcons || 0) + (currentData.filles || 0);
        const updatedData = { ...currentData, [field]: validatedValue };
        
        // Si les inscrits sont réduits et dépassent le total des autres
        if (validatedValue < totalAutres && totalAutres > 0) {
          // Ajuster proportionnellement les autres champs
          const ratio = validatedValue / totalAutres;
          updatedData.garcons = Math.round((currentData.garcons || 0) * ratio);
          updatedData.filles = Math.round((currentData.filles || 0) * ratio);
        }
        
        return {
          ...prev,
          [niveau]: updatedData
        };
      } else {
        // Pour les autres champs (garcons, filles), empêcher le dépassement
        const inscrits = currentData.total || 0;
        const garcons = currentData.garcons || 0;
        const filles = currentData.filles || 0;
        
        // Calculer le total des autres champs (sans celui qu'on modifie)
        const totalAutres = (field === 'garcons' ? filles : garcons);
        
        // Si les inscrits ne sont pas définis, permettre la saisie
        if (inscrits === 0) {
          return {
            ...prev,
            [niveau]: { ...currentData, [field]: validatedValue }
          };
        }
        
        // Empêcher la saisie si cela dépasserait les inscrits
        if (validatedValue + totalAutres > inscrits) {
          // Ne pas mettre à jour, garder la valeur précédente
          return prev;
        }
        
        // Si la saisie est valide, mettre à jour
        return {
          ...prev,
          [niveau]: { ...currentData, [field]: validatedValue }
        };
      }
    });
  };

  // Fonction pour mettre à jour les indicateurs de rendement externe
  const updateRendementExterne = (niveau: string, field: 'tauxGF' | 'tauxFilles', value: number) => {
    setRendementExterne(prev => {
      const updated = { ...prev };
      const currentNiveau = updated[niveau as keyof typeof updated];
      currentNiveau[field] = Math.max(0, Math.min(100, value)); // Limiter entre 0 et 100
      return updated;
    });
  };

  // Fonction pour calculer les taux externes à partir des nombres
  const calculerTauxExternes = () => {
    const nouveauxTaux: any = {};
    
    Object.keys(calculDataExternes).forEach((niveau) => {
      const data = calculDataExternes[niveau as keyof typeof calculDataExternes];
      const total = data.total || 0;
      const filles = data.filles || 0;
      
      if (total > 0) {
        const tauxGF = Math.round((total / total) * 100 * 100) / 100; // Toujours 100% pour le total
        const tauxFilles = Math.round((filles / total) * 100 * 100) / 100;
        
        nouveauxTaux[niveau] = {
          tauxGF: tauxGF,
          tauxFilles: tauxFilles
        };
      } else {
        nouveauxTaux[niveau] = { tauxGF: 0, tauxFilles: 0 };
      }
    });
    
    setRendementExterne(nouveauxTaux);
    setShowCalculModalExternes(false);
    
    // Sauvegarder immédiatement dans le brouillon
    setTimeout(() => {
      if (autoSaveForceSave) {
        autoSaveForceSave();
      }
    }, 500);
  };

  // Fonction pour ouvrir le modal de calcul primaire
  const openCalculModalPrimaire = () => {
    setShowCalculModalPrimaire(true);
  };

  // Fonction pour obtenir la valeur maximale autorisée pour un champ
  const getMaxValuePrimaire = (indicateur: string, field: string) => {
    const data = calculDataPrimaire[indicateur as keyof typeof calculDataPrimaire];
    if (field === 'inscrits') return undefined;
    return data.inscrits || undefined;
  };

  // Fonction pour vérifier si un niveau est valide
  const isNiveauValidPrimaire = (indicateur: string) => {
    const data = calculDataPrimaire[indicateur as keyof typeof calculDataPrimaire];
    const inscrits = data.inscrits || 0;
    const abandons = (data as any).abandons || 0;
    const reussites = (data as any).reussites || 0;
    const echecs = (data as any).echecs || 0;
    return inscrits > 0 && (abandons + reussites + echecs) <= inscrits;
  };

  // Fonction pour obtenir le statut d'un niveau
  const getNiveauStatusPrimaire = (indicateur: string) => {
    const data = calculDataPrimaire[indicateur as keyof typeof calculDataPrimaire];
    const inscrits = data.inscrits || 0;
    const abandons = (data as any).abandons || 0;
    const reussites = (data as any).reussites || 0;
    const echecs = (data as any).echecs || 0;
    const total = abandons + reussites + echecs;
    
    if (inscrits === 0) {
      return { message: "Commencez par saisir le nombre d'inscrits", color: "text-orange-600" };
    }
    if (total > inscrits) {
      return { message: `Erreur: La somme (${total}) dépasse les inscrits (${inscrits})`, color: "text-red-600" };
    }
    if (total === inscrits) {
      return { message: "✓ Données cohérentes", color: "text-green-600" };
    }
    return { message: `${inscrits - total} places restantes`, color: "text-blue-600" };
  };

  // Fonction pour mettre à jour les données de calcul primaire avec validation intelligente
  const updateCalculDataPrimaire = (indicateur: string, field: string, value: number) => {
    setCalculDataPrimaire(prev => {
      const updated = { ...prev };
      const currentData = updated[indicateur as keyof typeof updated];
      
      // Si on modifie les inscrits, réinitialiser les autres champs
      if (field === 'inscrits') {
        return {
          ...prev,
          [indicateur]: {
            inscrits: value,
            abandons: 0,
            reussites: 0,
            echecs: 0,
            garcons: 0,
            filles: 0
          }
        };
      }
      
      // Validation pour les autres champs
      const inscrits = currentData.inscrits || 0;
      const validatedValue = Math.max(0, Math.min(value, inscrits));
      
      // Empêcher la saisie si cela dépasserait les inscrits
      if (field === 'abandons' || field === 'reussites' || field === 'echecs') {
        const totalAutres = (field === 'abandons' ? 0 : (currentData as any).abandons || 0) +
                           (field === 'reussites' ? 0 : (currentData as any).reussites || 0) +
                           (field === 'echecs' ? 0 : (currentData as any).echecs || 0);
        
        if (validatedValue + totalAutres > inscrits) {
          // Ne pas mettre à jour, garder la valeur précédente
          return prev;
        }
      }
      
      // Si la saisie est valide, mettre à jour
      return {
        ...prev,
        [indicateur]: { ...currentData, [field]: validatedValue }
      };
    });
  };

  // Fonction pour mettre à jour les indicateurs d'efficacité primaire
  const updateEfficacitePrimaire = (indicateur: string, field: 'tauxGF' | 'tauxFilles', value: number) => {
    setEfficacitePrimaire(prev => {
      const updated = { ...prev };
      const currentIndicateur = updated[indicateur as keyof typeof updated];
      currentIndicateur[field] = Math.max(0, Math.min(100, value)); // Limiter entre 0 et 100
      return updated;
    });
  };

  // Fonction pour calculer les taux primaires à partir des nombres
  const calculerTauxPrimaires = () => {
    const nouveauxTaux: any = {};
    
    // Taux d'abandon
    const dataAbandon = calculDataPrimaire.tauxAbandon;
    const inscritsAbandon = dataAbandon.inscrits || 0;
    if (inscritsAbandon > 0) {
      const tauxGFAbandon = Math.round((dataAbandon.abandons / inscritsAbandon) * 100 * 100) / 100;
      const tauxFillesAbandon = Math.round((dataAbandon.filles / inscritsAbandon) * 100 * 100) / 100;
      nouveauxTaux.tauxAbandon = {
        tauxGF: tauxGFAbandon,
        tauxFilles: tauxFillesAbandon
      };
    } else {
      nouveauxTaux.tauxAbandon = { tauxGF: 0, tauxFilles: 0 };
    }

    // Taux de réussite
    const dataReussite = calculDataPrimaire.tauxReussite;
    const inscritsReussite = dataReussite.inscrits || 0;
    if (inscritsReussite > 0) {
      const tauxGFReussite = Math.round((dataReussite.reussites / inscritsReussite) * 100 * 100) / 100;
      const tauxFillesReussite = Math.round((dataReussite.filles / inscritsReussite) * 100 * 100) / 100;
      nouveauxTaux.tauxReussite = {
        tauxGF: tauxGFReussite,
        tauxFilles: tauxFillesReussite
      };
    } else {
      nouveauxTaux.tauxReussite = { tauxGF: 0, tauxFilles: 0 };
    }

    // Taux d'échec
    const dataEchec = calculDataPrimaire.tauxEchec;
    const inscritsEchec = dataEchec.inscrits || 0;
    if (inscritsEchec > 0) {
      const tauxGFEchec = Math.round((dataEchec.echecs / inscritsEchec) * 100 * 100) / 100;
      const tauxFillesEchec = Math.round((dataEchec.filles / inscritsEchec) * 100 * 100) / 100;
      nouveauxTaux.tauxEchec = {
        tauxGF: tauxGFEchec,
        tauxFilles: tauxFillesEchec
      };
    } else {
      nouveauxTaux.tauxEchec = { tauxGF: 0, tauxFilles: 0 };
    }
    
    setEfficacitePrimaire(nouveauxTaux);
    setShowCalculModalPrimaire(false);
    
    // Sauvegarder immédiatement dans le brouillon
    setTimeout(() => {
      if (autoSaveForceSave) {
        autoSaveForceSave();
      }
    }, 500);
  };

  // Fonction pour ouvrir le modal de calcul secondaire
  const openCalculModalSecondaire = () => {
    setShowCalculModalSecondaire(true);
  };

  // Fonction pour obtenir la valeur maximale autorisée pour un champ (secondaire)
  const getMaxValueSecondaire = (indicateur: string, field: string) => {
    const data = calculDataSecondaire[indicateur as keyof typeof calculDataSecondaire];
    if (field === 'inscrits') return undefined;
    return data.inscrits || undefined;
  };

  // Fonction pour vérifier si un niveau est valide (secondaire)
  const isNiveauValidSecondaire = (indicateur: string) => {
    const data = calculDataSecondaire[indicateur as keyof typeof calculDataSecondaire];
    const inscrits = data.inscrits || 0;
    const abandons = (data as any).abandons || 0;
    const reussites = (data as any).reussites || 0;
    const echecs = (data as any).echecs || 0;
    return inscrits > 0 && (abandons + reussites + echecs) <= inscrits;
  };

  // Fonction pour obtenir le statut d'un niveau (secondaire)
  const getNiveauStatusSecondaire = (indicateur: string) => {
    const data = calculDataSecondaire[indicateur as keyof typeof calculDataSecondaire];
    const inscrits = data.inscrits || 0;
    const abandons = (data as any).abandons || 0;
    const reussites = (data as any).reussites || 0;
    const echecs = (data as any).echecs || 0;
    const total = abandons + reussites + echecs;
    
    if (inscrits === 0) {
      return { message: "Commencez par saisir le nombre d'inscrits", color: "text-orange-600" };
    }
    if (total > inscrits) {
      return { message: `Erreur: La somme (${total}) dépasse les inscrits (${inscrits})`, color: "text-red-600" };
    }
    if (total === inscrits) {
      return { message: "✓ Données cohérentes", color: "text-green-600" };
    }
    return { message: `${inscrits - total} places restantes`, color: "text-blue-600" };
  };

  // Fonction pour mettre à jour les données de calcul secondaire avec validation intelligente
  const updateCalculDataSecondaire = (indicateur: string, field: string, value: number) => {
    setCalculDataSecondaire(prev => {
      const updated = { ...prev };
      const currentData = updated[indicateur as keyof typeof updated];
      
      // Si on modifie les inscrits, réinitialiser les autres champs
      if (field === 'inscrits') {
        return {
          ...prev,
          [indicateur]: {
            inscrits: value,
            abandons: 0,
            reussites: 0,
            echecs: 0,
            garcons: 0,
            filles: 0
          }
        };
      }
      
      // Validation pour les autres champs
      const inscrits = currentData.inscrits || 0;
      const validatedValue = Math.max(0, Math.min(value, inscrits));
      
      // Empêcher la saisie si cela dépasserait les inscrits
      if (field === 'abandons' || field === 'reussites' || field === 'echecs') {
        const totalAutres = (field === 'abandons' ? 0 : (currentData as any).abandons || 0) +
                           (field === 'reussites' ? 0 : (currentData as any).reussites || 0) +
                           (field === 'echecs' ? 0 : (currentData as any).echecs || 0);
        
        if (validatedValue + totalAutres > inscrits) {
          // Ne pas mettre à jour, garder la valeur précédente
          return prev;
        }
      }
      
      // Si la saisie est valide, mettre à jour
      return {
        ...prev,
        [indicateur]: { ...currentData, [field]: validatedValue }
      };
    });
  };

  // Fonction pour mettre à jour les indicateurs d'efficacité secondaire
  const updateEfficaciteSecondaire = (indicateur: string, field: 'tauxGF' | 'tauxFilles', value: number) => {
    setEfficaciteSecondaire(prev => {
      const updated = { ...prev };
      const currentIndicateur = updated[indicateur as keyof typeof updated];
      currentIndicateur[field] = Math.max(0, Math.min(100, value)); // Limiter entre 0 et 100
      return updated;
    });
  };

  // Fonction pour calculer les taux secondaires à partir des nombres
  const calculerTauxSecondaires = () => {
    const nouveauxTaux: any = {};
    
    // Taux d'abandon
    const dataAbandon = calculDataSecondaire.tauxAbandon;
    const inscritsAbandon = dataAbandon.inscrits || 0;
    if (inscritsAbandon > 0) {
      const tauxGFAbandon = Math.round((dataAbandon.abandons / inscritsAbandon) * 100 * 100) / 100;
      const tauxFillesAbandon = Math.round((dataAbandon.filles / inscritsAbandon) * 100 * 100) / 100;
      nouveauxTaux.tauxAbandon = {
        tauxGF: tauxGFAbandon,
        tauxFilles: tauxFillesAbandon
      };
    } else {
      nouveauxTaux.tauxAbandon = { tauxGF: 0, tauxFilles: 0 };
    }

    // Taux de réussite
    const dataReussite = calculDataSecondaire.tauxReussite;
    const inscritsReussite = dataReussite.inscrits || 0;
    if (inscritsReussite > 0) {
      const tauxGFReussite = Math.round((dataReussite.reussites / inscritsReussite) * 100 * 100) / 100;
      const tauxFillesReussite = Math.round((dataReussite.filles / inscritsReussite) * 100 * 100) / 100;
      nouveauxTaux.tauxReussite = {
        tauxGF: tauxGFReussite,
        tauxFilles: tauxFillesReussite
      };
    } else {
      nouveauxTaux.tauxReussite = { tauxGF: 0, tauxFilles: 0 };
    }

    // Taux d'échec
    const dataEchec = calculDataSecondaire.tauxEchec;
    const inscritsEchec = dataEchec.inscrits || 0;
    if (inscritsEchec > 0) {
      const tauxGFEchec = Math.round((dataEchec.echecs / inscritsEchec) * 100 * 100) / 100;
      const tauxFillesEchec = Math.round((dataEchec.filles / inscritsEchec) * 100 * 100) / 100;
      nouveauxTaux.tauxEchec = {
        tauxGF: tauxGFEchec,
        tauxFilles: tauxFillesEchec
      };
    } else {
      nouveauxTaux.tauxEchec = { tauxGF: 0, tauxFilles: 0 };
    }
    
    setEfficaciteSecondaire(nouveauxTaux);
    setShowCalculModalSecondaire(false);
    
    // Sauvegarder immédiatement dans le brouillon
    setTimeout(() => {
      if (autoSaveForceSave) {
        autoSaveForceSave();
      }
    }, 500);
  };

  // Fonction pour ouvrir le modal de calcul OCDE
  const openCalculModalOCDE = () => {
    setShowCalculModalOCDE(true);
  };

  // Fonction pour réinitialiser l'efficacité OCDE
  const resetEfficaciteOCDE = () => {
    setTauxDiplomesOCDE({
      humanitesScientifiques: { tauxGF: 0, tauxFilles: 0 },
      humanitesTechniques: { tauxGF: 0, tauxFilles: 0 }
    });
  };

  // Fonction pour obtenir la valeur maximale autorisée pour un champ (OCDE)
  const getMaxValueOCDE = (filiere: string, field: string) => {
    const data = calculDataOCDE[filiere as keyof typeof calculDataOCDE];
    if (field === 'finalistes') return undefined;
    return data.finalistes || undefined;
  };

  // Fonction pour vérifier si une filière est valide (OCDE)
  const isFiliereValidOCDE = (filiere: string) => {
    const data = calculDataOCDE[filiere as keyof typeof calculDataOCDE];
    const finalistes = data.finalistes || 0;
    const diplomes = data.diplomes || 0;
    const garcons = data.garcons || 0;
    const filles = data.filles || 0;
    return finalistes > 0 && diplomes <= finalistes && (garcons + filles) <= diplomes;
  };

  // Fonction pour obtenir le statut d'une filière (OCDE)
  const getFiliereStatusOCDE = (filiere: string) => {
    const data = calculDataOCDE[filiere as keyof typeof calculDataOCDE];
    const finalistes = data.finalistes || 0;
    const diplomes = data.diplomes || 0;
    const garcons = data.garcons || 0;
    const filles = data.filles || 0;
    const totalGenre = garcons + filles;
    
    if (finalistes === 0) {
      return { message: "Commencez par saisir le nombre de finalistes", color: "text-orange-600" };
    }
    if (diplomes > finalistes) {
      return { message: `Erreur: Les diplômés (${diplomes}) dépassent les finalistes (${finalistes})`, color: "text-red-600" };
    }
    if (totalGenre > diplomes) {
      return { message: `Erreur: La répartition par genre (${totalGenre}) dépasse les diplômés (${diplomes})`, color: "text-red-600" };
    }
    if (diplomes === finalistes && totalGenre === diplomes) {
      return { message: "✓ Données cohérentes", color: "text-green-600" };
    }
    return { message: `${finalistes - diplomes} finalistes restants, ${diplomes - totalGenre} diplômés à répartir`, color: "text-blue-600" };
  };

  // Fonction pour mettre à jour les données de calcul OCDE avec validation intelligente
  const updateCalculDataOCDE = (diplome: string, field: string, value: number) => {
    setCalculDataOCDE(prev => {
      const updated = { ...prev };
      const currentData = updated[diplome as keyof typeof updated];
      
      // Si on modifie les finalistes, réinitialiser les autres champs
      if (field === 'finalistes') {
        return {
          ...prev,
          [diplome]: {
            finalistes: value,
            diplomes: 0,
            garcons: 0,
            filles: 0
          }
        };
      }
      
      // Validation pour les diplômés
      const finalistes = currentData.finalistes || 0;
      const validatedValue = Math.max(0, Math.min(value, finalistes));
      
      // Empêcher la saisie si cela dépasserait les finalistes
      if (field === 'diplomes') {
        if (validatedValue > finalistes) {
          return prev;
        }
      }
      
      // Validation pour la répartition par genre
      if (field === 'garcons' || field === 'filles') {
        const diplomes = currentData.diplomes || 0;
        const totalAutres = (field === 'garcons' ? 0 : currentData.garcons || 0) +
                           (field === 'filles' ? 0 : currentData.filles || 0);
        
        if (validatedValue + totalAutres > diplomes) {
          return prev;
        }
      }
      
      // Si la saisie est valide, mettre à jour
      return {
        ...prev,
        [diplome]: { ...currentData, [field]: validatedValue }
      };
    });
  };

  // Fonction pour mettre à jour les taux de diplômes OCDE
  const updateTauxDiplomesOCDE = (diplome: string, field: 'tauxGF' | 'tauxFilles', value: number) => {
    setTauxDiplomesOCDE(prev => {
      const updated = { ...prev };
      const currentDiplome = updated[diplome as keyof typeof updated];
      currentDiplome[field] = Math.max(0, Math.min(100, value)); // Limiter entre 0 et 100
      return updated;
    });
  };

  // Fonction pour calculer les taux OCDE à partir des nombres
  const calculerTauxOCDE = () => {
    const nouveauxTaux: any = {};
    
    // Humanités Scientifiques
    const dataScientifiques = calculDataOCDE.humanitesScientifiques;
    const finalistesScientifiques = dataScientifiques.finalistes || 0;
    if (finalistesScientifiques > 0) {
      const tauxGFScientifiques = Math.round((dataScientifiques.diplomes / finalistesScientifiques) * 100 * 100) / 100;
      const tauxFillesScientifiques = Math.round((dataScientifiques.filles / finalistesScientifiques) * 100 * 100) / 100;
      nouveauxTaux.humanitesScientifiques = {
        tauxGF: tauxGFScientifiques,
        tauxFilles: tauxFillesScientifiques
      };
    } else {
      nouveauxTaux.humanitesScientifiques = { tauxGF: 0, tauxFilles: 0 };
    }

    // Humanités Techniques
    const dataTechniques = calculDataOCDE.humanitesTechniques;
    const finalistesTechniques = dataTechniques.finalistes || 0;
    if (finalistesTechniques > 0) {
      const tauxGFTechniques = Math.round((dataTechniques.diplomes / finalistesTechniques) * 100 * 100) / 100;
      const tauxFillesTechniques = Math.round((dataTechniques.filles / finalistesTechniques) * 100 * 100) / 100;
      nouveauxTaux.humanitesTechniques = {
        tauxGF: tauxGFTechniques,
        tauxFilles: tauxFillesTechniques
      };
    } else {
      nouveauxTaux.humanitesTechniques = { tauxGF: 0, tauxFilles: 0 };
    }
    
    setTauxDiplomesOCDE(nouveauxTaux);
    setShowCalculModalOCDE(false);
    
    // Sauvegarder immédiatement dans le brouillon
    setTimeout(() => {
      if (autoSaveForceSave) {
        autoSaveForceSave();
      }
    }, 500);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h3 className="text-lg font-medium mb-4 text-primary">III. EVALUATION QUALITATIVE (SUITE)</h3>
      
      {/* III.1.3. Matériels Didactiques */}
      <div className="mb-6">
        <h4 className="font-bold mb-3">III.1.3. Matériels Didactiques</h4>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-3 py-2 text-left">Niveau d'Enseignement</th>
                <th className="border border-gray-300 px-3 py-2 text-center">TRES BON</th>
                <th className="border border-gray-300 px-3 py-2 text-center">BON</th>
                <th className="border border-gray-300 px-3 py-2 text-center">CARENCE</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-3 py-2">a) Espace Communautaire d'éveil (ECE)</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="radio" 
                    name="mat_1" 
                    className="mx-auto block" 
                    checked={formData?.ameliorationQualite?.disponibiliteMoyensEnseignement?.materielsDidactiques?.ece === 'TRES BON'}
                    onChange={() => safeSetFormData((prev: any) => ({
                      ...prev,
                      ameliorationQualite: {
                        ...prev.ameliorationQualite,
                        disponibiliteMoyensEnseignement: {
                          ...prev.ameliorationQualite?.disponibiliteMoyensEnseignement,
                          materielsDidactiques: {
                            ...prev.ameliorationQualite?.disponibiliteMoyensEnseignement?.materielsDidactiques,
                            ece: 'TRES BON'
                          }
                        }
                      }
                    }))}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="radio" 
                    name="mat_1" 
                    className="mx-auto block" 
                    checked={formData?.ameliorationQualite?.disponibiliteMoyensEnseignement?.materielsDidactiques?.ece === 'BON'}
                    onChange={() => safeSetFormData((prev: any) => ({
                      ...prev,
                      ameliorationQualite: {
                        ...prev.ameliorationQualite,
                        disponibiliteMoyensEnseignement: {
                          ...prev.ameliorationQualite?.disponibiliteMoyensEnseignement,
                          materielsDidactiques: {
                            ...prev.ameliorationQualite?.disponibiliteMoyensEnseignement?.materielsDidactiques,
                            ece: 'BON'
                          }
                        }
                      }
                    }))}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="radio" 
                    name="mat_1" 
                    className="mx-auto block" 
                    checked={formData?.ameliorationQualite?.disponibiliteMoyensEnseignement?.materielsDidactiques?.ece === 'CARENCE'}
                    onChange={() => safeSetFormData((prev: any) => ({
                      ...prev,
                      ameliorationQualite: {
                        ...prev.ameliorationQualite,
                        disponibiliteMoyensEnseignement: {
                          ...prev.ameliorationQualite?.disponibiliteMoyensEnseignement,
                          materielsDidactiques: {
                            ...prev.ameliorationQualite?.disponibiliteMoyensEnseignement?.materielsDidactiques,
                            ece: 'CARENCE'
                          }
                        }
                      }
                    }))}
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">b) Préprimaire</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="radio" 
                    name="mat_2" 
                    className="mx-auto block" 
                    checked={formData?.ameliorationQualite?.disponibiliteMoyensEnseignement?.materielsDidactiques?.preprimaire === 'TRES BON'}
                    onChange={() => safeSetFormData((prev: any) => ({
                      ...prev,
                      ameliorationQualite: {
                        ...prev.ameliorationQualite,
                        disponibiliteMoyensEnseignement: {
                          ...prev.ameliorationQualite?.disponibiliteMoyensEnseignement,
                          materielsDidactiques: {
                            ...prev.ameliorationQualite?.disponibiliteMoyensEnseignement?.materielsDidactiques,
                            preprimaire: 'TRES BON'
                          }
                        }
                      }
                    }))}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="radio" 
                    name="mat_2" 
                    className="mx-auto block" 
                    checked={formData?.ameliorationQualite?.disponibiliteMoyensEnseignement?.materielsDidactiques?.preprimaire === 'BON'}
                    onChange={() => safeSetFormData((prev: any) => ({
                      ...prev,
                      ameliorationQualite: {
                        ...prev.ameliorationQualite,
                        disponibiliteMoyensEnseignement: {
                          ...prev.ameliorationQualite?.disponibiliteMoyensEnseignement,
                          materielsDidactiques: {
                            ...prev.ameliorationQualite?.disponibiliteMoyensEnseignement?.materielsDidactiques,
                            preprimaire: 'BON'
                          }
                        }
                      }
                    }))}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="radio" 
                    name="mat_2" 
                    className="mx-auto block" 
                    checked={formData?.ameliorationQualite?.disponibiliteMoyensEnseignement?.materielsDidactiques?.preprimaire === 'CARENCE'}
                    onChange={() => safeSetFormData((prev: any) => ({
                      ...prev,
                      ameliorationQualite: {
                        ...prev.ameliorationQualite,
                        disponibiliteMoyensEnseignement: {
                          ...prev.ameliorationQualite?.disponibiliteMoyensEnseignement,
                          materielsDidactiques: {
                            ...prev.ameliorationQualite?.disponibiliteMoyensEnseignement?.materielsDidactiques,
                            preprimaire: 'CARENCE'
                          }
                        }
                      }
                    }))}
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">c) Maternel</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="radio" 
                    name="mat_3" 
                    className="mx-auto block" 
                    checked={formData?.ameliorationQualite?.disponibiliteMoyensEnseignement?.materielsDidactiques?.maternel === 'TRES BON'}
                    onChange={() => safeSetFormData((prev: any) => ({
                      ...prev,
                      ameliorationQualite: {
                        ...prev.ameliorationQualite,
                        disponibiliteMoyensEnseignement: {
                          ...prev.ameliorationQualite?.disponibiliteMoyensEnseignement,
                          materielsDidactiques: {
                            ...prev.ameliorationQualite?.disponibiliteMoyensEnseignement?.materielsDidactiques,
                            maternel: 'TRES BON'
                          }
                        }
                      }
                    }))}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="radio" 
                    name="mat_3" 
                    className="mx-auto block" 
                    checked={formData?.ameliorationQualite?.disponibiliteMoyensEnseignement?.materielsDidactiques?.maternel === 'BON'}
                    onChange={() => safeSetFormData((prev: any) => ({
                      ...prev,
                      ameliorationQualite: {
                        ...prev.ameliorationQualite,
                        disponibiliteMoyensEnseignement: {
                          ...prev.ameliorationQualite?.disponibiliteMoyensEnseignement,
                          materielsDidactiques: {
                            ...prev.ameliorationQualite?.disponibiliteMoyensEnseignement?.materielsDidactiques,
                            maternel: 'BON'
                          }
                        }
                      }
                    }))}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="radio" 
                    name="mat_3" 
                    className="mx-auto block" 
                    checked={formData?.ameliorationQualite?.disponibiliteMoyensEnseignement?.materielsDidactiques?.maternel === 'CARENCE'}
                    onChange={() => safeSetFormData((prev: any) => ({
                      ...prev,
                      ameliorationQualite: {
                        ...prev.ameliorationQualite,
                        disponibiliteMoyensEnseignement: {
                          ...prev.ameliorationQualite?.disponibiliteMoyensEnseignement,
                          materielsDidactiques: {
                            ...prev.ameliorationQualite?.disponibiliteMoyensEnseignement?.materielsDidactiques,
                            maternel: 'CARENCE'
                          }
                        }
                      }
                    }))}
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">d) Primaire</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="radio" 
                    name="mat_4" 
                    className="mx-auto block" 
                    checked={formData?.ameliorationQualite?.disponibiliteMoyensEnseignement?.materielsDidactiques?.primaire === 'TRES BON'}
                    onChange={() => safeSetFormData((prev: any) => ({
                      ...prev,
                      ameliorationQualite: {
                        ...prev.ameliorationQualite,
                        disponibiliteMoyensEnseignement: {
                          ...prev.ameliorationQualite?.disponibiliteMoyensEnseignement,
                          materielsDidactiques: {
                            ...prev.ameliorationQualite?.disponibiliteMoyensEnseignement?.materielsDidactiques,
                            primaire: 'TRES BON'
                          }
                        }
                      }
                    }))}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="radio" 
                    name="mat_4" 
                    className="mx-auto block" 
                    checked={formData?.ameliorationQualite?.disponibiliteMoyensEnseignement?.materielsDidactiques?.primaire === 'BON'}
                    onChange={() => safeSetFormData((prev: any) => ({
                      ...prev,
                      ameliorationQualite: {
                        ...prev.ameliorationQualite,
                        disponibiliteMoyensEnseignement: {
                          ...prev.ameliorationQualite?.disponibiliteMoyensEnseignement,
                          materielsDidactiques: {
                            ...prev.ameliorationQualite?.disponibiliteMoyensEnseignement?.materielsDidactiques,
                            primaire: 'BON'
                          }
                        }
                      }
                    }))}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="radio" 
                    name="mat_4" 
                    className="mx-auto block" 
                    checked={formData?.ameliorationQualite?.disponibiliteMoyensEnseignement?.materielsDidactiques?.primaire === 'CARENCE'}
                    onChange={() => safeSetFormData((prev: any) => ({
                      ...prev,
                      ameliorationQualite: {
                        ...prev.ameliorationQualite,
                        disponibiliteMoyensEnseignement: {
                          ...prev.ameliorationQualite?.disponibiliteMoyensEnseignement,
                          materielsDidactiques: {
                            ...prev.ameliorationQualite?.disponibiliteMoyensEnseignement?.materielsDidactiques,
                            primaire: 'CARENCE'
                          }
                        }
                      }
                    }))}
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">e) Secondaire</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="radio" 
                    name="mat_5" 
                    className="mx-auto block" 
                    checked={formData?.ameliorationQualite?.disponibiliteMoyensEnseignement?.materielsDidactiques?.secondaire === 'TRES BON'}
                    onChange={() => safeSetFormData((prev: any) => ({
                      ...prev,
                      ameliorationQualite: {
                        ...prev.ameliorationQualite,
                        disponibiliteMoyensEnseignement: {
                          ...prev.ameliorationQualite?.disponibiliteMoyensEnseignement,
                          materielsDidactiques: {
                            ...prev.ameliorationQualite?.disponibiliteMoyensEnseignement?.materielsDidactiques,
                            secondaire: 'TRES BON'
                          }
                        }
                      }
                    }))}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="radio" 
                    name="mat_5" 
                    className="mx-auto block" 
                    checked={formData?.ameliorationQualite?.disponibiliteMoyensEnseignement?.materielsDidactiques?.secondaire === 'BON'}
                    onChange={() => safeSetFormData((prev: any) => ({
                      ...prev,
                      ameliorationQualite: {
                        ...prev.ameliorationQualite,
                        disponibiliteMoyensEnseignement: {
                          ...prev.ameliorationQualite?.disponibiliteMoyensEnseignement,
                          materielsDidactiques: {
                            ...prev.ameliorationQualite?.disponibiliteMoyensEnseignement?.materielsDidactiques,
                            secondaire: 'BON'
                          }
                        }
                      }
                    }))}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="radio" 
                    name="mat_5" 
                    className="mx-auto block" 
                    checked={formData?.ameliorationQualite?.disponibiliteMoyensEnseignement?.materielsDidactiques?.secondaire === 'CARENCE'}
                    onChange={() => safeSetFormData((prev: any) => ({
                      ...prev,
                      ameliorationQualite: {
                        ...prev.ameliorationQualite,
                        disponibiliteMoyensEnseignement: {
                          ...prev.ameliorationQualite?.disponibiliteMoyensEnseignement,
                          materielsDidactiques: {
                            ...prev.ameliorationQualite?.disponibiliteMoyensEnseignement?.materielsDidactiques,
                            secondaire: 'CARENCE'
                          }
                        }
                      }
                    }))}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* III.1.4. Matériels & Réactif des Laboratoires */}
      <div className="mb-6">
        <h4 className="font-bold mb-3">III.1.4. Matériels & Réactif des Laboratoires: HUMANITES SCIENTIFIQUES</h4>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-3 py-2 text-left">Laboratoire</th>
                <th className="border border-gray-300 px-3 py-2 text-center">TRES BON</th>
                <th className="border border-gray-300 px-3 py-2 text-center">BON</th>
                <th className="border border-gray-300 px-3 py-2 text-center">CARENCE</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-3 py-2">a) LABORATOIRE DE CHIMIE</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="radio" 
                    name="lab_chimie" 
                    className="mx-auto block" 
                    checked={formData?.ameliorationQualite?.disponibiliteMoyensEnseignement?.laboratoires?.chimie === 'TRES BON'}
                    onChange={() => safeSetFormData((prev: any) => ({
                      ...prev,
                      ameliorationQualite: {
                        ...prev.ameliorationQualite,
                        disponibiliteMoyensEnseignement: {
                          ...prev.ameliorationQualite?.disponibiliteMoyensEnseignement,
                          laboratoires: {
                            ...prev.ameliorationQualite?.disponibiliteMoyensEnseignement?.laboratoires,
                            chimie: 'TRES BON'
                          }
                        }
                      }
                    }))}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="radio" 
                    name="lab_chimie" 
                    className="mx-auto block" 
                    checked={formData?.ameliorationQualite?.disponibiliteMoyensEnseignement?.laboratoires?.chimie === 'BON'}
                    onChange={() => safeSetFormData((prev: any) => ({
                      ...prev,
                      ameliorationQualite: {
                        ...prev.ameliorationQualite,
                        disponibiliteMoyensEnseignement: {
                          ...prev.ameliorationQualite?.disponibiliteMoyensEnseignement,
                          laboratoires: {
                            ...prev.ameliorationQualite?.disponibiliteMoyensEnseignement?.laboratoires,
                            chimie: 'BON'
                          }
                        }
                      }
                    }))}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="radio" 
                    name="lab_chimie" 
                    className="mx-auto block" 
                    checked={formData?.ameliorationQualite?.disponibiliteMoyensEnseignement?.laboratoires?.chimie === 'CARENCE'}
                    onChange={() => safeSetFormData((prev: any) => ({
                      ...prev,
                      ameliorationQualite: {
                        ...prev.ameliorationQualite,
                        disponibiliteMoyensEnseignement: {
                          ...prev.ameliorationQualite?.disponibiliteMoyensEnseignement,
                          laboratoires: {
                            ...prev.ameliorationQualite?.disponibiliteMoyensEnseignement?.laboratoires,
                            chimie: 'CARENCE'
                          }
                        }
                      }
                    }))}
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">b) LABORATOIRE DE BIOLOGIE</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="radio" 
                    name="lab_bio" 
                    className="mx-auto block" 
                    checked={formData?.ameliorationQualite?.disponibiliteMoyensEnseignement?.laboratoires?.biologie === 'TRES BON'}
                    onChange={() => safeSetFormData((prev: any) => ({
                      ...prev,
                      ameliorationQualite: {
                        ...prev.ameliorationQualite,
                        disponibiliteMoyensEnseignement: {
                          ...prev.ameliorationQualite?.disponibiliteMoyensEnseignement,
                          laboratoires: {
                            ...prev.ameliorationQualite?.disponibiliteMoyensEnseignement?.laboratoires,
                            biologie: 'TRES BON'
                          }
                        }
                      }
                    }))}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="radio" 
                    name="lab_bio" 
                    className="mx-auto block" 
                    checked={formData?.ameliorationQualite?.disponibiliteMoyensEnseignement?.laboratoires?.biologie === 'BON'}
                    onChange={() => safeSetFormData((prev: any) => ({
                      ...prev,
                      ameliorationQualite: {
                        ...prev.ameliorationQualite,
                        disponibiliteMoyensEnseignement: {
                          ...prev.ameliorationQualite?.disponibiliteMoyensEnseignement,
                          laboratoires: {
                            ...prev.ameliorationQualite?.disponibiliteMoyensEnseignement?.laboratoires,
                            biologie: 'BON'
                          }
                        }
                      }
                    }))}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="radio" 
                    name="lab_bio" 
                    className="mx-auto block" 
                    checked={formData?.ameliorationQualite?.disponibiliteMoyensEnseignement?.laboratoires?.biologie === 'CARENCE'}
                    onChange={() => safeSetFormData((prev: any) => ({
                      ...prev,
                      ameliorationQualite: {
                        ...prev.ameliorationQualite,
                        disponibiliteMoyensEnseignement: {
                          ...prev.ameliorationQualite?.disponibiliteMoyensEnseignement,
                          laboratoires: {
                            ...prev.ameliorationQualite?.disponibiliteMoyensEnseignement?.laboratoires,
                            biologie: 'CARENCE'
                          }
                        }
                      }
                    }))}
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">c) LABORATOIRE DE PHYSIQUE</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="radio" 
                    name="lab_phys" 
                    className="mx-auto block" 
                    checked={formData?.ameliorationQualite?.disponibiliteMoyensEnseignement?.laboratoires?.physique === 'TRES BON'}
                    onChange={() => safeSetFormData((prev: any) => ({
                      ...prev,
                      ameliorationQualite: {
                        ...prev.ameliorationQualite,
                        disponibiliteMoyensEnseignement: {
                          ...prev.ameliorationQualite?.disponibiliteMoyensEnseignement,
                          laboratoires: {
                            ...prev.ameliorationQualite?.disponibiliteMoyensEnseignement?.laboratoires,
                            physique: 'TRES BON'
                          }
                        }
                      }
                    }))}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="radio" 
                    name="lab_phys" 
                    className="mx-auto block" 
                    checked={formData?.ameliorationQualite?.disponibiliteMoyensEnseignement?.laboratoires?.physique === 'BON'}
                    onChange={() => safeSetFormData((prev: any) => ({
                      ...prev,
                      ameliorationQualite: {
                        ...prev.ameliorationQualite,
                        disponibiliteMoyensEnseignement: {
                          ...prev.ameliorationQualite?.disponibiliteMoyensEnseignement,
                          laboratoires: {
                            ...prev.ameliorationQualite?.disponibiliteMoyensEnseignement?.laboratoires,
                            physique: 'BON'
                          }
                        }
                      }
                    }))}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="radio" 
                    name="lab_phys" 
                    className="mx-auto block" 
                    checked={formData?.ameliorationQualite?.disponibiliteMoyensEnseignement?.laboratoires?.physique === 'CARENCE'}
                    onChange={() => safeSetFormData((prev: any) => ({
                      ...prev,
                      ameliorationQualite: {
                        ...prev.ameliorationQualite,
                        disponibiliteMoyensEnseignement: {
                          ...prev.ameliorationQualite?.disponibiliteMoyensEnseignement,
                          laboratoires: {
                            ...prev.ameliorationQualite?.disponibiliteMoyensEnseignement?.laboratoires,
                            physique: 'CARENCE'
                          }
                        }
                      }
                    }))}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* III.1.5. Equipements Ateliers */}
      <div className="mb-6">
        <h4 className="font-bold mb-3">III.1.5. Equipements Ateliers: HUMANITES TECHNIQUES</h4>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-3 py-2 text-left">Equipement</th>
                <th className="border border-gray-300 px-3 py-2 text-center">TRES BON</th>
                <th className="border border-gray-300 px-3 py-2 text-center">BON</th>
                <th className="border border-gray-300 px-3 py-2 text-center">CARENCE</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-3 py-2">a) EQUIPEMENTS ATELIERS</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="radio" 
                    name="atelier" 
                    className="mx-auto block" 
                    checked={formData?.ameliorationQualite?.disponibiliteMoyensEnseignement?.equipementsAteliers?.humanitesTechniques === 'TRES BON'}
                    onChange={() => safeSetFormData((prev: any) => ({
                      ...prev,
                      ameliorationQualite: {
                        ...prev.ameliorationQualite,
                        disponibiliteMoyensEnseignement: {
                          ...prev.ameliorationQualite?.disponibiliteMoyensEnseignement,
                          equipementsAteliers: {
                            ...prev.ameliorationQualite?.disponibiliteMoyensEnseignement?.equipementsAteliers,
                            humanitesTechniques: 'TRES BON'
                          }
                        }
                      }
                    }))}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="radio" 
                    name="atelier" 
                    className="mx-auto block" 
                    checked={formData?.ameliorationQualite?.disponibiliteMoyensEnseignement?.equipementsAteliers?.humanitesTechniques === 'BON'}
                    onChange={() => safeSetFormData((prev: any) => ({
                      ...prev,
                      ameliorationQualite: {
                        ...prev.ameliorationQualite,
                        disponibiliteMoyensEnseignement: {
                          ...prev.ameliorationQualite?.disponibiliteMoyensEnseignement,
                          equipementsAteliers: {
                            ...prev.ameliorationQualite?.disponibiliteMoyensEnseignement?.equipementsAteliers,
                            humanitesTechniques: 'BON'
                          }
                        }
                      }
                    }))}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="radio" 
                    name="atelier" 
                    className="mx-auto block" 
                    checked={formData?.ameliorationQualite?.disponibiliteMoyensEnseignement?.equipementsAteliers?.humanitesTechniques === 'CARENCE'}
                    onChange={() => safeSetFormData((prev: any) => ({
                      ...prev,
                      ameliorationQualite: {
                        ...prev.ameliorationQualite,
                        disponibiliteMoyensEnseignement: {
                          ...prev.ameliorationQualite?.disponibiliteMoyensEnseignement,
                          equipementsAteliers: {
                            ...prev.ameliorationQualite?.disponibiliteMoyensEnseignement?.equipementsAteliers,
                            humanitesTechniques: 'CARENCE'
                          }
                        }
                      }
                    }))}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* III.2. Visites des classes & réunions pédagogiques */}
      <div className="mb-6">
        <h4 className="font-bold mb-3">III.2. Visites des classes & réunions pédagogiques par les C.E et fonctionnement des cellules de base d'encadrement & de formation (Unites Pédagogiques)</h4>
        
        {/* III.2.1. Fréquences des Visites des Classes */}
        <div className="mb-4">
          <h5 className="font-bold mb-2">III.2.1. Fréquences des Visites des Classes</h5>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left">Niveau d'Enseignement</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">TRES BON</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">BON</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">ASSEZ BON</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">a) Espace Communautaire d'éveil (ECE)</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="radio" 
                      name="visite_1" 
                      className="mx-auto block" 
                      checked={formData?.ameliorationQualite?.visitesEtReunions?.visitesClasses?.ece === 'TRES BON'}
                      onChange={() => safeSetFormData((prev: any) => ({
                        ...prev,
                        ameliorationQualite: {
                          ...prev.ameliorationQualite,
                          visitesEtReunions: {
                            ...prev.ameliorationQualite?.visitesEtReunions,
                            visitesClasses: {
                              ...prev.ameliorationQualite?.visitesEtReunions?.visitesClasses,
                              ece: 'TRES BON'
                            }
                          }
                        }
                      }))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="radio" 
                      name="visite_1" 
                      className="mx-auto block" 
                      checked={formData?.ameliorationQualite?.visitesEtReunions?.visitesClasses?.ece === 'BON'}
                      onChange={() => safeSetFormData((prev: any) => ({
                        ...prev,
                        ameliorationQualite: {
                          ...prev.ameliorationQualite,
                          visitesEtReunions: {
                            ...prev.ameliorationQualite?.visitesEtReunions,
                            visitesClasses: {
                              ...prev.ameliorationQualite?.visitesEtReunions?.visitesClasses,
                              ece: 'BON'
                            }
                          }
                        }
                      }))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="radio" 
                      name="visite_1" 
                      className="mx-auto block" 
                      checked={formData?.ameliorationQualite?.visitesEtReunions?.visitesClasses?.ece === 'ASSEZ BON'}
                      onChange={() => safeSetFormData((prev: any) => ({
                        ...prev,
                        ameliorationQualite: {
                          ...prev.ameliorationQualite,
                          visitesEtReunions: {
                            ...prev.ameliorationQualite?.visitesEtReunions,
                            visitesClasses: {
                              ...prev.ameliorationQualite?.visitesEtReunions?.visitesClasses,
                              ece: 'ASSEZ BON'
                            }
                          }
                        }
                      }))}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">b) Préprimaire</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="radio" 
                      name="visite_2" 
                      className="mx-auto block" 
                      checked={formData?.ameliorationQualite?.visitesEtReunions?.visitesClasses?.preprimaire === 'TRES BON'}
                      onChange={() => safeSetFormData((prev: any) => ({
                        ...prev,
                        ameliorationQualite: {
                          ...prev.ameliorationQualite,
                          visitesEtReunions: {
                            ...prev.ameliorationQualite?.visitesEtReunions,
                            visitesClasses: {
                              ...prev.ameliorationQualite?.visitesEtReunions?.visitesClasses,
                              preprimaire: 'TRES BON'
                            }
                          }
                        }
                      }))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="radio" 
                      name="visite_2" 
                      className="mx-auto block" 
                      checked={formData?.ameliorationQualite?.visitesEtReunions?.visitesClasses?.preprimaire === 'BON'}
                      onChange={() => safeSetFormData((prev: any) => ({
                        ...prev,
                        ameliorationQualite: {
                          ...prev.ameliorationQualite,
                          visitesEtReunions: {
                            ...prev.ameliorationQualite?.visitesEtReunions,
                            visitesClasses: {
                              ...prev.ameliorationQualite?.visitesEtReunions?.visitesClasses,
                              preprimaire: 'BON'
                            }
                          }
                        }
                      }))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="radio" 
                      name="visite_2" 
                      className="mx-auto block" 
                      checked={formData?.ameliorationQualite?.visitesEtReunions?.visitesClasses?.preprimaire === 'ASSEZ BON'}
                      onChange={() => safeSetFormData((prev: any) => ({
                        ...prev,
                        ameliorationQualite: {
                          ...prev.ameliorationQualite,
                          visitesEtReunions: {
                            ...prev.ameliorationQualite?.visitesEtReunions,
                            visitesClasses: {
                              ...prev.ameliorationQualite?.visitesEtReunions?.visitesClasses,
                              preprimaire: 'ASSEZ BON'
                            }
                          }
                        }
                      }))}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">c) Maternel</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="radio" 
                      name="visite_3" 
                      className="mx-auto block" 
                      checked={formData?.ameliorationQualite?.visitesEtReunions?.visitesClasses?.maternel === 'TRES BON'}
                      onChange={() => safeSetFormData((prev: any) => ({
                        ...prev,
                        ameliorationQualite: {
                          ...prev.ameliorationQualite,
                          visitesEtReunions: {
                            ...prev.ameliorationQualite?.visitesEtReunions,
                            visitesClasses: {
                              ...prev.ameliorationQualite?.visitesEtReunions?.visitesClasses,
                              maternel: 'TRES BON'
                            }
                          }
                        }
                      }))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="radio" 
                      name="visite_3" 
                      className="mx-auto block" 
                      checked={formData?.ameliorationQualite?.visitesEtReunions?.visitesClasses?.maternel === 'BON'}
                      onChange={() => safeSetFormData((prev: any) => ({
                        ...prev,
                        ameliorationQualite: {
                          ...prev.ameliorationQualite,
                          visitesEtReunions: {
                            ...prev.ameliorationQualite?.visitesEtReunions,
                            visitesClasses: {
                              ...prev.ameliorationQualite?.visitesEtReunions?.visitesClasses,
                              maternel: 'BON'
                            }
                          }
                        }
                      }))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="radio" 
                      name="visite_3" 
                      className="mx-auto block" 
                      checked={formData?.ameliorationQualite?.visitesEtReunions?.visitesClasses?.maternel === 'ASSEZ BON'}
                      onChange={() => safeSetFormData((prev: any) => ({
                        ...prev,
                        ameliorationQualite: {
                          ...prev.ameliorationQualite,
                          visitesEtReunions: {
                            ...prev.ameliorationQualite?.visitesEtReunions,
                            visitesClasses: {
                              ...prev.ameliorationQualite?.visitesEtReunions?.visitesClasses,
                              maternel: 'ASSEZ BON'
                            }
                          }
                        }
                      }))}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">d) Primaire</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="radio" 
                      name="visite_4" 
                      className="mx-auto block" 
                      checked={formData?.ameliorationQualite?.visitesEtReunions?.visitesClasses?.primaire === 'TRES BON'}
                      onChange={() => safeSetFormData((prev: any) => ({
                        ...prev,
                        ameliorationQualite: {
                          ...prev.ameliorationQualite,
                          visitesEtReunions: {
                            ...prev.ameliorationQualite?.visitesEtReunions,
                            visitesClasses: {
                              ...prev.ameliorationQualite?.visitesEtReunions?.visitesClasses,
                              primaire: 'TRES BON'
                            }
                          }
                        }
                      }))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="radio" 
                      name="visite_4" 
                      className="mx-auto block" 
                      checked={formData?.ameliorationQualite?.visitesEtReunions?.visitesClasses?.primaire === 'BON'}
                      onChange={() => safeSetFormData((prev: any) => ({
                        ...prev,
                        ameliorationQualite: {
                          ...prev.ameliorationQualite,
                          visitesEtReunions: {
                            ...prev.ameliorationQualite?.visitesEtReunions,
                            visitesClasses: {
                              ...prev.ameliorationQualite?.visitesEtReunions?.visitesClasses,
                              primaire: 'BON'
                            }
                          }
                        }
                      }))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="radio" 
                      name="visite_4" 
                      className="mx-auto block" 
                      checked={formData?.ameliorationQualite?.visitesEtReunions?.visitesClasses?.primaire === 'ASSEZ BON'}
                      onChange={() => safeSetFormData((prev: any) => ({
                        ...prev,
                        ameliorationQualite: {
                          ...prev.ameliorationQualite,
                          visitesEtReunions: {
                            ...prev.ameliorationQualite?.visitesEtReunions,
                            visitesClasses: {
                              ...prev.ameliorationQualite?.visitesEtReunions?.visitesClasses,
                              primaire: 'ASSEZ BON'
                            }
                          }
                        }
                      }))}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">e) Secondaire</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="radio" 
                      name="visite_5" 
                      className="mx-auto block" 
                      checked={formData?.ameliorationQualite?.visitesEtReunions?.visitesClasses?.secondaire === 'TRES BON'}
                      onChange={() => safeSetFormData((prev: any) => ({
                        ...prev,
                        ameliorationQualite: {
                          ...prev.ameliorationQualite,
                          visitesEtReunions: {
                            ...prev.ameliorationQualite?.visitesEtReunions,
                            visitesClasses: {
                              ...prev.ameliorationQualite?.visitesEtReunions?.visitesClasses,
                              secondaire: 'TRES BON'
                            }
                          }
                        }
                      }))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="radio" 
                      name="visite_5" 
                      className="mx-auto block" 
                      checked={formData?.ameliorationQualite?.visitesEtReunions?.visitesClasses?.secondaire === 'BON'}
                      onChange={() => safeSetFormData((prev: any) => ({
                        ...prev,
                        ameliorationQualite: {
                          ...prev.ameliorationQualite,
                          visitesEtReunions: {
                            ...prev.ameliorationQualite?.visitesEtReunions,
                            visitesClasses: {
                              ...prev.ameliorationQualite?.visitesEtReunions?.visitesClasses,
                              secondaire: 'BON'
                            }
                          }
                        }
                      }))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="radio" 
                      name="visite_5" 
                      className="mx-auto block" 
                      checked={formData?.ameliorationQualite?.visitesEtReunions?.visitesClasses?.secondaire === 'ASSEZ BON'}
                      onChange={() => safeSetFormData((prev: any) => ({
                        ...prev,
                        ameliorationQualite: {
                          ...prev.ameliorationQualite,
                          visitesEtReunions: {
                            ...prev.ameliorationQualite?.visitesEtReunions,
                            visitesClasses: {
                              ...prev.ameliorationQualite?.visitesEtReunions?.visitesClasses,
                              secondaire: 'ASSEZ BON'
                            }
                          }
                        }
                      }))}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">f) Spécial (handicap : Tout niveau confondu)</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="radio" 
                      name="visite_6" 
                      className="mx-auto block" 
                      checked={formData?.ameliorationQualite?.visitesEtReunions?.visitesClasses?.special === 'TRES BON'}
                      onChange={() => safeSetFormData((prev: any) => ({
                        ...prev,
                        ameliorationQualite: {
                          ...prev.ameliorationQualite,
                          visitesEtReunions: {
                            ...prev.ameliorationQualite?.visitesEtReunions,
                            visitesClasses: {
                              ...prev.ameliorationQualite?.visitesEtReunions?.visitesClasses,
                              special: 'TRES BON'
                            }
                          }
                        }
                      }))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="radio" 
                      name="visite_6" 
                      className="mx-auto block" 
                      checked={formData?.ameliorationQualite?.visitesEtReunions?.visitesClasses?.special === 'BON'}
                      onChange={() => safeSetFormData((prev: any) => ({
                        ...prev,
                        ameliorationQualite: {
                          ...prev.ameliorationQualite,
                          visitesEtReunions: {
                            ...prev.ameliorationQualite?.visitesEtReunions,
                            visitesClasses: {
                              ...prev.ameliorationQualite?.visitesEtReunions?.visitesClasses,
                              special: 'BON'
                            }
                          }
                        }
                      }))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="radio" 
                      name="visite_6" 
                      className="mx-auto block" 
                      checked={formData?.ameliorationQualite?.visitesEtReunions?.visitesClasses?.special === 'ASSEZ BON'}
                      onChange={() => safeSetFormData((prev: any) => ({
                        ...prev,
                        ameliorationQualite: {
                          ...prev.ameliorationQualite,
                          visitesEtReunions: {
                            ...prev.ameliorationQualite?.visitesEtReunions,
                            visitesClasses: {
                              ...prev.ameliorationQualite?.visitesEtReunions?.visitesClasses,
                              special: 'ASSEZ BON'
                            }
                          }
                        }
                      }))}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* III.2.2. Fréquence des Réunions Pédagogiques */}
        <div className="mb-4">
          <h5 className="font-bold mb-2">III.2.2. Fréquence des Réunions Pédagogiques</h5>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left">Niveau d'Enseignement</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">TRES BON</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">BON</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">ASSEZ BON</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">a) Espace Communautaire d'éveil (ECE)</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="radio" 
                      name="reunion_1" 
                      className="mx-auto block" 
                      checked={formData?.ameliorationQualite?.visitesEtReunions?.reunionsPedagogiques?.ece === 'TRES BON'}
                      onChange={() => safeSetFormData((prev: any) => ({
                        ...prev,
                        ameliorationQualite: {
                          ...prev.ameliorationQualite,
                          visitesEtReunions: {
                            ...prev.ameliorationQualite?.visitesEtReunions,
                            reunionsPedagogiques: {
                              ...prev.ameliorationQualite?.visitesEtReunions?.reunionsPedagogiques,
                              ece: 'TRES BON'
                            }
                          }
                        }
                      }))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="radio" 
                      name="reunion_1" 
                      className="mx-auto block" 
                      checked={formData?.ameliorationQualite?.visitesEtReunions?.reunionsPedagogiques?.ece === 'BON'}
                      onChange={() => safeSetFormData((prev: any) => ({
                        ...prev,
                        ameliorationQualite: {
                          ...prev.ameliorationQualite,
                          visitesEtReunions: {
                            ...prev.ameliorationQualite?.visitesEtReunions,
                            reunionsPedagogiques: {
                              ...prev.ameliorationQualite?.visitesEtReunions?.reunionsPedagogiques,
                              ece: 'BON'
                            }
                          }
                        }
                      }))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="radio" 
                      name="reunion_1" 
                      className="mx-auto block" 
                      checked={formData?.ameliorationQualite?.visitesEtReunions?.reunionsPedagogiques?.ece === 'ASSEZ BON'}
                      onChange={() => safeSetFormData((prev: any) => ({
                        ...prev,
                        ameliorationQualite: {
                          ...prev.ameliorationQualite,
                          visitesEtReunions: {
                            ...prev.ameliorationQualite?.visitesEtReunions,
                            reunionsPedagogiques: {
                              ...prev.ameliorationQualite?.visitesEtReunions?.reunionsPedagogiques,
                              ece: 'ASSEZ BON'
                            }
                          }
                        }
                      }))}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">b) Préprimaire</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="radio" 
                      name="reunion_2" 
                      className="mx-auto block" 
                      checked={formData?.ameliorationQualite?.visitesEtReunions?.reunionsPedagogiques?.preprimaire === 'TRES BON'}
                      onChange={() => safeSetFormData((prev: any) => ({
                        ...prev,
                        ameliorationQualite: {
                          ...prev.ameliorationQualite,
                          visitesEtReunions: {
                            ...prev.ameliorationQualite?.visitesEtReunions,
                            reunionsPedagogiques: {
                              ...prev.ameliorationQualite?.visitesEtReunions?.reunionsPedagogiques,
                              preprimaire: 'TRES BON'
                            }
                          }
                        }
                      }))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="radio" 
                      name="reunion_2" 
                      className="mx-auto block" 
                      checked={formData?.ameliorationQualite?.visitesEtReunions?.reunionsPedagogiques?.preprimaire === 'BON'}
                      onChange={() => safeSetFormData((prev: any) => ({
                        ...prev,
                        ameliorationQualite: {
                          ...prev.ameliorationQualite,
                          visitesEtReunions: {
                            ...prev.ameliorationQualite?.visitesEtReunions,
                            reunionsPedagogiques: {
                              ...prev.ameliorationQualite?.visitesEtReunions?.reunionsPedagogiques,
                              preprimaire: 'BON'
                            }
                          }
                        }
                      }))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="radio" 
                      name="reunion_2" 
                      className="mx-auto block" 
                      checked={formData?.ameliorationQualite?.visitesEtReunions?.reunionsPedagogiques?.preprimaire === 'ASSEZ BON'}
                      onChange={() => safeSetFormData((prev: any) => ({
                        ...prev,
                        ameliorationQualite: {
                          ...prev.ameliorationQualite,
                          visitesEtReunions: {
                            ...prev.ameliorationQualite?.visitesEtReunions,
                            reunionsPedagogiques: {
                              ...prev.ameliorationQualite?.visitesEtReunions?.reunionsPedagogiques,
                              preprimaire: 'ASSEZ BON'
                            }
                          }
                        }
                      }))}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">c) Maternel</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="radio" 
                      name="reunion_3" 
                      className="mx-auto block" 
                      checked={formData?.ameliorationQualite?.visitesEtReunions?.reunionsPedagogiques?.maternel === 'TRES BON'}
                      onChange={() => safeSetFormData((prev: any) => ({
                        ...prev,
                        ameliorationQualite: {
                          ...prev.ameliorationQualite,
                          visitesEtReunions: {
                            ...prev.ameliorationQualite?.visitesEtReunions,
                            reunionsPedagogiques: {
                              ...prev.ameliorationQualite?.visitesEtReunions?.reunionsPedagogiques,
                              maternel: 'TRES BON'
                            }
                          }
                        }
                      }))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="radio" 
                      name="reunion_3" 
                      className="mx-auto block" 
                      checked={formData?.ameliorationQualite?.visitesEtReunions?.reunionsPedagogiques?.maternel === 'BON'}
                      onChange={() => safeSetFormData((prev: any) => ({
                        ...prev,
                        ameliorationQualite: {
                          ...prev.ameliorationQualite,
                          visitesEtReunions: {
                            ...prev.ameliorationQualite?.visitesEtReunions,
                            reunionsPedagogiques: {
                              ...prev.ameliorationQualite?.visitesEtReunions?.reunionsPedagogiques,
                              maternel: 'BON'
                            }
                          }
                        }
                      }))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="radio" 
                      name="reunion_3" 
                      className="mx-auto block" 
                      checked={formData?.ameliorationQualite?.visitesEtReunions?.reunionsPedagogiques?.maternel === 'ASSEZ BON'}
                      onChange={() => safeSetFormData((prev: any) => ({
                        ...prev,
                        ameliorationQualite: {
                          ...prev.ameliorationQualite,
                          visitesEtReunions: {
                            ...prev.ameliorationQualite?.visitesEtReunions,
                            reunionsPedagogiques: {
                              ...prev.ameliorationQualite?.visitesEtReunions?.reunionsPedagogiques,
                              maternel: 'ASSEZ BON'
                            }
                          }
                        }
                      }))}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">d) Primaire</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="radio" 
                      name="reunion_4" 
                      className="mx-auto block" 
                      checked={formData?.ameliorationQualite?.visitesEtReunions?.reunionsPedagogiques?.primaire === 'TRES BON'}
                      onChange={() => safeSetFormData((prev: any) => ({
                        ...prev,
                        ameliorationQualite: {
                          ...prev.ameliorationQualite,
                          visitesEtReunions: {
                            ...prev.ameliorationQualite?.visitesEtReunions,
                            reunionsPedagogiques: {
                              ...prev.ameliorationQualite?.visitesEtReunions?.reunionsPedagogiques,
                              primaire: 'TRES BON'
                            }
                          }
                        }
                      }))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="radio" 
                      name="reunion_4" 
                      className="mx-auto block" 
                      checked={formData?.ameliorationQualite?.visitesEtReunions?.reunionsPedagogiques?.primaire === 'BON'}
                      onChange={() => safeSetFormData((prev: any) => ({
                        ...prev,
                        ameliorationQualite: {
                          ...prev.ameliorationQualite,
                          visitesEtReunions: {
                            ...prev.ameliorationQualite?.visitesEtReunions,
                            reunionsPedagogiques: {
                              ...prev.ameliorationQualite?.visitesEtReunions?.reunionsPedagogiques,
                              primaire: 'BON'
                            }
                          }
                        }
                      }))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="radio" 
                      name="reunion_4" 
                      className="mx-auto block" 
                      checked={formData?.ameliorationQualite?.visitesEtReunions?.reunionsPedagogiques?.primaire === 'ASSEZ BON'}
                      onChange={() => safeSetFormData((prev: any) => ({
                        ...prev,
                        ameliorationQualite: {
                          ...prev.ameliorationQualite,
                          visitesEtReunions: {
                            ...prev.ameliorationQualite?.visitesEtReunions,
                            reunionsPedagogiques: {
                              ...prev.ameliorationQualite?.visitesEtReunions?.reunionsPedagogiques,
                              primaire: 'ASSEZ BON'
                            }
                          }
                        }
                      }))}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* III.2.3. Fonctionnement Cellule de Base */}
        <div className="mb-4">
          <h5 className="font-bold mb-2">III.2.3. Fonctionnement Cellule de Base: FREQUENCE DES REUNIONS DES UP</h5>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left">Niveau d'Enseignement</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">TRES BON</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">BON</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">ASSEZ BON</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">a) Espace Communautaire d'éveil (ECE)</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="radio" 
                      name="cellule_1" 
                      className="mx-auto block" 
                      checked={formData?.ameliorationQualite?.visitesEtReunions?.fonctionnementCelluleBase?.ece === 'TRES BON'}
                      onChange={() => safeSetFormData((prev: any) => ({
                        ...prev,
                        ameliorationQualite: {
                          ...prev.ameliorationQualite,
                          visitesEtReunions: {
                            ...prev.ameliorationQualite?.visitesEtReunions,
                            fonctionnementCelluleBase: {
                              ...prev.ameliorationQualite?.visitesEtReunions?.fonctionnementCelluleBase,
                              ece: 'TRES BON'
                            }
                          }
                        }
                      }))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="radio" 
                      name="cellule_1" 
                      className="mx-auto block" 
                      checked={formData?.ameliorationQualite?.visitesEtReunions?.fonctionnementCelluleBase?.ece === 'BON'}
                      onChange={() => safeSetFormData((prev: any) => ({
                        ...prev,
                        ameliorationQualite: {
                          ...prev.ameliorationQualite,
                          visitesEtReunions: {
                            ...prev.ameliorationQualite?.visitesEtReunions,
                            fonctionnementCelluleBase: {
                              ...prev.ameliorationQualite?.visitesEtReunions?.fonctionnementCelluleBase,
                              ece: 'BON'
                            }
                          }
                        }
                      }))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="radio" 
                      name="cellule_1" 
                      className="mx-auto block" 
                      checked={formData?.ameliorationQualite?.visitesEtReunions?.fonctionnementCelluleBase?.ece === 'ASSEZ BON'}
                      onChange={() => safeSetFormData((prev: any) => ({
                        ...prev,
                        ameliorationQualite: {
                          ...prev.ameliorationQualite,
                          visitesEtReunions: {
                            ...prev.ameliorationQualite?.visitesEtReunions,
                            fonctionnementCelluleBase: {
                              ...prev.ameliorationQualite?.visitesEtReunions?.fonctionnementCelluleBase,
                              ece: 'ASSEZ BON'
                            }
                          }
                        }
                      }))}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">b) Préprimaire</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="radio" 
                      name="cellule_2" 
                      className="mx-auto block" 
                      checked={formData?.ameliorationQualite?.visitesEtReunions?.fonctionnementCelluleBase?.preprimaire === 'TRES BON'}
                      onChange={() => safeSetFormData((prev: any) => ({
                        ...prev,
                        ameliorationQualite: {
                          ...prev.ameliorationQualite,
                          visitesEtReunions: {
                            ...prev.ameliorationQualite?.visitesEtReunions,
                            fonctionnementCelluleBase: {
                              ...prev.ameliorationQualite?.visitesEtReunions?.fonctionnementCelluleBase,
                              preprimaire: 'TRES BON'
                            }
                          }
                        }
                      }))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="radio" 
                      name="cellule_2" 
                      className="mx-auto block" 
                      checked={formData?.ameliorationQualite?.visitesEtReunions?.fonctionnementCelluleBase?.preprimaire === 'BON'}
                      onChange={() => safeSetFormData((prev: any) => ({
                        ...prev,
                        ameliorationQualite: {
                          ...prev.ameliorationQualite,
                          visitesEtReunions: {
                            ...prev.ameliorationQualite?.visitesEtReunions,
                            fonctionnementCelluleBase: {
                              ...prev.ameliorationQualite?.visitesEtReunions?.fonctionnementCelluleBase,
                              preprimaire: 'BON'
                            }
                          }
                        }
                      }))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="radio" 
                      name="cellule_2" 
                      className="mx-auto block" 
                      checked={formData?.ameliorationQualite?.visitesEtReunions?.fonctionnementCelluleBase?.preprimaire === 'ASSEZ BON'}
                      onChange={() => safeSetFormData((prev: any) => ({
                        ...prev,
                        ameliorationQualite: {
                          ...prev.ameliorationQualite,
                          visitesEtReunions: {
                            ...prev.ameliorationQualite?.visitesEtReunions,
                            fonctionnementCelluleBase: {
                              ...prev.ameliorationQualite?.visitesEtReunions?.fonctionnementCelluleBase,
                              preprimaire: 'ASSEZ BON'
                            }
                          }
                        }
                      }))}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">c) Maternel</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="radio" 
                      name="cellule_2b" 
                      className="mx-auto block" 
                      checked={formData?.ameliorationQualite?.visitesEtReunions?.fonctionnementCelluleBase?.maternel === 'TRES BON'}
                      onChange={() => safeSetFormData((prev: any) => ({
                        ...prev,
                        ameliorationQualite: {
                          ...prev.ameliorationQualite,
                          visitesEtReunions: {
                            ...prev.ameliorationQualite?.visitesEtReunions,
                            fonctionnementCelluleBase: {
                              ...prev.ameliorationQualite?.visitesEtReunions?.fonctionnementCelluleBase,
                              maternel: 'TRES BON'
                            }
                          }
                        }
                      }))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="radio" 
                      name="cellule_2b" 
                      className="mx-auto block" 
                      checked={formData?.ameliorationQualite?.visitesEtReunions?.fonctionnementCelluleBase?.maternel === 'BON'}
                      onChange={() => safeSetFormData((prev: any) => ({
                        ...prev,
                        ameliorationQualite: {
                          ...prev.ameliorationQualite,
                          visitesEtReunions: {
                            ...prev.ameliorationQualite?.visitesEtReunions,
                            fonctionnementCelluleBase: {
                              ...prev.ameliorationQualite?.visitesEtReunions?.fonctionnementCelluleBase,
                              maternel: 'BON'
                            }
                          }
                        }
                      }))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="radio" 
                      name="cellule_2b" 
                      className="mx-auto block" 
                      checked={formData?.ameliorationQualite?.visitesEtReunions?.fonctionnementCelluleBase?.maternel === 'ASSEZ BON'}
                      onChange={() => safeSetFormData((prev: any) => ({
                        ...prev,
                        ameliorationQualite: {
                          ...prev.ameliorationQualite,
                          visitesEtReunions: {
                            ...prev.ameliorationQualite?.visitesEtReunions,
                            fonctionnementCelluleBase: {
                              ...prev.ameliorationQualite?.visitesEtReunions?.fonctionnementCelluleBase,
                              maternel: 'ASSEZ BON'
                            }
                          }
                        }
                      }))}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">d) Primaire</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="radio" 
                      name="cellule_3" 
                      className="mx-auto block" 
                      checked={formData?.ameliorationQualite?.visitesEtReunions?.fonctionnementCelluleBase?.primaire === 'TRES BON'}
                      onChange={() => safeSetFormData((prev: any) => ({
                        ...prev,
                        ameliorationQualite: {
                          ...prev.ameliorationQualite,
                          visitesEtReunions: {
                            ...prev.ameliorationQualite?.visitesEtReunions,
                            fonctionnementCelluleBase: {
                              ...prev.ameliorationQualite?.visitesEtReunions?.fonctionnementCelluleBase,
                              primaire: 'TRES BON'
                            }
                          }
                        }
                      }))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="radio" 
                      name="cellule_3" 
                      className="mx-auto block" 
                      checked={formData?.ameliorationQualite?.visitesEtReunions?.fonctionnementCelluleBase?.primaire === 'BON'}
                      onChange={() => safeSetFormData((prev: any) => ({
                        ...prev,
                        ameliorationQualite: {
                          ...prev.ameliorationQualite,
                          visitesEtReunions: {
                            ...prev.ameliorationQualite?.visitesEtReunions,
                            fonctionnementCelluleBase: {
                              ...prev.ameliorationQualite?.visitesEtReunions?.fonctionnementCelluleBase,
                              primaire: 'BON'
                            }
                          }
                        }
                      }))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="radio" 
                      name="cellule_3" 
                      className="mx-auto block" 
                      checked={formData?.ameliorationQualite?.visitesEtReunions?.fonctionnementCelluleBase?.primaire === 'ASSEZ BON'}
                      onChange={() => safeSetFormData((prev: any) => ({
                        ...prev,
                        ameliorationQualite: {
                          ...prev.ameliorationQualite,
                          visitesEtReunions: {
                            ...prev.ameliorationQualite?.visitesEtReunions,
                            fonctionnementCelluleBase: {
                              ...prev.ameliorationQualite?.visitesEtReunions?.fonctionnementCelluleBase,
                              primaire: 'ASSEZ BON'
                            }
                          }
                        }
                      }))}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">e) Secondaire</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="radio" 
                      name="cellule_4" 
                      className="mx-auto block" 
                      checked={formData?.ameliorationQualite?.visitesEtReunions?.fonctionnementCelluleBase?.secondaire === 'TRES BON'}
                      onChange={() => safeSetFormData((prev: any) => ({
                        ...prev,
                        ameliorationQualite: {
                          ...prev.ameliorationQualite,
                          visitesEtReunions: {
                            ...prev.ameliorationQualite?.visitesEtReunions,
                            fonctionnementCelluleBase: {
                              ...prev.ameliorationQualite?.visitesEtReunions?.fonctionnementCelluleBase,
                              secondaire: 'TRES BON'
                            }
                          }
                        }
                      }))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="radio" 
                      name="cellule_4" 
                      className="mx-auto block" 
                      checked={formData?.ameliorationQualite?.visitesEtReunions?.fonctionnementCelluleBase?.secondaire === 'BON'}
                      onChange={() => safeSetFormData((prev: any) => ({
                        ...prev,
                        ameliorationQualite: {
                          ...prev.ameliorationQualite,
                          visitesEtReunions: {
                            ...prev.ameliorationQualite?.visitesEtReunions,
                            fonctionnementCelluleBase: {
                              ...prev.ameliorationQualite?.visitesEtReunions?.fonctionnementCelluleBase,
                              secondaire: 'BON'
                            }
                          }
                        }
                      }))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="radio" 
                      name="cellule_4" 
                      className="mx-auto block" 
                      checked={formData?.ameliorationQualite?.visitesEtReunions?.fonctionnementCelluleBase?.secondaire === 'ASSEZ BON'}
                      onChange={() => safeSetFormData((prev: any) => ({
                        ...prev,
                        ameliorationQualite: {
                          ...prev.ameliorationQualite,
                          visitesEtReunions: {
                            ...prev.ameliorationQualite?.visitesEtReunions,
                            fonctionnementCelluleBase: {
                              ...prev.ameliorationQualite?.visitesEtReunions?.fonctionnementCelluleBase,
                              secondaire: 'ASSEZ BON'
                            }
                          }
                        }
                      }))}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">e) Spécial (handicap : Tout niveau confondu)</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="radio" 
                      name="cellule_5" 
                      className="mx-auto block" 
                      checked={formData?.ameliorationQualite?.visitesEtReunions?.fonctionnementCelluleBase?.special === 'TRES BON'}
                      onChange={() => safeSetFormData((prev: any) => ({
                        ...prev,
                        ameliorationQualite: {
                          ...prev.ameliorationQualite,
                          visitesEtReunions: {
                            ...prev.ameliorationQualite?.visitesEtReunions,
                            fonctionnementCelluleBase: {
                              ...prev.ameliorationQualite?.visitesEtReunions?.fonctionnementCelluleBase,
                              special: 'TRES BON'
                            }
                          }
                        }
                      }))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="radio" 
                      name="cellule_5" 
                      className="mx-auto block" 
                      checked={formData?.ameliorationQualite?.visitesEtReunions?.fonctionnementCelluleBase?.special === 'BON'}
                      onChange={() => safeSetFormData((prev: any) => ({
                        ...prev,
                        ameliorationQualite: {
                          ...prev.ameliorationQualite,
                          visitesEtReunions: {
                            ...prev.ameliorationQualite?.visitesEtReunions,
                            fonctionnementCelluleBase: {
                              ...prev.ameliorationQualite?.visitesEtReunions?.fonctionnementCelluleBase,
                              special: 'BON'
                            }
                          }
                        }
                      }))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="radio" 
                      name="cellule_5" 
                      className="mx-auto block" 
                      checked={formData?.ameliorationQualite?.visitesEtReunions?.fonctionnementCelluleBase?.special === 'ASSEZ BON'}
                      onChange={() => safeSetFormData((prev: any) => ({
                        ...prev,
                        ameliorationQualite: {
                          ...prev.ameliorationQualite,
                          visitesEtReunions: {
                            ...prev.ameliorationQualite?.visitesEtReunions,
                            fonctionnementCelluleBase: {
                              ...prev.ameliorationQualite?.visitesEtReunions?.fonctionnementCelluleBase,
                              special: 'ASSEZ BON'
                            }
                          }
                        }
                      }))}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* III.3. Activités Inspectorales */}
      <div className="mb-6">
        <h4 className="font-bold mb-3">III.3. Activités Inspectorales</h4>
        
        {/* III.3.1. Inspections Pédagogiques C3 */}
        <div className="mb-4">
          <h5 className="font-bold mb-2">III.3.1. Inspections Pédagogiques C3</h5>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left">Niveau d'Enseignement</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">NBRE PREVU</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">NBRE REALISE</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">% REALISATIONS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">Maternel</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={inspectionsC3.maternel.prevu ?? ''}
                      onChange={(e) => updateInspection('maternel', 'prevu', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      max={inspectionsC3.maternel.prevu || undefined}
                      value={inspectionsC3.maternel.realise ?? ''}
                      onChange={(e) => updateInspection('maternel', 'realise', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2 bg-gray-50">
                    <span className="w-full text-center font-medium text-blue-600">
                      {inspectionsC3.maternel.pourcentage}%
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">Primaire</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={inspectionsC3.primaire.prevu ?? ''}
                      onChange={(e) => updateInspection('primaire', 'prevu', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      max={inspectionsC3.primaire.prevu || undefined}
                      value={inspectionsC3.primaire.realise ?? ''}
                      onChange={(e) => updateInspection('primaire', 'realise', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2 bg-gray-50">
                    <span className="w-full text-center font-medium text-blue-600">
                      {inspectionsC3.primaire.pourcentage}%
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">Secondaire</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={inspectionsC3.secondaire.prevu ?? ''}
                      onChange={(e) => updateInspection('secondaire', 'prevu', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      max={inspectionsC3.secondaire.prevu || undefined}
                      value={inspectionsC3.secondaire.realise ?? ''}
                      onChange={(e) => updateInspection('secondaire', 'realise', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2 bg-gray-50">
                    <span className="w-full text-center font-medium text-blue-600">
                      {inspectionsC3.secondaire.pourcentage}%
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">Spécial (handicap: Tout niveau confondu)</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={inspectionsC3.special.prevu ?? ''}
                      onChange={(e) => updateInspection('special', 'prevu', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      max={inspectionsC3.special.prevu || undefined}
                      value={inspectionsC3.special.realise ?? ''}
                      onChange={(e) => updateInspection('special', 'realise', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2 bg-gray-50">
                    <span className="w-full text-center font-medium text-blue-600">
                      {inspectionsC3.special.pourcentage}%
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* III.3.2. Inspections de Formation */}
        <div className="mb-4">
          <h5 className="font-bold mb-2">III.3.2. Inspections de Formation</h5>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left">Niveau d'Enseignement</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">NBRE PREVU</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">NBRE REALISE</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">% REALISATIONS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">Maternel</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={inspectionsFormation.maternel.prevu ?? ''}
                      onChange={(e) => updateInspectionFormation('maternel', 'prevu', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      max={inspectionsFormation.maternel.prevu || undefined}
                      value={inspectionsFormation.maternel.realise ?? ''}
                      onChange={(e) => updateInspectionFormation('maternel', 'realise', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2 bg-gray-50">
                    <span className="w-full text-center font-medium text-blue-600">
                      {inspectionsFormation.maternel.pourcentage}%
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">Primaire</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={inspectionsFormation.primaire.prevu ?? ''}
                      onChange={(e) => updateInspectionFormation('primaire', 'prevu', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      max={inspectionsFormation.primaire.prevu || undefined}
                      value={inspectionsFormation.primaire.realise ?? ''}
                      onChange={(e) => updateInspectionFormation('primaire', 'realise', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2 bg-gray-50">
                    <span className="w-full text-center font-medium text-blue-600">
                      {inspectionsFormation.primaire.pourcentage}%
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">Secondaire</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={inspectionsFormation.secondaire.prevu ?? ''}
                      onChange={(e) => updateInspectionFormation('secondaire', 'prevu', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      max={inspectionsFormation.secondaire.prevu || undefined}
                      value={inspectionsFormation.secondaire.realise ?? ''}
                      onChange={(e) => updateInspectionFormation('secondaire', 'realise', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2 bg-gray-50">
                    <span className="w-full text-center font-medium text-blue-600">
                      {inspectionsFormation.secondaire.pourcentage}%
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">Spécial (handicap: Tout niveau confondu)</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      value={inspectionsFormation.special.prevu ?? ''}
                      onChange={(e) => updateInspectionFormation('special', 'prevu', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="0"
                      max={inspectionsFormation.special.prevu || undefined}
                      value={inspectionsFormation.special.realise ?? ''}
                      onChange={(e) => updateInspectionFormation('special', 'realise', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2 bg-gray-50">
                    <span className="w-full text-center font-medium text-blue-600">
                      {inspectionsFormation.special.pourcentage}%
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* III.3.3. Formation Continue */}
        <div className="mb-4">
          <h5 className="font-bold mb-2">III.3.3. Formation Continue</h5>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left">Niveau d'Enseignement</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">TRES BON</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">BON</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">CARENCE</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">Maternel</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="radio" 
                      name="formation_1" 
                      className="mx-auto block" 
                      checked={formData?.ameliorationQualite?.activitesInspectorales?.formationContinue?.prescolaire === 'TRES BON'}
                      onChange={() => safeSetFormData((prev: any) => ({
                        ...prev,
                        ameliorationQualite: {
                          ...prev.ameliorationQualite,
                          activitesInspectorales: {
                            ...prev.ameliorationQualite?.activitesInspectorales,
                            formationContinue: {
                              ...prev.ameliorationQualite?.activitesInspectorales?.formationContinue,
                              prescolaire: 'TRES BON'
                            }
                          }
                        }
                      }))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="radio" 
                      name="formation_1" 
                      className="mx-auto block" 
                      checked={formData?.ameliorationQualite?.activitesInspectorales?.formationContinue?.prescolaire === 'BON'}
                      onChange={() => safeSetFormData((prev: any) => ({
                        ...prev,
                        ameliorationQualite: {
                          ...prev.ameliorationQualite,
                          activitesInspectorales: {
                            ...prev.ameliorationQualite?.activitesInspectorales,
                            formationContinue: {
                              ...prev.ameliorationQualite?.activitesInspectorales?.formationContinue,
                              prescolaire: 'BON'
                            }
                          }
                        }
                      }))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="radio" 
                      name="formation_1" 
                      className="mx-auto block" 
                      checked={formData?.ameliorationQualite?.activitesInspectorales?.formationContinue?.prescolaire === 'CARENCE'}
                      onChange={() => safeSetFormData((prev: any) => ({
                        ...prev,
                        ameliorationQualite: {
                          ...prev.ameliorationQualite,
                          activitesInspectorales: {
                            ...prev.ameliorationQualite?.activitesInspectorales,
                            formationContinue: {
                              ...prev.ameliorationQualite?.activitesInspectorales?.formationContinue,
                              prescolaire: 'CARENCE'
                            }
                          }
                        }
                      }))}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">Primaire</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="radio" 
                      name="formation_2" 
                      className="mx-auto block" 
                      checked={formData?.ameliorationQualite?.activitesInspectorales?.formationContinue?.primaire === 'TRES BON'}
                      onChange={() => safeSetFormData((prev: any) => ({
                        ...prev,
                        ameliorationQualite: {
                          ...prev.ameliorationQualite,
                          activitesInspectorales: {
                            ...prev.ameliorationQualite?.activitesInspectorales,
                            formationContinue: {
                              ...prev.ameliorationQualite?.activitesInspectorales?.formationContinue,
                              primaire: 'TRES BON'
                            }
                          }
                        }
                      }))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="radio" 
                      name="formation_2" 
                      className="mx-auto block" 
                      checked={formData?.ameliorationQualite?.activitesInspectorales?.formationContinue?.primaire === 'BON'}
                      onChange={() => safeSetFormData((prev: any) => ({
                        ...prev,
                        ameliorationQualite: {
                          ...prev.ameliorationQualite,
                          activitesInspectorales: {
                            ...prev.ameliorationQualite?.activitesInspectorales,
                            formationContinue: {
                              ...prev.ameliorationQualite?.activitesInspectorales?.formationContinue,
                              primaire: 'BON'
                            }
                          }
                        }
                      }))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="radio" 
                      name="formation_2" 
                      className="mx-auto block" 
                      checked={formData?.ameliorationQualite?.activitesInspectorales?.formationContinue?.primaire === 'CARENCE'}
                      onChange={() => safeSetFormData((prev: any) => ({
                        ...prev,
                        ameliorationQualite: {
                          ...prev.ameliorationQualite,
                          activitesInspectorales: {
                            ...prev.ameliorationQualite?.activitesInspectorales,
                            formationContinue: {
                              ...prev.ameliorationQualite?.activitesInspectorales?.formationContinue,
                              primaire: 'CARENCE'
                            }
                          }
                        }
                      }))}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">Secondaire</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="radio" 
                      name="formation_3" 
                      className="mx-auto block" 
                      checked={formData?.ameliorationQualite?.activitesInspectorales?.formationContinue?.secondaire === 'TRES BON'}
                      onChange={() => safeSetFormData((prev: any) => ({
                        ...prev,
                        ameliorationQualite: {
                          ...prev.ameliorationQualite,
                          activitesInspectorales: {
                            ...prev.ameliorationQualite?.activitesInspectorales,
                            formationContinue: {
                              ...prev.ameliorationQualite?.activitesInspectorales?.formationContinue,
                              secondaire: 'TRES BON'
                            }
                          }
                        }
                      }))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="radio" 
                      name="formation_3" 
                      className="mx-auto block" 
                      checked={formData?.ameliorationQualite?.activitesInspectorales?.formationContinue?.secondaire === 'BON'}
                      onChange={() => safeSetFormData((prev: any) => ({
                        ...prev,
                        ameliorationQualite: {
                          ...prev.ameliorationQualite,
                          activitesInspectorales: {
                            ...prev.ameliorationQualite?.activitesInspectorales,
                            formationContinue: {
                              ...prev.ameliorationQualite?.activitesInspectorales?.formationContinue,
                              secondaire: 'BON'
                            }
                          }
                        }
                      }))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="radio" 
                      name="formation_3" 
                      className="mx-auto block" 
                      checked={formData?.ameliorationQualite?.activitesInspectorales?.formationContinue?.secondaire === 'CARENCE'}
                      onChange={() => safeSetFormData((prev: any) => ({
                        ...prev,
                        ameliorationQualite: {
                          ...prev.ameliorationQualite,
                          activitesInspectorales: {
                            ...prev.ameliorationQualite?.activitesInspectorales,
                            formationContinue: {
                              ...prev.ameliorationQualite?.activitesInspectorales?.formationContinue,
                              secondaire: 'CARENCE'
                            }
                          }
                        }
                      }))}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">Spécial (handicap: Tout niveau confondu)</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="radio" 
                      name="formation_4" 
                      className="mx-auto block" 
                      checked={formData?.ameliorationQualite?.activitesInspectorales?.formationContinue?.special === 'TRES BON'}
                      onChange={() => safeSetFormData((prev: any) => ({
                        ...prev,
                        ameliorationQualite: {
                          ...prev.ameliorationQualite,
                          activitesInspectorales: {
                            ...prev.ameliorationQualite?.activitesInspectorales,
                            formationContinue: {
                              ...prev.ameliorationQualite?.activitesInspectorales?.formationContinue,
                              special: 'TRES BON'
                            }
                          }
                        }
                      }))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="radio" 
                      name="formation_4" 
                      className="mx-auto block" 
                      checked={formData?.ameliorationQualite?.activitesInspectorales?.formationContinue?.special === 'BON'}
                      onChange={() => safeSetFormData((prev: any) => ({
                        ...prev,
                        ameliorationQualite: {
                          ...prev.ameliorationQualite,
                          activitesInspectorales: {
                            ...prev.ameliorationQualite?.activitesInspectorales,
                            formationContinue: {
                              ...prev.ameliorationQualite?.activitesInspectorales?.formationContinue,
                              special: 'BON'
                            }
                          }
                        }
                      }))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="radio" 
                      name="formation_4" 
                      className="mx-auto block" 
                      checked={formData?.ameliorationQualite?.activitesInspectorales?.formationContinue?.special === 'CARENCE'}
                      onChange={() => safeSetFormData((prev: any) => ({
                        ...prev,
                        ameliorationQualite: {
                          ...prev.ameliorationQualite,
                          activitesInspectorales: {
                            ...prev.ameliorationQualite?.activitesInspectorales,
                            formationContinue: {
                              ...prev.ameliorationQualite?.activitesInspectorales?.formationContinue,
                              special: 'CARENCE'
                            }
                          }
                        }
                      }))}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Quelques Principaux Thèmes Exploités */}
        <div className="mb-4">
          <h5 className="font-medium mb-2">Quelques Principaux Thèmes Exploités</h5>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left">Niveau d'Enseignement</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">Thèmes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">a) Espace Communautaire d'éveil (ECE)</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="text" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="Thèmes exploités..." 
                      value={themesExploites.ece}
                      onChange={(e) => setThemesExploites(prev => ({ ...prev, ece: e.target.value }))}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">b) Maternel</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="text" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      placeholder="Thèmes exploités..." 
                      value={themesExploites.maternel}
                      onChange={(e) => setThemesExploites(prev => ({ ...prev, maternel: e.target.value }))}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* III.4. Quelques Indicateurs du Rendement Interne */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-bold">III.4. Quelques Indicateurs du Rendement Interne</h4>
          <div className="flex gap-2">
            {hasRendementInterneData() && (
              <button
                type="button"
                onClick={() => {
                  setRendementInterne({
                    sixiemePrimaire: { abandon: 0, reussite: 0, echec: 0 },
                    huitiemeCETB: { abandon: 0, reussite: 0, echec: 0 },
                    quatriemeHumanite: { abandon: 0, reussite: 0, echec: 0 },
                    diplomesMathematiques: { abandon: 0, reussite: 0, echec: 0 },
                    diplomesFiliereTechniques: { abandon: 0, reussite: 0, echec: 0 }
                  });
                  // L'overlay réapparaîtra automatiquement car hasRendementInterneData() retournera false
                }}
                className="px-4 py-2 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Réinitialiser
              </button>
            )}
            <button
              type="button"
              onClick={openCalculModal}
              className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Calculer les taux
            </button>
          </div>
        </div>
        <div className="relative">
          {/* Overlay avec effet flou - MODAL UNIQUEMENT */}
          {!hasRendementInterneData() && (
            <div className="absolute inset-0 bg-white bg-opacity-75 backdrop-blur-sm z-10 flex items-center justify-center group hover:bg-opacity-85 transition-all duration-300 cursor-pointer">
              <div className="text-center transform group-hover:scale-105 transition-transform duration-300">
                <div className="mb-4">
                  <svg className="w-16 h-16 mx-auto text-blue-500 mb-4 group-hover:text-blue-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2 group-hover:text-gray-800 transition-colors duration-300">
                  Tableau verrouillé
                </h3>
                <p className="text-gray-600 mb-4 group-hover:text-gray-700 transition-colors duration-300">
                  Cliquez sur le bouton "<span className="font-bold">Calculer les taux</span>" pour saisir les données
                </p>
                <button
                  type="button"
                  onClick={openCalculModal}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Ouvrir la saisie des données
                </button>
              </div>
            </div>
          )}
          
          <table className={`w-full border-collapse border border-gray-300 ${!hasRendementInterneData() ? 'pointer-events-none' : ''}`}>
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-3 py-2 text-left">Niveau d'Enseignement</th>
                <th className="border border-gray-300 px-3 py-2 text-center">% D'ABANDON</th>
                <th className="border border-gray-300 px-3 py-2 text-center">% DE REUSSITE</th>
                <th className="border border-gray-300 px-3 py-2 text-center">% D'ECHEC</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-3 py-2">A. 6*** Primaire</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    max="100"
                    step="0.1"
                    value={rendementInterne.sixiemePrimaire.abandon ?? ''}
                    onChange={(e) => updateRendementInterne('sixiemePrimaire', 'abandon', Number(e.target.value))}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    max="100"
                    step="0.1"
                    value={rendementInterne.sixiemePrimaire.reussite ?? ''}
                    onChange={(e) => updateRendementInterne('sixiemePrimaire', 'reussite', Number(e.target.value))}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    max="100"
                    step="0.1"
                    value={rendementInterne.sixiemePrimaire.echec ?? ''}
                    onChange={(e) => updateRendementInterne('sixiemePrimaire', 'echec', Number(e.target.value))}
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">B. 8*** CETB</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    max="100"
                    step="0.1"
                    value={rendementInterne.huitiemeCETB.abandon ?? ''}
                    onChange={(e) => updateRendementInterne('huitiemeCETB', 'abandon', Number(e.target.value))}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    max="100"
                    step="0.1"
                    value={rendementInterne.huitiemeCETB.reussite ?? ''}
                    onChange={(e) => updateRendementInterne('huitiemeCETB', 'reussite', Number(e.target.value))}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    max="100"
                    step="0.1"
                    value={rendementInterne.huitiemeCETB.echec ?? ''}
                    onChange={(e) => updateRendementInterne('huitiemeCETB', 'echec', Number(e.target.value))}
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">C. 4*** Humanité</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    max="100"
                    step="0.1"
                    value={rendementInterne.quatriemeHumanite.abandon ?? ''}
                    onChange={(e) => updateRendementInterne('quatriemeHumanite', 'abandon', Number(e.target.value))}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    max="100"
                    step="0.1"
                    value={rendementInterne.quatriemeHumanite.reussite ?? ''}
                    onChange={(e) => updateRendementInterne('quatriemeHumanite', 'reussite', Number(e.target.value))}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    max="100"
                    step="0.1"
                    value={rendementInterne.quatriemeHumanite.echec ?? ''}
                    onChange={(e) => updateRendementInterne('quatriemeHumanite', 'echec', Number(e.target.value))}
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">D. Proportion des diplômés en Mathématiques</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    max="100"
                    step="0.1"
                    value={rendementInterne.diplomesMathematiques.abandon ?? ''}
                    onChange={(e) => updateRendementInterne('diplomesMathematiques', 'abandon', Number(e.target.value))}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    max="100"
                    step="0.1"
                    value={rendementInterne.diplomesMathematiques.reussite ?? ''}
                    onChange={(e) => updateRendementInterne('diplomesMathematiques', 'reussite', Number(e.target.value))}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    max="100"
                    step="0.1"
                    value={rendementInterne.diplomesMathematiques.echec ?? ''}
                    onChange={(e) => updateRendementInterne('diplomesMathematiques', 'echec', Number(e.target.value))}
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">E. Proportion des Diplômés des Filières Techniques</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    max="100"
                    step="0.1"
                    value={rendementInterne.diplomesFiliereTechniques.abandon ?? ''}
                    onChange={(e) => updateRendementInterne('diplomesFiliereTechniques', 'abandon', Number(e.target.value))}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    max="100"
                    step="0.1"
                    value={rendementInterne.diplomesFiliereTechniques.reussite ?? ''}
                    onChange={(e) => updateRendementInterne('diplomesFiliereTechniques', 'reussite', Number(e.target.value))}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    max="100"
                    step="0.1"
                    value={rendementInterne.diplomesFiliereTechniques.echec ?? ''}
                    onChange={(e) => updateRendementInterne('diplomesFiliereTechniques', 'echec', Number(e.target.value))}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* III.5. Quelques Indicateurs du Rendement Externes */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-bold">III.5. Quelques Indicateurs du Rendement Externes (Examens certificatifs)</h4>
          <div className="flex gap-2">
            {hasRendementExterneData() && (
              <button
                type="button"
                onClick={() => {
                  setRendementExterne({
                    prescolaire: { tauxGF: 0, tauxFilles: 0 },
                    espaceCommunautaireEveil: { tauxGF: 0, tauxFilles: 0 },
                    classePreprimaire: { tauxGF: 0, tauxFilles: 0 },
                    maternel: { tauxGF: 0, tauxFilles: 0 },
                    primaire: { tauxGF: 0, tauxFilles: 0 },
                    enseignementSpecialPrimaire: { tauxGF: 0, tauxFilles: 0 },
                    enseignementPrimaire: { tauxGF: 0, tauxFilles: 0 },
                    secondaire: { tauxGF: 0, tauxFilles: 0 },
                    enseignementSpecialSecondaire: { tauxGF: 0, tauxFilles: 0 },
                    enseignementSecondaireNormal: { tauxGF: 0, tauxFilles: 0 }
                  });
                }}
                className="px-4 py-2 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Réinitialiser
              </button>
            )}
            <button
              type="button"
              onClick={openCalculModalExternes}
              className="px-4 py-2 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Calculer les taux
            </button>
          </div>
        </div>
        <div className="relative">
          {/* Overlay avec effet flou - MODAL UNIQUEMENT */}
          {!hasRendementExterneData() && (
            <div className="absolute inset-0 bg-white bg-opacity-75 backdrop-blur-sm z-10 flex items-center justify-center group hover:bg-opacity-85 transition-all duration-300 cursor-pointer">
              <div className="text-center transform group-hover:scale-105 transition-transform duration-300">
                <div className="mb-4">
                  <svg className="w-16 h-16 mx-auto text-green-500 mb-4 group-hover:text-green-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2 group-hover:text-gray-800 transition-colors duration-300">
                  Tableau verrouillé
                </h3>
                <p className="text-gray-600 mb-4 group-hover:text-gray-700 transition-colors duration-300">
                  Cliquez sur le bouton "<span className="font-bold">Calculer les taux</span>" pour saisir les données
                </p>
                <button
                  type="button"
                  onClick={openCalculModalExternes}
                  className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300 flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Ouvrir la saisie des données
                </button>
              </div>
            </div>
          )}
          
          <table className={`w-full border-collapse border border-gray-300 ${!hasRendementExterneData() ? 'pointer-events-none' : ''}`}>
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-3 py-2 text-left">Niveau d'Enseignement</th>
                <th className="border border-gray-300 px-3 py-2 text-center">% GF</th>
                <th className="border border-gray-300 px-3 py-2 text-center">F</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-3 py-2">A. NIVEAU PRESCOLAIRE</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    max="100"
                    step="0.1"
                    value={rendementExterne.prescolaire.tauxGF || ''}
                    onChange={(e) => updateRendementExterne('prescolaire', 'tauxGF', Number(e.target.value))}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    max="100"
                    step="0.1"
                    value={rendementExterne.prescolaire.tauxFilles || ''}
                    onChange={(e) => updateRendementExterne('prescolaire', 'tauxFilles', Number(e.target.value))}
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">a) Espace Communautaire d'Eveil</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    max="100"
                    step="0.1"
                    value={rendementExterne.espaceCommunautaireEveil.tauxGF || ''}
                    onChange={(e) => updateRendementExterne('espaceCommunautaireEveil', 'tauxGF', Number(e.target.value))}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    max="100"
                    step="0.1"
                    value={rendementExterne.espaceCommunautaireEveil.tauxFilles || ''}
                    onChange={(e) => updateRendementExterne('espaceCommunautaireEveil', 'tauxFilles', Number(e.target.value))}
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">b) Classe Préprimaire</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    max="100"
                    step="0.1"
                    value={rendementExterne.classePreprimaire.tauxGF || ''}
                    onChange={(e) => updateRendementExterne('classePreprimaire', 'tauxGF', Number(e.target.value))}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    max="100"
                    step="0.1"
                    value={rendementExterne.classePreprimaire.tauxFilles || ''}
                    onChange={(e) => updateRendementExterne('classePreprimaire', 'tauxFilles', Number(e.target.value))}
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">c) Maternel</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    max="100"
                    step="0.1"
                    value={rendementExterne.maternel.tauxGF || ''}
                    onChange={(e) => updateRendementExterne('maternel', 'tauxGF', Number(e.target.value))}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    max="100"
                    step="0.1"
                    value={rendementExterne.maternel.tauxFilles || ''}
                    onChange={(e) => updateRendementExterne('maternel', 'tauxFilles', Number(e.target.value))}
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">C. NIVEAU PRIMAIRE</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    max="100"
                    step="0.1"
                    value={rendementExterne.primaire.tauxGF || ''}
                    onChange={(e) => updateRendementExterne('primaire', 'tauxGF', Number(e.target.value))}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    max="100"
                    step="0.1"
                    value={rendementExterne.primaire.tauxFilles || ''}
                    onChange={(e) => updateRendementExterne('primaire', 'tauxFilles', Number(e.target.value))}
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">a) Enseignement Spécial (handicap)</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    max="100"
                    step="0.1"
                    value={rendementExterne.enseignementSpecialPrimaire.tauxGF || ''}
                    onChange={(e) => updateRendementExterne('enseignementSpecialPrimaire', 'tauxGF', Number(e.target.value))}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    max="100"
                    step="0.1"
                    value={rendementExterne.enseignementSpecialPrimaire.tauxFilles || ''}
                    onChange={(e) => updateRendementExterne('enseignementSpecialPrimaire', 'tauxFilles', Number(e.target.value))}
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">b) Enseignement Primaire</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    max="100"
                    step="0.1"
                    value={rendementExterne.enseignementPrimaire.tauxGF || ''}
                    onChange={(e) => updateRendementExterne('enseignementPrimaire', 'tauxGF', Number(e.target.value))}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    max="100"
                    step="0.1"
                    value={rendementExterne.enseignementPrimaire.tauxFilles || ''}
                    onChange={(e) => updateRendementExterne('enseignementPrimaire', 'tauxFilles', Number(e.target.value))}
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">C. NIVEAU SECONDAIRE</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    max="100"
                    step="0.1"
                    value={rendementExterne.secondaire.tauxGF || ''}
                    onChange={(e) => updateRendementExterne('secondaire', 'tauxGF', Number(e.target.value))}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    max="100"
                    step="0.1"
                    value={rendementExterne.secondaire.tauxFilles || ''}
                    onChange={(e) => updateRendementExterne('secondaire', 'tauxFilles', Number(e.target.value))}
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">a) Enseignement Spécial (handicap)</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    max="100"
                    step="0.1"
                    value={rendementExterne.enseignementSpecialSecondaire.tauxGF || ''}
                    onChange={(e) => updateRendementExterne('enseignementSpecialSecondaire', 'tauxGF', Number(e.target.value))}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    max="100"
                    step="0.1"
                    value={rendementExterne.enseignementSpecialSecondaire.tauxFilles || ''}
                    onChange={(e) => updateRendementExterne('enseignementSpecialSecondaire', 'tauxFilles', Number(e.target.value))}
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">b) Enseignement Secondaire Normal</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    max="100"
                    step="0.1"
                    value={rendementExterne.enseignementSecondaireNormal.tauxGF || ''}
                    onChange={(e) => updateRendementExterne('enseignementSecondaireNormal', 'tauxGF', Number(e.target.value))}
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input 
                    type="number" 
                    className="w-full text-center border-none focus:outline-none focus:ring-0" 
                    max="100"
                    step="0.1"
                    value={rendementExterne.enseignementSecondaireNormal.tauxFilles || ''}
                    onChange={(e) => updateRendementExterne('enseignementSecondaireNormal', 'tauxFilles', Number(e.target.value))}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* III.8. Efficacité Externe du Système Educatif */}
      <div className="mb-6">
        <h4 className="font-bold mb-3">III.8. Efficacité Externe du Système Educatif: Examen, Evaluations certificatives</h4>
        
        {/* A. NIVEAU PRIMAIRE */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-3">
            <h5 className="font-bold">A. NIVEAU PRIMAIRE</h5>
            <div className="flex gap-2">
              {hasEfficacitePrimaireData() && (
                <button
                  type="button"
                  onClick={() => {
                    setEfficacitePrimaire({
                      tauxAbandon: { tauxGF: 0, tauxFilles: 0 },
                      tauxReussite: { tauxGF: 0, tauxFilles: 0 },
                      tauxEchec: { tauxGF: 0, tauxFilles: 0 }
                    });
                  }}
                  className="px-4 py-2 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Réinitialiser
                </button>
              )}
              <button
                type="button"
                onClick={openCalculModalPrimaire}
                className="px-4 py-2 text-sm bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Calculer les taux
              </button>
            </div>
          </div>
          <div className="relative">
            {/* Overlay avec effet flou - MODAL UNIQUEMENT */}
            {!hasEfficacitePrimaireData() && (
              <div className="absolute inset-0 bg-white bg-opacity-75 backdrop-blur-sm z-10 flex items-center justify-center group hover:bg-opacity-85 transition-all duration-300 cursor-pointer">
                <div className="text-center transform group-hover:scale-105 transition-transform duration-300">
                  <div className="mb-4">
                    <svg className="w-16 h-16 mx-auto text-purple-500 mb-4 group-hover:text-purple-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2 group-hover:text-gray-800 transition-colors duration-300">
                    Tableau verrouillé
                  </h3>
                  <p className="text-gray-600 mb-4 group-hover:text-gray-700 transition-colors duration-300">
                    Cliquez sur le bouton "<span className="font-bold">Calculer les taux</span>" pour saisir les données
                  </p>
                  <button
                    type="button"
                    onClick={openCalculModalPrimaire}
                    className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all duration-300 flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Ouvrir la saisie des données
                  </button>
                </div>
              </div>
            )}
            
            <table className={`w-full border-collapse border border-gray-300 ${!hasEfficacitePrimaireData() ? 'pointer-events-none' : ''}`}>
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left">Indicateur</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">Taux (GF)</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">des (Filles)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">1) TAUX D'ABANDON %</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      max="100"
                      step="0.1"
                      value={efficacitePrimaire.tauxAbandon.tauxGF || ''}
                      onChange={(e) => updateEfficacitePrimaire('tauxAbandon', 'tauxGF', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      max="100"
                      step="0.1"
                      value={efficacitePrimaire.tauxAbandon.tauxFilles || ''}
                      onChange={(e) => updateEfficacitePrimaire('tauxAbandon', 'tauxFilles', Number(e.target.value))}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">2) TAUX DE REUSSITE %</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      max="100"
                      step="0.1"
                      value={efficacitePrimaire.tauxReussite.tauxGF || ''}
                      onChange={(e) => updateEfficacitePrimaire('tauxReussite', 'tauxGF', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      max="100"
                      step="0.1"
                      value={efficacitePrimaire.tauxReussite.tauxFilles || ''}
                      onChange={(e) => updateEfficacitePrimaire('tauxReussite', 'tauxFilles', Number(e.target.value))}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">3) TAUX D'ECHEC %</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      max="100"
                      step="0.1"
                      value={efficacitePrimaire.tauxEchec.tauxGF || ''}
                      onChange={(e) => updateEfficacitePrimaire('tauxEchec', 'tauxGF', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      max="100"
                      step="0.1"
                      value={efficacitePrimaire.tauxEchec.tauxFilles || ''}
                      onChange={(e) => updateEfficacitePrimaire('tauxEchec', 'tauxFilles', Number(e.target.value))}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* B. NIVEAU SECONDAIRE */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-3">
            <h5 className="font-bold">B. NIVEAU SECONDAIRE</h5>
            <div className="flex gap-2">
              {hasEfficaciteSecondaireData() && (
                <button
                  type="button"
                  onClick={() => {
                    setEfficaciteSecondaire({
                      tauxAbandon: { tauxGF: 0, tauxFilles: 0 },
                      tauxReussite: { tauxGF: 0, tauxFilles: 0 },
                      tauxEchec: { tauxGF: 0, tauxFilles: 0 }
                    });
                  }}
                  className="px-4 py-2 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Réinitialiser
                </button>
              )}
              <button
                type="button"
                onClick={openCalculModalSecondaire}
                className="px-4 py-2 text-sm bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Calculer les taux
              </button>
            </div>
          </div>
          <div className="relative">
            {/* Overlay avec effet flou - MODAL UNIQUEMENT */}
            {!hasEfficaciteSecondaireData() && (
              <div className="absolute inset-0 bg-white bg-opacity-75 backdrop-blur-sm z-10 flex items-center justify-center group hover:bg-opacity-85 transition-all duration-300 cursor-pointer">
                <div className="text-center transform group-hover:scale-105 transition-transform duration-300">
                  <div className="mb-4">
                    <svg className="w-16 h-16 mx-auto text-orange-500 mb-4 group-hover:text-orange-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2 group-hover:text-gray-800 transition-colors duration-300">
                    Tableau verrouillé
                  </h3>
                  <p className="text-gray-600 mb-4 group-hover:text-gray-700 transition-colors duration-300">
                    Cliquez sur le bouton "<span className="font-bold">Calculer les taux</span>" pour saisir les données
                  </p>
                  <button
                    type="button"
                    onClick={openCalculModalSecondaire}
                    className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-300 flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Ouvrir la saisie des données
                  </button>
                </div>
              </div>
            )}
            
            <table className={`w-full border-collapse border border-gray-300 ${!hasEfficaciteSecondaireData() ? 'pointer-events-none' : ''}`}>
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left">Indicateur</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">Taux (GF)</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">(F)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">1) TAUX D'ABANDON %</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      max="100"
                      step="0.1"
                      value={efficaciteSecondaire.tauxAbandon.tauxGF || ''}
                      onChange={(e) => updateEfficaciteSecondaire('tauxAbandon', 'tauxGF', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      max="100"
                      step="0.1"
                      value={efficaciteSecondaire.tauxAbandon.tauxFilles || ''}
                      onChange={(e) => updateEfficaciteSecondaire('tauxAbandon', 'tauxFilles', Number(e.target.value))}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">2) TAUX DE REUSSITE %</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      max="100"
                      step="0.1"
                      value={efficaciteSecondaire.tauxReussite.tauxGF || ''}
                      onChange={(e) => updateEfficaciteSecondaire('tauxReussite', 'tauxGF', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      max="100"
                      step="0.1"
                      value={efficaciteSecondaire.tauxReussite.tauxFilles || ''}
                      onChange={(e) => updateEfficaciteSecondaire('tauxReussite', 'tauxFilles', Number(e.target.value))}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">3) TAUX D'ECHEC %</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      max="100"
                      step="0.1"
                      value={efficaciteSecondaire.tauxEchec.tauxGF || ''}
                      onChange={(e) => updateEfficaciteSecondaire('tauxEchec', 'tauxGF', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      max="100"
                      step="0.1"
                      value={efficaciteSecondaire.tauxEchec.tauxFilles || ''}
                      onChange={(e) => updateEfficaciteSecondaire('tauxEchec', 'tauxFilles', Number(e.target.value))}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* TAUX DIPLÔMES DE FINALISTES (OCDE) */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-3">
            <h5 className="font-bold">TAUX DIPLÔMES DE FINALISTES (OCDE)</h5>
            <div className="flex gap-2">
              {hasEfficaciteOCDEData() && (
                <button
                  type="button"
                  onClick={resetEfficaciteOCDE}
                  className="px-4 py-2 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Réinitialiser
                </button>
              )}
              <button
                type="button"
                onClick={openCalculModalOCDE}
                className="px-4 py-2 text-sm bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Calculer les taux
              </button>
            </div>
          </div>
          <div className="relative">
            {/* Overlay avec effet flou - MODAL UNIQUEMENT */}
            {!hasEfficaciteOCDEData() && (
              <div className="absolute inset-0 bg-white bg-opacity-75 backdrop-blur-sm z-10 flex items-center justify-center group hover:bg-opacity-85 transition-all duration-300 cursor-pointer">
                <div className="text-center transform group-hover:scale-105 transition-transform duration-300">
                  <div className="mb-4">
                    <svg className="w-16 h-16 mx-auto text-indigo-500 mb-4 group-hover:text-indigo-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2 group-hover:text-gray-800 transition-colors duration-300">
                    Tableau verrouillé
                  </h3>
                  <p className="text-gray-600 mb-4 group-hover:text-gray-700 transition-colors duration-300">
                    Cliquez sur le bouton "<span className="font-bold">Calculer les taux</span>" pour saisir les données
                  </p>
                </div>
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left">Type de Diplôme</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">Taux (GF)</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">(F)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">HUMANITES SCIENTIFIQUES</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      max="100"
                      step="0.1"
                      value={tauxDiplomesOCDE.humanitesScientifiques.tauxGF || ''}
                      onChange={(e) => updateTauxDiplomesOCDE('humanitesScientifiques', 'tauxGF', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      max="100"
                      step="0.1"
                      value={tauxDiplomesOCDE.humanitesScientifiques.tauxFilles || ''}
                      onChange={(e) => updateTauxDiplomesOCDE('humanitesScientifiques', 'tauxFilles', Number(e.target.value))}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">HUMANITES TECHNIQUES</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      max="100"
                      step="0.1"
                      value={tauxDiplomesOCDE.humanitesTechniques.tauxGF || ''}
                      onChange={(e) => updateTauxDiplomesOCDE('humanitesTechniques', 'tauxGF', Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      className="w-full text-center border-none focus:outline-none focus:ring-0" 
                      max="100"
                      step="0.1"
                      value={tauxDiplomesOCDE.humanitesTechniques.tauxFilles || ''}
                      onChange={(e) => updateTauxDiplomesOCDE('humanitesTechniques', 'tauxFilles', Number(e.target.value))}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de calcul des taux */}
      {showCalculModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Calculer les indicateurs de rendement interne</h3>
              <button
                onClick={() => setShowCalculModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-2">Formulaire intelligent avec blocage</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• <strong>Blocage automatique</strong> : Impossible de saisir un nombre qui dépasserait les inscrits</li>
                      <li>• <strong>Limite visible</strong> : Chaque champ affiche sa valeur maximale autorisée</li>
                      <li>• <strong>Saisie guidée</strong> : Commencez par saisir les inscrits, puis les autres champs</li>
                      <li>• <strong>Validation en temps réel</strong> : Les indicateurs changent selon la cohérence des données</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* A. 6ème Primaire */}
              <div className={`mb-6 border rounded-lg p-4 ${isNiveauValid('sixiemePrimaire') ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-lg text-blue-700">A. 6ème Primaire</h4>
                  <div className="flex items-center gap-2">
                    {isNiveauValid('sixiemePrimaire') ? (
                      <span className="text-green-600 text-sm font-medium">✓ Validé</span>
                    ) : (
                      <span className="text-orange-600 text-sm font-medium">⚠ En cours</span>
                    )}
                  </div>
                </div>
                <div className={`text-sm mb-4 p-2 rounded ${getNiveauStatus('sixiemePrimaire').color} bg-opacity-10`}>
                  {getNiveauStatus('sixiemePrimaire').message}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Inscrits</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={calculData.sixiemePrimaire.inscrits || ''}
                      onChange={(e) => updateCalculData('sixiemePrimaire', 'inscrits', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Abandons
                      {getMaxValue('sixiemePrimaire', 'abandons') !== undefined && (
                        <span className="text-xs text-gray-500 ml-2">
                          (Max: {getMaxValue('sixiemePrimaire', 'abandons')})
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      max={getMaxValue('sixiemePrimaire', 'abandons')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      value={calculData.sixiemePrimaire.abandons || ''}
                      onChange={(e) => updateCalculData('sixiemePrimaire', 'abandons', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Réussites
                      {getMaxValue('sixiemePrimaire', 'reussites') !== undefined && (
                        <span className="text-xs text-gray-500 ml-2">
                          (Max: {getMaxValue('sixiemePrimaire', 'reussites')})
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      max={getMaxValue('sixiemePrimaire', 'reussites')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={calculData.sixiemePrimaire.reussites || ''}
                      onChange={(e) => updateCalculData('sixiemePrimaire', 'reussites', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Échecs
                      {getMaxValue('sixiemePrimaire', 'echecs') !== undefined && (
                        <span className="text-xs text-gray-500 ml-2">
                          (Max: {getMaxValue('sixiemePrimaire', 'echecs')})
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      max={getMaxValue('sixiemePrimaire', 'echecs')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      value={calculData.sixiemePrimaire.echecs || ''}
                      onChange={(e) => updateCalculData('sixiemePrimaire', 'echecs', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* B. 8ème CETB */}
              <div className={`mb-6 border rounded-lg p-4 ${isNiveauValid('huitiemeCETB') ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-lg text-blue-700">B. 8ème CETB</h4>
                  <div className="flex items-center gap-2">
                    {isNiveauValid('huitiemeCETB') ? (
                      <span className="text-green-600 text-sm font-medium">✓ Validé</span>
                    ) : (
                      <span className="text-orange-600 text-sm font-medium">⚠ En cours</span>
                    )}
                  </div>
                </div>
                <div className={`text-sm mb-4 p-2 rounded ${getNiveauStatus('huitiemeCETB').color} bg-opacity-10`}>
                  {getNiveauStatus('huitiemeCETB').message}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Inscrits</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={calculData.huitiemeCETB.inscrits || ''}
                      onChange={(e) => updateCalculData('huitiemeCETB', 'inscrits', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Abandons
                      {getMaxValue('huitiemeCETB', 'abandons') !== undefined && (
                        <span className="text-xs text-gray-500 ml-2">
                          (Max: {getMaxValue('huitiemeCETB', 'abandons')})
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      max={getMaxValue('huitiemeCETB', 'abandons')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      value={calculData.huitiemeCETB.abandons || ''}
                      onChange={(e) => updateCalculData('huitiemeCETB', 'abandons', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Réussites
                      {getMaxValue('huitiemeCETB', 'reussites') !== undefined && (
                        <span className="text-xs text-gray-500 ml-2">
                          (Max: {getMaxValue('huitiemeCETB', 'reussites')})
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      max={getMaxValue('huitiemeCETB', 'reussites')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={calculData.huitiemeCETB.reussites || ''}
                      onChange={(e) => updateCalculData('huitiemeCETB', 'reussites', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Échecs
                      {getMaxValue('huitiemeCETB', 'echecs') !== undefined && (
                        <span className="text-xs text-gray-500 ml-2">
                          (Max: {getMaxValue('huitiemeCETB', 'echecs')})
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      max={getMaxValue('huitiemeCETB', 'echecs')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      value={calculData.huitiemeCETB.echecs || ''}
                      onChange={(e) => updateCalculData('huitiemeCETB', 'echecs', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* C. 4ème Humanité */}
              <div className={`mb-6 border rounded-lg p-4 ${isNiveauValid('quatriemeHumanite') ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-lg text-blue-700">C. 4ème Humanité</h4>
                  <div className="flex items-center gap-2">
                    {isNiveauValid('quatriemeHumanite') ? (
                      <span className="text-green-600 text-sm font-medium">✓ Validé</span>
                    ) : (
                      <span className="text-orange-600 text-sm font-medium">⚠ En cours</span>
                    )}
                  </div>
                </div>
                <div className={`text-sm mb-4 p-2 rounded ${getNiveauStatus('quatriemeHumanite').color} bg-opacity-10`}>
                  {getNiveauStatus('quatriemeHumanite').message}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Inscrits</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={calculData.quatriemeHumanite.inscrits || ''}
                      onChange={(e) => updateCalculData('quatriemeHumanite', 'inscrits', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Abandons
                      {getMaxValue('quatriemeHumanite', 'abandons') !== undefined && (
                        <span className="text-xs text-gray-500 ml-2">
                          (Max: {getMaxValue('quatriemeHumanite', 'abandons')})
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      max={getMaxValue('quatriemeHumanite', 'abandons')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      value={calculData.quatriemeHumanite.abandons || ''}
                      onChange={(e) => updateCalculData('quatriemeHumanite', 'abandons', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Réussites
                      {getMaxValue('quatriemeHumanite', 'reussites') !== undefined && (
                        <span className="text-xs text-gray-500 ml-2">
                          (Max: {getMaxValue('quatriemeHumanite', 'reussites')})
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      max={getMaxValue('quatriemeHumanite', 'reussites')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={calculData.quatriemeHumanite.reussites || ''}
                      onChange={(e) => updateCalculData('quatriemeHumanite', 'reussites', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Échecs
                      {getMaxValue('quatriemeHumanite', 'echecs') !== undefined && (
                        <span className="text-xs text-gray-500 ml-2">
                          (Max: {getMaxValue('quatriemeHumanite', 'echecs')})
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      max={getMaxValue('quatriemeHumanite', 'echecs')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      value={calculData.quatriemeHumanite.echecs || ''}
                      onChange={(e) => updateCalculData('quatriemeHumanite', 'echecs', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* D. Proportion des diplômés en Mathématiques */}
              <div className={`mb-6 border rounded-lg p-4 ${isNiveauValid('diplomesMathematiques') ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-lg text-blue-700">D. Proportion des diplômés en Mathématiques</h4>
                  <div className="flex items-center gap-2">
                    {isNiveauValid('diplomesMathematiques') ? (
                      <span className="text-green-600 text-sm font-medium">✓ Validé</span>
                    ) : (
                      <span className="text-orange-600 text-sm font-medium">⚠ En cours</span>
                    )}
                  </div>
                </div>
                <div className={`text-sm mb-4 p-2 rounded ${getNiveauStatus('diplomesMathematiques').color} bg-opacity-10`}>
                  {getNiveauStatus('diplomesMathematiques').message}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Inscrits</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={calculData.diplomesMathematiques.inscrits || ''}
                      onChange={(e) => updateCalculData('diplomesMathematiques', 'inscrits', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Abandons
                      {getMaxValue('diplomesMathematiques', 'abandons') !== undefined && (
                        <span className="text-xs text-gray-500 ml-2">
                          (Max: {getMaxValue('diplomesMathematiques', 'abandons')})
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      max={getMaxValue('diplomesMathematiques', 'abandons')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      value={calculData.diplomesMathematiques.abandons || ''}
                      onChange={(e) => updateCalculData('diplomesMathematiques', 'abandons', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Réussites
                      {getMaxValue('diplomesMathematiques', 'reussites') !== undefined && (
                        <span className="text-xs text-gray-500 ml-2">
                          (Max: {getMaxValue('diplomesMathematiques', 'reussites')})
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      max={getMaxValue('diplomesMathematiques', 'reussites')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={calculData.diplomesMathematiques.reussites || ''}
                      onChange={(e) => updateCalculData('diplomesMathematiques', 'reussites', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Échecs
                      {getMaxValue('diplomesMathematiques', 'echecs') !== undefined && (
                        <span className="text-xs text-gray-500 ml-2">
                          (Max: {getMaxValue('diplomesMathematiques', 'echecs')})
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      max={getMaxValue('diplomesMathematiques', 'echecs')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      value={calculData.diplomesMathematiques.echecs || ''}
                      onChange={(e) => updateCalculData('diplomesMathematiques', 'echecs', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* E. Proportion des Diplômés des Filières Techniques */}
              <div className={`mb-6 border rounded-lg p-4 ${isNiveauValid('diplomesFiliereTechniques') ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-lg text-blue-700">E. Proportion des Diplômés des Filières Techniques</h4>
                  <div className="flex items-center gap-2">
                    {isNiveauValid('diplomesFiliereTechniques') ? (
                      <span className="text-green-600 text-sm font-medium">✓ Validé</span>
                    ) : (
                      <span className="text-orange-600 text-sm font-medium">⚠ En cours</span>
                    )}
                  </div>
                </div>
                <div className={`text-sm mb-4 p-2 rounded ${getNiveauStatus('diplomesFiliereTechniques').color} bg-opacity-10`}>
                  {getNiveauStatus('diplomesFiliereTechniques').message}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Inscrits</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={calculData.diplomesFiliereTechniques.inscrits || ''}
                      onChange={(e) => updateCalculData('diplomesFiliereTechniques', 'inscrits', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Abandons
                      {getMaxValue('diplomesFiliereTechniques', 'abandons') !== undefined && (
                        <span className="text-xs text-gray-500 ml-2">
                          (Max: {getMaxValue('diplomesFiliereTechniques', 'abandons')})
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      max={getMaxValue('diplomesFiliereTechniques', 'abandons')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      value={calculData.diplomesFiliereTechniques.abandons || ''}
                      onChange={(e) => updateCalculData('diplomesFiliereTechniques', 'abandons', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Réussites
                      {getMaxValue('diplomesFiliereTechniques', 'reussites') !== undefined && (
                        <span className="text-xs text-gray-500 ml-2">
                          (Max: {getMaxValue('diplomesFiliereTechniques', 'reussites')})
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      max={getMaxValue('diplomesFiliereTechniques', 'reussites')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={calculData.diplomesFiliereTechniques.reussites || ''}
                      onChange={(e) => updateCalculData('diplomesFiliereTechniques', 'reussites', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Échecs
                      {getMaxValue('diplomesFiliereTechniques', 'echecs') !== undefined && (
                        <span className="text-xs text-gray-500 ml-2">
                          (Max: {getMaxValue('diplomesFiliereTechniques', 'echecs')})
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      max={getMaxValue('diplomesFiliereTechniques', 'echecs')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      value={calculData.diplomesFiliereTechniques.echecs || ''}
                      onChange={(e) => updateCalculData('diplomesFiliereTechniques', 'echecs', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Indicateur global de validation */}
            <div className={`px-6 py-4 border-t border-gray-200 ${getGlobalStatus().bgColor}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {getGlobalStatus().status === 'perfect' ? (
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : getGlobalStatus().status === 'partial' ? (
                      <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    <span className={`font-medium ${getGlobalStatus().color}`}>
                      {getGlobalStatus().message}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowCalculModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={calculerTaux}
                  disabled={!areAllNiveauxValid()}
                  className={`px-6 py-2 rounded-md transition-all duration-300 flex items-center gap-2 ${
                    areAllNiveauxValid() 
                      ? 'bg-green-500 text-white hover:bg-green-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {areAllNiveauxValid() ? ' Calculer les pourcentages' : 'Complétez tous les niveaux'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de calcul des taux externes */}
      {showCalculModalExternes && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Calculer les indicateurs de rendement externe</h3>
              <button
                onClick={() => setShowCalculModalExternes(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-green-800 mb-2">Formulaire intelligent avec blocage</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• <strong>Blocage automatique</strong> : Impossible de saisir un nombre qui dépasserait les inscrits</li>
                      <li>• <strong>Limite visible</strong> : Chaque champ affiche sa valeur maximale autorisée</li>
                      <li>• <strong>Saisie guidée</strong> : Commencez par saisir les inscrits, puis les autres champs</li>
                      <li>• <strong>Validation en temps réel</strong> : Les indicateurs changent selon la cohérence des données</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* A. NIVEAU PRESCOLAIRE */}
              <div className={`mb-6 border rounded-lg p-4 ${isNiveauExterneValid('prescolaire') ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-lg text-green-700">A. NIVEAU PRESCOLAIRE</h4>
                  <div className="flex items-center gap-2">
                    {isNiveauExterneValid('prescolaire') ? (
                      <span className="text-green-600 text-sm font-medium">✓ Validé</span>
                    ) : (
                      <span className="text-orange-600 text-sm font-medium">⚠ En cours</span>
                    )}
                  </div>
                </div>
                <div className={`text-sm mb-4 p-2 rounded ${getNiveauExterneStatus('prescolaire').color} bg-opacity-10`}>
                  {getNiveauExterneStatus('prescolaire').message}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total (GF)</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={calculDataExternes.prescolaire.total || ''}
                      onChange={(e) => updateCalculDataExternes('prescolaire', 'total', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Garçons
                      {getMaxValueExterne('prescolaire', 'garcons') !== undefined && (
                        <span className="text-xs text-gray-500 ml-2">
                          (Max: {getMaxValueExterne('prescolaire', 'garcons')})
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      max={getMaxValueExterne('prescolaire', 'garcons')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={calculDataExternes.prescolaire.garcons || ''}
                      onChange={(e) => updateCalculDataExternes('prescolaire', 'garcons', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filles
                      {getMaxValueExterne('prescolaire', 'filles') !== undefined && (
                        <span className="text-xs text-gray-500 ml-2">
                          (Max: {getMaxValueExterne('prescolaire', 'filles')})
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      max={getMaxValueExterne('prescolaire', 'filles')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      value={calculDataExternes.prescolaire.filles || ''}
                      onChange={(e) => updateCalculDataExternes('prescolaire', 'filles', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* a) Espace Communautaire d'Eveil */}
              <div className={`mb-6 border rounded-lg p-4 ${isNiveauExterneValid('espaceCommunautaireEveil') ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-lg text-green-700">a) Espace Communautaire d'Eveil</h4>
                  <div className="flex items-center gap-2">
                    {isNiveauExterneValid('espaceCommunautaireEveil') ? (
                      <span className="text-green-600 text-sm font-medium">✓ Validé</span>
                    ) : (
                      <span className="text-orange-600 text-sm font-medium">⚠ En cours</span>
                    )}
                  </div>
                </div>
                <div className={`text-sm mb-4 p-2 rounded ${getNiveauExterneStatus('espaceCommunautaireEveil').color} bg-opacity-10`}>
                  {getNiveauExterneStatus('espaceCommunautaireEveil').message}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total (GF)</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={calculDataExternes.espaceCommunautaireEveil.total || ''}
                      onChange={(e) => updateCalculDataExternes('espaceCommunautaireEveil', 'total', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Garçons
                      {getMaxValueExterne('espaceCommunautaireEveil', 'garcons') !== undefined && (
                        <span className="text-xs text-gray-500 ml-2">
                          (Max: {getMaxValueExterne('espaceCommunautaireEveil', 'garcons')})
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      max={getMaxValueExterne('espaceCommunautaireEveil', 'garcons')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={calculDataExternes.espaceCommunautaireEveil.garcons || ''}
                      onChange={(e) => updateCalculDataExternes('espaceCommunautaireEveil', 'garcons', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filles
                      {getMaxValueExterne('espaceCommunautaireEveil', 'filles') !== undefined && (
                        <span className="text-xs text-gray-500 ml-2">
                          (Max: {getMaxValueExterne('espaceCommunautaireEveil', 'filles')})
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      max={getMaxValueExterne('espaceCommunautaireEveil', 'filles')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      value={calculDataExternes.espaceCommunautaireEveil.filles || ''}
                      onChange={(e) => updateCalculDataExternes('espaceCommunautaireEveil', 'filles', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* b) Classe Préprimaire */}
              <div className={`mb-6 border rounded-lg p-4 ${isNiveauExterneValid('classePreprimaire') ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-lg text-green-700">b) Classe Préprimaire</h4>
                  <div className="flex items-center gap-2">
                    {isNiveauExterneValid('classePreprimaire') ? (
                      <span className="text-green-600 text-sm font-medium">✓ Validé</span>
                    ) : (
                      <span className="text-orange-600 text-sm font-medium">⚠ En cours</span>
                    )}
                  </div>
                </div>
                <div className={`text-sm mb-4 p-2 rounded ${getNiveauExterneStatus('classePreprimaire').color} bg-opacity-10`}>
                  {getNiveauExterneStatus('classePreprimaire').message}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total (GF)</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={calculDataExternes.classePreprimaire.total || ''}
                      onChange={(e) => updateCalculDataExternes('classePreprimaire', 'total', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Garçons
                      {getMaxValueExterne('classePreprimaire', 'garcons') !== undefined && (
                        <span className="text-xs text-gray-500 ml-2">
                          (Max: {getMaxValueExterne('classePreprimaire', 'garcons')})
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      max={getMaxValueExterne('classePreprimaire', 'garcons')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={calculDataExternes.classePreprimaire.garcons || ''}
                      onChange={(e) => updateCalculDataExternes('classePreprimaire', 'garcons', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filles
                      {getMaxValueExterne('classePreprimaire', 'filles') !== undefined && (
                        <span className="text-xs text-gray-500 ml-2">
                          (Max: {getMaxValueExterne('classePreprimaire', 'filles')})
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      max={getMaxValueExterne('classePreprimaire', 'filles')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      value={calculDataExternes.classePreprimaire.filles || ''}
                      onChange={(e) => updateCalculDataExternes('classePreprimaire', 'filles', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* c) Maternel */}
              <div className={`mb-6 border rounded-lg p-4 ${isNiveauExterneValid('maternel') ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-lg text-green-700">c) Maternel</h4>
                  <div className="flex items-center gap-2">
                    {isNiveauExterneValid('maternel') ? (
                      <span className="text-green-600 text-sm font-medium">✓ Validé</span>
                    ) : (
                      <span className="text-orange-600 text-sm font-medium">⚠ En cours</span>
                    )}
                  </div>
                </div>
                <div className={`text-sm mb-4 p-2 rounded ${getNiveauExterneStatus('maternel').color} bg-opacity-10`}>
                  {getNiveauExterneStatus('maternel').message}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total (GF)</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={calculDataExternes.maternel.total || ''}
                      onChange={(e) => updateCalculDataExternes('maternel', 'total', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Garçons
                      {getMaxValueExterne('maternel', 'garcons') !== undefined && (
                        <span className="text-xs text-gray-500 ml-2">
                          (Max: {getMaxValueExterne('maternel', 'garcons')})
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      max={getMaxValueExterne('maternel', 'garcons')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={calculDataExternes.maternel.garcons || ''}
                      onChange={(e) => updateCalculDataExternes('maternel', 'garcons', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filles
                      {getMaxValueExterne('maternel', 'filles') !== undefined && (
                        <span className="text-xs text-gray-500 ml-2">
                          (Max: {getMaxValueExterne('maternel', 'filles')})
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      max={getMaxValueExterne('maternel', 'filles')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      value={calculDataExternes.maternel.filles || ''}
                      onChange={(e) => updateCalculDataExternes('maternel', 'filles', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* C. NIVEAU PRIMAIRE */}
              <div className={`mb-6 border rounded-lg p-4 ${isNiveauExterneValid('primaire') ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-lg text-green-700">C. NIVEAU PRIMAIRE</h4>
                  <div className="flex items-center gap-2">
                    {isNiveauExterneValid('primaire') ? (
                      <span className="text-green-600 text-sm font-medium">✓ Validé</span>
                    ) : (
                      <span className="text-orange-600 text-sm font-medium">⚠ En cours</span>
                    )}
                  </div>
                </div>
                <div className={`text-sm mb-4 p-2 rounded ${getNiveauExterneStatus('primaire').color} bg-opacity-10`}>
                  {getNiveauExterneStatus('primaire').message}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total (GF)</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={calculDataExternes.primaire.total || ''}
                      onChange={(e) => updateCalculDataExternes('primaire', 'total', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Garçons
                      {getMaxValueExterne('primaire', 'garcons') !== undefined && (
                        <span className="text-xs text-gray-500 ml-2">
                          (Max: {getMaxValueExterne('primaire', 'garcons')})
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      max={getMaxValueExterne('primaire', 'garcons')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={calculDataExternes.primaire.garcons || ''}
                      onChange={(e) => updateCalculDataExternes('primaire', 'garcons', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filles
                      {getMaxValueExterne('primaire', 'filles') !== undefined && (
                        <span className="text-xs text-gray-500 ml-2">
                          (Max: {getMaxValueExterne('primaire', 'filles')})
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      max={getMaxValueExterne('primaire', 'filles')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      value={calculDataExternes.primaire.filles || ''}
                      onChange={(e) => updateCalculDataExternes('primaire', 'filles', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* a) Enseignement Spécial (handicap) */}
              <div className={`mb-6 border rounded-lg p-4 ${isNiveauExterneValid('enseignementSpecialPrimaire') ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-lg text-green-700">a) Enseignement Spécial (handicap)</h4>
                  <div className="flex items-center gap-2">
                    {isNiveauExterneValid('enseignementSpecialPrimaire') ? (
                      <span className="text-green-600 text-sm font-medium">✓ Validé</span>
                    ) : (
                      <span className="text-orange-600 text-sm font-medium">⚠ En cours</span>
                    )}
                  </div>
                </div>
                <div className={`text-sm mb-4 p-2 rounded ${getNiveauExterneStatus('enseignementSpecialPrimaire').color} bg-opacity-10`}>
                  {getNiveauExterneStatus('enseignementSpecialPrimaire').message}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total (GF)</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={calculDataExternes.enseignementSpecialPrimaire.total || ''}
                      onChange={(e) => updateCalculDataExternes('enseignementSpecialPrimaire', 'total', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Garçons
                      {getMaxValueExterne('enseignementSpecialPrimaire', 'garcons') !== undefined && (
                        <span className="text-xs text-gray-500 ml-2">
                          (Max: {getMaxValueExterne('enseignementSpecialPrimaire', 'garcons')})
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      max={getMaxValueExterne('enseignementSpecialPrimaire', 'garcons')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={calculDataExternes.enseignementSpecialPrimaire.garcons || ''}
                      onChange={(e) => updateCalculDataExternes('enseignementSpecialPrimaire', 'garcons', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filles
                      {getMaxValueExterne('enseignementSpecialPrimaire', 'filles') !== undefined && (
                        <span className="text-xs text-gray-500 ml-2">
                          (Max: {getMaxValueExterne('enseignementSpecialPrimaire', 'filles')})
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      max={getMaxValueExterne('enseignementSpecialPrimaire', 'filles')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      value={calculDataExternes.enseignementSpecialPrimaire.filles || ''}
                      onChange={(e) => updateCalculDataExternes('enseignementSpecialPrimaire', 'filles', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* b) Enseignement Primaire */}
              <div className={`mb-6 border rounded-lg p-4 ${isNiveauExterneValid('enseignementPrimaire') ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-lg text-green-700">b) Enseignement Primaire</h4>
                  <div className="flex items-center gap-2">
                    {isNiveauExterneValid('enseignementPrimaire') ? (
                      <span className="text-green-600 text-sm font-medium">✓ Validé</span>
                    ) : (
                      <span className="text-orange-600 text-sm font-medium">⚠ En cours</span>
                    )}
                  </div>
                </div>
                <div className={`text-sm mb-4 p-2 rounded ${getNiveauExterneStatus('enseignementPrimaire').color} bg-opacity-10`}>
                  {getNiveauExterneStatus('enseignementPrimaire').message}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total (GF)</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={calculDataExternes.enseignementPrimaire.total || ''}
                      onChange={(e) => updateCalculDataExternes('enseignementPrimaire', 'total', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Garçons
                      {getMaxValueExterne('enseignementPrimaire', 'garcons') !== undefined && (
                        <span className="text-xs text-gray-500 ml-2">
                          (Max: {getMaxValueExterne('enseignementPrimaire', 'garcons')})
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      max={getMaxValueExterne('enseignementPrimaire', 'garcons')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={calculDataExternes.enseignementPrimaire.garcons || ''}
                      onChange={(e) => updateCalculDataExternes('enseignementPrimaire', 'garcons', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filles
                      {getMaxValueExterne('enseignementPrimaire', 'filles') !== undefined && (
                        <span className="text-xs text-gray-500 ml-2">
                          (Max: {getMaxValueExterne('enseignementPrimaire', 'filles')})
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      max={getMaxValueExterne('enseignementPrimaire', 'filles')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      value={calculDataExternes.enseignementPrimaire.filles || ''}
                      onChange={(e) => updateCalculDataExternes('enseignementPrimaire', 'filles', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* C. NIVEAU SECONDAIRE */}
              <div className={`mb-6 border rounded-lg p-4 ${isNiveauExterneValid('secondaire') ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-lg text-green-700">C. NIVEAU SECONDAIRE</h4>
                  <div className="flex items-center gap-2">
                    {isNiveauExterneValid('secondaire') ? (
                      <span className="text-green-600 text-sm font-medium">✓ Validé</span>
                    ) : (
                      <span className="text-orange-600 text-sm font-medium">⚠ En cours</span>
                    )}
                  </div>
                </div>
                <div className={`text-sm mb-4 p-2 rounded ${getNiveauExterneStatus('secondaire').color} bg-opacity-10`}>
                  {getNiveauExterneStatus('secondaire').message}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total (GF)</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={calculDataExternes.secondaire.total || ''}
                      onChange={(e) => updateCalculDataExternes('secondaire', 'total', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Garçons
                      {getMaxValueExterne('secondaire', 'garcons') !== undefined && (
                        <span className="text-xs text-gray-500 ml-2">
                          (Max: {getMaxValueExterne('secondaire', 'garcons')})
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      max={getMaxValueExterne('secondaire', 'garcons')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={calculDataExternes.secondaire.garcons || ''}
                      onChange={(e) => updateCalculDataExternes('secondaire', 'garcons', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filles
                      {getMaxValueExterne('secondaire', 'filles') !== undefined && (
                        <span className="text-xs text-gray-500 ml-2">
                          (Max: {getMaxValueExterne('secondaire', 'filles')})
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      max={getMaxValueExterne('secondaire', 'filles')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      value={calculDataExternes.secondaire.filles || ''}
                      onChange={(e) => updateCalculDataExternes('secondaire', 'filles', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* a) Enseignement Spécial (handicap) - Secondaire */}
              <div className={`mb-6 border rounded-lg p-4 ${isNiveauExterneValid('enseignementSpecialSecondaire') ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-lg text-green-700">a) Enseignement Spécial (handicap) - Secondaire</h4>
                  <div className="flex items-center gap-2">
                    {isNiveauExterneValid('enseignementSpecialSecondaire') ? (
                      <span className="text-green-600 text-sm font-medium">✓ Validé</span>
                    ) : (
                      <span className="text-orange-600 text-sm font-medium">⚠ En cours</span>
                    )}
                  </div>
                </div>
                <div className={`text-sm mb-4 p-2 rounded ${getNiveauExterneStatus('enseignementSpecialSecondaire').color} bg-opacity-10`}>
                  {getNiveauExterneStatus('enseignementSpecialSecondaire').message}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total (GF)</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={calculDataExternes.enseignementSpecialSecondaire.total || ''}
                      onChange={(e) => updateCalculDataExternes('enseignementSpecialSecondaire', 'total', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Garçons
                      {getMaxValueExterne('enseignementSpecialSecondaire', 'garcons') !== undefined && (
                        <span className="text-xs text-gray-500 ml-2">
                          (Max: {getMaxValueExterne('enseignementSpecialSecondaire', 'garcons')})
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      max={getMaxValueExterne('enseignementSpecialSecondaire', 'garcons')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={calculDataExternes.enseignementSpecialSecondaire.garcons || ''}
                      onChange={(e) => updateCalculDataExternes('enseignementSpecialSecondaire', 'garcons', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filles
                      {getMaxValueExterne('enseignementSpecialSecondaire', 'filles') !== undefined && (
                        <span className="text-xs text-gray-500 ml-2">
                          (Max: {getMaxValueExterne('enseignementSpecialSecondaire', 'filles')})
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      max={getMaxValueExterne('enseignementSpecialSecondaire', 'filles')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      value={calculDataExternes.enseignementSpecialSecondaire.filles || ''}
                      onChange={(e) => updateCalculDataExternes('enseignementSpecialSecondaire', 'filles', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* b) Enseignement Secondaire Normal */}
              <div className={`mb-6 border rounded-lg p-4 ${isNiveauExterneValid('enseignementSecondaireNormal') ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-lg text-green-700">b) Enseignement Secondaire Normal</h4>
                  <div className="flex items-center gap-2">
                    {isNiveauExterneValid('enseignementSecondaireNormal') ? (
                      <span className="text-green-600 text-sm font-medium">✓ Validé</span>
                    ) : (
                      <span className="text-orange-600 text-sm font-medium">⚠ En cours</span>
                    )}
                  </div>
                </div>
                <div className={`text-sm mb-4 p-2 rounded ${getNiveauExterneStatus('enseignementSecondaireNormal').color} bg-opacity-10`}>
                  {getNiveauExterneStatus('enseignementSecondaireNormal').message}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total (GF)</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={calculDataExternes.enseignementSecondaireNormal.total || ''}
                      onChange={(e) => updateCalculDataExternes('enseignementSecondaireNormal', 'total', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Garçons
                      {getMaxValueExterne('enseignementSecondaireNormal', 'garcons') !== undefined && (
                        <span className="text-xs text-gray-500 ml-2">
                          (Max: {getMaxValueExterne('enseignementSecondaireNormal', 'garcons')})
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      max={getMaxValueExterne('enseignementSecondaireNormal', 'garcons')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={calculDataExternes.enseignementSecondaireNormal.garcons || ''}
                      onChange={(e) => updateCalculDataExternes('enseignementSecondaireNormal', 'garcons', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filles
                      {getMaxValueExterne('enseignementSecondaireNormal', 'filles') !== undefined && (
                        <span className="text-xs text-gray-500 ml-2">
                          (Max: {getMaxValueExterne('enseignementSecondaireNormal', 'filles')})
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      max={getMaxValueExterne('enseignementSecondaireNormal', 'filles')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      value={calculDataExternes.enseignementSecondaireNormal.filles || ''}
                      onChange={(e) => updateCalculDataExternes('enseignementSecondaireNormal', 'filles', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setShowCalculModalExternes(false)}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={calculerTauxExternes}
                disabled={!areAllNiveauxExternesValid()}
                className={`px-6 py-2 rounded-md transition-colors flex items-center gap-2 ${
                  areAllNiveauxExternesValid() 
                    ? 'bg-green-500 text-white hover:bg-green-600' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {areAllNiveauxExternesValid() ? ' Calculer les pourcentages' : 'Complétez tous les niveaux'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de calcul des taux primaires (III.8) */}
      {showCalculModalPrimaire && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Calculer les indicateurs d'efficacité externe - Niveau Primaire</h3>
              <button
                onClick={() => setShowCalculModalPrimaire(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-blue-800 mb-3">Formulaire intelligent avec blocage</h4>
                

                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• <strong>Blocage automatique</strong> : Impossible de saisir un nombre qui dépasserait les inscrits</li>
                  <li>• <strong>Limite visible</strong> : Chaque champ affiche sa valeur maximale autorisée</li>
                  <li>• <strong>Validation en temps réel</strong> : Les indicateurs changent selon la cohérence des données</li>
                </ul>
              </div>

              {/* 1) TAUX D'ABANDON */}
              <div className={`mb-6 border rounded-lg p-4 ${isNiveauValidPrimaire('tauxAbandon') ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-lg text-purple-700">1) TAUX D'ABANDON %</h4>
                  <div className="flex items-center gap-2">
                    {isNiveauValidPrimaire('tauxAbandon') ? (
                      <span className="text-green-600 text-sm font-medium">✓ Validé</span>
                    ) : (
                      <span className="text-orange-600 text-sm font-medium">⚠ En cours</span>
                    )}
                  </div>
                </div>
                <div className={`text-sm mb-4 p-2 rounded ${getNiveauStatusPrimaire('tauxAbandon').color} bg-opacity-10`}>
                  {getNiveauStatusPrimaire('tauxAbandon').message}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Inscrits</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={calculDataPrimaire.tauxAbandon.inscrits || ''}
                      onChange={(e) => updateCalculDataPrimaire('tauxAbandon', 'inscrits', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Abandons
                      {getMaxValuePrimaire('tauxAbandon', 'abandons') !== undefined && (
                        <span className="text-xs text-gray-500 ml-2">
                          (Max: {getMaxValuePrimaire('tauxAbandon', 'abandons')})
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      max={getMaxValuePrimaire('tauxAbandon', 'abandons')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      value={calculDataPrimaire.tauxAbandon.abandons || ''}
                      onChange={(e) => updateCalculDataPrimaire('tauxAbandon', 'abandons', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Garçons</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={calculDataPrimaire.tauxAbandon.garcons || ''}
                      onChange={(e) => updateCalculDataPrimaire('tauxAbandon', 'garcons', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Filles</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      value={calculDataPrimaire.tauxAbandon.filles || ''}
                      onChange={(e) => updateCalculDataPrimaire('tauxAbandon', 'filles', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* 2) TAUX DE REUSSITE */}
              <div className={`mb-6 border rounded-lg p-4 ${isNiveauValidPrimaire('tauxReussite') ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-lg text-purple-700">2) TAUX DE REUSSITE %</h4>
                  <div className="flex items-center gap-2">
                    {isNiveauValidPrimaire('tauxReussite') ? (
                      <span className="text-green-600 text-sm font-medium">✓ Validé</span>
                    ) : (
                      <span className="text-orange-600 text-sm font-medium">⚠ En cours</span>
                    )}
                  </div>
                </div>
                <div className={`text-sm mb-4 p-2 rounded ${getNiveauStatusPrimaire('tauxReussite').color} bg-opacity-10`}>
                  {getNiveauStatusPrimaire('tauxReussite').message}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Inscrits</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={calculDataPrimaire.tauxReussite.inscrits || ''}
                      onChange={(e) => updateCalculDataPrimaire('tauxReussite', 'inscrits', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Réussites
                      {getMaxValuePrimaire('tauxReussite', 'reussites') !== undefined && (
                        <span className="text-xs text-gray-500 ml-2">
                          (Max: {getMaxValuePrimaire('tauxReussite', 'reussites')})
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      max={getMaxValuePrimaire('tauxReussite', 'reussites')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={calculDataPrimaire.tauxReussite.reussites || ''}
                      onChange={(e) => updateCalculDataPrimaire('tauxReussite', 'reussites', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Garçons</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={calculDataPrimaire.tauxReussite.garcons || ''}
                      onChange={(e) => updateCalculDataPrimaire('tauxReussite', 'garcons', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Filles</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      value={calculDataPrimaire.tauxReussite.filles || ''}
                      onChange={(e) => updateCalculDataPrimaire('tauxReussite', 'filles', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* 3) TAUX D'ECHEC */}
              <div className={`mb-6 border rounded-lg p-4 ${isNiveauValidPrimaire('tauxEchec') ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-lg text-purple-700">3) TAUX D'ECHEC %</h4>
                  <div className="flex items-center gap-2">
                    {isNiveauValidPrimaire('tauxEchec') ? (
                      <span className="text-green-600 text-sm font-medium">✓ Validé</span>
                    ) : (
                      <span className="text-orange-600 text-sm font-medium">⚠ En cours</span>
                    )}
                  </div>
                </div>
                <div className={`text-sm mb-4 p-2 rounded ${getNiveauStatusPrimaire('tauxEchec').color} bg-opacity-10`}>
                  {getNiveauStatusPrimaire('tauxEchec').message}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Inscrits</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={calculDataPrimaire.tauxEchec.inscrits || ''}
                      onChange={(e) => updateCalculDataPrimaire('tauxEchec', 'inscrits', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Échecs
                      {getMaxValuePrimaire('tauxEchec', 'echecs') !== undefined && (
                        <span className="text-xs text-gray-500 ml-2">
                          (Max: {getMaxValuePrimaire('tauxEchec', 'echecs')})
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      max={getMaxValuePrimaire('tauxEchec', 'echecs')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      value={calculDataPrimaire.tauxEchec.echecs || ''}
                      onChange={(e) => updateCalculDataPrimaire('tauxEchec', 'echecs', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Garçons</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={calculDataPrimaire.tauxEchec.garcons || ''}
                      onChange={(e) => updateCalculDataPrimaire('tauxEchec', 'garcons', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Filles</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      value={calculDataPrimaire.tauxEchec.filles || ''}
                      onChange={(e) => updateCalculDataPrimaire('tauxEchec', 'filles', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setShowCalculModalPrimaire(false)}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={calculerTauxPrimaires}
                className="px-6 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Calculer les pourcentages
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de calcul des taux secondaires (III.8) */}
      {showCalculModalSecondaire && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Calculer les indicateurs d'efficacité externe - Niveau Secondaire</h3>
              <button
                onClick={() => setShowCalculModalSecondaire(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-4">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-orange-800 mb-3">Formulaire intelligent avec blocage</h4>
                

                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• <strong>Blocage automatique</strong> : Impossible de saisir un nombre qui dépasserait les inscrits</li>
                  <li>• <strong>Limite visible</strong> : Chaque champ affiche sa valeur maximale autorisée</li>
                  <li>• <strong>Validation en temps réel</strong> : Les indicateurs changent selon la cohérence des données</li>
                </ul>
              </div>

              {/* 1) TAUX D'ABANDON */}
              <div className="mb-6 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-lg mb-4 text-orange-700">1) TAUX D'ABANDON %</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Inscrits</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={calculDataSecondaire.tauxAbandon.inscrits || ''}
                      onChange={(e) => updateCalculDataSecondaire('tauxAbandon', 'inscrits', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Abandons</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      value={calculDataSecondaire.tauxAbandon.abandons || ''}
                      onChange={(e) => updateCalculDataSecondaire('tauxAbandon', 'abandons', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Garçons</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={calculDataSecondaire.tauxAbandon.garcons || ''}
                      onChange={(e) => updateCalculDataSecondaire('tauxAbandon', 'garcons', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Filles</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      value={calculDataSecondaire.tauxAbandon.filles || ''}
                      onChange={(e) => updateCalculDataSecondaire('tauxAbandon', 'filles', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* 2) TAUX DE REUSSITE */}
              <div className="mb-6 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-lg mb-4 text-orange-700">2) TAUX DE REUSSITE %</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Inscrits</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={calculDataSecondaire.tauxReussite.inscrits || ''}
                      onChange={(e) => updateCalculDataSecondaire('tauxReussite', 'inscrits', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Réussites</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={calculDataSecondaire.tauxReussite.reussites || ''}
                      onChange={(e) => updateCalculDataSecondaire('tauxReussite', 'reussites', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Garçons</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={calculDataSecondaire.tauxReussite.garcons || ''}
                      onChange={(e) => updateCalculDataSecondaire('tauxReussite', 'garcons', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Filles</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      value={calculDataSecondaire.tauxReussite.filles || ''}
                      onChange={(e) => updateCalculDataSecondaire('tauxReussite', 'filles', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* 3) TAUX D'ECHEC */}
              <div className="mb-6 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-lg mb-4 text-orange-700">3) TAUX D'ECHEC %</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Inscrits</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={calculDataSecondaire.tauxEchec.inscrits || ''}
                      onChange={(e) => updateCalculDataSecondaire('tauxEchec', 'inscrits', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Échecs</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      value={calculDataSecondaire.tauxEchec.echecs || ''}
                      onChange={(e) => updateCalculDataSecondaire('tauxEchec', 'echecs', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Garçons</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={calculDataSecondaire.tauxEchec.garcons || ''}
                      onChange={(e) => updateCalculDataSecondaire('tauxEchec', 'garcons', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Filles</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      value={calculDataSecondaire.tauxEchec.filles || ''}
                      onChange={(e) => updateCalculDataSecondaire('tauxEchec', 'filles', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setShowCalculModalSecondaire(false)}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={calculerTauxSecondaires}
                className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Calculer les pourcentages
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de calcul des taux OCDE */}
      {showCalculModalOCDE && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Calculer les taux de diplômes de finalistes (OCDE)</h3>
              <button
                onClick={() => setShowCalculModalOCDE(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-4">
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-indigo-800 mb-3">Formulaire intelligent avec blocage</h4>
                <ul className="text-sm text-indigo-700 space-y-1">
                  <li>• <strong>Blocage automatique</strong> : Impossible de saisir un nombre qui dépasserait les finalistes</li>
                  <li>• <strong>Limite visible</strong> : Chaque champ affiche sa valeur maximale autorisée</li>
                  <li>• <strong>Validation en temps réel</strong> : Les indicateurs changent selon la cohérence des données</li>
                </ul>
              </div>

              {/* HUMANITES SCIENTIFIQUES */}
              <div className={`mb-6 border rounded-lg p-4 ${isFiliereValidOCDE('humanitesScientifiques') ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-lg text-indigo-700">HUMANITES SCIENTIFIQUES</h4>
                  <div className="flex items-center gap-2">
                    {isFiliereValidOCDE('humanitesScientifiques') ? (
                      <span className="text-green-600 text-sm font-medium">✓ Validé</span>
                    ) : (
                      <span className="text-orange-600 text-sm font-medium">⚠ En cours</span>
                    )}
                  </div>
                </div>
                <div className={`text-sm mb-4 p-2 rounded ${getFiliereStatusOCDE('humanitesScientifiques').color} bg-opacity-10`}>
                  {getFiliereStatusOCDE('humanitesScientifiques').message}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Finalistes</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={calculDataOCDE.humanitesScientifiques.finalistes || ''}
                      onChange={(e) => updateCalculDataOCDE('humanitesScientifiques', 'finalistes', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Diplômés
                      {getMaxValueOCDE('humanitesScientifiques', 'diplomes') !== undefined && (
                        <span className="text-xs text-gray-500 ml-2">
                          (Max: {getMaxValueOCDE('humanitesScientifiques', 'diplomes')})
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      max={getMaxValueOCDE('humanitesScientifiques', 'diplomes')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={calculDataOCDE.humanitesScientifiques.diplomes || ''}
                      onChange={(e) => updateCalculDataOCDE('humanitesScientifiques', 'diplomes', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Garçons
                      {calculDataOCDE.humanitesScientifiques.diplomes > 0 && (
                        <span className="text-xs text-gray-500 ml-2">
                          (Max: {calculDataOCDE.humanitesScientifiques.diplomes - (calculDataOCDE.humanitesScientifiques.filles || 0)})
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      max={calculDataOCDE.humanitesScientifiques.diplomes - (calculDataOCDE.humanitesScientifiques.filles || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={calculDataOCDE.humanitesScientifiques.garcons || ''}
                      onChange={(e) => updateCalculDataOCDE('humanitesScientifiques', 'garcons', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filles
                      {calculDataOCDE.humanitesScientifiques.diplomes > 0 && (
                        <span className="text-xs text-gray-500 ml-2">
                          (Max: {calculDataOCDE.humanitesScientifiques.diplomes - (calculDataOCDE.humanitesScientifiques.garcons || 0)})
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      max={calculDataOCDE.humanitesScientifiques.diplomes - (calculDataOCDE.humanitesScientifiques.garcons || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      value={calculDataOCDE.humanitesScientifiques.filles || ''}
                      onChange={(e) => updateCalculDataOCDE('humanitesScientifiques', 'filles', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* HUMANITES TECHNIQUES */}
              <div className={`mb-6 border rounded-lg p-4 ${isFiliereValidOCDE('humanitesTechniques') ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-lg text-indigo-700">HUMANITES TECHNIQUES</h4>
                  <div className="flex items-center gap-2">
                    {isFiliereValidOCDE('humanitesTechniques') ? (
                      <span className="text-green-600 text-sm font-medium">✓ Validé</span>
                    ) : (
                      <span className="text-orange-600 text-sm font-medium">⚠ En cours</span>
                    )}
                  </div>
                </div>
                <div className={`text-sm mb-4 p-2 rounded ${getFiliereStatusOCDE('humanitesTechniques').color} bg-opacity-10`}>
                  {getFiliereStatusOCDE('humanitesTechniques').message}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Finalistes</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={calculDataOCDE.humanitesTechniques.finalistes || ''}
                      onChange={(e) => updateCalculDataOCDE('humanitesTechniques', 'finalistes', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Diplômés
                      {getMaxValueOCDE('humanitesTechniques', 'diplomes') !== undefined && (
                        <span className="text-xs text-gray-500 ml-2">
                          (Max: {getMaxValueOCDE('humanitesTechniques', 'diplomes')})
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      max={getMaxValueOCDE('humanitesTechniques', 'diplomes')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={calculDataOCDE.humanitesTechniques.diplomes || ''}
                      onChange={(e) => updateCalculDataOCDE('humanitesTechniques', 'diplomes', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Garçons
                      {calculDataOCDE.humanitesTechniques.diplomes > 0 && (
                        <span className="text-xs text-gray-500 ml-2">
                          (Max: {calculDataOCDE.humanitesTechniques.diplomes - (calculDataOCDE.humanitesTechniques.filles || 0)})
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      max={calculDataOCDE.humanitesTechniques.diplomes - (calculDataOCDE.humanitesTechniques.filles || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={calculDataOCDE.humanitesTechniques.garcons || ''}
                      onChange={(e) => updateCalculDataOCDE('humanitesTechniques', 'garcons', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filles
                      {calculDataOCDE.humanitesTechniques.diplomes > 0 && (
                        <span className="text-xs text-gray-500 ml-2">
                          (Max: {calculDataOCDE.humanitesTechniques.diplomes - (calculDataOCDE.humanitesTechniques.garcons || 0)})
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      max={calculDataOCDE.humanitesTechniques.diplomes - (calculDataOCDE.humanitesTechniques.garcons || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      value={calculDataOCDE.humanitesTechniques.filles || ''}
                      onChange={(e) => updateCalculDataOCDE('humanitesTechniques', 'filles', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setShowCalculModalOCDE(false)}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={calculerTauxOCDE}
                className="px-6 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Calculer les pourcentages
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default EvaluationQualitativeComplete; 