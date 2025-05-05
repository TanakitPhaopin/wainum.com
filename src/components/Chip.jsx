import Chip from '@mui/material/Chip';

export default function MyChip({ label, icon, variant, size, color, sx }) {
    return (
        <Chip icon={icon} label={label} variant={variant} size={size} color={color} sx={sx}/>   
    );
}