import { useCallback } from "react";

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

const useFormHandlers = <T extends Record<string, any>>(
  setFormData: SetState<T>
) => {
  const handleChange = useCallback(
    <K extends keyof T>(key: K, value: T[K]) => {
      setFormData((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    [setFormData]
  );

  return { handleChange };
};

export default useFormHandlers;