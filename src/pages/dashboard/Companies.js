import { useEffect, useState } from 'react';
// material
import { Grid, Card, Container, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
// hooks
import useSettings from '../../hooks/useSettings';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { AppLinks } from '../../components/_dashboard/companies';
import SortingSelecting from '../../components/_dashboard/companies/sorting-selecting';
import LoadingScreen from '../../components/LoadingScreen';
import axios from '../../axios';
import ApiConstants from 'src/_apis_/ApiConstants';
import useAuth from 'src/hooks/useAuth';
// ----------------------------------------------------------------------

export default function Companies() {
  const { themeStretch } = useSettings();
  const [companies, setCompanies] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const { access_token } = useAuth()
  useEffect(() => {
    const getUser = async () => {
      const response = await axios.get(ApiConstants.MY_ACCOUNT, { headers: { Authorization: access_token } });
      const { user } = response.data;
      const filteredCompanies = user.companies.filter((item, _) => item.disabled === false);
      setCompanies(filteredCompanies);
    };
    if (access_token) {
      getUser();
    }
  }, []);

  const deleteCompany = async (companyInfo) => {
    try {
      const response = await axios.delete(ApiConstants.DELETE_COMPANY(companyInfo.uuid), { headers: { Authorization: access_token } });
      enqueueSnackbar('Company deleted successfuly', { variant: 'success' });
      setCompanies((oldList) => oldList.filter((item, index) => item["company-uuid"] !== companyInfo.uuid))
      console.log("Success", response)
    } catch (error) {
      console.log("Error", error)
    }
  }

  return (
    <>
      {companies.length === 0 ? (
        <LoadingScreen />
      ) : (
        <Page title="esgwize | Companies">
          {/* {console.log(companies)} */}
          <Container maxWidth={themeStretch ? false : 'lg'}>
            <HeaderBreadcrumbs
              heading="Companies"
              links={[{ name: 'Home', href: PATH_DASHBOARD.root }, { name: 'Companies List' }]}
            />
            <Grid container spacing={3}>
              <AppLinks />
            </Grid>
            <br />
            <br />
            <br />
            <Grid>
              <Typography variant="h5">List of Companies</Typography>
              <Typography variant="subtitle2">Complete of list of companies currently being tracked</Typography>
            </Grid>
            <br />
            <Grid>
              <Card>
                <SortingSelecting data={companies} deleteCompany={deleteCompany}/>
              </Card>
            </Grid>
          </Container>
        </Page>
      )}
    </>
  );
}
