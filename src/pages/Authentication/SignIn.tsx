import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoDark from '../../images/icon/Logo-gouv_MINED-NC.png';
import Logo from '../../images/icon/Logo-gouv_MINED-NC_Blanc.png';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../app/store';
import { loginUser } from '../../features/users/usersSlice';

const SignIn: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false); // Nouvel état pour gérer le loader
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem('email');
    const password = localStorage.getItem('password');

    if (email && password) {
      navigate('/tableaubord');
      window.location.reload();
    }
  }, [navigate]);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); 
    let data: object = {
      email: email,
      password: password,
    };
  
    try {
      const result = await dispatch(loginUser({ route: 'login', data })).unwrap();
      console.log('Login successful!', result);
      setIsLoading(false);
      localStorage.setItem('email', email);
      localStorage.setItem('password', password);
      localStorage.setItem('token', result.token);
      localStorage.setItem('data', JSON.stringify(result.data));
      navigate('/tableaubord');
      window.location.reload(); // Stops the loader after success
    } catch (err) {
      console.error('Login failed:', err);
      setIsLoading(false); // Stops the loader on failure
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
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Entrer votre adresse email"
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="Au moins 6 caractères, dont une majuscule"
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>

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
