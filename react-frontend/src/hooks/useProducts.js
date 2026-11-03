import { useCallback, useEffect, useState } from "react";
import { getProducts } from "../api/product";

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getProducts();
      setProducts(response.data.data || []);
      setLastUpdated(new Date());
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to load products. Please try again.";
      console.error("Failed to load products", err);
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, lastUpdated, refetch: fetchProducts };
}
