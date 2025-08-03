import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../app/store';
import { changeVisibility } from '../../../features/sousdirection/sousDirectionSlice';

const CheckboxDirection = () => {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const { roleDirection } = useSelector((state: RootState) => state.direction);

  return (
    <div>
      <label
        htmlFor="checkboxLabelFour"
        className="flex cursor-pointer select-none items-center"
      >
        <div className="relative">
          <input
            type="checkbox"
            id="checkboxLabelFour"
            className="sr-only"
            onChange={() => {
              setIsChecked(!isChecked);
              dispatch(changeVisibility(!isChecked));
            }}
          />
          <div
            className={`mr-4 flex h-5 w-5 items-center justify-center rounded-full border ${
              isChecked && 'border-primary'
            }`}
          >
            <span
              className={`h-2.5 w-2.5 rounded-full bg-transparent ${
                isChecked && '!bg-primary'
              }`}
            >
              {' '}
            </span>
          </div>
        </div>
        { roleDirection.includes('Inspecteur') ?'Votre poste est-il au sein de la sous inspection provinciale ou territoriale':'Votre poste est-il au sein de la sous-division éducative ?'}
        
      </label>
    </div>
  );
};

export default CheckboxDirection;



