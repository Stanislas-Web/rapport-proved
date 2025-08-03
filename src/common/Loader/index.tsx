

import logo from '../../images/icon/Logo-gouv_MINED-NC.png';

import { useEffect, useState } from 'react';

const Loader = () => {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 10000); // La splash screen disparaît après 3 secondes

    return () => clearTimeout(timer);
  }, []);

  if (!showLoader) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="relative">
        <img
          src={logo} // Remplacez par le chemin vers votre logo
          alt="Logo"
          className="h-20 object-cover w-80 animate-logo"
        />
        {/* <div className="absolute inset-0 animate-pulse border-4 border-primary rounded-full"></div> */}
      </div>
    </div>
  );
}
export default Loader;
