import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { environment } from "../config/environnement";
import { Environment } from "../models/Enums";

// URL de base
export const Base_Url = "http://134.122.23.150";

function devUrl(): string {
    return "http://134.122.23.150/api/v1/";
}

export function prodUrl(): string {
    return "http://134.122.23.150/api/v1/";
}

export const URL = environment === Environment.DEVELOPPEMENT ? devUrl() : prodUrl();

// Fonction pour générer l'URL complète
const getFullUrl = (route: string): string => {
    const fullUrl = `${URL}${route}`;
    console.log('🔍 BaseService - URL générée:', fullUrl);
    console.log('🔍 BaseService - URL de base:', URL);
    console.log('🔍 BaseService - Route:', route);
    return fullUrl;
};

// Configuration par défaut
const defaultConfig: AxiosRequestConfig = {
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 5000, // Timeout de 5 secondes
};

// Fonction pour obtenir la configuration avec token
const getConfigWithToken = (): AxiosRequestConfig => {
    const token = localStorage.getItem('token');
    console.log('🔍 BaseService - Token récupéré:', token);
    
    return {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
        },
        timeout: 5000, // Timeout de 5 secondes
    };
};

// Service de base avec méthodes GET, POST, PUT, DELETE
export const BaseService = {
    // Méthode GET avec config
    get: async (route: string, config: AxiosRequestConfig = {}): Promise<any> => {
        try {
            const tokenConfig = getConfigWithToken();
            console.log('🔍 BaseService.get - Route:', route);
            console.log('🔍 BaseService.get - Token config:', tokenConfig);
            
            const response: AxiosResponse = await axios.get(getFullUrl(route), { ...tokenConfig, ...config });
            return response.data;
        } catch (error: any) {
            console.error('🔍 BaseService.get - Erreur:', error);
            throw error.response ? error.response.data : error;
        }
    },

    // Méthode POST avec config
    post: async (route: string, data: any, config: AxiosRequestConfig = {}): Promise<any> => {
        try {
            const tokenConfig = getConfigWithToken();
            const fullUrl = getFullUrl(route);
            
            console.log('🔍 BaseService.post - URL complète:', fullUrl);
            console.log('🔍 BaseService.post - Route:', route);
            console.log('🔍 BaseService.post - Data:', data);
            console.log('🔍 BaseService.post - Token config:', tokenConfig);
            console.log('🔍 BaseService.post - Headers:', tokenConfig.headers);
            
            const response: AxiosResponse = await axios.post(fullUrl, data, { ...tokenConfig, ...config });
            console.log('🔍 BaseService.post - Réponse:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('🔍 BaseService.post - Erreur complète:', error);
            console.error('🔍 BaseService.post - Status:', error.response?.status);
            console.error('🔍 BaseService.post - Data d\'erreur:', error.response?.data);
            console.error('🔍 BaseService.post - URL qui a échoué:', getFullUrl(route));
            throw error.response ? error.response.data : error;
        }
    },

    login: async (route: string, data: any, config: AxiosRequestConfig = {}): Promise<any> => {
        try {
            const response: AxiosResponse = await axios.post(getFullUrl(route), data, { ...defaultConfig, ...config });
            return response.data;
        } catch (error: any) {
            throw error.response ? error.response.data : error;
        }
    },

    // Méthode PUT avec config
    put: async (route: string, data: any, config: AxiosRequestConfig = {}): Promise<any> => {
        try {
            const response: AxiosResponse = await axios.put(getFullUrl(route), data, { ...defaultConfig, ...config });
            return response.data;
        } catch (error: any) {
            throw error.response ? error.response.data : error;
        }
    },

    // Méthode DELETE avec config
    delete: async (route: string, config: AxiosRequestConfig = {}): Promise<any> => {
        try {
            const response: AxiosResponse = await axios.delete(getFullUrl(route), { ...defaultConfig, ...config });
            return response.data;
        } catch (error: any) {
            throw error.response ? error.response.data : error;
        }
    },


    uploadImage: async (route: string, imageFile: File | null, config: AxiosRequestConfig = {}): Promise<any> => {
        const convertFile = imageFile as unknown as File;
        try {
            const formData = new FormData();
            formData.append('photo', convertFile); // 'file' est le nom du champ côté backend

            const uploadConfig = {
                headers: {
                    ...getConfigWithToken().headers,
                    'Content-Type': 'multipart/form-data', // Important pour l'upload de fichiers
                },
                timeout: getConfigWithToken().timeout,
            };

            const response: AxiosResponse = await axios.post(getFullUrl(route), formData, { ...uploadConfig, ...config });
            return response.data;
        } catch (error: any) {
            throw error.response ? error.response.data : error;
        }
    }


};
