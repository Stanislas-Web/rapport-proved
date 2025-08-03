import { Role } from "../enums/role";

export type User = {
  id: string,
  password: string,
  nom: string,
  postnom: string,
  prenom: string,
  photo: string,
  email: string,
  role: Role,
  direction: string,
  service: string,
  phone: string,
  province: string,
  sousDirection: string,
  visiblePhoto: boolean,
  fonction: string,
  grade: string,
  fileValue: File | null,
  isActive: boolean
};


