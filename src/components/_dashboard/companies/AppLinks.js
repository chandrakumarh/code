import { Link as RouterLink } from 'react-router-dom';
// material
import { Box, Card, Typography, Button, Grid } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import CalendarTodaySharpIcon from '@mui/icons-material/CalendarTodaySharp';

// ----------------------------------------------------------------------

const BUTTON_OPTIONS = [
  {
    category: 'Companies',
    label: 'Company List',
    icon: AccountBalanceOutlinedIcon,
    catergoryColor: 'info',
    link: '/dashboard/companies',
    key: 'company-list'
  },
  {
    category: 'Companies',
    label: 'Add Company',
    icon: AccountBalanceOutlinedIcon,
    catergoryColor: 'info',
    link: '/dashboard/companies/add',
    key: 'add-company'
  }
];

// ----------------------------------------------------------------------

export default function AppLinks() {
  return (
    <>
      {BUTTON_OPTIONS.map((option) => (
        <Grid item xs={12} md={3} key={option.key}>
          <Card sx={{ display: 'flex', alignItems: 'center', p: 3, boxShadow: 4 }}>
            <Box sx={{ flexGrow: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                <option.icon fontSize="small" color={option.catergoryColor} />
                <Typography variant="subtitle2">&nbsp;{option.category}</Typography>
              </div>
              <br />

              <Typography variant="h5" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                {option.label}&nbsp;
                <Button to={option.link} component={RouterLink} color={option.catergoryColor}>
                  <ArrowForwardIcon />
                </Button>
              </Typography>
            </Box>
          </Card>
        </Grid>
      ))}
    </>
  );
}
