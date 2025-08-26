import { BaseService } from '../baseservice';
import { FicheAutoEvaluation, CreateFicheAutoEvaluationRequest, UpdateFicheAutoEvaluationRequest } from '../../models/FicheAutoEvaluation';

class FicheAutoEvaluationService {
  private endpoint = '/fiche-auto-evaluation';

  // Récupérer toutes les fiches d'auto-évaluation
  async getAllFiches(): Promise<FicheAutoEvaluation[]> {
    try {
      // Vérifier que le token est présent
      const token = localStorage.getItem('token');
      console.log('🔒 FicheAutoEvaluationService.getAllFiches - Token présent:', !!token);
      
      const response = await BaseService.get(`${this.endpoint}?limit=1000&page=1`);
      console.log('🔍 FicheAutoEvaluationService.getAllFiches - Réponse complète:', response);
      
      if (response && response.success && response.data && response.data.docs) {
        console.log('🔍 FicheAutoEvaluationService.getAllFiches - Nombre de fiches:', response.data.totalDocs);
        console.log('🔍 FicheAutoEvaluationService.getAllFiches - Message:', response.message);
        return response.data.docs;
      }
      
      console.log('🔍 FicheAutoEvaluationService.getAllFiches - Structure de réponse non reconnue');
      return [];
    } catch (error) {
      console.error('Erreur lors de la récupération des fiches d\'auto-évaluation:', error);
      console.error('Erreur complète:', JSON.stringify(error, null, 2));
      throw error;
    }
  }

  // Récupérer une fiche d'auto-évaluation par ID
  async getFicheById(id: string): Promise<FicheAutoEvaluation> {
    try {
      const response = await BaseService.get(`${this.endpoint}/${id}`);
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération de la fiche d\'auto-évaluation:', error);
      throw error;
    }
  }

  // Créer une nouvelle fiche d'auto-évaluation
  async createFiche(ficheData: CreateFicheAutoEvaluationRequest): Promise<FicheAutoEvaluation> {
    try {
      // Vérifier que le token est présent
      const token = localStorage.getItem('token');
      console.log('🔒 FicheAutoEvaluationService.createFiche - Token présent:', !!token);
      
      const response = await BaseService.post(this.endpoint, ficheData);
      return response;
    } catch (error: any) {
      console.error('Erreur lors de la création de la fiche d\'auto-évaluation:', error);
      
      // Gestion spécifique des timeouts
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        throw new Error('La requête a pris trop de temps. Veuillez réessayer.');
      }
      
      // Gestion des erreurs de réseau
      if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
        throw new Error('Erreur de connexion réseau. Vérifiez votre connexion internet.');
      }
      
      throw error;
    }
  }

  // Mettre à jour une fiche d'auto-évaluation
  async updateFiche(id: string, ficheData: UpdateFicheAutoEvaluationRequest): Promise<FicheAutoEvaluation> {
    try {
      // Vérifier que le token est présent
      const token = localStorage.getItem('token');
      console.log('🔒 FicheAutoEvaluationService.updateFiche - Token présent:', !!token);
      
      const response = await BaseService.put(`${this.endpoint}/${id}`, ficheData);
      return response;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la fiche d\'auto-évaluation:', error);
      throw error;
    }
  }

  // Supprimer une fiche d'auto-évaluation
  async deleteFiche(id: string): Promise<void> {
    try {
      await BaseService.delete(`${this.endpoint}/${id}`);
    } catch (error) {
      console.error('Erreur lors de la suppression de la fiche d\'auto-évaluation:', error);
      throw error;
    }
  }

  // Soumettre une fiche d'auto-évaluation (changer le statut en 'soumis')
  async submitFiche(id: string): Promise<FicheAutoEvaluation> {
    try {
      const response = await BaseService.patch(`${this.endpoint}/${id}/statut`, { statut: 'soumis' });
      return response;
    } catch (error) {
      console.error('Erreur lors de la soumission de la fiche d\'auto-évaluation:', error);
      throw error;
    }
  }

  // Approuver une fiche d'auto-évaluation
  async approveFiche(id: string): Promise<FicheAutoEvaluation> {
    try {
      const response = await BaseService.patch(`${this.endpoint}/${id}/statut`, { statut: 'approuve' });
      return response;
    } catch (error) {
      console.error('Erreur lors de l\'approbation de la fiche d\'auto-évaluation:', error);
      throw error;
    }
  }

  // Rejeter une fiche d'auto-évaluation
  async rejectFiche(id: string, reason?: string): Promise<FicheAutoEvaluation> {
    try {
      const response = await BaseService.patch(`${this.endpoint}/${id}/statut`, { 
        statut: 'rejete',
        raison: reason 
      });
      return response;
    } catch (error) {
      console.error('Erreur lors du rejet de la fiche d\'auto-évaluation:', error);
      throw error;
    }
  }

  // Récupérer les fiches par statut
  async getFichesByStatus(status: string): Promise<FicheAutoEvaluation[]> {
    try {
      const response = await BaseService.get(`${this.endpoint}/statut/${status}`);
      if (response && response.success && response.data && response.data.docs) {
        return response.data.docs;
      }
      return [];
    } catch (error) {
      console.error('Erreur lors de la récupération des fiches par statut:', error);
      throw error;
    }
  }

  // Rechercher des fiches
  async searchFiches(query: string): Promise<FicheAutoEvaluation[]> {
    try {
      const response = await BaseService.get(`${this.endpoint}/search?q=${encodeURIComponent(query)}`);
      if (response && response.success && response.data && response.data.docs) {
        return response.data.docs;
      }
      return [];
    } catch (error) {
      console.error('Erreur lors de la recherche des fiches:', error);
      throw error;
    }
  }

  // Exporter les fiches en Excel
  async exportToExcel(): Promise<Blob> {
    try {
      const response = await BaseService.get(`${this.endpoint}/export/excel`, {
        responseType: 'blob'
      });
      return response;
    } catch (error) {
      console.error('Erreur lors de l\'export Excel:', error);
      throw error;
    }
  }

  // Générer des statistiques
  async getStatistics(): Promise<any> {
    try {
      const response = await BaseService.get(`${this.endpoint}/statistics`);
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  }
}

export const ficheAutoEvaluationService = new FicheAutoEvaluationService();
