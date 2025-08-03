import React from 'react';
import { RapportActivite } from '../../../models/RapportActivite';

interface BasicInfoProps {
  formData: RapportActivite;
  handleInputChange: (field: string, value: any) => void;
}

const BasicInfo: React.FC<BasicInfoProps> = ({ formData, handleInputChange }) => {
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h3 className="text-lg font-medium mb-4">Informations de base</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-black dark:text-white mb-2">
            Identification PROVED
          </label>
          <input
            type="text"
            value={formData.identificationProved}
            onChange={(e) => handleInputChange('identificationProved', e.target.value)}
            className="w-full rounded border border-stroke bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Entrez l'identification PROVED"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-black dark:text-white mb-2">
            Année
          </label>
          <input
            type="number"
            value={formData.annee}
            onChange={(e) => handleInputChange('annee', parseInt(e.target.value) || 0)}
            className="w-full rounded border border-stroke bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Année du rapport"
          />
        </div>
      </div>

      <div className="mt-4">
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