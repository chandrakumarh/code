// import { orderBy } from 'lodash';
// import { Icon } from '@iconify/react';
import * as Yup from 'yup';
// import plusFill from '@iconify/icons-eva/plus-fill';
import { useNavigate } from 'react-router-dom';
// import InfiniteScroll from 'react-infinite-scroll-component';
import { useSnackbar } from 'notistack';
// import { useEffect, useCallback, useState } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import {
  // Box,
  Grid,
  // Skeleton,
  Card,
  // Table,
  Stack,
  // Avatar,
  // Button,
  // Checkbox,
  TextField,
  Autocomplete,
  // TableRow,
  // TableBody,
  // TableCell,
  Container,
  Typography
  // TableContainer,
  // TablePagination
} from '@mui/material';
// import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
// redux
// import { useDispatch, useSelector } from '../../redux/store';
// import { getPostsInitial, getMorePosts } from '../../redux/slices/blog';
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
// import SortingSelecting from '../../components/_dashboard/templates/sorting-selecting';
// data
import { TEMPLATE_DATA, COMPANY_DATA } from '../../data/data';

// ----------------------------------------------------------------------

// const LabelStyle = styled(Typography)(({ theme }) => ({
//   ...theme.typography.subtitle2,
//   color: theme.palette.text.secondary,
//   marginBottom: theme.spacing(1)
// }));

function createData(code, name) {
  return [{ code, name }];
}

let TEMPLATE_DATA_M = [];

Object.keys(TEMPLATE_DATA).forEach((x) => {
  TEMPLATE_DATA_M = [...TEMPLATE_DATA_M, ...createData(x, TEMPLATE_DATA[x].templateName)];
});

let COMPANY_DATA_M = [];

Object.keys(COMPANY_DATA).forEach((x) => {
  COMPANY_DATA_M = [...COMPANY_DATA_M, ...createData(x, COMPANY_DATA[x].companyName)];
});

// ----------------------------------------------------------------------

export default function CompaniesCustomSelect() {
  const { themeStretch } = useSettings();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const NewFormSchema = Yup.object().shape({
    templateName: Yup.string().required('Template name must be selected from the dropdown list'),
    companyName: Yup.string().required('Company name must be selected from the dropdown list')
  });

  const formik = useFormik({
    initialValues: {
      templateName: '',
      companyName: ''
    },
    validationSchema: NewFormSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await fakeRequest(1500);
        resetForm();
        // handleClosePreview();
        setSubmitting(false);
        navigate(`/dashboard/templates/companies/${values.companyName}/${values.templateName}`);
        enqueueSnackbar('Custom template score for the company calculated', { variant: 'success' });
      } catch (error) {
        console.error(error);
        setSubmitting(false);
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  return (
    <Page title="esgwize | Templates">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Custom Company Score"
          links={[
            { name: 'Home', href: PATH_DASHBOARD.root },
            { name: 'Templates', href: PATH_DASHBOARD.general.templates },
            { name: 'Custom Company Score' }
          ]}
        />
        <Grid container spacing={3}>
          <AppLinks />
        </Grid>
        <br />
        <br />
        <br />
        <Grid>
          <Typography variant="h5">Custom Company Score</Typography>
          <Typography variant="subtitle2">Select company and scoring template for custom esg score</Typography>
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
                      options={COMPANY_DATA_M}
                      getOptionLabel={(option) => option.name}
                      onChange={(e, value) => {
                        setFieldValue('companyName', value !== null ? value.code : formik.initialValues.companyName);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Company Name"
                          margin="none"
                          error={Boolean(touched.companyName && errors.companyName)}
                          helperText={touched.companyName && errors.companyName}
                        />
                      )}
                    />

                    <Autocomplete
                      fullWidth
                      options={TEMPLATE_DATA_M}
                      getOptionLabel={(option) => option.name}
                      onChange={(e, value) => {
                        setFieldValue('templateName', value !== null ? value.code : formik.initialValues.templateName);
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
  );
}
