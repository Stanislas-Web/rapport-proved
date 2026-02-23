import React, { useState, useEffect } from 'react';
import { RapportActivite } from '../../../models/RapportActivite';
import EffectifsPrecedent, { EffectifsAnneePrecedente } from './EffectifsPrecedent';
import { EffectifAnnuelService } from '../../../services/effectifAnnuel/effectifAnnuel.service';
import { getProvedIdFromToken } from '../../../utils/jwtUtils';

interface BasicInfoProps {
  formData: RapportActivite;
  handleInputChange: (field: string, value: any) => void;
}

const BasicInfo: React.FC<BasicInfoProps> = ({ formData, handleInputChange }) => {
  // État initial pour les effectifs - utilise les données de formData si disponibles
  const defaultEffectifs: EffectifsAnneePrecedente = {
    niveauPrescolaire: {
      espaceCommunautaireEveil: { effectifGarconsFilles: 0, effectifFilles: 0 },
      maternel: { effectifGarconsFilles: 0, effectifFilles: 0 },
      prePrimaire: { effectifGarconsFilles: 0, effectifFilles: 0 },
      special: { effectifGarconsFilles: 0, effectifFilles: 0 }
    },
    niveauPrimaire: {
      enseignementSpecial: { effectifGarconsFilles: 0, effectifFilles: 0 },
      enseignementPrimaire: { effectifGarconsFilles: 0, effectifFilles: 0 }
    },
    niveauSecondaire: {
      enseignementSpecial: { effectifGarcons: 0, effectifFilles: 0 },
      enseignementSecondaire: {
        septiemeCTEB: { effectifGarcons: 0, effectifFilles: 0 },
        huitiemeCTEB: { effectifGarcons: 0, effectifFilles: 0 },
        premiereHumanite: { effectifGarcons: 0, effectifFilles: 0 },
        quatriemeHumanite: { effectifGarcons: 0, effectifFilles: 0 }
      }
    }
  };

  const [effectifs, setEffectifs] = useState<EffectifsAnneePrecedente>(defaultEffectifs);

  // Récupérer l'ID PROVED depuis le token JWT en utilisant l'utilitaire robuste
  const getProvedId = (): string | null => {
    return getProvedIdFromToken();
  };

  // Charger les effectifs existants au montage du composant
  useEffect(() => {
    const loadInitialEffectifs = async () => {
      const provedId = getProvedId();
      const annee = formData?.annee;
      
      if (provedId && annee) {
        try {
          const data = await EffectifAnnuelService.getByProvedAndAnnee(provedId, annee);
          
          let effectifsCharges = null;
          
          if (Array.isArray(data) && data.length > 0 && data[0].effectifs) {
            effectifsCharges = data[0].effectifs;
          } else if (data && data.effectifs) {
            effectifsCharges = data.effectifs;
          } else if (data && data.niveauPrescolaire && data.niveauPrimaire && data.niveauSecondaire) {
            effectifsCharges = data;
          }
          
          if (effectifsCharges) {
            console.log('✅ Effectifs chargés depuis l\'API:', effectifsCharges);
            setEffectifs(effectifsCharges);
          }
        } catch (error) {
          // Pas d'effectif existant, ce n'est pas une erreur
        }
      }
    };
    
    loadInitialEffectifs();
  }, [formData?.annee]);

  const handleEffectifsUpdate = (newEffectifs: EffectifsAnneePrecedente) => {
    // Mettre à jour uniquement l'état local
    // Les effectifs sont déjà enregistrés dans la base de données
    setEffectifs(newEffectifs);
  };

  const provedId = getProvedId();
  console.log('🔍 BasicInfo render - provedId:', provedId, 'annee:', formData?.annee);

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h3 className="text-lg font-medium mb-4">Informations de base</h3>
      
      {/* Composant Effectifs */}
      <EffectifsPrecedent 
        effectifs={effectifs} 
        onUpdate={handleEffectifsUpdate}
        identificationProved={provedId || undefined}
        annee={formData?.annee?.toString()}
      />
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-black dark:text-white mb-2">
          Année scolaire <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.annee}
          onChange={(e) => handleInputChange('annee', e.target.value)}
          className="w-full rounded border border-stroke bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Ex: 2024-2025"
          required
        />
        <p className="text-xs text-gray-500 mt-1">Format requis: YYYY-YYYY (ex: 2024-2025)</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-black dark:text-white mb-2">
          Introduction
        </label>
        <textarea
          value={formData.introduction}
          onChange={(e) => handleInputChange('introduction', e.target.value)}
          rows={4}
          className="w-full rounded border border-stroke bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Brève description de la genèse et présentation de la situation sociogéographique..."
        />
      </div>
    </div>
  );
};

export default BasicInfo; 