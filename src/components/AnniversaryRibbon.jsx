import { useId, useLayoutEffect, useRef, useState } from 'react';
import './AnniversaryRibbon.css';

export default function AnniversaryRibbon({ lang }) {
  const svgRef = useRef(null);
  const pathId = `anniversary-wave-${useId().replaceAll(':', '')}`;
  const [size, setSize] = useState({ width: 1200, height: 78 });
  const message = lang === 'EN'
    ? ['Celebrating ', '10 years', ' together']
    : lang === 'KZ'
      ? ['Бізге ', '10 жыл', ' — сіздермен бірге!']
      : ['Нам ', '10 лет', ' — вместе с вами!'];

  useLayoutEffect(() => {
    const svg = svgRef.current;
    const measure = () => {
      const { width, height } = svg.getBoundingClientRect();
      if (width && height) setSize(previous => previous.width === width && previous.height === height ? previous : { width, height });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(svg);
    return () => observer.disconnect();
  }, []);

  // Use the same curve as the fabric, in actual pixels so letters keep their proportions.
  const fontSize = Math.min(32, size.width * 0.044);
  const x = value => value * size.width / 1200;
  const y = value => value * size.height / 90 + fontSize * 0.32;
  const wave = `M ${x(45)} ${y(39)} C ${x(260)} ${y(71)} ${x(390)} ${y(39)} ${x(600)} ${y(39)} C ${x(810)} ${y(39)} ${x(940)} ${y(71)} ${x(1155)} ${y(39)}`;

  return (
    <div className="anniversary-ribbon">
      <svg ref={svgRef} className="ribbon-lettering" viewBox={`0 0 ${size.width} ${size.height}`} role="img" aria-label={message.join('')}>
        <defs><path id={pathId} d={wave} /></defs>
        <text className="ribbon-wave-message" fontSize={fontSize} textAnchor="middle" textLength={Math.min(size.width * 0.78, 680)} lengthAdjust="spacing" aria-hidden="true">
          <textPath href={`#${pathId}`} startOffset="50%">
            {message[0]}<tspan className="ribbon-wave-years">{message[1]}</tspan>{message[2]}
          </textPath>
        </text>
        <text className="ribbon-wave-star" x={x(95)} y={y(45)} fontSize={fontSize * 0.9} textAnchor="middle" aria-hidden="true">✦</text>
        <text className="ribbon-wave-star" x={x(1105)} y={y(45)} fontSize={fontSize * 0.9} textAnchor="middle" aria-hidden="true">✦</text>
      </svg>
    </div>
  );
}
