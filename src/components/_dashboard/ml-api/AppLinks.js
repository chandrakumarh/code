import { Link as RouterLink } from 'react-router-dom';
// material
import { alpha, useTheme, styled } from '@mui/material/styles';
import { Box, Card, Typography, Stack, Button, IconButton, Grid } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import CalendarTodaySharpIcon from '@mui/icons-material/CalendarTodaySharp';
import DeveloperModeSharpIcon from '@mui/icons-material/DeveloperModeSharp';

// ----------------------------------------------------------------------

const BUTTON_OPTIONS = [
  {
    category: 'Machine Learning APIs',
    label: 'Carbon Emission',
    icon: DeveloperModeSharpIcon,
    categoryColor: 'error',
    link: '/dashboard/mlapi/carbonEmission',
    key: 'carbon-emission',
    disabled: true
  },
  {
    category: 'Machine Learning APIs',
    label: 'Gender Diversity',
    icon: DeveloperModeSharpIcon,
    categoryColor: 'error',
    link: '/dashboard/mlapi/genderDiversity',
    key: 'gender-diversity',
    disabled: true
  },
  {
    category: 'Machine Learning APIs',
    label: 'Sentiment Analysis',
    icon: DeveloperModeSharpIcon,
    categoryColor: 'error',
    link: '/dashboard/mlapi/sentimentAnalysis',
    key: 'sentiment-analysis'
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
                <option.icon fontSize="small" color={option.categoryColor} />
                <Typography variant="subtitle2">&nbsp;{option.category}</Typography>
              </div>
              <br />
              <span style={{ cursor: option.disabled ? 'not-allowed' : null }}>
                <Typography variant="h5" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                  {option.label}&nbsp;
                  <Button
                    to={option.link}
                    component={RouterLink}
                    color={option.categoryColor}
                    disabled={option.disabled}
                  >
                    <ArrowForwardIcon />
                  </Button>
                </Typography>
              </span>
            </Box>
          </Card>
        </Grid>
      ))}
    </>
  );
}
