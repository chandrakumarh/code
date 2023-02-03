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
    category: 'Templates',
    label: 'Templates Builder',
    icon: CalendarTodaySharpIcon,
    catergoryColor: 'primary',
    link: '/dashboard/templates',
    key: 'saved-template'
  },
  {
    category: 'Portfolios',
    label: 'Tracked Portfolio',
    icon: AnalyticsOutlinedIcon,
    catergoryColor: 'warning',
    link: '/dashboard/portfolios',
    key: 'tracked-portfolio'
  },
  {
    category: 'Simulations',
    label: 'Score Simulation',
    icon: CalendarTodaySharpIcon,
    catergoryColor: 'primary',
    link: '/dashboard/templates/portfolios/select',
    key: 'saved-template'
  },
  {
    category: 'Companies',
    label: 'Tracked Companies',
    icon: AccountBalanceOutlinedIcon,
    catergoryColor: 'info',
    link: '/dashboard/companies',
    key: 'company-list'
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
                <Typography variant="h5">&nbsp;{option.category}</Typography>
              </div>
              <br />

              <Typography variant="subtitle2" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
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
