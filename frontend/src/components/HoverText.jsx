import React from 'react';

export default function HoverText({ children }) {
  return <span className="hover-text" aria-label={children}>{Array.from(children).map((char, i) =>
    <span className="hover-letter" aria-hidden="true" style={{ '--letter-index': i }} key={i}>
      <span>{char === ' ' ? '\u00a0' : char}</span><span>{char === ' ' ? '\u00a0' : char}</span>
    </span>
  )}</span>;
}
