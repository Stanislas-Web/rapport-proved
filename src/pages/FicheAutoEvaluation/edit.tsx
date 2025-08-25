import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ficheAutoEvaluationService } from '../../services/ficheAutoEvaluation/ficheAutoEvaluationService';
import { FicheAutoEvaluation, UpdateFicheAutoEvaluationRequest } from '../../models/FicheAutoEvaluation';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import toast from 'react-hot-toast';

const EditFicheAutoEvaluationPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState<UpdateFicheAutoEvaluationRequest>({
    identificationProved: '',
    intituleFormation: '',
    contenuComprehension: {
      contenuClair: 'Assez',
      nouvellesConnaissances: 'Assez'
    },
    participationImplication: {
      participationActive: 'Assez',
      rythmeAdapte: 'Assez'
    },
    pertinenceUtilite: {
      themesUtiles: 'Assez',
      capaciteApplication: 'Assez'
    },
    suggestionsCommentaires: {
      ceQuiApprecie: '',
      ameliorations: '',
      autresCommentaires: ''
    }
  });

  useEffect(() => {
    if (id) {
      loadFiche();
    }
  }, [id]);

  const loadFiche = async () => {
    try {
      setInitialLoading(true);
      const fiche = await ficheAutoEvaluationService.getFicheById(id!);
      setFormData({
        identificationProved: '', // On ne charge pas l'ID car il sera défini lors de la soumission
        intituleFormation: fiche.intituleFormation,
        contenuComprehension: fiche.contenuComprehension,
        participationImplication: fiche.participationImplication,
        pertinenceUtilite: fiche.pertinenceUtilite,
        suggestionsCommentaires: fiche.suggestionsCommentaires
      });
    } catch (error) {
      console.error('Erreur lors du chargement de la fiche:', error);
      toast.error('Erreur lors du chargement de la fiche');
      navigate('/fiche-auto-evaluation');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (parentField: string, childField: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parentField]: {
        ...(prev[parentField as keyof typeof prev] as any),
        [childField]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Récupérer l'ID de l'utilisateur connecté
      const userData = JSON.parse(localStorage.getItem('data') || '{}');
      const userId = userData.id || userData._id;
      
      if (!userId) {
        toast.error('Erreur: Impossible de récupérer les informations utilisateur');
        setLoading(false);
        return;
      }

      // Créer les données avec l'ID utilisateur
      const ficheData = {
        ...formData,
        identificationProved: userId
      };

      await ficheAutoEvaluationService.updateFiche(id!, ficheData);
      toast.success('Fiche d\'auto-évaluation mise à jour avec succès');
      navigate('/fiche-auto-evaluation');
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour de la fiche');
    } finally {
      setLoading(false);
    }
  };

  const evaluationOptions = ['Pas du tout', 'Peu', 'Assez', 'Beaucoup', 'Tout à fait'];

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb pageName="Modifier la Fiche d'Auto-évaluation" />

      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <div className="mb-6">
          <h2 className="text-title-md2 font-semibold text-black dark:text-white">
            Modifier la Fiche d'Auto-évaluation
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informations générales */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Informations Générales
              </h3>
            </div>
            <div className="p-6.5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Intitulé de la Formation <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Entrez l'intitulé de la formation"
                    value={formData.intituleFormation}
                    onChange={(e) => handleInputChange('intituleFormation', e.target.value)}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    required
                  />
                </div>


              </div>
            </div>
          </div>

          {/* Contenu et Compréhension */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Contenu et Compréhension
              </h3>
            </div>
            <div className="p-6.5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="mb-2.5 block text-black dark:text-white font-semibold">
                    Le contenu était-il clair et compréhensible ?
                  </label>
                  <div className="grid grid-cols-1 gap-3 mt-2">
                    {evaluationOptions.map(option => (
                      <label key={option} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="contenuClair"
                          value={option}
                          checked={formData.contenuComprehension?.contenuClair === option}
                          onChange={(e) => handleNestedInputChange('contenuComprehension', 'contenuClair', e.target.value)}
                          className="mr-3 h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                        />
                        <span className="text-sm text-black dark:text-white">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2.5 block text-black dark:text-white font-semibold">
                    Avez-vous acquis de nouvelles connaissances ?
                  </label>
                  <div className="grid grid-cols-1 gap-3 mt-2">
                    {evaluationOptions.map(option => (
                      <label key={option} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="nouvellesConnaissances"
                          value={option}
                          checked={formData.contenuComprehension?.nouvellesConnaissances === option}
                          onChange={(e) => handleNestedInputChange('contenuComprehension', 'nouvellesConnaissances', e.target.value)}
                          className="mr-3 h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                        />
                        <span className="text-sm text-black dark:text-white">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Participation et Implication */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Participation et Implication
              </h3>
            </div>
            <div className="p-6.5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="mb-2.5 block text-black dark:text-white font-semibold">
                    Avez-vous participé activement aux activités ?
                  </label>
                  <div className="grid grid-cols-1 gap-3 mt-2">
                    {evaluationOptions.map(option => (
                      <label key={option} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="participationActive"
                          value={option}
                          checked={formData.participationImplication?.participationActive === option}
                          onChange={(e) => handleNestedInputChange('participationImplication', 'participationActive', e.target.value)}
                          className="mr-3 h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                        />
                        <span className="text-sm text-black dark:text-white">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2.5 block text-black dark:text-white font-semibold">
                    Le rythme était-il adapté à votre niveau ?
                  </label>
                  <div className="grid grid-cols-1 gap-3 mt-2">
                    {evaluationOptions.map(option => (
                      <label key={option} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="rythmeAdapte"
                          value={option}
                          checked={formData.participationImplication?.rythmeAdapte === option}
                          onChange={(e) => handleNestedInputChange('participationImplication', 'rythmeAdapte', e.target.value)}
                          className="mr-3 h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                        />
                        <span className="text-sm text-black dark:text-white">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pertinence et Utilité */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Pertinence et Utilité
              </h3>
            </div>
            <div className="p-6.5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="mb-2.5 block text-black dark:text-white font-semibold">
                    Les thèmes abordés sont-ils utiles pour votre pratique ?
                  </label>
                  <div className="grid grid-cols-1 gap-3 mt-2">
                    {evaluationOptions.map(option => (
                      <label key={option} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="themesUtiles"
                          value={option}
                          checked={formData.pertinenceUtilite?.themesUtiles === option}
                          onChange={(e) => handleNestedInputChange('pertinenceUtilite', 'themesUtiles', e.target.value)}
                          className="mr-3 h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                        />
                        <span className="text-sm text-black dark:text-white">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2.5 block text-black dark:text-white font-semibold">
                    Pensez-vous pouvoir appliquer ces connaissances ?
                  </label>
                  <div className="grid grid-cols-1 gap-3 mt-2">
                    {evaluationOptions.map(option => (
                      <label key={option} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="capaciteApplication"
                          value={option}
                          checked={formData.pertinenceUtilite?.capaciteApplication === option}
                          onChange={(e) => handleNestedInputChange('pertinenceUtilite', 'capaciteApplication', e.target.value)}
                          className="mr-3 h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                        />
                        <span className="text-sm text-black dark:text-white">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Suggestions et Commentaires */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Suggestions et Commentaires
              </h3>
            </div>
            <div className="p-6.5">
              <div className="space-y-6">
                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Ce que vous avez le plus apprécié
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Décrivez ce que vous avez le plus apprécié..."
                    value={formData.suggestionsCommentaires?.ceQuiApprecie || ''}
                    onChange={(e) => handleNestedInputChange('suggestionsCommentaires', 'ceQuiApprecie', e.target.value)}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Suggestions d'amélioration
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Proposez des améliorations..."
                    value={formData.suggestionsCommentaires?.ameliorations || ''}
                    onChange={(e) => handleNestedInputChange('suggestionsCommentaires', 'ameliorations', e.target.value)}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Autres commentaires
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Autres commentaires ou observations..."
                    value={formData.suggestionsCommentaires?.autresCommentaires || ''}
                    onChange={(e) => handleNestedInputChange('suggestionsCommentaires', 'autresCommentaires', e.target.value)}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/fiche-auto-evaluation')}
              className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90 disabled:opacity-50"
            >
              {loading ? 'Mise à jour...' : 'Mettre à jour'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditFicheAutoEvaluationPage;
