import { useEffect, useState } from 'react';
// material
import { Grid, Card, Container, Typography } from '@mui/material';
// redux

// hooks
import useSettings from '../../hooks/useSettings';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { AppLinks } from '../../components/_dashboard/portfolios';
import SortingSelecting from '../../components/_dashboard/portfolios/sorting-selecting';
import LoadingScreen from '../../components/LoadingScreen';
import axios from '../../axios';
import ApiConstants from '../../_apis_/ApiConstants';

// ----------------------------------------------------------------------

export default function Companies() {
  const { themeStretch } = useSettings();
  const [portfolios, setPortfolios] = useState([]);

  useEffect(() => {
    const getAllPortfolios = async () => {
      const response = await axios.get(ApiConstants.PORTFOLIO_LIST);
      setPortfolios(response.data.data);
    };
    getAllPortfolios();
  }, []);

  return (
    <>
      {portfolios.length === 0 ? (
        <LoadingScreen />
      ) : (
        <Page title="esgwize | Portfolios">
          <Container maxWidth={themeStretch ? false : 'lg'}>
            <HeaderBreadcrumbs
              heading="Portfolios"
              links={[{ name: 'Home', href: PATH_DASHBOARD.root }, { name: 'Portfolios List' }]}
            />
            <Grid container spacing={3}>
              <AppLinks />
            </Grid>
            <br />
            <br />
            <br />
            <Grid>
              <Typography variant="h5">List of Portfolios</Typography>
              <Typography variant="subtitle2">Complete list of portfolios currently being tracked</Typography>
            </Grid>
            <br />
            <Grid>
              <Card>
                <SortingSelecting data={portfolios} />
              </Card>
            </Grid>
          </Container>
        </Page>
      )}
    </>
  );
}
