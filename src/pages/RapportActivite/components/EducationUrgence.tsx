import React from 'react';
import { RapportActivite } from '../../../models/RapportActivite';

interface EducationUrgenceProps {
  formData: RapportActivite;
  setFormData: React.Dispatch<React.SetStateAction<RapportActivite>>;
}

const EducationUrgence: React.FC<EducationUrgenceProps> = ({ formData, setFormData }) => {
  const handleInputChange = (path: string, value: string | number) => {
    setFormData(prev => {
      const updated = { ...prev };
      const keys = path.split('.');
      let current: any = updated;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return updated;
    });
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
            value={formData.educationUrgence.planStockContingence.plan}
            onChange={(e) => handleInputChange('educationUrgence.planStockContingence.plan', e.target.value)}
          />
        </div>

        {/* V.1.2. STOCK */}
        <div className="mb-4">
          <h5 className="font-medium mb-2">V.1.2. STOCK (En Spécifier brièvement le contenu)</h5>
          <textarea
            className="w-full h-20 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Décrivez le contenu du stock..."
            value={formData.educationUrgence.planStockContingence.stock}
            onChange={(e) => handleInputChange('educationUrgence.planStockContingence.stock', e.target.value)}
          />
        </div>

        {/* V.1.3. Survenue des Catastrophes naturelles */}
        <div className="mb-4">
          <h5 className="font-medium mb-2">V.1.3. Survenue des Catastrophes naturelles (En préciser la nature et les effets négatifs)</h5>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-2">Nature des catastrophes</label>
            <textarea
              className="w-full h-20 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Décrivez la nature des catastrophes naturelles..."
              value={formData.educationUrgence.catastrophesNaturelles.nature}
              onChange={(e) => handleInputChange('educationUrgence.catastrophesNaturelles.nature', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Effets négatifs</label>
            <textarea
              className="w-full h-20 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Décrivez les effets négatifs des catastrophes..."
              value={formData.educationUrgence.catastrophesNaturelles.effetsNegatifs}
              onChange={(e) => handleInputChange('educationUrgence.catastrophesNaturelles.effetsNegatifs', e.target.value)}
            />
          </div>
        </div>

        {/* V.1.4. Destruction des SDC par les Forces Négatives */}
        <div className="mb-4">
          <h5 className="font-medium mb-2">V.1.4. Destruction des SDC par les Forces Négatives</h5>
          <textarea
            className="w-full h-20 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Décrivez les destructions..."
            value={formData.educationUrgence.destructionSDC.forcesNegatives}
            onChange={(e) => handleInputChange('educationUrgence.destructionSDC.forcesNegatives', e.target.value)}
          />
        </div>

        {/* V.1.5. Solutions locales */}
        <div className="mb-4">
          <h5 className="font-medium mb-2">V.1.5. Solutions locales</h5>
          <textarea
            className="w-full h-20 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Décrivez les solutions locales..."
            value={formData.educationUrgence.solutionsLocales}
            onChange={(e) => handleInputChange('educationUrgence.solutionsLocales', e.target.value)}
          />
        </div>

        {/* V.1.6. Fréquences des réunions du Cluster Education */}
        <div className="mb-4">
          <h5 className="font-medium mb-2">V.1.6. Fréquences des réunions du Cluster Education, (qlq principaux points traités et réalisés)</h5>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-2">Fréquence des réunions</label>
            <textarea
              className="w-full h-20 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Décrivez la fréquence des réunions..."
              value={formData.educationUrgence.reunionsClusterEducation.frequence}
              onChange={(e) => handleInputChange('educationUrgence.reunionsClusterEducation.frequence', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Principaux points traités et réalisés</label>
            <textarea
              className="w-full h-20 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Décrivez les principaux points traités..."
              value={formData.educationUrgence.reunionsClusterEducation.pointsTraites}
              onChange={(e) => handleInputChange('educationUrgence.reunionsClusterEducation.pointsTraites', e.target.value)}
            />
          </div>
        </div>

        {/* V.1.7. Recommandations */}
        <div className="mb-4">
          <h5 className="font-medium mb-2">V.1.7. Recommandations</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">a) Nbre d'Espaces Temporaires d'apprentissages construits</label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nombre"
                value={formData.educationUrgence.recommandations.espacesTemporairesApprentissage.nombre ?? ''}
                onChange={(e) => handleInputChange('educationUrgence.recommandations.espacesTemporairesApprentissage.nombre', Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">b) Nbre d'apprenants scolarisés (Cible)</label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nombre"
                value={formData.educationUrgence.recommandations.apprenantsScolarises.cible ?? ''}
                onChange={(e) => handleInputChange('educationUrgence.recommandations.apprenantsScolarises.cible', Number(e.target.value))}
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Coûts des Espaces Temporaires d'apprentissage (En préciser les coûts)</label>
            <textarea
              className="w-full h-20 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Décrivez les coûts estimés..."
              value={formData.educationUrgence.recommandations.espacesTemporairesApprentissage.couts}
              onChange={(e) => handleInputChange('educationUrgence.recommandations.espacesTemporairesApprentissage.couts', e.target.value)}
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">c) Formations des enseignants sur l'ESU</label>
            <textarea
              className="w-full h-20 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Décrivez les formations..."
              value={formData.educationUrgence.recommandations.formationEnseignantsESU}
              onChange={(e) => handleInputChange('educationUrgence.recommandations.formationEnseignantsESU', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationUrgence; 