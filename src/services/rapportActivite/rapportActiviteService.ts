import { BaseService } from '../baseservice';
import { RapportActivite, CreateRapportActiviteRequest, UpdateRapportActiviteRequest } from '../../models/RapportActivite';

class RapportActiviteService {
  private endpoint = '/rapport-activite';

  // Récupérer tous les rapports d'activité
  async getAllRapports(): Promise<RapportActivite[]> {
    try {
      const response = await BaseService.get(this.endpoint);
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des rapports d\'activité:', error);
      throw error;
    }
  }

  // Récupérer un rapport d'activité par ID
  async getRapportById(id: string): Promise<RapportActivite> {
    try {
      const response = await BaseService.get(`${this.endpoint}/${id}`);
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération du rapport d\'activité:', error);
      throw error;
    }
  }

  // Créer un nouveau rapport d'activité
  async createRapport(rapportData: CreateRapportActiviteRequest): Promise<RapportActivite> {
    try {
      const response = await BaseService.post(this.endpoint, rapportData);
      return response;
    } catch (error) {
      console.error('Erreur lors de la création du rapport d\'activité:', error);
      throw error;
    }
  }

  // Mettre à jour un rapport d'activité
  async updateRapport(id: string, rapportData: UpdateRapportActiviteRequest): Promise<RapportActivite> {
    try {
      const response = await BaseService.put(`${this.endpoint}/${id}`, rapportData);
      return response;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du rapport d\'activité:', error);
      throw error;
    }
  }

  // Supprimer un rapport d'activité
  async deleteRapport(id: string): Promise<void> {
    try {
      await BaseService.delete(`${this.endpoint}/${id}`);
    } catch (error) {
      console.error('Erreur lors de la suppression du rapport d\'activité:', error);
      throw error;
    }
  }

  // Soumettre un rapport d'activité (changer le statut en 'soumis')
  async submitRapport(id: string): Promise<RapportActivite> {
    try {
      const response = await BaseService.put(`${this.endpoint}/${id}/submit`, {});
      return response;
    } catch (error) {
      console.error('Erreur lors de la soumission du rapport d\'activité:', error);
      throw error;
    }
  }

  // Approuver un rapport d'activité
  async approveRapport(id: string): Promise<RapportActivite> {
    try {
      const response = await BaseService.put(`${this.endpoint}/${id}/approve`, {});
      return response;
    } catch (error) {
      console.error('Erreur lors de l\'approbation du rapport d\'activité:', error);
      throw error;
    }
  }

  // Rejeter un rapport d'activité
  async rejectRapport(id: string, reason?: string): Promise<RapportActivite> {
    try {
      const response = await BaseService.put(`${this.endpoint}/${id}/reject`, { reason });
      return response;
    } catch (error) {
      console.error('Erreur lors du rejet du rapport d\'activité:', error);
      throw error;
    }
  }

  // Récupérer les rapports par année
  async getRapportsByYear(year: number): Promise<RapportActivite[]> {
    try {
      const response = await BaseService.get(`${this.endpoint}/year/${year}`);
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des rapports par année:', error);
      throw error;
    }
  }

  // Récupérer les rapports par statut
  async getRapportsByStatus(status: 'brouillon' | 'soumis' | 'approuve' | 'rejete'): Promise<RapportActivite[]> {
    try {
      const response = await BaseService.get(`${this.endpoint}/status/${status}`);
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des rapports par statut:', error);
      throw error;
    }
  }

  // Récupérer les rapports par PROVED
  async getRapportsByProved(provedId: string): Promise<RapportActivite[]> {
    try {
      const response = await BaseService.get(`${this.endpoint}/proved/${provedId}`);
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des rapports par PROVED:', error);
      throw error;
    }
  }

  // Uploader un fichier joint
  async uploadFile(id: string, file: File): Promise<{ fichierJoint: string }> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await BaseService.post(`${this.endpoint}/${id}/upload`, formData);
      return response;
    } catch (error) {
      console.error('Erreur lors de l\'upload du fichier:', error);
      throw error;
    }
  }

  // Télécharger un fichier joint
  async downloadFile(id: string): Promise<Blob> {
    try {
      const response = await BaseService.get(`${this.endpoint}/${id}/download`);
      return response;
    } catch (error) {
      console.error('Erreur lors du téléchargement du fichier:', error);
      throw error;
    }
  }

  // Générer un rapport PDF
  async generatePDF(id: string): Promise<Blob> {
    try {
      const response = await BaseService.get(`${this.endpoint}/${id}/pdf`);
      return response;
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      throw error;
    }
  }

  // Exporter les données en Excel
  async exportToExcel(filters?: {
    year?: number;
    status?: string;
    provedId?: string;
  }): Promise<Blob> {
    try {
      const params = new URLSearchParams();
      if (filters?.year) params.append('year', filters.year.toString());
      if (filters?.status) params.append('status', filters.status);
      if (filters?.provedId) params.append('provedId', filters.provedId);

      const response = await BaseService.get(`${this.endpoint}/export/excel?${params.toString()}`);
      return response;
    } catch (error) {
      console.error('Erreur lors de l\'export Excel:', error);
      throw error;
    }
  }
}

export const rapportActiviteService = new RapportActiviteService(); 