import { BaseService } from '../baseservice';

export interface EffectifAnnuelPayload {
  identificationProved: string | number;
  annee: string | number;
  effectifs: {
    niveauPrescolaire: {
      espaceCommunautaireEveil: {
        effectifGarconsFilles: number;
        effectifFilles: number;
      };
      maternel: {
        effectifGarconsFilles: number;
        effectifFilles: number;
      };
      prePrimaire: {
        effectifGarconsFilles: number;
        effectifFilles: number;
      };
      special: {
        effectifGarconsFilles: number;
        effectifFilles: number;
      };
    };
    niveauPrimaire: {
      enseignementSpecial: {
        effectifGarconsFilles: number;
        effectifFilles: number;
      };
      enseignementPrimaire: {
        effectifGarconsFilles: number;
        effectifFilles: number;
      };
    };
    niveauSecondaire: {
      enseignementSpecial: {
        effectifGarcons: number;
        effectifFilles: number;
      };
      enseignementSecondaire: {
        septiemeCTEB: {
          effectifGarcons: number;
          effectifFilles: number;
        };
        huitiemeCTEB: {
          effectifGarcons: number;
          effectifFilles: number;
        };
        premiereHumanite: {
          effectifGarcons: number;
          effectifFilles: number;
        };
        quatriemeHumanite: {
          effectifGarcons: number;
          effectifFilles: number;
        };
      };
    };
  };
}

export const EffectifAnnuelService = {
  // Créer un nouvel effectif annuel
  create: async (payload: EffectifAnnuelPayload) => {
    try {
      console.log('📊 EffectifAnnuelService.create - Payload:', payload);
      const response = await BaseService.post('effectif-annuel', payload);
      console.log('✅ EffectifAnnuelService.create - Succès:', response);
      return response;
    } catch (error: any) {
      console.error('❌ EffectifAnnuelService.create - Erreur:', error);
      throw error;
    }
  },

  // Récupérer les effectifs annuels
  getAll: async () => {
    try {
      const response = await BaseService.get('effectif-annuel');
      return response;
    } catch (error) {
      console.error('❌ EffectifAnnuelService.getAll - Erreur:', error);
      throw error;
    }
  },

  // Récupérer un effectif annuel par ID
  getById: async (id: string) => {
    try {
      const response = await BaseService.get(`effectif-annuel/${id}`);
      return response;
    } catch (error) {
      console.error('❌ EffectifAnnuelService.getById - Erreur:', error);
      throw error;
    }
  },

  // Récupérer les effectifs par identificationProved et année
  getByProvedAndAnnee: async (identificationProved: string | number, annee: string | number) => {
    try {
      console.log('🔍 EffectifAnnuelService.getByProvedAndAnnee - Params:', { identificationProved, annee });
      const response = await BaseService.get(`effectif-annuel?identificationProved=${identificationProved}&annee=${annee}`);
      console.log('✅ EffectifAnnuelService.getByProvedAndAnnee - Succès:', response);
      return response;
    } catch (error) {
      console.error('❌ EffectifAnnuelService.getByProvedAndAnnee - Erreur:', error);
      throw error;
    }
  },

  // Mettre à jour un effectif annuel
  update: async (id: string, payload: EffectifAnnuelPayload) => {
    try {
      const response = await BaseService.put(`effectif-annuel/${id}`, payload);
      return response;
    } catch (error) {
      console.error('❌ EffectifAnnuelService.update - Erreur:', error);
      throw error;
    }
  },

  // Supprimer un effectif annuel
  delete: async (id: string) => {
    try {
      const response = await BaseService.delete(`effectif-annuel/${id}`);
      return response;
    } catch (error) {
      console.error('❌ EffectifAnnuelService.delete - Erreur:', error);
      throw error;
    }
  }
};
