import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function MyAccordion({data}) {
  return (
    <div>
        {data.map((item, index) => (
            <Accordion key={index} defaultExpanded={item.defaultExpanded || false} sx={item.sx}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel${index + 1}-content`}
                    id={`panel${index + 1}-header`}
                >
                    <p className={`text-lg font-normal ${item.titleStyle}`}>{item.title}</p>
                </AccordionSummary>
                <AccordionDetails sx={{ fontWeight: 'normal', fontSize: '1rem' }}>
                    {item.content}
                </AccordionDetails>
            </Accordion>
        ))}
    </div>
  );
}
