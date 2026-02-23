/**
 * Utilitaires pour décoder et manipuler les tokens JWT de manière robuste
 * Cette fonction gère tous les cas d'erreur possibles
 */

/**
 * Décode un token JWT de manière sécurisée
 * Gère les tokens avec espaces, caractères parasites, et différents encodages
 * @param token - Le token JWT complet
 * @returns Le payload décodé ou null en cas d'erreur
 */
export const decodeJWT = (token: string | null): any | null => {
  try {
    if (!token) {
      return null;
    }

    // Nettoyer le token (espaces, retours à la ligne, etc.)
    const cleanToken = token.trim().replace(/\s/g, '');

    // Vérifier que c'est un JWT valide (3 parties séparées par des points)
    const parts = cleanToken.split('.');
    if (parts.length !== 3) {
      console.error('❌ Token JWT invalide: doit avoir 3 parties séparées par des points');
      return null;
    }

    // Extraire le payload (partie du milieu)
    let base64Payload = parts[1];

    // Convertir Base64URL vers Base64 standard
    // Les JWT utilisent Base64URL qui remplace + par - et / par _
    base64Payload = base64Payload.replace(/-/g, '+').replace(/_/g, '/');

    // Ajouter le padding si nécessaire
    // Base64 nécessite que la longueur soit un multiple de 4
    while (base64Payload.length % 4) {
      base64Payload += '=';
    }

    // Décoder la chaîne Base64
    const jsonPayload = atob(base64Payload);

    // Parser le JSON
    const payload = JSON.parse(jsonPayload);

    return payload;
  } catch (error) {
    console.error('❌ Erreur lors du décodage du JWT:', error);
    return null;
  }
};

/**
 * Récupère l'ID PROVED depuis le token JWT stocké dans localStorage
 * @returns L'ID PROVED ou null si non trouvé
 */
export const getProvedIdFromToken = (): string | null => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('⚠️ Aucun token trouvé dans localStorage');
      return null;
    }

    const payload = decodeJWT(token);
    if (!payload) {
      console.error('❌ Impossible de décoder le token');
      return null;
    }

    // Essayer différents champs possibles pour l'ID PROVED
    const provedId = payload._id 
      || payload.identificationProved 
      || payload.provedId 
      || payload.id 
      || null;

    if (!provedId) {
      console.error('❌ Aucun ID PROVED trouvé dans le token. Payload:', payload);
    }

    return provedId;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération de l\'ID PROVED:', error);
    return null;
  }
};

/**
 * Vérifie si le token est expiré
 * @returns true si le token est expiré, false sinon
 */
export const isTokenExpired = (): boolean => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return true;

    const payload = decodeJWT(token);
    if (!payload || !payload.exp) return true;

    // exp est en secondes, Date.now() est en millisecondes
    const expirationTime = payload.exp * 1000;
    const currentTime = Date.now();

    return currentTime > expirationTime;
  } catch (error) {
    console.error('❌ Erreur lors de la vérification d\'expiration du token:', error);
    return true;
  }
};

/**
 * Récupère toutes les informations utilisateur depuis le token
 * @returns Les informations utilisateur ou null
 */
export const getUserInfoFromToken = (): any | null => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;

    return decodeJWT(token);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des infos utilisateur:', error);
    return null;
  }
};
