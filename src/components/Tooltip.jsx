import * as React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

export default function MyTooltip({icon, handleClick, size, title}) {
  return (
    <Tooltip title={title}>
      <IconButton onClick={handleClick} size={size}>
        {icon}
      </IconButton>
    </Tooltip>
  );
}