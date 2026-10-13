import { useEffect, useState } from 'react';
import { api } from '../SiteData';
import { cloudEnabled } from '../cloud';
import useLanguage from '../useLanguage';

export default function VisitorStats() {
 const lang=useLanguage(); const t=(ru,kz,en)=>lang==='EN'?en:lang==='KZ'?kz:ru;
 const [stats,setStats]=useState(null); const [error,setError]=useState(false); const [busy,setBusy]=useState(false);
 const refresh=async()=>{setBusy(true);setError(false);try{setStats(await api('/stats'));}catch{setError(true);}finally{setBusy(false);}};
 useEffect(()=>{let active=true;if(cloudEnabled) api('/stats').then(data=>{if(active)setStats(data);}).catch(()=>{if(active)setError(true);});return()=>{active=false;};},[]);
 return <section className="visitor-stats"><div className="management-heading"><h2>{t('Посещаемость сайта','Сайтқа кіру статистикасы','Website traffic')}</h2>{cloudEnabled && <button disabled={busy} onClick={refresh}>{t('Обновить','Жаңарту','Refresh')}</button>}</div>
 {!cloudEnabled ? <p>{t('Статистика публичного сайта появится после подключения онлайн-базы. Локальные просмотры не учитываются.','Онлайн дерекқор қосылғаннан кейін жария сайттың статистикасы көрсетіледі. Жергілікті қараулар есептелмейді.','Public website statistics become available after connecting the online database. Local views are not counted.')}</p> : error ? <p role="alert">{t('Не удалось загрузить статистику','Статистика жүктелмеді','Could not load statistics')}</p> : !stats ? <p>{t('Загрузка…','Жүктелуде…','Loading…')}</p> : <div className="visitor-stats-grid">{[['visitorsToday','Посетители сегодня','Бүгінгі келушілер','Visitors today'],['visitorsTotal','Всего посетителей','Барлық келушілер','Total visitors'],['visitsTotal','Всего посещений','Барлық кірулер','Total visits'],['pageviewsTotal','Просмотры страниц','Беттерді қарау','Page views']].map(([key,...labels])=><div key={key}><strong>{Number(stats[key]||0).toLocaleString()}</strong><span>{t(...labels)}</span></div>)}</div>}
 <small>{t('Посетитель — отдельный браузер. Посещение начинается заново после 30 минут бездействия. Ваши просмотры под админом не считаются. Сегодня — по времени Казахстана.','Келуші — жеке браузер. 30 минут әрекетсіздіктен кейін жаңа кіру басталады. Әкімшінің қарауы есептелмейді. Күн Қазақстан уақыты бойынша.','A visitor is a distinct browser. A new visit starts after 30 minutes of inactivity. Administrator views are excluded. Days use Kazakhstan time.')}</small></section>;
}
