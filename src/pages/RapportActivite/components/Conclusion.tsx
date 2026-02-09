import React from 'react';
import { RapportActivite } from '../../../models/RapportActivite';

interface ConclusionProps {
  formData: RapportActivite;
  handleInputChange: (field: string, value: any) => void;
}

const Conclusion: React.FC<ConclusionProps> = ({ formData, handleInputChange }) => {
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h3 className="text-lg font-medium mb-4 text-primary">VI. AUTRES PRINCIPAUX PROBLEMES SPECIFIQUES</h3>
      
      {/* VI.1. Autres principaux problèmes spécifiques */}
      <div className="mb-6">
        <h4 className="font-bold mb-3">VI.1. Autres principaux problèmes spécifiques (10 lignes maximum)</h4>
        <textarea
          value={formData.autresProblemes.problemesSpecifiques}
          onChange={(e) => handleInputChange('autresProblemes.problemesSpecifiques', e.target.value)}
          className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Décrivez les autres problèmes spécifiques..."
        />
      </div>

      {/* CONCLUSION */}
      <div className="mb-6">
        <h4 className="font-bold mb-3">CONCLUSION</h4>
        <h5 className="font-medium mb-2">Conclusion (10 lignes maximum)</h5>
        <textarea
          className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Entrez votre conclusion..."
          value={formData.conclusion}
          onChange={(e) => handleInputChange('conclusion', e.target.value)}
        />
      </div>
    </div>
  );
};

export default Conclusion; 