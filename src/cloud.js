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
 if (path === '/setup') {
  if (input !== undefined) throw new Error('Online administrators must be configured by the project owner');
  return {needed:false};
 }
 if (path === '/register') {
  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6}$/.test(input.password)) throw new Error('Password format');
  const data = checked(await cloud.auth.signUp({email:input.email,password:input.password,options:{data:{name:input.name},emailRedirectTo:new URL('/profile',window.location.origin).href}}));
  return {user:data.session ? await account() : null, confirmationRequired:!data.session};
 }
 if (path === '/login') { checked(await cloud.auth.signInWithPassword({email:input.email,password:input.password})); return {user:await account()}; }
 if (path === '/logout') { checked(await cloud.auth.signOut()); return {ok:true}; }
 if (path === '/verify') { checked(await cloud.auth.verifyOtp({email:input.email,token:input.code,type:'signup'})); return {user:await account()}; }
 if (path === '/resend') { checked(await cloud.auth.resend({type:'signup',email:input.email})); return {ok:true}; }
 if (path === '/reviews' || path === '/reviews/mine') {
  if (input !== undefined) return checked(await cloud.from('reviews').insert({store:input.store.trim(),rating:Number(input.rating),body:input.body.trim()}).select('id').single());
  let query=cloud.from('reviews').select('id,author_name,store,rating,body,created_at,review_replies(body,created_at)').order('created_at',{ascending:false}).limit(100);
  if(path.endsWith('/mine')) { const user=await account(); if(!user) throw new Error('Please sign in'); query=query.eq('author_id',user.id); }
  return checked(await query).map(review=>({...review,review_replies:review.review_replies ? (Array.isArray(review.review_replies) ? review.review_replies : [review.review_replies]) : []}));
 }
 if (/^\/reviews\/[0-9a-f-]+\/reply$/.test(path)) {
  const id=path.split('/')[2]; const found=checked(await cloud.from('review_replies').select('review_id').eq('review_id',id).maybeSingle());
  return checked(found ? await cloud.from('review_replies').update({body:input.body.trim()}).eq('review_id',id) : await cloud.from('review_replies').insert({review_id:id,body:input.body.trim()}));
 }
 if (path === '/stats') return checked(await cloud.rpc('visitor_stats'));
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
