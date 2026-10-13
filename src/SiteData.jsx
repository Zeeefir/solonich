/* eslint-disable react-refresh/only-export-components -- Context helpers share this provider module. */
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import publishedProducts from './data/products.json';
import { cloud, cloudEnabled, cloudApi } from './cloud';

export const backendEnabled = cloudEnabled || import.meta.env.DEV || import.meta.env.VITE_API_ENABLED === 'true';

const DataContext = createContext(null);
export async function api(path, input, method = 'POST') {
  if (cloudEnabled) return cloudApi(path,input,method);
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
    if (!backendEnabled) return;
    const [items, account] = await Promise.all([api('/products'), api('/me')]);
    setProducts(items); setUser(account.user); setError('');
  }, []);
  useEffect(() => {
    let active=true;
    if(backendEnabled) Promise.all([api('/products'),api('/me')]).then(([items,account])=>{
      if(active){setProducts(items);setUser(account.user);setError('');}
    }).catch(()=>{if(active)setError('Не удалось подключиться к базе / Database unavailable / Дерекқор қолжетімсіз');}).finally(()=>{if(active)setLoading(false);});
    return()=>{active=false;};
  }, []);
  useEffect(() => {
    if (!cloud) return;
    const {data:{subscription}} = cloud.auth.onAuthStateChange(() => {
      // Run outside the auth callback to avoid locking the SDK's auth storage.
      setTimeout(() => { refresh().catch(() => setUser(null)); },0);
    });
    return () => subscription.unsubscribe();
  },[refresh]);
  return <DataContext.Provider value={{ products, user, setUser, loading, error, refresh }}>{children}</DataContext.Provider>;
}
export function useSiteData() { return useContext(DataContext); }
