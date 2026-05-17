import React from 'react'
import './Input.css'

export default function Input({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  autoComplete,
}) {
  return (
    <div className={`input-group${error ? ' input-group--error' : ''}`}>
      {label && (
        <label htmlFor={name} className="input-label">
          {label}
          {required && <span className="input-required"> *</span>}
        </label>
      )}
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="input-field"
      />
      {error && <span className="input-error">{error}</span>}
    </div>
  )
}