import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input: React.FC<InputProps> = ({ label, ...props }) => (
  <div style={{ marginBottom: '1rem' }}>
    {label && <label style={{ display: 'block', marginBottom: 4 }}>{label}</label>}
    <input
      style={{
        padding: '0.5rem',
        border: '1px solid #ccc',
        borderRadius: 4,
        width: '100%',
      }}
      {...props}
    />
  </div>
);

export default Input;