import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

export default function MyCheckbox({check, label, onChange}) {
  return (
      <FormControlLabel control={<Checkbox checked={check} />} label={label} onChange={onChange}/>
  );
}
