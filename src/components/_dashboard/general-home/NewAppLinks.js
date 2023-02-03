import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Box, Card, Typography, Button, Grid } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import CalendarTodaySharpIcon from '@mui/icons-material/CalendarTodaySharp';

function NewAppLinks() {
  // TODO: update links appropriately
  const BUTTON_OPTIONS = [
    {
      category: 'Corporate Universe',
      labels: ['Company', 'Portfolio'],
      icon: CalendarTodaySharpIcon,
      catergoryColor: 'primary',
      links: ['/dashboard/companies', '/dashboard/portfolios'],
      key: 'corporate-universe',
      disabled: [false, false]
    },
    {
      category: 'Reporting',
      labels: ['Risk Reports', 'Risk Analysis', 'Custom Reports'],
      icon: AnalyticsOutlinedIcon,
      catergoryColor: 'warning',
      links: ['#', '#', '#'],
      key: 'reporting',
      disabled: [true, true, true]
    },
    {
      category: 'Workflows',
      labels: ['My Tasks', 'My alerts', 'My events'],
      icon: CalendarTodaySharpIcon,
      catergoryColor: 'primary',
      links: ['#', '#', '#'],
      key: 'workflows',
      disabled: [true, true, true]
    },
    {
      category: 'ESG Framework',
      labels: ['ESG Metrics', 'Industry Classification', 'Data Indicators'],
      icon: AccountBalanceOutlinedIcon,
      catergoryColor: 'info',
      links: ['/dashboard/templates', '#', '#'],
      key: 'esg-framework',
      disabled: [false, true, true]
    },
    {
      category: 'Risk Framework',
      labels: ['Risk Classification', 'Risk Monitoring'],
      icon: AccountBalanceOutlinedIcon,
      catergoryColor: 'info',
      links: ['#', '/dashboard/news'],
      key: 'risk-framework',
      disabled: [true, false]
    },
    {
      category: 'Corporate Framework',
      labels: ['Materiality Matrix', 'ESG weightages'],
      icon: AccountBalanceOutlinedIcon,
      catergoryColor: 'info',
      links: ['#', '#'],
      key: 'corporate-framework',
      disabled: [true, true]
    },
    {
      category: 'Setups',
      labels: ['User Management', 'Interface Setups', 'Events & Alerts'],
      icon: AccountBalanceOutlinedIcon,
      catergoryColor: 'info',
      links: ['#', '#', '#'],
      key: 'setups',
      disabled: [true, true, true]
    }
  ];
  return (
    <>
      {BUTTON_OPTIONS.map((option) => (
        <Grid item xs={12} md={4} key={option.key}>
          <Card sx={{ display: 'flex', alignItems: 'center', p: 2, boxShadow: 4 }} style={{ height: '100%' }}>
            <Box sx={{ flexGrow: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                <option.icon fontSize="small" color={option.catergoryColor} />
                <Typography variant="h5">&nbsp;{option.category}</Typography>
              </div>
              <br />

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {option.labels.map((label, index) => (
                  <span key={label} style={{ cursor: option.disabled[index] ? 'not-allowed' : null }}>
                    <Button
                      key={label}
                      to={option.links[index]}
                      component={RouterLink}
                      color={option.catergoryColor}
                      disabled={option.disabled[index]}
                    >
                      <Typography
                        key={label}
                        variant="caption"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          flexWrap: 'NoWrap'
                        }}
                        // color="black"
                      >
                        <Typography color="black" variant="caption">
                          {label}
                        </Typography>
                        <ArrowForwardIcon color={option.disabled[index] ? '' : option.catergoryColor} />
                      </Typography>
                    </Button>
                  </span>
                ))}
              </div>
            </Box>
          </Card>
        </Grid>
      ))}
    </>
  );
}

export default NewAppLinks;
