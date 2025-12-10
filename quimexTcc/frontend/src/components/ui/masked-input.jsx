'use client'; 

import React from 'react';

// Funções de máscara
const applyMask = (value, mask) => {
  const cleaned = value.replace(/\D/g, '');
  let result = '';
  let dataIndex = 0;

  for (let i = 0; i < mask.length && dataIndex < cleaned.length; i++) {
    if (mask[i] === '0') {
      result += cleaned[dataIndex];
      dataIndex++;
    } else {
      result += mask[i];
    }
  }

  return result;
};

const removeMask = (value) => {
  return value.replace(/\D/g, '');
};

const formatCurrency = (value) => {
  const cleaned = value.replace(/\D/g, '');
  const number = parseFloat(cleaned) / 100;
  return number.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
};

// Componente de Input com Máscara
export const MaskedInput = ({ 
  mask = '', 
  value, 
  onChange, 
  placeholder, 
  id, 
  type = 'text',
  className = ''
}) => {
  const handleChange = (e) => {
    let newValue = e.target.value;
    
    if (type === 'currency') {
      const cleaned = newValue.replace(/\D/g, '');
      onChange(cleaned);
    } else {
      const cleaned = removeMask(newValue);
      onChange(cleaned);
    }
  };

  const displayValue = type === 'currency' 
    ? (value ? formatCurrency(value) : '')
    : (value ? applyMask(value, mask) : '');

  return (
    <input
      id={id}
      type="text"
      value={displayValue}
      onChange={handleChange}
      placeholder={placeholder}
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`}
    />
  );
};