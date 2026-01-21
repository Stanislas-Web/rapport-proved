import React from 'react';
import toast from 'react-hot-toast';
import { RapportActivite } from '../../../models/RapportActivite';

interface AutoFillBannerProps {
  formData: RapportActivite;
  setFormData: React.Dispatch<React.SetStateAction<RapportActivite>>;
}

const AutoFillBanner: React.FC<AutoFillBannerProps> = ({ formData, setFormData }) => {
  const autoFillWithSampleData = () => {
    setFormData(prev => ({
      ...prev,
      annee: new Date().getFullYear(),
      introduction: "Ce rapport présente l'activité éducative de la PROVED pour l'année " + new Date().getFullYear() + ". La province connaît une croissance démographique importante avec une forte demande en services éducatifs.",
      conclusion: "L'année " + new Date().getFullYear() + " a été marquée par des progrès significatifs dans l'accès à l'éducation, avec une augmentation des effectifs et une amélioration des infrastructures. Des défis persistent notamment dans les zones rurales.",
      parametresCles: {
        nombreEcolesClasses: {
          prescolaire: 15 + 25 + 30 + 3,
          primaire: 120,
          secondaire: 45 + 42 + 38 + 8,
          niveauPrescolaire: {
            espaceCommunautaireEveil: 15,
            maternel: 25,
            prePrimaire: 30,
            special: 3
          },
          niveauPrimaire: {
            enseignementSpecial: { nombreEcoles: 0, nombreClasses: 12 },
            enseignementPrimaire: { nombreEcoles: 120, nombreClasses: 480 }
          },
          niveauSecondaire: {
            enseignementSpecial: { nombreEcoles: 0, nombreClasses: 8 },
            premierCycle: { nombreEcoles: 45 + 42, nombreClasses: 45 + 42 },
            deuxiemeCycle: { nombreEcoles: 38 + 8, nombreClasses: 38 + 8 }
          }
        },
        effectifScolaire: {
          prescolaire: 450 + 420 + 750 + 720 + 900 + 870 + 45 + 42,
          primaire: 12000 + 11800 + 180 + 165,
          secondaire: 2250 + 2100 + 1900 + 1800 + 120 + 110,
        },
        niveauPrescolaire: {
          espaceCommunautaireEveil: {
            nombreEcoles: 15,
            nombreClasses: 45,
            effectifGarcons: 450,
            effectifFilles: 420,
            tauxAccroissement: 5.2
          },
          maternel: {
            nombreEcoles: 25,
            nombreClasses: 75,
            effectifGarcons: 750,
            effectifFilles: 720,
            tauxAccroissement: 4.8
          },
          prePrimaire: {
            nombreEcoles: 30,
            nombreClasses: 90,
            effectifGarcons: 900,
            effectifFilles: 870,
            tauxAccroissement: 6.1
          },
          special: {
            nombreEcoles: 3,
            nombreClasses: 9,
            effectifGarcons: 45,
            effectifFilles: 42,
            tauxAccroissement: 3.5
          }
        },
        niveauPrimaire: {
          enseignementSpecial: {
            nombreClasses: 12,
            effectifGarcons: 180,
            effectifFilles: 165,
            tauxAccroissement: 4.2
          },
          enseignementPrimaire: {
            nombreEcoles: 120,
            nombreClasses: 480,
            classesPlethoriques: 15,
            effectifGarcons: 12000,
            effectifFilles: 11800,
            tauxAccroissement: 5.8
          }
        },
        niveauSecondaire: {
          enseignementSpecial: {
            nombreClasses: 8,
            effectifGarcons: 120,
            effectifFilles: 110,
            tauxAccroissement: 3.8
          },
          enseignementSecondaire: {
            premierCycle: {
              classes7emeCTEB: 45,
              classes8emeCTEB: 42,
              effectifGarcons: 2250,
              effectifFilles: 2100,
              tauxAccroissement: 4.5
            },
            deuxiemeCycle: {
              classesHumanites: 38,
              effectifGarcons: 1900,
              effectifFilles: 1800,
              tauxAccroissement: 3.9
            }
          }
        }
      },
      personnel: {
        personnelEnseignant: {
          prescolaire: { hommes: 45, femmes: 120 },
          primaire: { hommes: 180, femmes: 420 },
          secondaire: { hommes: 95, femmes: 85 }
        },
        personnelAdministratif: {
          directionProvinciale: 25,
          inspectionPrincipale: 15,
          dinacope: 8,
          sernie: 6,
          coordinationProvinciale: 12,
          sousDivision: 18,
          poolsInspectionPrimaire: 35,
          poolsInspectionSecondaire: 22,
          antenneDinacope: 4,
          antenneSernie: 3,
          coordinationDiocesaine: 8,
          sousCoordinationConventionnees: 15,
          conseillerieResidente: 5
        }
      },
      realisations: {
        accesAccessibiliteEquite: {
          nouvellesSallesClasses: {
            prescolaire: 8,
            primaire: 25,
            secondaire: 12,
            sourceFinancement: "Budget provincial et partenaires"
          },
          nouveauxBancsTables: {
            prescolaire: 120,
            primaire: 500,
            secondaire: 200,
            sourceFinancement: "Fonds de développement local"
          },
          nouvellesLatrines: {
            prescolaire: 5,
            primaire: 15,
            secondaire: 8,
            sourceFinancement: "UNICEF et partenaires"
          },
          gratuitéEnseignementPrimaire: "Mise en œuvre effective de la gratuité pour tous les élèves du primaire",
          sensibilisation: {
            filles: true,
            enfantsHorsEcole: true,
            peuplesAutochtones: false
          },
          cantinesScolaires: {
            prescolaire: 12,
            primaire: 45,
            secondaire: 8,
            commentaire: "Programme PAM étendu à plus d'écoles"
          },
          indicateursAcces: {
            proportionNouveauxInscrits: 85.5,
            tauxTransitionPrimaireCTEB: 92.3,
            tauxTransitionCTEBHumanites: 78.6
          }
        }
      }
    }));
    toast.success('Formulaire rempli avec des données d\'exemple !');
  };

  return (
    <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
      <div className="flex items-center">
        <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
        <span className="text-sm">💡 <strong>Astuce :</strong> Utilisez le remplissage automatique pour voir un exemple complet du formulaire.</span>
      </div>
      <div className="flex items-center space-x-2">
        <button
          type="button"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium"
          onClick={autoFillWithSampleData}
        >
          Remplir avec exemple
        </button>
        <button
          type="button"
          className="text-blue-600 hover:text-blue-800"
          onClick={() => {
            const banner = document.querySelector('.bg-blue-50') as HTMLElement;
            if (banner) banner.style.display = 'none';
          }}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AutoFillBanner; 