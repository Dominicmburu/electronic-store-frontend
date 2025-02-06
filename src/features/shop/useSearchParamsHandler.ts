import { useSearchParams } from 'react-router-dom';

export const useSearchParamsHandler = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateSearchParams = (params: { [key: string]: string }) => {
    const newParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      value ? newParams.set(key, value) : newParams.delete(key);
    });
    setSearchParams(newParams);
  };

  return { updateSearchParams };
};