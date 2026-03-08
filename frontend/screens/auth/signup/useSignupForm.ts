import { useState } from 'react';
import { CreateUserForm } from 'types/User';
import { validateEmail, validateSignup } from 'utils/validators';


export const useSignupForm = (role: CreateUserForm['role']) => {
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<CreateUserForm>({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role,
    departmentId: undefined,
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof CreateUserForm, string>>>({});

  const handleChange = (field: keyof CreateUserForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    setFormErrors((prev) => ({
      ...prev,
      [field]: '',
    }));

    if (field === 'email' && value.length > 0 && !validateEmail(value)) {
      setFormErrors((prev) => ({
        ...prev,
        email: 'Invalid email address',
      }));
    }
  };

  const validateForm = () => {
    const errors = validateSignup(role, formData);
    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  return {
    formData,
    formErrors,
    isLoading,
    setIsLoading,
    handleChange,
    validateForm,
  };
};
