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
          value={formData.conclusion}
          onChange={(e) => handleInputChange('conclusion', e.target.value)}
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
        />
      </div>

      {/* NOTE EXPLICATIVE */}
      <div className="mb-6">
        <h4 className="font-bold mb-3">NOTE EXPLICATIVE</h4>
        <div className="text-sm text-gray-700 space-y-3">
          <p>
            Ce template constitue un premier draft pour les discussions. Il servira à produire un rapport définitif par les "Proveds" 
            qui sera soumis au Ministère de l'EPST.
          </p>
          <p>
            Actuellement, il n'existe pas de cadre standard pour les rapports d'activité. Cette proposition vise à combler cette lacune 
            et à harmoniser les rapports d'activité des provinces éducationnelles.
          </p>
          <p>
            L'analyse permettra de supprimer les informations superflues et de ne garder que l'essentiel pour la prise de décision 
            au niveau central.
          </p>
          <p>
            Un panel d'experts sera mis en place pour valider ce template et le Conseiller Jacks sera chargé de la coordination 
            de ce processus.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Conclusion; 