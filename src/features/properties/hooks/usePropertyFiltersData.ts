import { useEffect, useState } from "react";
import {
  getPropertyCharacteristics,
  getPropertyTypes,
  type PropertyCharacteristic,
  type PropertyType,
} from "../services/formService";

type FiltersData = {
  propertyTypes: PropertyType[];
  characteristics: PropertyCharacteristic[];
  loading: boolean;
  error: string | null;
};

export const usePropertyFiltersData = (): FiltersData => {
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [characteristics, setCharacteristics] = useState<PropertyCharacteristic[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [types, chars] = await Promise.all([
          getPropertyTypes(),
          getPropertyCharacteristics(),
        ]);
        if (!isMounted) return;
        setPropertyTypes(types);
        setCharacteristics(chars);
      } catch (err) {
        console.error("Error fetching form data:", err);
        if (!isMounted) return;
        setError("No se pudieron cargar los datos.");
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  return { propertyTypes, characteristics, loading, error };
};
