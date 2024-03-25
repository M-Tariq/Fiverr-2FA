import React from 'react';
import { useFormContext } from 'react-hook-form';

type FormInputProps = {
  label: string;
  name: string;
  type?: string;
};

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  type = 'text',
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <div className=''>
      <input
        type={type}
        placeholder={label}
        className='block w-full rounded-2xl appearance-none focus:outline-none py-4 px-4'
        {...register(name)}
      />
      {errors[name] && (
        <span className='text-red-500 text-xs pt-1 block'>
          {errors[name]?.message as string}
        </span>
      )}
    </div>
  );
};

export default FormInput;
