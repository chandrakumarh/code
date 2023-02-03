import { orderBy } from 'lodash';
import { Icon } from '@iconify/react';
import * as Yup from 'yup';
import plusFill from '@iconify/icons-eva/plus-fill';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSnackbar } from 'notistack';
import { useEffect, useCallback, useState } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import {
  Box,
  Grid,
  Skeleton,
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TextField,
  Autocomplete,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getPostsInitial, getMorePosts } from '../../redux/slices/blog';
// utils
import fakeRequest from '../../utils/fakeRequest';
// hooks
import useSettings from '../../hooks/useSettings';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { AppLinks } from '../../components/_dashboard/templates';
import SortingSelecting from '../../components/_dashboard/templates/sorting-selecting';
import axios from '../../axios';
import LoadingScreen from '../../components/LoadingScreen';
// data
import { TEMPLATE_DATA, PORTFOLIO_DATA } from '../../data/data';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

function createData(code, name) {
  return [{ code, name }];
}

let TEMPLATE_DATA_M = [];

Object.keys(TEMPLATE_DATA).forEach((x) => {
  TEMPLATE_DATA_M = [...TEMPLATE_DATA_M, ...createData(x, TEMPLATE_DATA[x].templateName)];
});

let PORTFOLIO_DATA_M = [];

Object.keys(PORTFOLIO_DATA).forEach((x) => {
  PORTFOLIO_DATA_M = [...PORTFOLIO_DATA_M, ...createData(x, PORTFOLIO_DATA[x].portfolioName)];
});

// ----------------------------------------------------------------------

export default function PortfolioCustomSelect() {
  const { themeStretch } = useSettings();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const NewFormSchema = Yup.object().shape({
    // templateName: Yup.object().required('Template name must be selected from the dropdown list'),
    // portfolioName: Yup.object().required('Portfolio name must be selected from the dropdown list')
    templateName: Yup.string().required('Template name must be selected from the dropdown list'),
    portfolioName: Yup.string().required('Portfolio name must be selected from the dropdown list')
  });

  const formik = useFormik({
    initialValues: {
      templateName: '',
      portfolioName: ''
    },
    validationSchema: NewFormSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        console.log(values);
        await fakeRequest(1500);
        resetForm();
        // handleClosePreview();
        setSubmitting(false);
        navigate(`/dashboard/templates/portfolios/select`);
        // navigate(`/dashboard/templates/portfolios/${values.portfolioName}/${values.templateName}`);
        // enqueueSnackbar('Custom template score for the portfolio calculated', { variant: 'success' });
        enqueueSnackbar('This functionality has been disabled', { variant: 'error' });
      } catch (error) {
        console.error(error);
        setSubmitting(false);
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  const [templates, setTemplates] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  useEffect(() => {
    const getAllTemplates = async () => {
      const url = '/template/list';
      const response = await axios.get(url);
      console.log(response.data);
      setTemplates(response.data.data.templateData);
    };
    const getAllPortfolios = async () => {
      const url = '/portfolio/list';
      const response = await axios.get(url);
      console.log(response.data);
      setPortfolios(response.data.data.portfolioData);
    };
    getAllPortfolios();
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
              heading="Custom Portfolio Score"
              links={[
                { name: 'Home', href: PATH_DASHBOARD.root },
                { name: 'Templates', href: PATH_DASHBOARD.general.templates },
                { name: 'Custom Portfolio Score' }
              ]}
            />
            <Grid container spacing={3}>
              <AppLinks />
            </Grid>
            <br />
            <br />
            <br />
            <Grid>
              <Typography variant="h5">Custom Portfolio Score</Typography>
              <Typography variant="subtitle2">Select portfolio and scoring template for custom esg score</Typography>
            </Grid>
            <br />
            <FormikProvider value={formik}>
              <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={12}>
                    <Card sx={{ p: 3 }}>
                      <Stack spacing={3}>
                        <Autocomplete
                          fullWidth
                          options={portfolios}
                          getOptionLabel={(option) => option.portfolioName}
                          // options={PORTFOLIO_DATA_M}
                          // getOptionLabel={(option) => option.name}
                          onChange={(e, value) => {
                            console.log(value);
                            setFieldValue(
                              'portfolioName',
                              value !== null ? value.portfolioName : formik.initialValues.portfolioName
                            );
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Portfolio Name"
                              margin="none"
                              error={Boolean(touched.portfolioName && errors.portfolioName)}
                              helperText={touched.portfolioName && errors.portfolioName}
                            />
                          )}
                        />

                        <Autocomplete
                          fullWidth
                          options={templates}
                          getOptionLabel={(option) => option.templateName}
                          // options={TEMPLATE_DATA_M}
                          // getOptionLabel={(option) => option.name}
                          onChange={(e, value) => {
                            setFieldValue(
                              'templateName',
                              value !== null ? value.templateName : formik.initialValues.templateName
                            );
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Template Name"
                              margin="none"
                              error={Boolean(touched.templateName && errors.templateName)}
                              helperText={touched.templateName && errors.templateName}
                            />
                          )}
                        />

                        <LoadingButton fullWidth type="submit" variant="contained" size="large" loading={isSubmitting}>
                          View Custom Company Score
                        </LoadingButton>
                      </Stack>
                    </Card>
                  </Grid>
                </Grid>
              </Form>
            </FormikProvider>
          </Container>
        </Page>
      )}
    </>
  );
}
