/**
 * Utilitaire pour extraire les messages d'erreur du backend
 * et les formater de manière cohérente pour l'affichage
 */

/**
 * Extrait un message d'erreur lisible depuis un objet d'erreur
 * @param error - L'objet d'erreur retourné par le backend
 * @param defaultMessage - Message par défaut si aucun message n'est trouvé
 * @returns Le message d'erreur formaté
 */
export const extractErrorMessage = (error: any, defaultMessage: string = 'Une erreur est survenue'): string => {
  // Cas 1: Erreur avec response.data.message (structure API standard)
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  
  // Cas 2: Erreur avec response.data.error
  if (error?.response?.data?.error) {
    return error.response.data.error;
  }
  
  // Cas 3: Erreur avec un tableau d'erreurs
  if (error?.response?.data?.errors && Array.isArray(error.response.data.errors)) {
    const errors = error.response.data.errors;
    if (errors.length > 0) {
      // Joindre tous les messages d'erreur
      return errors
        .map((err: any) => {
          if (typeof err === 'string') return err;
          if (err.message) return err.message;
          if (err.msg) return err.msg;
          return JSON.stringify(err);
        })
        .join(', ');
    }
  }
  
  // Cas 4: Erreur avec errors direct (sans response)
  if (error?.errors && Array.isArray(error.errors) && error.errors.length > 0) {
    return error.errors
      .map((err: any) => {
        if (typeof err === 'string') return err;
        if (err.message) return err.message;
        if (err.msg) return err.msg;
        return JSON.stringify(err);
      })
      .join(', ');
  }
  
  // Cas 5: Message d'erreur direct
  if (error?.message) {
    return error.message;
  }
  
  // Cas 6: L'erreur est une chaîne de caractères
  if (typeof error === 'string') {
    return error;
  }
  
  // Cas 7: Erreur de validation
  if (error?.response?.data?.validation) {
    const validationErrors = error.response.data.validation;
    if (typeof validationErrors === 'object') {
      return Object.values(validationErrors).flat().join(', ');
    }
  }
  
  // Cas 8: Statut d'erreur HTTP
  if (error?.response?.status) {
    switch (error.response.status) {
      case 400:
        return 'Données invalides';
      case 401:
        return 'Non autorisé - Veuillez vous reconnecter';
      case 403:
        return 'Accès interdit';
      case 404:
        return 'Ressource non trouvée';
      case 409:
        return 'Conflit - La ressource existe déjà';
      case 500:
        return 'Erreur serveur';
      case 503:
        return 'Service temporairement indisponible';
      default:
        return `Erreur ${error.response.status}`;
    }
  }
  
  // Par défaut
  return defaultMessage;
};

/**
 * Extrait un message d'erreur court pour les notifications toast
 * (limite à 100 caractères)
 */
export const extractShortErrorMessage = (error: any, defaultMessage: string = 'Une erreur est survenue'): string => {
  const fullMessage = extractErrorMessage(error, defaultMessage);
  if (fullMessage.length > 100) {
    return fullMessage.substring(0, 97) + '...';
  }
  return fullMessage;
};

/**
 * Vérifie si une erreur est une erreur de validation
 */
export const isValidationError = (error: any): boolean => {
  return !!(
    error?.response?.data?.errors ||
    error?.errors ||
    error?.response?.data?.validation ||
    error?.response?.status === 400
  );
};

/**
 * Vérifie si une erreur est une erreur d'authentification
 */
export const isAuthError = (error: any): boolean => {
  return error?.response?.status === 401 || error?.response?.status === 403;
};

/**
 * Vérifie si une erreur est une erreur serveur
 */
export const isServerError = (error: any): boolean => {
  return error?.response?.status >= 500;
};
