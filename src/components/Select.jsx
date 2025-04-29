import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';

export default function MySelect({ label, menuItems, onChange, value }) {
    return (
      <Box sx={{ width: 1 }}>
        <FormControl fullWidth>
          <InputLabel id="select-label">{label}</InputLabel>
          <Select
            labelId="select-label"
            defaultValue={''}
            value={value}
            onChange={onChange}
            
          >
            {menuItems.map((item, index) => (
              <MenuItem key={index} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    );
}