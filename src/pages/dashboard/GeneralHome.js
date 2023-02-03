import { useEffect, useState } from 'react';
// material
import { Container, Grid, Card, CardHeader, CardContent } from '@mui/material';

// hooks
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import {
  AppWelcome,
  AppLinks,
  ChartArea,
  DashboardCompanyCount,
  DashboardPortfolioCount,
  DashboardSimulationCount,
  DashboardTemplateCount,
  SectorChart,
  NewsTable,
  ClusterMap
} from '../../components/_dashboard/general-home';
import SortingSelecting from '../../components/_dashboard/general-home/comparative-table';
import LoadingScreen from '../../components/LoadingScreen';

// import { DASHBOARD_DATA } from '../../data/data';
import axios from '../../axios';

// ----------------------------------------------------------------------

export default function GeneralHome() {
  const { themeStretch } = useSettings();
  const { user } = useAuth();
  const [data, setData] = useState({});
  useEffect(() => {
    const getDashboardData = async () => {
      const url = '/dashboard';
      const response = await axios.get(url);
      // console.log(response.data);
      setData(response.data.rawData);
    };
    getDashboardData();
  }, []);

  return (
    <>
      {Object.keys(data).length === 0 ? (
        <LoadingScreen />
      ) : (
        <Page title="esgwize | Home">
          <Container maxWidth={themeStretch ? false : 'lg'}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <AppWelcome displayName={user.displayName} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <DashboardTemplateCount data={data.dashboard['headline-numbers']} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <DashboardPortfolioCount data={data.dashboard['headline-numbers']} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <DashboardSimulationCount data={data.dashboard['headline-numbers']} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <DashboardCompanyCount data={data.dashboard['headline-numbers']} />
              </Grid>

              <AppLinks />

              <Grid item xs={12}>
                <Card dir="ltr">
                  <CardHeader title="Tracked Companies by Score (Company# 20)" />
                  <CardContent>
                    <ChartArea data={data.dashboard['universe-scores']} />
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6} lg={6} sx={{ height: '100%' }}>
                <SectorChart data={data.dashboard['sector-data']} />
              </Grid>

              <Grid item xs={12} md={6} lg={6}>
                <Card>
                  <SortingSelecting data={data.dashboard['sector-data']} />
                </Card>
              </Grid>
              <Grid item xs={12} key="map">
                <Card dir="ltr">
                  <ClusterMap data={data.dashboard['maps-data']} />
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card>
                  <NewsTable />
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Page>
      )}
    </>
  );
}
