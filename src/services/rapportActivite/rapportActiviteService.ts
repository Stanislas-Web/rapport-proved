import { BaseService } from '../baseservice';
import { RapportActivite, CreateRapportActiviteRequest, UpdateRapportActiviteRequest } from '../../models/RapportActivite';

class RapportActiviteService {
  private endpoint = '/rapport-activite';

  // Récupérer tous les rapports d'activité
  async getAllRapports(): Promise<RapportActivite[]> {
    try {
      const response = await BaseService.get(this.endpoint);
      console.log('🔍 RapportActiviteService.getAllRapports - Réponse complète:', response);
      
      // La structure de réponse est: { success: true, data: { docs: [...] } }
      if (response && response.success && response.data && response.data.docs) {
        console.log('🔍 RapportActiviteService.getAllRapports - Nombre de rapports:', response.data.totalDocs);
        console.log('🔍 RapportActiviteService.getAllRapports - Message:', response.message);
        return response.data.docs;
      }
      
      console.log('🔍 RapportActiviteService.getAllRapports - Structure de réponse non reconnue');
      return [];
    } catch (error) {
      console.error('Erreur lors de la récupération des rapports d\'activité:', error);
      console.error('Erreur complète:', JSON.stringify(error, null, 2));
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

  // Récupérer les statistiques des rapports d'activité
  async getRapportStats(): Promise<{
    totalRapports: number;
    rapportsParStatut: { [key: string]: number };
    totalEffectifs: number;
    totalEcoles: number;
    totalClasses: number;
    totalPersonnel: number;
    rapportsParAnnee: { [key: string]: number };
    provincesRepresentees: number;
    rapportsParProved: { [key: string]: number };
  }> {
    try {
      const rapports = await this.getAllRapports();
      
      // Calculer les statistiques
      const stats = {
        totalRapports: rapports.length,
        rapportsParStatut: {} as { [key: string]: number },
        totalEffectifs: 0,
        totalEcoles: 0,
        totalClasses: 0,
        totalPersonnel: 0,
        rapportsParAnnee: {} as { [key: string]: number },
        provincesRepresentees: new Set<string>().size,
        rapportsParProved: {} as { [key: string]: number },
      };

      const provinces = new Set<string>();

      rapports.forEach(rapport => {
        // Statistiques par statut
        const statut = rapport.statut || 'brouillon';
        stats.rapportsParStatut[statut] = (stats.rapportsParStatut[statut] || 0) + 1;

        // Statistiques par année
        const annee = rapport.annee?.toString() || 'N/A';
        stats.rapportsParAnnee[annee] = (stats.rapportsParAnnee[annee] || 0) + 1;

        // Statistiques par PROVED
        if (rapport.identificationProved?.provinceAdministrative) {
          const proved = rapport.identificationProved.provinceAdministrative;
          stats.rapportsParProved[proved] = (stats.rapportsParProved[proved] || 0) + 1;
          provinces.add(proved);
          console.log('🔍 Service - Ajout rapport pour PROVED:', proved, 'Total:', stats.rapportsParProved[proved]);
        } else {
          console.log('🔍 Service - PROVED manquant pour rapport:', rapport._id, 'identificationProved:', rapport.identificationProved);
        }

        // Total effectifs
        stats.totalEffectifs += rapport.totalEffectifs || 0;

        // Calculer les totaux des écoles et classes
        if (rapport.parametresCles) {
          // Écoles
          const ecolesPrescolaire = 
            (rapport.parametresCles.niveauPrescolaire?.espaceCommunautaireEveil?.nombreEcoles || 0) +
            (rapport.parametresCles.niveauPrescolaire?.maternel?.nombreEcoles || 0) +
            (rapport.parametresCles.niveauPrescolaire?.prePrimaire?.nombreEcoles || 0) +
            (rapport.parametresCles.niveauPrescolaire?.special?.nombreEcoles || 0);
          
          const ecolesPrimaire = rapport.parametresCles.niveauPrimaire?.enseignementPrimaire?.nombreEcoles || 0;
          
          stats.totalEcoles += ecolesPrescolaire + ecolesPrimaire;

          // Classes
          const classesPrescolaire = 
            (rapport.parametresCles.niveauPrescolaire?.espaceCommunautaireEveil?.nombreClasses || 0) +
            (rapport.parametresCles.niveauPrescolaire?.maternel?.nombreClasses || 0) +
            (rapport.parametresCles.niveauPrescolaire?.prePrimaire?.nombreClasses || 0) +
            (rapport.parametresCles.niveauPrescolaire?.special?.nombreClasses || 0);
          
          const classesPrimaire = 
            (rapport.parametresCles.niveauPrimaire?.enseignementSpecial?.nombreClasses || 0) +
            (rapport.parametresCles.niveauPrimaire?.enseignementPrimaire?.nombreClasses || 0);
          
          const classesSecondaire = 
            (rapport.parametresCles.niveauSecondaire?.enseignementSpecial?.nombreClasses || 0) +
            (rapport.parametresCles.niveauSecondaire?.enseignementSecondaire?.premierCycle?.classes7emeCTEB || 0) +
            (rapport.parametresCles.niveauSecondaire?.enseignementSecondaire?.premierCycle?.classes8emeCTEB || 0) +
            (rapport.parametresCles.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.classesHumanites || 0);
          
          stats.totalClasses += classesPrescolaire + classesPrimaire + classesSecondaire;
        }

        // Calculer le personnel total
        if (rapport.personnel) {
          const personnelEnseignant = 
            (rapport.personnel.personnelEnseignant?.prescolaire?.hommes || 0) +
            (rapport.personnel.personnelEnseignant?.prescolaire?.femmes || 0) +
            (rapport.personnel.personnelEnseignant?.primaire?.hommes || 0) +
            (rapport.personnel.personnelEnseignant?.primaire?.femmes || 0) +
            (rapport.personnel.personnelEnseignant?.secondaire?.hommes || 0) +
            (rapport.personnel.personnelEnseignant?.secondaire?.femmes || 0);
          
          const personnelAdministratif = 
            (rapport.personnel.personnelAdministratif?.directionProvinciale || 0) +
            (rapport.personnel.personnelAdministratif?.inspectionPrincipale || 0) +
            (rapport.personnel.personnelAdministratif?.coordinationProvinciale || 0) +
            (rapport.personnel.personnelAdministratif?.sousDivision || 0);
          
          stats.totalPersonnel += personnelEnseignant + personnelAdministratif;
        }
      });

      stats.provincesRepresentees = provinces.size;

      console.log('🔍 Statistiques calculées:', stats);
      console.log('🔍 Rapports par PROVED final:', stats.rapportsParProved);
      return stats;
    } catch (error) {
      console.error('Erreur lors du calcul des statistiques:', error);
      throw error;
    }
  }
}

export const rapportActiviteService = new RapportActiviteService(); 