
import { useEffect, useState } from 'react';
import DropFile from '../../common/Loader/dropfile';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import CustomSelect from '../../components/Forms/SelectGroup/customSelect';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../app/store';
import { Province } from '../../types/province';
import { Direction } from '../../types/direction';
import { ServiceDirection } from '../../types/servicedirection';
import { getAllProvince } from '../../features/province/provinceSlice';
import { getAllDirection } from '../../features/directions/directionSlice';
import { getAllServiceDirections } from '../../features/servicedirection/servicedirectionSlice';
import { createUser, resetUserState, updateFile, updateUserField, updateVisibilityPhoto, validateInputs } from '../../features/users/usersSlice';
import CheckboxDirection from './components/checkBoxDirection';
import { SousDirection } from '../../types/sousdirection';
import { changeVisibility } from '../../features/sousdirection/sousDirectionSlice';
import toast, { Toaster } from 'react-hot-toast';


const CreateUser = () => {

  const { user, validationErrors } = useSelector((state: RootState) => state.users);
  const { visible } = useSelector((state: RootState) => state.sousDirections);

  const dispatch = useDispatch<AppDispatch>();

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [directions, setDirections] = useState<Direction[]>([]);
  const [sousDirections, setSousDirections] = useState<Direction[]>([]);
  const [services, setServices] = useState<ServiceDirection[]>([]);
  const [loading, setLoading] = useState(true);


  const handleBlur = () => {
    dispatch(validateInputs());
  };


  useEffect(() => {
    const fetchProvinces = async () => {
      const email = localStorage.getItem('email');
      const password = localStorage.getItem('password');

      if (email && password) {
        try {
          setLoading(true);
          console.log(loading);
          // Set loading to true before fetching
          const result = await dispatch(getAllProvince({ route: 'provinces' })).unwrap();

          // Format the response
          const formattedProvinces = result.data.map((province: Province) => ({
            value: province._id,
            label: province.nom,
          }));

          setProvinces(formattedProvinces);
        } catch (err) {
          console.error('get all provinces:', err);
        } finally {
          setLoading(false); // Set loading to false once done
        }
      }
    };


    const fetchDirections = async () => {
      const email = localStorage.getItem('email');
      const password = localStorage.getItem('password');

      if (email && password) {
        try {
          setLoading(true); // Set loading to true before fetching
          const result = await dispatch(getAllDirection({ route: 'directions' })).unwrap();

          // Format the response
          const formattedDirections = result.data.map((direction: Direction) => ({
            value: direction._id,
            label: direction.nom,
          }));

          setDirections(formattedDirections);
        } catch (err) {
          console.error('get all directions:', err);
        } finally {
          setLoading(false); // Set loading to false once done
        }
      }
    };

    const fetchSousDirections = async () => {
      const email = localStorage.getItem('email');
      const password = localStorage.getItem('password');

      if (email && password) {
        try {
          setLoading(true);
          const result = await dispatch(getAllDirection({ route: 'sous-directions' })).unwrap();

          const formattedDirections = result.data.map((sousDirection: SousDirection) => ({
            value: sousDirection._id,
            label: sousDirection.nom,
          }));

          setSousDirections(formattedDirections);
        } catch (err) {
          console.error('get all sous directions:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    const fetchServices = async () => {
      const email = localStorage.getItem('email');
      const password = localStorage.getItem('password');

      if (email && password) {
        try {
          setLoading(true);
          const result = await dispatch(getAllServiceDirections({ route: 'services' })).unwrap();

          const formattedServices = result.data.map((service: ServiceDirection) => ({
            value: service._id,
            label: service.nom,
          }));

          setServices(formattedServices);
        } catch (err) {
          console.error('get all directions:', err);
        } finally {
          setLoading(false);
        }
      }
    };
    dispatch(changeVisibility(false));
    dispatch(updateVisibilityPhoto(false));
    dispatch(updateFile(null));
    fetchServices();
    fetchProvinces();
    fetchDirections();
    fetchSousDirections();
  }, [dispatch]);

  const data = [
    { value: 'Administrateur', label: 'Administrateur' },
    { value: 'Utilisateur', label: 'Utilisateur' },
    { value: 'Superviseur', label: 'Superviseur' },
    { value: 'Inspecteur', label: 'Inspecteur' },
    { value: 'Decideur', label: 'Decideur' }
  ];

  const handleSubmit = async () => {
    setLoading(true);
    dispatch(validateInputs());
    const myPromise = new Promise((resolve) => setTimeout(resolve, 1000));

    let dataWithSousDirection: object = {
      "password": "1234",
      "nom": user.nom,
      "postnom": user.postnom,
      "prenom": user.prenom,
      "photo": "string",
      "email": user.email,
      "role": user.role,
      "provinces": user.province,
      "direction": user.direction,
      "sousDirection": user.sousDirection,
      "service": user.service,
      "grade": user.grade,
      "fonction": user.fonction,
      "phone": user.phone,
      "isActive": user.isActive
    }


    let dataWithoutSousDirection: object = {
      "password": "1234",
      "nom": user.nom,
      "postnom": user.postnom,
      "prenom": user.prenom,
      "photo": "string",
      "email": user.email,
      "role": user.role,
      "provinces": user.province,
      "direction": user.direction,
      "service": user.service,
      "grade": user.grade,
      "fonction": user.fonction,
      "phone": user.phone,
      "isActive": user.isActive
    };

    const data: any = (visible === true ? dataWithSousDirection : dataWithoutSousDirection);


    try {
      const result = await dispatch(createUser({ route: 'signup', data })).unwrap();
      console.log('create users successful!', result.data);
      
      dispatch(updateVisibilityPhoto(true));
      toast.promise(myPromise, {
        loading: 'Chargement en cours...',
        success: () => (
          <div>
            <p>Compte utilisateur créé avec succès 🤗!</p>
            <p>Ajouter maintenant la photo</p>
          </div>
        ),
        error: 'Error',
      });

      dispatch(resetUserState());
      dispatch(updateVisibilityPhoto(true));
      dispatch(updateUserField({ field: 'id', value: result.data._id}));
      setLoading(false);

    } catch (err) {
      console.error('erreur data failed:', err);
    }

  };


  return (
    <>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Créer un utilisateur" />
        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="p-7">
                <form action="#">
                  <Toaster
                    position="top-center"
                    reverseOrder={false}
                  />

                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="fullName"
                      >
                        Nom
                      </label>
                      <div className="relative">
                        <span className="absolute left-4.5 top-4">
                          <svg
                            className="fill-current"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g opacity="0.8">
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M3.72039 12.887C4.50179 12.1056 5.5616 11.6666 6.66667 11.6666H13.3333C14.4384 11.6666 15.4982 12.1056 16.2796 12.887C17.061 13.6684 17.5 14.7282 17.5 15.8333V17.5C17.5 17.9602 17.1269 18.3333 16.6667 18.3333C16.2064 18.3333 15.8333 17.9602 15.8333 17.5V15.8333C15.8333 15.1703 15.5699 14.5344 15.1011 14.0655C14.6323 13.5967 13.9964 13.3333 13.3333 13.3333H6.66667C6.00363 13.3333 5.36774 13.5967 4.8989 14.0655C4.43006 14.5344 4.16667 15.1703 4.16667 15.8333V17.5C4.16667 17.9602 3.79357 18.3333 3.33333 18.3333C2.8731 18.3333 2.5 17.9602 2.5 17.5V15.8333C2.5 14.7282 2.93899 13.6684 3.72039 12.887Z"
                                fill=""
                              />
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M9.99967 3.33329C8.61896 3.33329 7.49967 4.45258 7.49967 5.83329C7.49967 7.214 8.61896 8.33329 9.99967 8.33329C11.3804 8.33329 12.4997 7.214 12.4997 5.83329C12.4997 4.45258 11.3804 3.33329 9.99967 3.33329ZM5.83301 5.83329C5.83301 3.53211 7.69849 1.66663 9.99967 1.66663C12.3009 1.66663 14.1663 3.53211 14.1663 5.83329C14.1663 8.13448 12.3009 9.99996 9.99967 9.99996C7.69849 9.99996 5.83301 8.13448 5.83301 5.83329Z"
                                fill=""
                              />
                            </g>
                          </svg>
                        </span>
                        <input
                          className={`w-full rounded border bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none 
    ${validationErrors.nom ? 'border-red-500 dark:border-red-500' : 'border-stroke dark:border-strokedark'}
    dark:bg-meta-4 dark:text-white dark:focus:border-primary`}
                          type="text"
                          name="nom"
                          id="nom"
                          placeholder="Nom"
                          value={user.nom}
                          onBlur={handleBlur}
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            const value = event.target.value;
                            dispatch(updateUserField({ field: 'nom', value: value.trim() as string }));
                          }}
                        />


                        {validationErrors.nom && <span className="text-red-500 text-xs">{validationErrors.nom}</span>}
                      </div>
                    </div>


                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="fullName"
                      >
                        Postnom
                      </label>
                      <div className="relative">
                        <span className="absolute left-4.5 top-4">
                          <svg
                            className="fill-current"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g opacity="0.8">
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M3.72039 12.887C4.50179 12.1056 5.5616 11.6666 6.66667 11.6666H13.3333C14.4384 11.6666 15.4982 12.1056 16.2796 12.887C17.061 13.6684 17.5 14.7282 17.5 15.8333V17.5C17.5 17.9602 17.1269 18.3333 16.6667 18.3333C16.2064 18.3333 15.8333 17.9602 15.8333 17.5V15.8333C15.8333 15.1703 15.5699 14.5344 15.1011 14.0655C14.6323 13.5967 13.9964 13.3333 13.3333 13.3333H6.66667C6.00363 13.3333 5.36774 13.5967 4.8989 14.0655C4.43006 14.5344 4.16667 15.1703 4.16667 15.8333V17.5C4.16667 17.9602 3.79357 18.3333 3.33333 18.3333C2.8731 18.3333 2.5 17.9602 2.5 17.5V15.8333C2.5 14.7282 2.93899 13.6684 3.72039 12.887Z"
                                fill=""
                              />
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M9.99967 3.33329C8.61896 3.33329 7.49967 4.45258 7.49967 5.83329C7.49967 7.214 8.61896 8.33329 9.99967 8.33329C11.3804 8.33329 12.4997 7.214 12.4997 5.83329C12.4997 4.45258 11.3804 3.33329 9.99967 3.33329ZM5.83301 5.83329C5.83301 3.53211 7.69849 1.66663 9.99967 1.66663C12.3009 1.66663 14.1663 3.53211 14.1663 5.83329C14.1663 8.13448 12.3009 9.99996 9.99967 9.99996C7.69849 9.99996 5.83301 8.13448 5.83301 5.83329Z"
                                fill=""
                              />
                            </g>
                          </svg>
                        </span>
                        <input
                          className={`w-full rounded border bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none 
                            ${validationErrors.postnom ? 'border-red-500 dark:border-red-500' : 'border-stroke dark:border-strokedark'}
                            dark:bg-meta-4 dark:text-white dark:focus:border-primary`}
                          type="text"
                          name="postnom"
                          id="postnom"
                          value={user.postnom}
                          placeholder="Postnom"
                          onBlur={handleBlur}
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            const value = event.target.value;
                            dispatch(updateUserField({ field: 'postnom', value: value.trim() as string }));
                          }}

                        />
                        {validationErrors.postnom && <span className="text-red-500 text-xs">{validationErrors.postnom}</span>}
                      </div>
                    </div>
                  </div>



                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="fullName"
                      >
                        Prénom
                      </label>
                      <div className="relative">
                        <span className="absolute left-4.5 top-4">
                          <svg
                            className="fill-current"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g opacity="0.8">
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M3.72039 12.887C4.50179 12.1056 5.5616 11.6666 6.66667 11.6666H13.3333C14.4384 11.6666 15.4982 12.1056 16.2796 12.887C17.061 13.6684 17.5 14.7282 17.5 15.8333V17.5C17.5 17.9602 17.1269 18.3333 16.6667 18.3333C16.2064 18.3333 15.8333 17.9602 15.8333 17.5V15.8333C15.8333 15.1703 15.5699 14.5344 15.1011 14.0655C14.6323 13.5967 13.9964 13.3333 13.3333 13.3333H6.66667C6.00363 13.3333 5.36774 13.5967 4.8989 14.0655C4.43006 14.5344 4.16667 15.1703 4.16667 15.8333V17.5C4.16667 17.9602 3.79357 18.3333 3.33333 18.3333C2.8731 18.3333 2.5 17.9602 2.5 17.5V15.8333C2.5 14.7282 2.93899 13.6684 3.72039 12.887Z"
                                fill=""
                              />
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M9.99967 3.33329C8.61896 3.33329 7.49967 4.45258 7.49967 5.83329C7.49967 7.214 8.61896 8.33329 9.99967 8.33329C11.3804 8.33329 12.4997 7.214 12.4997 5.83329C12.4997 4.45258 11.3804 3.33329 9.99967 3.33329ZM5.83301 5.83329C5.83301 3.53211 7.69849 1.66663 9.99967 1.66663C12.3009 1.66663 14.1663 3.53211 14.1663 5.83329C14.1663 8.13448 12.3009 9.99996 9.99967 9.99996C7.69849 9.99996 5.83301 8.13448 5.83301 5.83329Z"
                                fill=""
                              />
                            </g>
                          </svg>
                        </span>
                        <input
                          className={`w-full rounded border bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none 
                                                      ${validationErrors.prenom ? 'border-red-500 dark:border-red-500' : 'border-stroke dark:border-strokedark'}
                                                      dark:bg-meta-4 dark:text-white dark:focus:border-primary`}
                          type="text"
                          name="prenom"
                          id="prenom"
                          placeholder="Prénom"
                          value={user.prenom}
                          onBlur={handleBlur}
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            const value = event.target.value; // Extract the input value
                            dispatch(updateUserField({ field: 'prenom', value: value.trim() as string }));
                          }}

                        />
                        {validationErrors.prenom && <span className="text-red-500 text-xs">{validationErrors.prenom}</span>}
                      </div>
                    </div>


                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="phoneNumber"
                      >
                        Téléphone
                      </label>
                      <input
                        className={`w-full rounded border bg-gray py-3 pl-3 pr-4.5 text-black focus:border-primary focus-visible:outline-none 
                                                    ${validationErrors.phone ? 'border-red-500 dark:border-red-500' : 'border-stroke dark:border-strokedark'}
                                                    dark:bg-meta-4 dark:text-white dark:focus:border-primary`}
                        type="text"
                        name="phoneNumber"
                        id="phoneNumber"
                        placeholder="+243826016607"
                        defaultValue=""
                        value={user.phone}
                        onBlur={handleBlur}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                          const value = event.target.value; // Extract the input value
                          dispatch(updateUserField({ field: 'phone', value: value.trim() as string }));
                        }}
                      />
                      {validationErrors.phone && <span className="text-red-500 text-xs">{validationErrors.phone}</span>}
                    </div>
                  </div>


                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emailAddress"
                    >
                      Email
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <svg
                          className="fill-current"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g opacity="0.8">
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M3.33301 4.16667C2.87658 4.16667 2.49967 4.54357 2.49967 5V15C2.49967 15.4564 2.87658 15.8333 3.33301 15.8333H16.6663C17.1228 15.8333 17.4997 15.4564 17.4997 15V5C17.4997 4.54357 17.1228 4.16667 16.6663 4.16667H3.33301ZM0.833008 5C0.833008 3.6231 1.9561 2.5 3.33301 2.5H16.6663C18.0432 2.5 19.1663 3.6231 19.1663 5V15C19.1663 16.3769 18.0432 17.5 16.6663 17.5H3.33301C1.9561 17.5 0.833008 16.3769 0.833008 15V5Z"
                              fill=""
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M0.983719 4.52215C1.24765 4.1451 1.76726 4.05341 2.1443 4.31734L9.99975 9.81615L17.8552 4.31734C18.2322 4.05341 18.7518 4.1451 19.0158 4.52215C19.2797 4.89919 19.188 5.4188 18.811 5.68272L10.4776 11.5161C10.1907 11.7169 9.80879 11.7169 9.52186 11.5161L1.18853 5.68272C0.811486 5.4188 0.719791 4.89919 0.983719 4.52215Z"
                              fill=""
                            />
                          </g>
                        </svg>
                      </span>
                      <input
                        className={`w-full rounded border bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none 
                                                    ${validationErrors.email ? 'border-red-500 dark:border-red-500' : 'border-stroke dark:border-strokedark'}
                                                    dark:bg-meta-4 dark:text-white dark:focus:border-primary`}
                        type="email"
                        name="emailAddress"
                        id="emailAddress"
                        placeholder="exemple@gmail.com"
                        defaultValue=""
                        value={user.email}
                        onBlur={handleBlur}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                          const value = event.target.value; // Extract the input value
                          dispatch(updateUserField({ field: 'email', value: value.trim() as string }));
                        }}
                      />
                      {validationErrors.email && <span className="text-red-500 text-xs">{validationErrors.email}</span>}
                    </div>
                  </div>
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="fullName"
                      >
                        Grade
                      </label>
                      <div className="relative">
                        <span className="absolute left-4.5 top-4">
                          <svg
                            className="fill-current"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g opacity="0.8">
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M3.72039 12.887C4.50179 12.1056 5.5616 11.6666 6.66667 11.6666H13.3333C14.4384 11.6666 15.4982 12.1056 16.2796 12.887C17.061 13.6684 17.5 14.7282 17.5 15.8333V17.5C17.5 17.9602 17.1269 18.3333 16.6667 18.3333C16.2064 18.3333 15.8333 17.9602 15.8333 17.5V15.8333C15.8333 15.1703 15.5699 14.5344 15.1011 14.0655C14.6323 13.5967 13.9964 13.3333 13.3333 13.3333H6.66667C6.00363 13.3333 5.36774 13.5967 4.8989 14.0655C4.43006 14.5344 4.16667 15.1703 4.16667 15.8333V17.5C4.16667 17.9602 3.79357 18.3333 3.33333 18.3333C2.8731 18.3333 2.5 17.9602 2.5 17.5V15.8333C2.5 14.7282 2.93899 13.6684 3.72039 12.887Z"
                                fill=""
                              />
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M9.99967 3.33329C8.61896 3.33329 7.49967 4.45258 7.49967 5.83329C7.49967 7.214 8.61896 8.33329 9.99967 8.33329C11.3804 8.33329 12.4997 7.214 12.4997 5.83329C12.4997 4.45258 11.3804 3.33329 9.99967 3.33329ZM5.83301 5.83329C5.83301 3.53211 7.69849 1.66663 9.99967 1.66663C12.3009 1.66663 14.1663 3.53211 14.1663 5.83329C14.1663 8.13448 12.3009 9.99996 9.99967 9.99996C7.69849 9.99996 5.83301 8.13448 5.83301 5.83329Z"
                                fill=""
                              />
                            </g>
                          </svg>
                        </span>
                        <input
                          className={`w-full rounded border bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none 
    ${validationErrors.grade ? 'border-red-500 dark:border-red-500' : 'border-stroke dark:border-strokedark'}
    dark:bg-meta-4 dark:text-white dark:focus:border-primary`}
                          type="text"
                          name="grade"
                          id="grade"
                          placeholder="Grade"
                          value={user.grade}
                          onBlur={handleBlur}
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            const value = event.target.value;
                            dispatch(updateUserField({ field: 'grade', value: value.trim() as string }));
                          }}
                        />


                        {validationErrors.grade && <span className="text-red-500 text-xs">{validationErrors.grade}</span>}
                      </div>
                    </div>


                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="fullName"
                      >
                        Fonction
                      </label>
                      <div className="relative">
                        <span className="absolute left-4.5 top-4">
                          <svg
                            className="fill-current"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g opacity="0.8">
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M3.72039 12.887C4.50179 12.1056 5.5616 11.6666 6.66667 11.6666H13.3333C14.4384 11.6666 15.4982 12.1056 16.2796 12.887C17.061 13.6684 17.5 14.7282 17.5 15.8333V17.5C17.5 17.9602 17.1269 18.3333 16.6667 18.3333C16.2064 18.3333 15.8333 17.9602 15.8333 17.5V15.8333C15.8333 15.1703 15.5699 14.5344 15.1011 14.0655C14.6323 13.5967 13.9964 13.3333 13.3333 13.3333H6.66667C6.00363 13.3333 5.36774 13.5967 4.8989 14.0655C4.43006 14.5344 4.16667 15.1703 4.16667 15.8333V17.5C4.16667 17.9602 3.79357 18.3333 3.33333 18.3333C2.8731 18.3333 2.5 17.9602 2.5 17.5V15.8333C2.5 14.7282 2.93899 13.6684 3.72039 12.887Z"
                                fill=""
                              />
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M9.99967 3.33329C8.61896 3.33329 7.49967 4.45258 7.49967 5.83329C7.49967 7.214 8.61896 8.33329 9.99967 8.33329C11.3804 8.33329 12.4997 7.214 12.4997 5.83329C12.4997 4.45258 11.3804 3.33329 9.99967 3.33329ZM5.83301 5.83329C5.83301 3.53211 7.69849 1.66663 9.99967 1.66663C12.3009 1.66663 14.1663 3.53211 14.1663 5.83329C14.1663 8.13448 12.3009 9.99996 9.99967 9.99996C7.69849 9.99996 5.83301 8.13448 5.83301 5.83329Z"
                                fill=""
                              />
                            </g>
                          </svg>
                        </span>
                        <input
                          className={`w-full rounded border bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none 
                            ${validationErrors.fonction ? 'border-red-500 dark:border-red-500' : 'border-stroke dark:border-strokedark'}
                            dark:bg-meta-4 dark:text-white dark:focus:border-primary`}
                          type="text"
                          name="fonction"
                          id="fonction"
                          value={user.fonction}
                          placeholder="Fonction"
                          onBlur={handleBlur}
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            const value = event.target.value;
                            dispatch(updateUserField({ field: 'fonction', value: value.trim() as string }));
                          }}

                        />
                        {validationErrors.fonction && <span className="text-red-500 text-xs">{validationErrors.fonction}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="mb-5.5">
                    <CustomSelect
                      title="Rôle"
                      data={data}
                      placeholder='Selectionner un rôle'
                    />
                  </div>

                  <div className="mb-5.5">
                    <CustomSelect
                      title="Province"
                      data={provinces}
                      placeholder='Selectionner la province'
                    />
                  </div>
                  <div className="mb-5.5">
                    <CustomSelect
                      title="Direction"
                      data={directions}
                      placeholder='Selectionner une direction'
                    />
                  </div>
                  <div className="mb-5.5">
                    <CheckboxDirection
                    />
                  </div>
                  {
                    visible && <div className="mb-5.5">
                      <CustomSelect
                        title="Sous-direction"
                        data={sousDirections}
                        placeholder='Selectionner une sous-direction'
                      />
                    </div>
                  }

                  <div className="mb-5.5">
                    <CustomSelect
                      title="Service"
                      data={services}
                      placeholder='Selectionner un service'
                    />
                  </div>



                  {
                    user.visiblePhoto == false ? <div className="flex justify-end gap-4.5">
                      {/* <div onClick={handleSubmit} className="cursor-pointer flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90">
                        Enregistrer
                      </div> */}
                      <button
                    onClick={handleSubmit}
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                    disabled={loading} // Désactive le bouton pendant le chargement
                  >
                    {loading ? (
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
                      'Enregistrer'
                    )}
                  </button>

                    </div> : null
                  }

                </form>
              </div>
            </div>
          </div>
          <div className="col-span-5 xl:col-span-2">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="p-7">
                {
                  user.visiblePhoto ?
                    <DropFile
                      title="Ou glissez-déposez votre photo passeport (PNG, JPG, JPEG)"
                    />
                    : <div>
                      <h1 className='text-center font-medium'>Veuillez d'abord soumettre le formulaire avant d'ajouter une photo.</h1>
                    </div>
                }

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateUser;
