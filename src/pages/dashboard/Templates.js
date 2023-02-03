import { useEffect, useState } from 'react';
// material
import { Grid, Card, Container, Typography } from '@mui/material';

// hooks
import useSettings from '../../hooks/useSettings';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { AppLinks } from '../../components/_dashboard/templates';
import SortingSelecting from '../../components/_dashboard/templates/sorting-selecting';
import LoadingScreen from '../../components/LoadingScreen';
import axios from '../../axios';

// ----------------------------------------------------------------------

export default function Companies() {
  const { themeStretch } = useSettings();

  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    const getAllTemplates = async () => {
      const url = '/template/list';
      const response = await axios.get(url);
      setTemplates(response.data.data);
    };
    getAllTemplates();
  }, []);

  return (
    <>
      {templates.length === 0 ? (
        <LoadingScreen />
      ) : (
        <Page title="esgwize | Templates">
          <Container maxWidth={themeStretch ? false : 'lg'}>
            <HeaderBreadcrumbs
              heading="Templates"
              links={[{ name: 'Home', href: PATH_DASHBOARD.root }, { name: 'Template List' }]}
            />
            <Grid container spacing={3}>
              <AppLinks />
            </Grid>
            <br />
            <br />
            <br />
            <Grid>
              <Typography variant="h5">List of Templates</Typography>
              <Typography variant="subtitle2">Complete of list of templates currently available</Typography>
            </Grid>
            <br />
            <Grid>
              <Card>
                <SortingSelecting data={templates} />
              </Card>
            </Grid>
          </Container>
        </Page>
      )}
    </>
  );
}
