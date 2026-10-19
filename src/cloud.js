import { createClient } from '@supabase/supabase-js';

// Publishable keys are intentionally public. Access is enforced by database RLS.
const url = import.meta.env.VITE_SUPABASE_URL || 'https://xukraqoitjpgddhrgmqe.supabase.co';
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_zjtD-J93eUOQXo8o48s-vw_j-3JWHU-';
export const cloudEnabled = Boolean(url && key);
export const cloud = cloudEnabled ? createClient(url, key) : null;
const checked = result => { if (result.error) throw result.error; return result.data; };
// Keep in sync with the database allowlist in migration 004. RLS remains authoritative.
const approvedAdministrators = new Map([
 ['e1f33220-d4e1-4639-8d9d-07a70f1048e8', 'stasvisnakov15@gmail.com'],
 ['48a8bce1-b831-4bcb-a5a1-07f58a139d44', '3kuku66qq@gmail.com'],
]);
async function account() {
 const session = checked(await cloud.auth.getSession())?.session;
 if (!session) return null;
 const authUser = checked(await cloud.auth.getUser())?.user;
 if (!authUser) return null;
 if (!authUser.email_confirmed_at || approvedAdministrators.get(authUser.id) !== authUser.email?.toLowerCase()) {
  checked(await cloud.auth.signOut({scope:'local'}));
  return null;
 }
 const profile = checked(await cloud.from('profiles').select('name,role').eq('id',authUser.id).single());
 if (profile.role !== 'admin') return null;
 return {id:authUser.id,email:authUser.email,name:profile.name,role:profile.role};
}
export async function cloudApi(path, input, method) {
 if (path === '/me') return {user:await account()};
 if (path === '/login') { checked(await cloud.auth.signInWithPassword({email:input.email,password:input.password})); return {user:await account()}; }
 if (path === '/logout') { checked(await cloud.auth.signOut()); return {ok:true}; }
 if (path === '/products' && input === undefined) return checked(await cloud.from('products').select('id,content').order('id')).map(({id,content})=>({...content,id})).sort((a,b)=>(a.sortOrder ?? 0)-(b.sortOrder ?? 0)||a.id-b.id);
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
