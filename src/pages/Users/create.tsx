
import { useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../app/store';
import { createUser } from '../../features/users/usersSlice';
import toast, { Toaster } from 'react-hot-toast';
import { User } from '../../types/user';
import { useNavigate } from 'react-router-dom';

const CreateUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false); // État pour gérer la visibilité du mot de passe
  const [formData, setFormData] = useState<User>({
    id: '',
    motDePasse: '',
    provinceAdministrative: '',
    provinceEducationnelle: '',
    chefLieuProved: '',
    emailProfessionnel: '',
    telephone: '',
    statutOccupation: 'Propriétaire',
    nombreTerritoires: 0,
    nombreSousDivisions: 0,
    directeurProvincial: '',
    isActive: true, // Par défaut activé
  });
  const [errorMessage, setErrorMessage] = useState<string>('');

  // États pour la recherche des provinces
  const [searchAdmin, setSearchAdmin] = useState('');
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);

  // Liste des 26 provinces
  const provinces = [
    "Bas-Uele", "Équateur", "Haut-Katanga", "Haut-Lomami", "Haut-Uele",
    "Ituri", "Kasaï", "Kasaï-Central", "Kasaï-Oriental", "Kinshasa",
    "Kongo-Central", "Kwango", "Kwilu", "Lomami", "Lualaba",
    "Mai-Ndombe", "Maniema", "Mongala", "Nord-Kivu", "Nord-Ubangi",
    "Sankuru", "Sud-Kivu", "Sud-Ubangi", "Tanganyika", "Tshopo", "Tshuapa"
  ];

  // Filtrer les provinces selon la recherche
  const filteredAdminProvinces = provinces.filter(province =>
    province.toLowerCase().includes(searchAdmin.toLowerCase())
  );

  const handleInputChange = (field: keyof User, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Fermer les dropdowns quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.province-dropdown')) {
        setShowAdminDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérifier si l'utilisateur est connecté
    const token = localStorage.getItem('token');
    const telephone = localStorage.getItem('telephone');
    
    if (!token || !telephone) {
      toast.error('Vous devez être connecté pour créer un utilisateur');
      return;
    }
    
    console.log('🔍 Token de l\'utilisateur connecté:', token);
    console.log('🔍 Téléphone de l\'utilisateur connecté:', telephone);
    
    // Validation
    if (!formData.provinceAdministrative || !formData.provinceEducationnelle || 
        !formData.chefLieuProved || !formData.emailProfessionnel || 
        !formData.telephone || !formData.directeurProvincial || !formData.motDePasse) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      setLoading(true);
      
      // Préparer les données avec le préfixe +243 pour le téléphone
      const dataToSend = {
        ...formData,
        telephone: `+243${formData.telephone}` // Ajouter le préfixe +243
      };
      
      console.log('🔍 Données à envoyer:', dataToSend);
      
      const result = await dispatch(createUser({ 
        route: 'identification-proved', 
        data: dataToSend 
      })).unwrap();
      
      console.log('🔍 Résultat création:', result);
      toast.success('Utilisateur créé avec succès!');
      
      // Redirection vers la page d'affichage des utilisateurs
      setTimeout(() => {
        navigate('/users');
      }, 1500); // Attendre 1.5 secondes pour que l'utilisateur voie le message de succès
      
      // Reset form
      setFormData({
        id: '',
        motDePasse: '',
        provinceAdministrative: '',
        provinceEducationnelle: '',
        chefLieuProved: '',
        emailProfessionnel: '',
        telephone: '',
        statutOccupation: 'Propriétaire',
        nombreTerritoires: 0,
        nombreSousDivisions: 0,
        directeurProvincial: '',
        isActive: true, // Par défaut activé
      });
      
    } catch (error: any) {
      console.error('🔍 Erreur création utilisateur:', error);
      console.error('🔍 Message d\'erreur:', error.message);
      console.error('🔍 Status:', error.response?.status);
      console.error('🔍 Data d\'erreur:', error.response?.data);
      
      // Afficher le message d'erreur de l'API
      let errorMessage = 'Erreur lors de la création de l\'utilisateur';
      
      // Gestion des erreurs de validation de l'API
      if (error.response?.data && typeof error.response.data === 'object') {
        const apiErrors = error.response.data;
        console.log('🔍 Erreurs de validation API:', apiErrors);
        
        // Si c'est un objet avec des erreurs de validation
        if (Object.keys(apiErrors).length > 0) {
          // Afficher la première erreur dans le toast
          const firstError = Object.values(apiErrors)[0];
          errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
          
          // Afficher toutes les erreurs dans la console
          console.log('🔍 Toutes les erreurs de validation:');
          Object.entries(apiErrors).forEach(([field, message]) => {
            console.log(`  - ${field}: ${message}`);
          });
          
          // Afficher les erreurs dans l'interface
          setErrorMessage(`Erreurs de validation: ${Object.values(apiErrors).join(', ')}`);
        } else if (apiErrors.message) {
          errorMessage = apiErrors.message;
        } else if (apiErrors.error) {
          errorMessage = apiErrors.error;
        }
      } else if (error.response?.data?.message) {
        // Message direct de l'API
        errorMessage = error.response.data.message;
        console.log('🔍 Message API:', error.response.data.message);
      } else if (error.response?.data?.error) {
        // Autre format possible
        errorMessage = error.response.data.error;
        console.log('🔍 Error API:', error.response.data.error);
      } else if (error.response?.data) {
        // Si c'est une string directe
        errorMessage = typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data);
        console.log('🔍 Data API:', error.response.data);
      } else if (error.message) {
        // Message d'erreur générique
        errorMessage = error.message;
        console.log('🔍 Message générique:', error.message);
      }
      
      // Afficher le message dans un toast et dans la console
      console.log('🔍 Message d\'erreur final:', errorMessage);
      toast.error(errorMessage);
      
      // Afficher aussi dans l'interface
      setErrorMessage(errorMessage);
      
      // Nettoyer le message d'erreur après 10 secondes
      setTimeout(() => {
        setErrorMessage('');
      }, 10000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Créer un Utilisateur" />
        
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Informations de l'utilisateur
            </h3>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6.5">
            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Province Administrative <span className="text-red-500">*</span>
              </label>
              <div className="relative province-dropdown">
                <input
                  type="text"
                  placeholder="Rechercher une province..."
                  value={searchAdmin}
                  onChange={(e) => setSearchAdmin(e.target.value)}
                  onFocus={() => setShowAdminDropdown(true)}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
                {showAdminDropdown && (
                  <div className="absolute z-50 w-full mt-1 bg-white dark:bg-boxdark border border-stroke dark:border-strokedark rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredAdminProvinces.length > 0 ? (
                      filteredAdminProvinces.map((province, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-meta-4 cursor-pointer"
                          onClick={() => {
                            handleInputChange('provinceAdministrative', province);
                            setSearchAdmin(province);
                            setShowAdminDropdown(false);
                          }}
                        >
                          {province}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-500">Aucune province trouvée</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Province Educationnelle <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Entrez la province educationnelle"
                value={formData.provinceEducationnelle}
                onChange={(e) => handleInputChange('provinceEducationnelle', e.target.value)}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>

            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Chef Lieu PROVED <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Entrez le chef lieu PROVED"
                value={formData.chefLieuProved}
                onChange={(e) => handleInputChange('chefLieuProved', e.target.value)}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>

            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Email Professionnel <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="Entrez l'email professionnel"
                value={formData.emailProfessionnel}
                onChange={(e) => handleInputChange('emailProfessionnel', e.target.value)}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>

            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Téléphone <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-l-md border-r border-gray-200 dark:border-gray-600 z-10">
                  <span className="text-xl mr-2">🇨🇩</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">+243</span>
                </div>
                <input
                  type="tel"
                  placeholder="Entrez le numéro de téléphone"
                  value={formData.telephone}
                  onChange={(e) => {
                    // N'accepter que les chiffres
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    handleInputChange('telephone', value);
                  }}
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-24 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
            </div>

            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Statut d'Occupation
              </label>
              <select
                value={formData.statutOccupation}
                onChange={(e) => handleInputChange('statutOccupation', e.target.value)}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              >
                <option value="Propriétaire">Propriétaire</option>
                <option value="Locataire">Locataire</option>
              </select>
            </div>

            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Nombre de Territoires
              </label>
              <input
                type="number"
                placeholder="0"
                value={formData.nombreTerritoires}
                onChange={(e) => handleInputChange('nombreTerritoires', parseInt(e.target.value) || 0)}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>

            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Nombre de Sous-Divisions
              </label>
              <input
                type="number"
                placeholder="0"
                value={formData.nombreSousDivisions}
                onChange={(e) => handleInputChange('nombreSousDivisions', parseInt(e.target.value) || 0)}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>

            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Directeur Provincial <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Entrez le nom du directeur provincial"
                value={formData.directeurProvincial}
                onChange={(e) => handleInputChange('directeurProvincial', e.target.value)}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>

            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Mot de Passe <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Entrez le mot de passe"
                  value={formData.motDePasse}
                  onChange={(e) => handleInputChange('motDePasse', e.target.value)}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 pr-12 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="mb-4.5 text-red-500">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 disabled:opacity-50"
            >
              {loading ? 'Création en cours...' : 'Créer l\'utilisateur'}
            </button>
          </form>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default CreateUser;
