import { useCallback, useState, useEffect } from 'react';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { Grid, Container, Stack, TextField, Typography, FormHelperText, Card, Autocomplete } from '@mui/material';
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// utils
import { fData } from '../../utils/formatNumber';
import fakeRequest from '../../utils/fakeRequest';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { AppLinks } from '../../components/_dashboard/companies';
//
import { UploadMultiFile } from '../../components/upload';
//
import axios from '../../axios';
//
import { COMPANY_ARRAY } from '../../data/dataAnand';
import LoadingScreen from '../../components/LoadingScreen';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

// ----------------------------------------------------------------------

export default function Companies() {
  const { themeStretch } = useSettings();
  const { enqueueSnackbar } = useSnackbar();

  const NewFormSchema = Yup.object().shape({
    companyName: Yup.string().required('Company name is required'),
    companyCode: Yup.string().required('Unique company code is required')
  });

  const [data, setData] = useState([]);
  const [accessToken, setAccessToken] = useState([]);
  const [account, setAccount] = useState([]);
  const [userCompanies, setUserCompanies] = useState([]);
  const [allCompanies, setAllCompanies] = useState([]);

  const formik = useFormik({
    initialValues: {
      companyName: '',
      companyCode: '',
      companyDocuments: [],
      // companyId: '',
      company: {}
    },
    validationSchema: NewFormSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        if (account.companies.length >= account.maxCompanies) {
          // throw 'You have reached maximum limit';
          throw new Error('You have reached maximum limit');
        }
        const response = await axios.post('/add', values, { headers: { Authorization: accessToken } });
        resetForm();
        setSubmitting(false);
        enqueueSnackbar(response.data.message, { variant: 'success' });
        console.log(response);
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps, handleChange } = formik;
  const handleAutocomplete = (evt, value) => {
    setFieldValue('companyName', value);

    const x = allCompanies
      .filter((el) => userCompanies.every((f) => f.companyName !== el.companyName))
      .filter((company) => company.companyName === value);
    // const x = data.filter((company) => company.companyName === value);
    setFieldValue('companyCode', x[0].publicIdentifier);
    setFieldValue('company', x[0]);
  };

  // const handleDrop = useCallback(
  //   (acceptedFiles) => {
  //     console.log(acceptedFiles);
  //     const arr = [];
  //     acceptedFiles.forEach((file) => {
  //       const reader = new FileReader();
  //       reader.onabort = () => console.log('file reading was aborted');
  //       reader.onerror = () => console.log('file reading has failed');
  //       reader.onload = (fileLoadedEvent) => {
  //         const srcData = fileLoadedEvent.target.result; // <--- data: base64
  //         arr.push({ fileName: file.name, type: file.type, base64: srcData });
  //       };
  //       reader.readAsDataURL(file);
  //     });
  //     setFieldValue('companyDocuments', arr);
  //   },
  //   [setFieldValue]
  // );

  useEffect(() => {
    const at = window.localStorage.getItem('accessToken');
    setAccessToken(at);
    const getUser = async () => {
      const response = await axios.get('/myAccount', { headers: { Authorization: at } });
      const { user } = response.data;
      console.log(user.companies);
      setUserCompanies(user.companies);
      setAccount(user);
      return user.companies;
    };

    const getCompanyList = async () => {
      const response = await axios.get('/company/list');
      console.log(response.data.data);
      setAllCompanies(response.data.data);
      return response.data.data;
    };
    getUser();
    getCompanyList();
  }, []);

  return (
    <Page title="esgwize | Companies">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Companies"
          links={[
            { name: 'Home', href: PATH_DASHBOARD.root },
            { name: 'Companies', href: PATH_DASHBOARD.general.companies },
            { name: 'Add' }
          ]}
        />
        <Grid container spacing={3}>
          <AppLinks />
        </Grid>
        <br />
        <br />
        <br />
        <Grid>
          <Typography variant="h5">Add a Company</Typography>
          <Typography variant="subtitle2">
            Provide the company name and code-identifier for review and additon
          </Typography>
        </Grid>
        <br />
        <FormikProvider value={formik}>
          <Form noValidate autoComplete="off" onSubmit={handleSubmit} encType="multipart/form-data">
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <Card sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    {/* <TextField
                      fullWidth
                      label="Company Name"
                      {...getFieldProps('companyName')}
                      name="companyName"
                      error={Boolean(touched.companyName && errors.companyName)}
                      helperText={touched.companyName && errors.companyName}
                      required
                    /> */}

                    <Autocomplete
                      disablePortal
                      id="companyName"
                      name="companyName"
                      // options={data.map((option) => option.companyName)}
                      options={allCompanies
                        .filter((el) => userCompanies.every((f) => f.companyName !== el.companyName))
                        .map((option) => option.companyName)}
                      renderInput={(params) => <TextField {...params} label="Company Name" />}
                      onChange={handleAutocomplete}
                      required
                    />
                    <TextField
                      fullWidth
                      label="Company Code"
                      {...getFieldProps('companyCode')}
                      name="companyCode"
                      error={Boolean(touched.companyCode && errors.companyCode)}
                      helperText={touched.companyCode && errors.companyCode}
                      required
                      value={values.companyCode}
                      disabled
                    />

                    {/* <div>
                      <LabelStyle>Optional Company Document</LabelStyle>
                      <UploadMultiFile
                        accept=".pdf, .txt, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        file={values.companyDocuments}
                        onDrop={handleDrop}
                        error={Boolean(touched.cover && errors.cover)}
                      />
                      {touched.cover && errors.cover && (
                        <FormHelperText error sx={{ px: 2 }}>
                          {touched.cover && errors.cover}
                        </FormHelperText>
                      )}
                    </div> */}
                    <LoadingButton fullWidth type="submit" variant="contained" size="large" loading={isSubmitting}>
                      Submit
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
