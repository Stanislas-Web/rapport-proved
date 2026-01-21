import { RapportActivite } from '../models/RapportActivite';

export interface DraftMetadata {
  id: string;
  userId?: string;
  createdAt: string;
  lastSavedAt: string;
  lastModifiedAt: string;
  completionPercentage: number;
  currentSection: string;
  totalSections: number;
  completedSections: string[];
  status: 'draft' | 'submitted' | 'validated';
  version: number;
}

export interface Draft {
  formData: RapportActivite;
  metadata: DraftMetadata;
}

/**
 * Calculer le pourcentage de complétion du formulaire
 * Basé sur les sections principales plutôt que tous les champs individuels
 */
export const calculateCompletionPercentage = (formData: RapportActivite): number => {
  let completedSections = 0;
  let totalSections = 0;

  // Helper pour vérifier si un objet a des valeurs non vides
  const hasAnyValue = (obj: any, depth = 0): boolean => {
    if (!obj || depth > 5) return false;
    
    return Object.values(obj).some((value) => {
      if (value === null || value === undefined || value === '') return false;
      if (typeof value === 'number') return value !== 0;
      if (typeof value === 'string') return value.trim() !== '';
      if (typeof value === 'boolean') return true;
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'object') return hasAnyValue(value, depth + 1);
      return false;
    });
  };

  // Section I: Identification
  totalSections++;
  if (formData.identificationProved || formData.annee) {
    completedSections++;
  }

  // Section II: Paramètres Clés - Nombre d'écoles et classes
  totalSections++;
  if (hasAnyValue(formData.parametresCles?.nombreEcolesClasses)) {
    completedSections++;
  }

  // Section II: Paramètres Clés - Effectif scolaire
  totalSections++;
  if (hasAnyValue(formData.parametresCles?.effectifScolaire)) {
    completedSections++;
  }

  // Section III: Personnel
  totalSections++;
  if (hasAnyValue(formData.personnel)) {
    completedSections++;
  }

  // Section IV: Réalisations - Inspections
  totalSections++;
  if (hasAnyValue(formData.realisations?.inspectionsPedagogiques)) {
    completedSections++;
  }

  // Section IV: Réalisations - Formations
  totalSections++;
  if (hasAnyValue(formData.realisations?.formations)) {
    completedSections++;
  }

  // Section IV: Réalisations - Évaluations
  totalSections++;
  if (hasAnyValue(formData.realisations?.evaluations)) {
    completedSections++;
  }

  // Section IV: Introduction
  totalSections++;
  if (formData.introduction && formData.introduction.trim() !== '') {
    completedSections++;
  }

  // Section V: Conclusion
  totalSections++;
  if (formData.conclusion && formData.conclusion.trim() !== '') {
    completedSections++;
  }

  // Section IV: Évaluation qualitative
  totalSections++;
  if (hasAnyValue(formData.evaluationQualitativeComplete)) {
    completedSections++;
  }

  if (totalSections === 0) return 0;
  const percentage = Math.round((completedSections / totalSections) * 100);
  
  console.log('📊 Calcul complétion:', {
    completedSections,
    totalSections,
    percentage,
    sections: {
      identification: !!(formData.identificationProved || formData.annee),
      ecoles: hasAnyValue(formData.parametresCles?.nombreEcolesClasses),
      effectifs: hasAnyValue(formData.parametresCles?.effectifScolaire),
      personnel: hasAnyValue(formData.personnel),
      inspections: hasAnyValue(formData.realisations?.inspectionsPedagogiques),
      formations: hasAnyValue(formData.realisations?.formations),
      evaluations: hasAnyValue(formData.realisations?.evaluations),
      introduction: !!(formData.introduction && formData.introduction.trim() !== ''),
      conclusion: !!(formData.conclusion && formData.conclusion.trim() !== ''),
      evalQualitative: hasAnyValue(formData.evaluationQualitativeComplete)
    }
  });
  
  return percentage;
};


/**
 * Déterminer les sections complétées
 */
