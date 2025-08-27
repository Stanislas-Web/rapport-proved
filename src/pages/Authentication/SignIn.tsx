import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoDark from '../../images/icon/Logo-gouv_MINED-NC.png';
import Logo from '../../images/icon/Logo-gouv_MINED-NC_Blanc.png';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../app/store';
import { loginUser } from '../../features/users/usersSlice';

const SignIn: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [telephone, setTelephone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false); // État pour gérer la visibilité du mot de passe
  const [isLoading, setIsLoading] = useState<boolean>(false); // Nouvel état pour gérer le loader
  const [errorMessage, setErrorMessage] = useState<string>(''); // État pour gérer les messages d'erreur
  const navigate = useNavigate();

  useEffect(() => {
    const telephone = localStorage.getItem('telephone');
    const password = localStorage.getItem('password');

    if (telephone && password) {
      navigate('/tableaubord');
      window.location.reload();
    }
  }, [navigate]);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(''); // Réinitialise le message d'erreur
    let data: object = {
      identifier:"+243" + telephone,
      motDePasse: password,
    };
  
    try {
      const result = await dispatch(loginUser({ route: 'proved/login', data })).unwrap();
      console.log('Login successful!', result);
      console.log('User data:', result.data);
      console.log('User data keys:', Object.keys(result.data));
      console.log('Role:', result.data.role);
      console.log('Nom:', result.data.nom);
      console.log('Prenom:', result.data.prenom);
      setIsLoading(false);
      localStorage.setItem('telephone', telephone);
      localStorage.setItem('password', password);
      localStorage.setItem('token', result.token);
      localStorage.setItem('data', JSON.stringify(result.data));
      navigate('/tableaubord');
      window.location.reload(); // Stops the loader after success
    } catch (err) {
      console.error('Login failed:', err);
      setIsLoading(false); // Stops the loader on failure
      setErrorMessage('Numéro de téléphone ou mot de passe incorrect. Veuillez réessayer.');
    }
  };
  

  return (
    <>
      <div className="rounded-sm border border-stroke bg-white shadow-default mt-16 md:mx-26 dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center">
          <div className="hidden w-full xl:block xl:w-1/2">
            <div className="py-17.5 px-26 text-center">
              <Link className="mb-5.5 inline-block" to="/">
                <img className="hidden dark:block w-96" src={Logo} alt="Logo" />
                <img className="dark:hidden w-96" src={LogoDark} alt="Logo" />
              </Link>
            </div>
          </div>

          <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Connexion
              </h2>

              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Numéro de téléphone
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-l-md border-r border-gray-200 dark:border-gray-600 z-10">
                      <span className="text-xl mr-2">🇨🇩</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">+243</span>
                    </div>
                    <input
                      type="tel"
                      placeholder="Entrer votre numéro de téléphone"
                      onChange={(e) => setTelephone(e.target.value)}
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-24 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Au moins 6 caractères, dont une majuscule"
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-12 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
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

                {/* Affichage du message d'erreur */}
                {errorMessage && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {errorMessage}
                  </div>
                )}

                <div className="mb-5">
                  <button
                    type="submit"
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                    disabled={isLoading} // Désactive le bouton pendant le chargement
                  >
                    {isLoading ? (
                      <svg
                        className="animate-spin h-5 w-5 mx-auto"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        ></path>
                      </svg>
                    ) : (
                      'Connexion'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
