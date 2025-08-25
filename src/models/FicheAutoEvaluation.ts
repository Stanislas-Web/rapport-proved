export interface FicheAutoEvaluation {
  _id?: string;
  id?: string;
  identificationProved: {
    directeurProvincial: string;
    provinceAdministrative: string;
  };
  intituleFormation: string;
  contenuComprehension: {
    contenuClair: 'Pas du tout' | 'Peu' | 'Assez' | 'Beaucoup' | 'Tout à fait';
    nouvellesConnaissances: 'Pas du tout' | 'Peu' | 'Assez' | 'Beaucoup' | 'Tout à fait';
  };
  participationImplication: {
    participationActive: 'Pas du tout' | 'Peu' | 'Assez' | 'Beaucoup' | 'Tout à fait';
    rythmeAdapte: 'Pas du tout' | 'Peu' | 'Assez' | 'Beaucoup' | 'Tout à fait';
  };
  pertinenceUtilite: {
    themesUtiles: 'Pas du tout' | 'Peu' | 'Assez' | 'Beaucoup' | 'Tout à fait';
    capaciteApplication: 'Pas du tout' | 'Peu' | 'Assez' | 'Beaucoup' | 'Tout à fait';
  };
  suggestionsCommentaires: {
    ceQuiApprecie: string;
    ameliorations: string;
    autresCommentaires: string;
  };
  statut: 'brouillon' | 'soumis' | 'approuve' | 'rejete';
  scoreGlobal?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateFicheAutoEvaluationRequest {
  identificationProved: string; // ID de l'utilisateur lors de la création
  intituleFormation: string;
  contenuComprehension: {
    contenuClair: 'Pas du tout' | 'Peu' | 'Assez' | 'Beaucoup' | 'Tout à fait';
    nouvellesConnaissances: 'Pas du tout' | 'Peu' | 'Assez' | 'Beaucoup' | 'Tout à fait';
  };
  participationImplication: {
    participationActive: 'Pas du tout' | 'Peu' | 'Assez' | 'Beaucoup' | 'Tout à fait';
    rythmeAdapte: 'Pas du tout' | 'Peu' | 'Assez' | 'Beaucoup' | 'Tout à fait';
  };
  pertinenceUtilite: {
    themesUtiles: 'Pas du tout' | 'Peu' | 'Assez' | 'Beaucoup' | 'Tout à fait';
    capaciteApplication: 'Pas du tout' | 'Peu' | 'Assez' | 'Beaucoup' | 'Tout à fait';
  };
  suggestionsCommentaires: {
    ceQuiApprecie: string;
    ameliorations: string;
    autresCommentaires: string;
  };
}

export interface UpdateFicheAutoEvaluationRequest extends Partial<CreateFicheAutoEvaluationRequest> {
  identificationProved?: string; // ID de l'utilisateur lors de la mise à jour
  statut?: 'brouillon' | 'soumis' | 'approuve' | 'rejete';
}
