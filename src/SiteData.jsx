import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import publishedProducts from './data/products.json';

export const backendEnabled = import.meta.env.DEV || import.meta.env.VITE_API_ENABLED === 'true';

const DataContext = createContext(null);
export async function api(path, input, method = 'POST') {
  const response = await fetch(`/api${path}`, input === undefined ? undefined : { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input) });
  const value = await response.json();
  if (!response.ok) throw new Error(value.error || 'Request failed');
  return value;
}
export function SiteData({ children }) {
  const [products, setProducts] = useState(backendEnabled ? [] : publishedProducts);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(backendEnabled);
  const [error, setError] = useState('');
  const refresh = useCallback(async () => {
    if (!backendEnabled) { setProducts(publishedProducts); setUser(null); return; }
    const [items, account] = await Promise.all([api('/products'), api('/me')]);
    setProducts(items); setUser(account.user); setError('');
  }, []);
  useEffect(() => {
    refresh().catch(() => setError('Не удалось подключиться к базе / Database unavailable / Дерекқор қолжетімсіз')).finally(() => setLoading(false));
  }, [refresh]);
  return <DataContext.Provider value={{ products, user, setUser, loading, error, refresh }}>{children}</DataContext.Provider>;
}
export function useSiteData() { return useContext(DataContext); }
