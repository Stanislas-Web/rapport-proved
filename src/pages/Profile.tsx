import { useState, useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import UsersService from '../services/users/usersservice';
import toast from 'react-hot-toast';

interface UserProfile {
  _id?: string;
  role?: string;
  provinceAdministrative?: string;
  provinceEducationnelle?: string;
  chefLieuProved?: string;
  emailProfessionnel?: string;
  telephone?: string;
  statutOccupation?: string;
  nombreTerritoires?: number;
  nombreSousDivisions?: number;
  directeurProvincial?: string;
  isActive?: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  // Champs supplémentaires pour le formulaire
  password?: string;
}

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserProfile>({});
  const [formData, setFormData] = useState<UserProfile>({});

  useEffect(() => {
    // Vérifier le token d'authentification
    const token = localStorage.getItem('token');
    console.log('🔍 Token au chargement:', token);
    console.log('🔍 Token type:', typeof token);
    console.log('🔍 Token length:', token?.length);
    console.log('🔍 Tous les éléments localStorage:', {
      token: localStorage.getItem('token'),
      data: localStorage.getItem('data'),
      telephone: localStorage.getItem('telephone'),
      password: localStorage.getItem('password')
    });
    
    if (!token) {
      toast.error('Token d\'authentification manquant. Veuillez vous reconnecter.');
      return;
    }
    
    // Récupérer les données utilisateur depuis localStorage
    const storedData = localStorage.getItem('data');
    
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        console.log('🔍 Données utilisateur récupérées:', parsedData);
        setUserData(parsedData);
        setFormData(parsedData);
      } catch (error) {
        console.error('Erreur lors du parsing des données utilisateur:', error);
      }
    } else {
      console.log('Aucune donnée utilisateur trouvée dans localStorage');
      toast.error('Données utilisateur non trouvées. Veuillez vous reconnecter.');
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔍 Données utilisateur:', userData);
    console.log('🔍 ID utilisateur:', userData._id);
    
    // Vérifier le token
    const token = localStorage.getItem('token');
    console.log('🔍 Token avant soumission:', token);
    console.log('🔍 Token type:', typeof token);
    console.log('🔍 Token length:', token?.length);
    console.log('🔍 Token starts with Bearer:', token?.startsWith('Bearer'));
    
    if (!token) {
      toast.error('Token d\'authentification non trouvé. Veuillez vous reconnecter.');
      return;
    }
    
    if (token === 'null' || token === 'undefined' || token.trim() === '') {
      toast.error('Token invalide. Veuillez vous reconnecter.');
      return;
    }
    
    // Vérifier si le token est déjà avec "Bearer"
    if (token.includes('Bearer')) {
      console.log('🔍 Token contient déjà Bearer, format correct');
    } else {
      console.log('🔍 Token sans Bearer, sera ajouté automatiquement');
    }
    
    // Afficher les premiers et derniers caractères du token pour debug
    if (token.length > 10) {
      console.log('🔍 Token preview:', `${token.substring(0, 10)}...${token.substring(token.length - 10)}`);
    } else {
      console.log('🔍 Token complet:', token);
    }
    
    // Essayer de décoder le token JWT pour voir s'il est expiré
    try {
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        console.log('🔍 Token payload:', payload);
        console.log('🔍 Token exp:', new Date(payload.exp * 1000));
        console.log('🔍 Token iat:', new Date(payload.iat * 1000));
        console.log('🔍 Token expiré?', Date.now() > payload.exp * 1000);
      }
    } catch (error) {
      console.log('🔍 Token n\'est pas un JWT valide:', error);
    }
    
    if (!userData._id) {
      toast.error('ID utilisateur non trouvé dans les données');
      return;
    }

    setLoading(true);
    
    try {
      // Préparer les données à envoyer
      const updateData = {
        role: formData.role,
        provinceAdministrative: formData.provinceAdministrative,
        provinceEducationnelle: formData.provinceEducationnelle,
        chefLieuProved: formData.chefLieuProved,
        emailProfessionnel: formData.emailProfessionnel,
        telephone: formData.telephone,
        statutOccupation: formData.statutOccupation,
        nombreTerritoires: formData.nombreTerritoires,
        nombreSousDivisions: formData.nombreSousDivisions,
        directeurProvincial: formData.directeurProvincial,
        isActive: formData.isActive
      };

      // Si un nouveau mot de passe est fourni, l'inclure
      if (formData.password && formData.password.trim() !== '') {
        (updateData as any).motDePasse = formData.password;
      }

      console.log('🔍 Données à envoyer:', updateData);
      console.log('🔍 ID utilisé:', userData._id);

      const response = await UsersService.updateUser(userData._id, updateData);
      console.log('🔍 Réponse API:', response);
      
      // Mettre à jour les données dans localStorage
      const updatedUserData = { ...userData, ...formData };
      localStorage.setItem('data', JSON.stringify(updatedUserData));
      setUserData(updatedUserData);
      
      toast.success('Profil mis à jour avec succès');
      
    } catch (error: any) {
      console.error('🔍 Erreur complète:', error);
      console.error('🔍 Message d\'erreur:', error.message);
      console.error('🔍 Status:', error.response?.status);
      console.error('🔍 Data d\'erreur:', error.response?.data);
      
      // Afficher un message d'erreur plus spécifique
      if (error.response?.status === 404) {
        toast.error('Utilisateur non trouvé sur le serveur');
      } else if (error.response?.status === 401) {
        toast.error('Non autorisé - Token invalide');
      } else if (error.response?.status === 403) {
        toast.error('Accès interdit');
      } else {
        toast.error(error.message || 'Erreur lors de la mise à jour du profil');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Modifier le profil" />

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        {/* Formulaire de modification du profil */}
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Informations personnelles
              </h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6.5">
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Directeur Provincial
                  </label>
                  <input
                    type="text"
                    name="directeurProvincial"
                    value={formData.directeurProvincial || ''}
                    onChange={handleInputChange}
                    placeholder="Entrez le nom du directeur provincial"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Email Professionnel
                  </label>
                  <input
                    type="email"
                    name="emailProfessionnel"
                    value={formData.emailProfessionnel || ''}
                    onChange={handleInputChange}
                    placeholder="Entrez votre email professionnel"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="telephone"
                    value={formData.telephone || ''}
                    onChange={handleInputChange}
                    placeholder="Entrez votre numéro de téléphone"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Nouveau mot de passe (optionnel)
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password || ''}
                    onChange={handleInputChange}
                    placeholder="Laissez vide pour ne pas changer"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Province Administrative
                  </label>
                  <input
                    type="text"
                    name="provinceAdministrative"
                    value={formData.provinceAdministrative || ''}
                    onChange={handleInputChange}
                    placeholder="Entrez la province administrative"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Province Éducationnelle
            </label>
                  <input
                    type="text"
                    name="provinceEducationnelle"
                    value={formData.provinceEducationnelle || ''}
                    onChange={handleInputChange}
                    placeholder="Entrez la province éducationnelle"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
          </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Chef Lieu PROVED
                  </label>
                  <input
                    type="text"
                    name="chefLieuProved"
                    value={formData.chefLieuProved || ''}
                    onChange={handleInputChange}
                    placeholder="Entrez le chef lieu PROVED"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
        </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Statut Occupation
                  </label>
                  <input
                    type="text"
                    name="statutOccupation"
                    value={formData.statutOccupation || ''}
                    onChange={handleInputChange}
                    placeholder="Entrez le statut d'occupation"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Nombre de Territoires
                  </label>
                  <input
                    type="number"
                    name="nombreTerritoires"
                    value={formData.nombreTerritoires || ''}
                    onChange={handleInputChange}
                    placeholder="Entrez le nombre de territoires"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Nombre de Sous-divisions
                  </label>
                <input
                    type="number"
                    name="nombreSousDivisions"
                    value={formData.nombreSousDivisions || ''}
                    onChange={handleInputChange}
                    placeholder="Entrez le nombre de sous-divisions"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div className="mb-6">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Statut du compte
              </label>
                  <select
                    name="isActive"
                    value={formData.isActive ? 'true' : 'false'}
                    onChange={handleInputChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  >
                    <option value="true">Actif</option>
                    <option value="false">Inactif</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 disabled:opacity-50"
                >
                  {loading ? 'Mise à jour...' : 'Mettre à jour le profil'}
                </button>
            </div>
            </form>
          </div>
        </div>

        {/* Informations de profil en lecture seule */}
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Informations système
            </h3>
            </div>
            <div className="p-6.5">
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  ID Utilisateur
                </label>
                <input
                  type="text"
                  value={userData._id || 'Non défini'}
                  disabled
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Rôle
                </label>
                <input
                  type="text"
                  value={userData.role || 'Non défini'}
                  disabled
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Statut du compte
                </label>
                <input
                  type="text"
                  value={userData.isActive ? 'Actif' : 'Inactif'}
                  disabled
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
            </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Date de création
                </label>
                <input
                  type="text"
                  value={userData.createdAt ? new Date(userData.createdAt).toLocaleDateString('fr-FR') : 'Non défini'}
                  disabled
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
            </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Dernière mise à jour
                </label>
                <input
                  type="text"
                  value={userData.updatedAt ? new Date(userData.updatedAt).toLocaleDateString('fr-FR') : 'Non défini'}
                  disabled
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
