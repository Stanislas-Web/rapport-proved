import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { rapportActiviteService } from '../../services/rapportActivite/rapportActiviteService';
import { RapportActivite } from '../../models/RapportActivite';
import AutoFillBanner from './components/AutoFillBanner';
import BasicInfo from './components/BasicInfo';
import ParametresCles from './components/ParametresCles';
import ParametresClesComplete from './components/ParametresClesComplete';
import Personnel from './components/Personnel';
import EvaluationQualitative from './components/EvaluationQualitative';
import Realisations from './components/Realisations';
import Gouvernance from './components/Gouvernance';
import EducationUrgence from './components/EducationUrgence';
import EvaluationQualitativeComplete from './components/EvaluationQualitativeComplete';
import RealisationsComplete from './components/RealisationsComplete';
import Conclusion from './components/Conclusion';

const CreateRapportActivite: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<RapportActivite>({
    identificationProved: '',
    annee: new Date().getFullYear(),
    introduction: '',
    parametresCles: {
      niveauPrescolaire: {
        espaceCommunautaireEveil: {
          nombreEcoles: 0,
          nombreClasses: 0,
          effectifGarcons: 0,
          effectifFilles: 0,
          tauxAccroissement: 0
        },
        maternel: {
          nombreEcoles: 0,
          nombreClasses: 0,
          effectifGarcons: 0,
          effectifFilles: 0,
          tauxAccroissement: 0
        },
        prePrimaire: {
          nombreEcoles: 0,
          nombreClasses: 0,
          effectifGarcons: 0,
          effectifFilles: 0,
          tauxAccroissement: 0
        },
        special: {
          nombreEcoles: 0,
          nombreClasses: 0,
          effectifGarcons: 0,
          effectifFilles: 0,
          tauxAccroissement: 0
        }
      },
      niveauPrimaire: {
        enseignementSpecial: {
          nombreClasses: 0,
          effectifGarcons: 0,
          effectifFilles: 0,
          tauxAccroissement: 0
        },
        enseignementPrimaire: {
          nombreEcoles: 0,
          nombreClasses: 0,
          classesPlethoriques: 0,
          effectifGarcons: 0,
          effectifFilles: 0,
          tauxAccroissement: 0
        }
      },
      niveauSecondaire: {
        enseignementSpecial: {
          nombreClasses: 0,
          effectifGarcons: 0,
          effectifFilles: 0,
          tauxAccroissement: 0
        },
        enseignementSecondaire: {
          premierCycle: {
            classes7emeCTEB: 0,
            classes8emeCTEB: 0,
            effectifGarcons: 0,
            effectifFilles: 0,
            tauxAccroissement: 0
          },
          deuxiemeCycle: {
            classesHumanites: 0,
            effectifGarcons: 0,
            effectifFilles: 0,
            tauxAccroissement: 0
          }
        }
      }
    },
    personnel: {
      personnelEnseignant: {
        prescolaire: { hommes: 0, femmes: 0 },
        primaire: { hommes: 0, femmes: 0 },
        secondaire: { hommes: 0, femmes: 0 }
      },
      personnelAdministratif: {
        directionProvinciale: 0,
        inspectionPrincipale: 0,
        dinacope: 0,
        sernie: 0,
        coordinationProvinciale: 0,
        sousDivision: 0,
        poolsInspectionPrimaire: 0,
        poolsInspectionSecondaire: 0,
        antenneDinacope: 0,
        antenneSernie: 0,
        coordinationDiocesaine: 0,
        sousCoordinationConventionnees: 0,
        conseillerieResidente: 0
      }
    },
    realisations: {
      accesAccessibiliteEquite: {
        nouvellesSallesClasses: {
          prescolaire: 0,
          primaire: 0,
          secondaire: 0,
          sourceFinancement: ''
        },
        nouveauxBancsTables: {
          prescolaire: 0,
          primaire: 0,
          secondaire: 0,
          sourceFinancement: ''
        },
        nouvellesLatrines: {
          prescolaire: 0,
          primaire: 0,
          secondaire: 0,
          sourceFinancement: ''
        },
        gratuitéEnseignementPrimaire: '',
        sensibilisation: {
          filles: false,
          enfantsHorsEcole: false,
          peuplesAutochtones: false
        },
        cantinesScolaires: {
          prescolaire: 0,
          primaire: 0,
          secondaire: 0,
          commentaire: ''
        },
        indicateursAcces: {
          proportionNouveauxInscrits: 0,
          tauxTransitionPrimaireCTEB: 0,
          tauxTransitionCTEBHumanites: 0
        }
      }
    },
    conclusion: '',
    statut: 'brouillon'
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const createRequest = {
        identificationProved: formData.identificationProved,
        annee: formData.annee,
        introduction: formData.introduction,
        parametresCles: formData.parametresCles,
        personnel: formData.personnel,
        realisations: formData.realisations,
        conclusion: formData.conclusion,
        statut: formData.statut
      };
      await rapportActiviteService.createRapport(createRequest);
      toast.success('Rapport d\'activité créé avec succès !');
      navigate('/rapport-activite');
    } catch (error) {
      console.error('Erreur lors de la création du rapport:', error);
      toast.error('Erreur lors de la création du rapport d\'activité');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-title-md2 font-semibold text-black dark:text-white">
            Créer un rapport d'activité
          </h2>
        </div>

        <AutoFillBanner formData={formData} setFormData={setFormData} />

        <form onSubmit={handleSubmit} className="space-y-6">
                        <BasicInfo formData={formData} handleInputChange={handleInputChange} />
              <ParametresCles formData={formData} setFormData={setFormData} />
              <ParametresClesComplete formData={formData} setFormData={setFormData} />
              <Personnel formData={formData} setFormData={setFormData} />
              <EvaluationQualitative />
              <EvaluationQualitativeComplete />
              <Realisations formData={formData} setFormData={setFormData} />
              <RealisationsComplete formData={formData} setFormData={setFormData} />
              <Gouvernance formData={formData} setFormData={setFormData} />
              <EducationUrgence formData={formData} setFormData={setFormData} />
              <Conclusion formData={formData} handleInputChange={handleInputChange} />

          {/* Boutons d'action */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/rapport-activite')}
              className="inline-flex items-center justify-center rounded-md border border-stroke bg-white py-2 px-10 text-center font-medium text-black hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 disabled:opacity-50"
            >
              {loading ? 'Création...' : 'Créer le rapport'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateRapportActivite; 