export const getCompletedSections = (formData: RapportActivite): string[] => {
  const sections: string[] = [];

  // Vérifier chaque section
  if (formData.identificationProved && formData.annee) {
    sections.push('I - Informations de base');
  }

  if (formData.parametresCles) {
    sections.push('II - Paramètres Clés');
  }

  if (formData.personnel) {
    sections.push('III - Personnel');
  }

  if (formData.realisations) {
    sections.push('IV - Réalisations');
  }

  if (formData.conclusion) {
    sections.push('V - Conclusion');
  }

  return sections;
};

/**
 * Sauvegarder un brouillon
 */
export const saveDraft = (
  formData: RapportActivite,
  currentSection: string = 'I',
  existingMetadata?: DraftMetadata
): Draft => {
  const now = new Date().toISOString();
  
  const metadata: DraftMetadata = {
    id: existingMetadata?.id || `draft_${Date.now()}`,
    userId: existingMetadata?.userId,
    createdAt: existingMetadata?.createdAt || now,
    lastSavedAt: now,
    lastModifiedAt: now,
    completionPercentage: calculateCompletionPercentage(formData),
    currentSection,
    totalSections: 12, // À ajuster selon votre formulaire
    completedSections: getCompletedSections(formData),
    status: 'draft',
    version: (existingMetadata?.version || 0) + 1
  };

  const draft: Draft = {
    formData,
    metadata
  };

  // Sauvegarder dans localStorage
  localStorage.setItem('rapport_draft', JSON.stringify(draft));
  localStorage.setItem('rapport_draft_timestamp', now);

  return draft;
};

/**
 * Charger un brouillon
 */
export const loadDraft = (): Draft | null => {
  try {
    const draftStr = localStorage.getItem('rapport_draft');
    if (!draftStr) return null;

    const draft: Draft = JSON.parse(draftStr);
    return draft;
  } catch (error) {
    console.error('Erreur lors du chargement du brouillon:', error);
    return null;
  }
};

/**
 * Supprimer un brouillon
 */
export const deleteDraft = (): void => {
  console.log('🗑️ Suppression du brouillon...');
  
  // Supprimer le nouveau format
  localStorage.removeItem('rapport_draft');
  localStorage.removeItem('rapport_draft_timestamp');
  
  // Supprimer l'ancien format (rétrocompatibilité)
  localStorage.removeItem('rapportActiviteDraft');
  
  console.log('✅ Brouillon supprimé. Vérification:', {
    rapport_draft: localStorage.getItem('rapport_draft'),
    rapport_draft_timestamp: localStorage.getItem('rapport_draft_timestamp'),
    rapportActiviteDraft: localStorage.getItem('rapportActiviteDraft')
  });
};

/**
 * Vérifier si un brouillon existe
 */
export const hasDraft = (): boolean => {
  return localStorage.getItem('rapport_draft') !== null;
};

/**
 * Obtenir l'âge du brouillon en jours
 */
export const getDraftAge = (): number | null => {
  const timestamp = localStorage.getItem('rapport_draft_timestamp');
  if (!timestamp) return null;

  const savedDate = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - savedDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return diffDays;
};

/**
 * Formater le temps écoulé depuis la dernière sauvegarde
 */
export const formatTimeSince = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "À l'instant";
  if (diffMins === 1) return "Il y a 1 minute";
  if (diffMins < 60) return `Il y a ${diffMins} minutes`;
  if (diffHours === 1) return "Il y a 1 heure";
  if (diffHours < 24) return `Il y a ${diffHours} heures`;
  if (diffDays === 1) return "Il y a 1 jour";
  return `Il y a ${diffDays} jours`;
};

/**
 * Compresser les données pour économiser de l'espace
 */
export const compressData = (data: any): string => {
  return JSON.stringify(data);
  // Si vous voulez une vraie compression, installez lz-string:
  // import LZString from 'lz-string';
  // return LZString.compress(JSON.stringify(data));
};

/**
 * Décompresser les données
 */
export const decompressData = (compressed: string): any => {
  return JSON.parse(compressed);
  // Si vous utilisez lz-string:
  // import LZString from 'lz-string';
  // const decompressed = LZString.decompress(compressed);
  // return decompressed ? JSON.parse(decompressed) : null;
};
