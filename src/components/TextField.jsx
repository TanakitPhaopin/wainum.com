import React from 'react';
import TextField from '@mui/material/TextField';

export default function MyTextField({
  label,
  value,
  defaultValue,
  onChange,
  multiline = false,
  rows = 1,
  type = 'text',
  maxLength = 150,
  id,
  required = false,
  disabled = false,
  showCounter = false,
}) {
  return (
    <div>
    <TextField
      id={id}
      label={label}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      type={type}
      required={required}
      disabled={disabled}
      multiline={multiline}
      rows={rows}
      fullWidth
      variant="outlined"
      slotProps={
        { htmlInput: { maxLength } }
      }
      helperText={showCounter ? `${value.length}/${maxLength}` : ''}
    />
    </div>
  );
}
