import React from 'react';
import './Button.css';

export default function Button({
  label = 'Click Me',
  size = 'medium',
  variant = 'primary',
  onClick = () => console.log('Button clicked'),
}) {
  const className = `cb-btn cb-btn-${variant} cb-btn-${size}`;
  return (
    <button className={className} onClick={onClick}>
      {label}
    </button>
  );
}


