import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contacts" className="site-footer">
      <div className="footer-container">
        {/* Основная сетка: Левая колонка (Заголовок + Контакты) + Карта */}
        <div className="footer-main-content">
          {/* Левая колонка: объединены заголовок и контакты, чтобы встать вровень с картой */}
          <div className="footer-left-column">
            <h3 className="footer-title">Где мы находимся</h3>
            <div className="footer-contacts-info">
              <ul className="contacts-list">
                <li>
                  <MapPin size={18} className="contact-icon" />
                  <span>ТОО "LVR Asia", г. Алматы</span>
                </li>
                <li>
                  <Phone size={18} className="contact-icon" />
                  <a href="tel:+77079903960">+7 (707) 990-39-60</a>
                </li>
                <li>
                  <Mail size={18} className="contact-icon" />
                  <a href="mailto:info@solenych.kz">info@solenych.kz</a>
                </li>
                <li>
                  <Clock size={18} className="contact-icon" />
                  <span>Пн–Пт: 09:00 – 17:00, Сб-Вс: Выходной</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Интерактивная карта с темно-красной рамкой */}
          <div className="footer-map-box">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d965.7073528882029!2d76.85809357589523!3d43.365260761690905!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x388315f11320d405%3A0x981076489edd7eb1!2z0KLQntCeICJMVlIgQXNpYSI!5e0!3m2!1sru!2skz!4v1789396634556!5m2!1sru!2skz"
              width="100%"
              height="220"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title="Наше местоположение"
            ></iframe>
          </div>
        </div>

        {/* Нижняя полоска с бейджем и копирайтом */}
        <div className="footer-bottom-bar">
          <div className="footer-center-badge">
            <div className="footer-badge-icon">
              <span className="footer-logo-text">СОЛЁНЫЧ</span>
            </div>
          </div>

          <div className="footer-right-text">
            * Настоящие домашние соленья из свежайших овощей
          </div>
        </div>
      </div>
    </footer>
  );
}