export const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePassword = (pass: string) => {
  const hasNumber = /\d/.test(pass);
  const hasUpper = /[A-Z]/.test(pass);
  const isLongEnough = pass.length >= 8;
  return { hasNumber, hasUpper, isLongEnough };
};
