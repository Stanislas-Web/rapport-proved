import React from 'react';
import { RapportActivite } from '../../../models/RapportActivite';

interface EducationUrgenceProps {
  formData: RapportActivite;
  setFormData: React.Dispatch<React.SetStateAction<RapportActivite>>;
}

const EducationUrgence: React.FC<EducationUrgenceProps> = ({ formData, setFormData }) => {
  const handleChange = (field: keyof RapportActivite, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h3 className="text-lg font-medium mb-4 text-primary">V. EDUCATION EN SITUATION D'URGENCE</h3>
      {/* V.1. Plan & Stock de Contingence */}
      <div className="mb-6">
        <h4 className="font-medium mb-3 text-blue-600">V.1. Plan & Stock de Contingence</h4>
        
        {/* V.1.1. PLAN */}
        <div className="mb-4">
          <h5 className="font-medium mb-2">V.1.1. PLAN (Le reprendre brièvement)</h5>
          <textarea
            className="w-full h-20 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Décrivez le plan..."
          />
        </div>

        {/* V.1.2. STOCK */}
        <div className="mb-4">
          <h5 className="font-medium mb-2">V.1.2. STOCK (En Spécifier brièvement le contenu)</h5>
          <textarea
            className="w-full h-20 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Décrivez le contenu du stock..."
          />
        </div>

        {/* V.1.3. Survenue des Catastrophes naturelles */}
        <div className="mb-4">
          <h5 className="font-medium mb-2">V.1.3. Survenue des Catastrophes naturelles (En préciser la nature et les effets négatifs)</h5>
          <textarea
            className="w-full h-20 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Décrivez les catastrophes naturelles..."
          />
        </div>

        {/* V.1.4. Destruction des SDC par les Forces Négatives */}
        <div className="mb-4">
          <h5 className="font-medium mb-2">V.1.4. Destruction des SDC par les Forces Négatives</h5>
          <textarea
            className="w-full h-20 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Décrivez les destructions..."
          />
        </div>

        {/* V.1.5. Solutions locales */}
        <div className="mb-4">
          <h5 className="font-medium mb-2">V.1.5. Solutions locales</h5>
          <textarea
            className="w-full h-20 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Décrivez les solutions locales..."
          />
        </div>

        {/* V.1.6. Fréquences des réunions du Cluster Education */}
        <div className="mb-4">
          <h5 className="font-medium mb-2">V.1.6. Fréquences des réunions du Cluster Education, (qlq principaux points traités et réalisés)</h5>
          <textarea
            className="w-full h-20 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Décrivez les réunions du Cluster Education..."
          />
        </div>

        {/* V.1.7. Recommandations */}
        <div className="mb-4">
          <h5 className="font-medium mb-2">V.1.7. Recommandations</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">a) Nbre d'Espaces Temporaires d'apprentissages construits (En préciser les coûts)</label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nombre"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">b) Nbre d'apprenants scolarisés (Cible)</label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nombre"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">c) Formations des enseignants sur l'ESU</label>
            <textarea
              className="w-full h-20 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Décrivez les formations..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationUrgence; 