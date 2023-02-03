import { useEffect, useState } from 'react';
// material
import { Container, Grid, Stack, Card, CardHeader, CardContent } from '@mui/material';

// hooks
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import {
  Alerts,
  NewAppLinks,
  NewDashboardCompanyCount,
  NewDashboardPortfolioCount,
  NewsTable,
  ClusterMap,
  ChartDonut,
  AppWelcome
} from '../../components/_dashboard/general-home';
import LoadingScreen from '../../components/LoadingScreen';

import axios from '../../axios';

// ----------------------------------------------------------------------

export default function GeneralHome() {
  const { themeStretch } = useSettings();
  const { user } = useAuth();
  const [data, setData] = useState({});
  // const [data, setData] = useState([]);
  const [accessToken, setAccessToken] = useState([]);
  const [account, setAccount] = useState([]);
  useEffect(() => {
    const at = window.localStorage.getItem('accessToken');
    setAccessToken(at);
    const getUser = async () => {
      const response = await axios.get('/myAccount', { headers: { Authorization: at } });
      const { user } = response.data;
      // console.log(user);
      setAccount(user);
    };
    const getDashboardData = async () => {
      const url = '/dashboard';
      const response = await axios.get(url);
      // console.log(response.data);
      setData(response.data.rawData);
    };
    getUser();
    // getDashboardData();
  }, []);

  return (
    <>
      {Object.keys(account).length === 0 ? (
        <LoadingScreen />
      ) : (
        <Page title="esgwize | Home">
          <Container maxWidth={themeStretch ? false : 'lg'} alignItems="stretch">
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <AppWelcome displayName={user.displayName} />
              </Grid>
              <Grid item xs={12} md={2}>
                <Stack spacing={3}>
                  <Grid item data-tut="reactour__scroll">
                    <NewDashboardCompanyCount data={account['headline-numbers']} />
                  </Grid>
                  <Grid item className="first-step">
                    <NewDashboardPortfolioCount data={account['headline-numbers']} class="second-step" />
                  </Grid>
                </Stack>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card style={{ height: '100%' }}>
                  <CardHeader title="Company Distribution by Sector" />
                  <CardContent
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      height: '100%'
                    }}
                  >
                    <ChartDonut data={account['sector-data']} />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <ClusterMap data={account['maps-data']} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Card style={{ height: '100%' }}>
                  <Alerts data={account['alert-data']} />
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card style={{ height: '100%' }}>
                  <NewsTable />
                </Card>
              </Grid>
              <NewAppLinks />
            </Grid>
          </Container>
        </Page>
      )}
    </>
  );
}
