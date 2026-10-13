import { createClient } from '@supabase/supabase-js';

// Publishable keys are intentionally public. Access is enforced by database RLS.
const url = import.meta.env.VITE_SUPABASE_URL || 'https://xukraqoitjpgddhrgmqe.supabase.co';
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_zjtD-J93eUOQXo8o48s-vw_j-3JWHU-';
export const cloudEnabled = Boolean(url && key);
export const cloud = cloudEnabled ? createClient(url, key) : null;
const checked = result => { if (result.error) throw result.error; return result.data; };
async function account() {
 const session = checked(await cloud.auth.getSession())?.session;
 if (!session) return null;
 const authUser = checked(await cloud.auth.getUser())?.user;
 if (!authUser) return null;
 const profile = checked(await cloud.from('profiles').select('name,role').eq('id',authUser.id).single());
 return {id:authUser.id,email:authUser.email,name:profile.name,role:profile.role};
}
export async function cloudApi(path, input, method) {
 if (path === '/me') return {user:await account()};
 if (path === '/login') { checked(await cloud.auth.signInWithPassword({email:input.email,password:input.password})); return {user:await account()}; }
 if (path === '/logout') { checked(await cloud.auth.signOut()); return {ok:true}; }
 if (path === '/products' && input === undefined) return checked(await cloud.from('products').select('id,content').order('id')).map(({id,content})=>({...content,id}));
 if (path.startsWith('/products') && input !== undefined) {
  const id = Number(path.split('/')[2]);
  if (method === 'DELETE') { checked(await cloud.from('products').delete().eq('id',id)); return {ok:true}; }
  const content = {...input}; delete content.id;
  const query = method === 'PUT' ? cloud.from('products').update({content}).eq('id',id) : cloud.from('products').insert({content});
  const row = checked(await query.select('id,content').single());
  return {...row.content,id:row.id};
 }
 throw new Error('Not found');
}
