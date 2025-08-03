import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select, { SingleValue } from 'react-select';
import { AppDispatch, RootState } from '../../../app/store';
import { updateUserField } from '../../../features/users/usersSlice';
import { Direction } from '../../../types/direction';
import { setRole, setSliceDirection } from '../../../features/directions/directionSlice';
import { setSliceSousDirection } from '../../../features/sousdirection/sousDirectionSlice';
import { setSliceService } from '../../../features/servicedirection/servicedirectionSlice';

const CustomSelect: React.FC<CustomSelectProps> = ({ data, title, placeholder }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedOption, setSelectedOption] = useState<SingleValue<{ value: string; label: string }>>(null);
  const { validationErrors, user } = useSelector((state: RootState) => state.users);
  const { cacheDirections } = useSelector((state: RootState) => state.direction);
  const { cacheSousDirections } = useSelector((state: RootState) => state.sousDirections);
  const { serviceDirection } = useSelector((state: RootState) => state.services);
  const { serviceSousDirection } = useSelector((state: RootState) => state.services);

  const changeTextSelected = (selected: SingleValue<{ value: string; label: string }>) => {
    setSelectedOption(selected);

    if (!selected) {
      console.log("Aucune option sélectionnée");
      return;
    }

    const cleanDirection = () => {
      dispatch(updateUserField({ field: 'direction', value: '' }));
      dispatch(updateUserField({ field: 'sousDirection', value: '' }));
      dispatch(updateUserField({ field: 'service', value: '' }));
    };

    const cleanSousDirection = () => {
      dispatch(updateUserField({ field: 'sousDirection', value: '' }));
      dispatch(updateUserField({ field: 'service', value: '' }));
    }

    const cleanService = () => {
      dispatch(updateUserField({ field: 'service', value: '' }));
    }

    switch (title) {
      case 'Rôle':
        dispatch(updateUserField({ field: 'role', value: selected.value }));
        dispatch(setRole(selected.value));
        break;
      case 'Province':
        cleanDirection();
        dispatch(updateUserField({ field: 'province', value: selected.value }));
        const filterDirection = cacheDirections.filter((e: any) => e.idProvince._id === selected.value);
        const formattedDirections = filterDirection.map((direction: Direction) => ({
          value: direction._id,
          label: direction.nom,
        }));

        dispatch(setSliceDirection(formattedDirections));

        break;

      case 'Direction':
      case 'PROVED':
      case 'Inspection Provinciale':

        cleanSousDirection();
        dispatch(updateUserField({ field: 'direction', value: selected.value }));

        const filterSousDirection = cacheSousDirections.filter((e: any) => e.idDirection._id === selected.value);
        const formattedSousDirections = filterSousDirection.map((sousDirection: Direction) => ({
          value: sousDirection._id,
          label: sousDirection.nom,
        }));

        dispatch(setSliceSousDirection(formattedSousDirections));

        const filterServiceDirection = serviceDirection.filter((e: any) => e.idDirection._id === selected.value);
        const formattedServiceDirections = filterServiceDirection.map((ServiceDirection: Direction) => ({
          value: ServiceDirection._id,
          label: ServiceDirection.nom,
        }));

        dispatch(setSliceService(formattedServiceDirections));
        break;
      case 'Sous-direction':
      case 'SOUS-DIVISION':
      case 'Sous Inspection Provinciale ou Territoriale':

        cleanService();

        dispatch(updateUserField({ field: 'sousDirection', value: selected.value }));

        const filterServiceSousDirection = serviceSousDirection.filter((e: any) => e.idSousDirection._id === selected.value);
        const formattedServiceSousDirections = filterServiceSousDirection.map((ServiceSousDirection: Direction) => ({
          value: ServiceSousDirection._id,
          label: ServiceSousDirection.nom,
        }));

        dispatch(setSliceService(formattedServiceSousDirections));
        break;

      case 'Service':
        dispatch(updateUserField({ field: 'service', value: selected.value }));
        break;
      default:
        console.log("Titre non reconnu:", title);
    }
  };

  // Map title to corresponding error field in validationErrors
  const errorMessages: { [key: string]: string | undefined } = {
    'Rôle': validationErrors.role,
    'Province': validationErrors.province,
    'Direction': validationErrors.direction,
    'Service': validationErrors.service,
  };

  const hasError = !!errorMessages[title];


  useEffect(() => {
    const resetSelectedOption = () => {
      const userFieldValue = (() => {
        switch (title) {
          case 'Rôle': return user.role;
          case 'Province': return user.province;
          case 'Direction': case 'PROVED': case 'Inspection Provinciale': return user.direction;
          case 'Sous-direction': case 'SOUS-DIVISION': case 'Sous Inspection Provinciale ou Territoriale': return user.sousDirection;
          case 'Service': return user.service;
          default: return null;
        }
      })();

      if (userFieldValue !== selectedOption?.value) {
        setSelectedOption(userFieldValue ? { value: userFieldValue, label: userFieldValue } : null);
      }
    };

    resetSelectedOption();
  }, [user, title, selectedOption]);


  return (
    <div>
      <label className="mb-3 block text-black dark:text-white">
        {title}
      </label>

      <div className={`border rounded ${hasError ? 'border-red-500' : 'border-stroke dark:border-form-strokedark'}`}>
        <Select
          value={selectedOption}
          onChange={changeTextSelected}
          options={data}
          placeholder={placeholder}
          classNamePrefix="react-select"
          styles={{
            control: (provided) => ({
              ...provided,
              border: 'none',
              boxShadow: 'none',
              minHeight: '48px',
              backgroundColor: 'transparent',
              color: 'inherit',
            }),
            singleValue: (provided) => ({
              ...provided,
              color: 'black',
            }),
            placeholder: (provided) => ({
              ...provided,
              color: 'gray',
            }),
            menu: (provided) => ({
              ...provided,
              backgroundColor: '#fff',
              color: 'black',
            }),
            option: (provided, state) => ({
              ...provided,
              backgroundColor: state.isFocused ? '#F0F0F0' : 'transparent',
              color: state.isSelected ? 'black' : 'gray',
            }),
          }}
        />
      </div>
      {hasError && (
        <span className="text-red-500 text-xs">{errorMessages[title]}</span>
      )}
    </div>
  );
};

export default CustomSelect;
