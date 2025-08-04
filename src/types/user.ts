import { Role } from "../enums/role";

export type User = {
  id: string,
  motDePasse: string,
  provinceAdministrative: string,
  provinceEducationnelle: string,
  chefLieuProved: string,
  emailProfessionnel: string,
  telephone: string,
  statutOccupation: string,
  nombreTerritoires: number,
  nombreSousDivisions: number,
  directeurProvincial: string,
  isActive: boolean,
  // Champs optionnels pour compatibilité
  nom?: string,
  postnom?: string,
  prenom?: string,
  photo?: string,
  email?: string,
  role?: Role,
  direction?: string,
  service?: string,
  phone?: string,
  province?: string,
  sousDirection?: string,
  visiblePhoto?: boolean,
  fonction?: string,
  grade?: string,
  fileValue?: File | null,
  password?: string
};


