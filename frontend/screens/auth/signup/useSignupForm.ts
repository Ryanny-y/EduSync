import { useState } from 'react';
import { CreateUserForm } from 'types/User';
import { validateEmail, validateSignup } from 'utils/validators';

type Message = {
  type: 'success' | 'error';
  text: string;
};

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
    department: '',
  });

  const [formErrors, setFormErrors] =
    useState<Partial<Record<keyof CreateUserForm, string>>>({});

  const [message, setMessage] = useState<Message | null>(null);

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
    const errors = validateSignup(formData);
    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const resetMessage = () => setMessage(null);

  return {
    formData,
    formErrors,
    message,
    isLoading,
    setIsLoading,
    setMessage,
    handleChange,
    validateForm,
    resetMessage,
  };
};