import useFetchData from "hooks/useFetchData";
import { createContext, ReactNode, useContext } from "react";
import { IClass } from "types/class";
import { ApiResponse } from "types/common";

interface ClassContextType {
  data?: ApiResponse<IClass[]> | null;
  loading: boolean;
  error: unknown;
  refetchData: () => void;
}

const ClassContext = createContext<ClassContextType | undefined>(undefined);

export const ClassProvider = ({ children }: { children: ReactNode }) => {
  const { data, loading, error, refetchData } =
    useFetchData<ApiResponse<IClass[]>>("class");

  return (
    <ClassContext.Provider value={{ data, loading, error, refetchData }}>
      {children}
    </ClassContext.Provider>
  );
};

export const useClassContext = () => {
  const context = useContext(ClassContext);

  if (!context) {
    throw new Error("useClassContext must be used within a ClassProvider");
  }

  return context;
};