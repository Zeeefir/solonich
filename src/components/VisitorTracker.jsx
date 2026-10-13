import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useSiteData } from '../SiteData';
import { cloud } from '../cloud';

export default function VisitorTracker() {
 const {pathname} = useLocation(); const {user,loading} = useSiteData();
 const lastPath = useRef(null);
 useEffect(() => {
  if (!cloud || loading || ['localhost','127.0.0.1','::1'].includes(window.location.hostname) || user?.role === 'admin' || navigator.webdriver || !/^\/(?:product\/\d+)?$/.test(pathname) || lastPath.current===pathname) return;
  lastPath.current=pathname;
  try {
   let visitor=localStorage.getItem('solonich_visitor');
   if (!visitor || !/^[0-9a-f-]{36}$/.test(visitor)) {visitor=crypto.randomUUID();localStorage.setItem('solonich_visitor',visitor);}
   let visit=JSON.parse(localStorage.getItem('solonich_visit') || 'null');
   if (!visit || Date.now()-visit.time>30*60*1000 || !visit.id) visit={id:crypto.randomUUID()};
   visit.time=Date.now(); localStorage.setItem('solonich_visit',JSON.stringify(visit));
   cloud.rpc('record_visit',{visitor_id:visitor,session_id:visit.id,page_path:pathname,event_id:crypto.randomUUID()}).catch(()=>{});
  } catch { /* Storage-blocked visitors can still use the site. */ }
 },[pathname,user,loading]);
 return null;
}
