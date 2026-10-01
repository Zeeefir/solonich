import { Leaf, ShieldCheck, Sparkles, Flame } from 'lucide-react';

export default function WhyUs() {
  const features = [
    {
      icon: <Leaf size={32} color="#c62828" />,
      title: "100% Натурально",
      desc: "Только свежие овощи, натуральные специи и соль. Без ГМО и синтетических консервантов."
    },
    {
      icon: <ShieldCheck size={32} color="#c62828" />,
      title: "Живая ферментация",
      desc: "Традиционный рецепт естественного брожения, сохраняющий полезные витамины."
    },
    {
      icon: <Sparkles size={32} color="#c62828" />,
      title: "Хруст и сочность",
      desc: "Строгий контроль качества сырья обеспечивает знакомый с детства домашний хруст."
    },
    {
      icon: <Flame size={32} color="#c62828" />,
      title: "Богатая палитра вкусов",
      desc: "От нежной квашеной капусты с клюквой до острейшей домашней аджики и пелюстки."
    }
  ];

  return (
    <section id="why-us" className="why-us-section">
      <h2 className="section-title">Почему именно «Солёныч»?</h2>
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