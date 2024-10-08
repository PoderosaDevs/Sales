// src/hooks/useNavigation.ts
import { useNavigate } from "react-router-dom";

export const useNavigation = () => {
  const navigate = useNavigate();
  return (path: string) => {
    navigate(path);
  };
};
