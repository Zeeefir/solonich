import useLanguage from '../useLanguage';
import { Leaf, ShieldCheck, Sparkles, Flame } from 'lucide-react';

export default function WhyUs() {
  const isRu = useLanguage() === 'RU';
  const features = [
    {
      icon: <Leaf size={32} color="#c62828" />,
      title: isRu ? "100% Натурально" : "100% Табиғи",
      desc: isRu ? "Только свежие овощи, натуральные специи и соль. Без ГМО и синтетических консервантов." : "Тек балғын көкөністер, табиғи дәмдеуіштер мен тұз. ГМО және синтетикалық консерванттарсыз."
    },
    {
      icon: <ShieldCheck size={32} color="#c62828" />,
      title: isRu ? "Живая ферментация" : "Табиғи ашыту",
      desc: isRu ? "Традиционный рецепт естественного брожения, сохраняющий полезные витамины." : "Пайдалы дәрумендерді сақтайтын табиғи ашытудың дәстүрлі рецепті."
    },
    {
      icon: <Sparkles size={32} color="#c62828" />,
      title: isRu ? "Хруст и сочность" : "Қытырлақ әрі шырынды",
      desc: isRu ? "Строгий контроль качества сырья обеспечивает знакомый с детства домашний хруст." : "Шикізат сапасын қатаң бақылау бала кезден таныс үйдегідей қытырлақ дәмді қамтамасыз етеді."
    },
    {
      icon: <Flame size={32} color="#c62828" />,
      title: isRu ? "Богатая палитра вкусов" : "Дәмдердің бай таңдауы",
      desc: isRu ? "От нежной квашеной капусты с клюквой до острейшей домашней аджики и пелюстки." : "Мүкжидек қосылған жұмсақ ашытылған қырыққабаттан бастап, өте ащы үй аджикасы мен «Пелюсткаға» дейін."
    }
  ];

  return (
    <section id="why-us" className="why-us-section">
      <h2 className="section-title">{isRu ? 'Почему именно «Солёныч»?' : 'Неліктен «Солёныч»?'}</h2>
      <div className="features-grid">
        {features.map((item, index) => (
          <div key={index} className="feature-card">
            <div className="feature-icon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}