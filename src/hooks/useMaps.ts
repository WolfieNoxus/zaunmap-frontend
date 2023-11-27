import { useEffect, useState } from "react";
import mapService from "../services/mapService";
import { CanceledError } from "axios";
import IMap from "../Interfaces/IMap";

const useMaps = () => {
  const [maps, setMaps] = useState<IMap[]>([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    const { request, cancel } = mapService.getAll<IMap>();
    request
      .then((res) => {
        setMaps(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        setLoading(false);
      });

    return () => cancel();
  }, []);

  return { maps, error, isLoading, setMaps, setError };
};

export default useMaps;
