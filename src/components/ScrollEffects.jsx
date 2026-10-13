import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './ScrollEffects.css';
import { useSiteData } from '../SiteData';

// Remove this component from App to disable the scroll animation experiment.
export default function ScrollEffects() {
  const { pathname } = useLocation();
  const { products, loading } = useSiteData();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || typeof IntersectionObserver !== 'function' || !CSS.supports('translate', '0 24px')) return;

    const targets = [...document.querySelectorAll(
      '.catalog-top-bar, .product-card-box, .about-card-col, .about-highlight-box, .advantages-main-title, .adv-card, .footer-left-column, .footer-map-box'
    )];
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        target.classList.add('scroll-arrived');
        observer.unobserve(target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });

    targets.forEach((target) => {
      // Content already on screen stays still; animate newly encountered content.
      if (target.getBoundingClientRect().top < window.innerHeight - 24) return;
      target.classList.add('scroll-pending');
      const siblings = [...target.parentElement.children];
      target.style.setProperty('--arrival-delay', `${Math.min(siblings.indexOf(target) % 4, 3) * 72}ms`);
      target.style.setProperty('--arrival-tilt', siblings.indexOf(target) % 2 ? '3deg' : '-3deg');
      observer.observe(target);
    });

    return () => {
      observer.disconnect();
      targets.forEach((target) => {
        target.classList.remove('scroll-pending', 'scroll-arrived');
        target.style.removeProperty('--arrival-delay');
        target.style.removeProperty('--arrival-tilt');
      });
    };
  }, [pathname, products, loading]);

  return null;
}
