import { useEffect, useState } from "react";
import axios from "axios";

/**
 *
 * @param {AxiosRequestConfig} request
 * @returns
 */
export default function useFetch(request) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const { data } = await axios(request);
        setData(data);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { isLoading, data, error };
}
