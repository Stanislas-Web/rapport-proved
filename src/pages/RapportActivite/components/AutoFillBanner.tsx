import React from 'react';
import toast from 'react-hot-toast';
import { RapportActivite } from '../../../models/RapportActivite';

interface AutoFillBannerProps {
  formData: RapportActivite;
  setFormData: React.Dispatch<React.SetStateAction<RapportActivite>>;
}

const AutoFillBanner: React.FC<AutoFillBannerProps> = ({ formData, setFormData }) => {
  return (
    <div className="bg-gray-800 text-white px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
      <div className="flex items-center">
        <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
        <span className="text-sm">La fonctionnalité de remplissage automatique peut vous aider à remplir ce formulaire.</span>
      </div>
      <div className="flex items-center space-x-2">
        <button
          type="button"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium"
          onClick={() => {
            setFormData(prev => ({
              ...prev,
              annee: new Date().getFullYear(),
              introduction: "Brève description de la genèse et présentation de la situation sociogéographique de la Province éducationnelle...",
              conclusion: "Conclusion du rapport d'activité de la Province éducationnelle..."
            }));
            toast.success('Formulaire auto-rempli avec des valeurs par défaut');
          }}
        >
          Remp. auto.
        </button>
        <button
          type="button"
          className="text-white hover:text-gray-300"
          onClick={() => {
            const banner = document.querySelector('.bg-gray-800') as HTMLElement;
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