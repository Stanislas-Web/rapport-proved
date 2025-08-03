export type Ecole = {
    _id: string;
    createdAt: string;
    id: string;
    nom: string;
    createdBy: any;
    adresse: string;
    eleves: any[]; // Remplacez 'any' par un type spécifique si nécessaire
    sousDirection: {
      _id: string;
      nom: string;
      idDirection: string;
      createdAt: string;
      updatedAt: string;
    };
    localisation: {
      latitude: number;
      longitude: number;
    };
    __v: number;
    effectifs: number;
  };
  