import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  maxLength?: number;
}

export function FormField({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  disabled,
  required,
  maxLength,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label 
        htmlFor={id} 
        className="font-display text-xs font-bold uppercase tracking-wider"
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        maxLength={maxLength}
        className={error ? 'border-destructive' : ''}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <p id={`${id}-error`} className="font-body text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
