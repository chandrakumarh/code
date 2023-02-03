import { useCallback, useState } from 'react';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import {
  Grid,
  Container,
  Chip,
  Stack,
  Button,
  TextField,
  Typography,
  Autocomplete,
  FormHelperText,
  Box,
  Card,
  Switch,
  CardHeader,
  CardContent,
  FormControlLabel
} from '@mui/material';
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
import { AppLinks } from '../../components/_dashboard/ml-api';
//
import { UploadSingleFile } from '../../components/upload';
import { BASE_API_URL } from '../../data/data';

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

  const initalResult = JSON.stringify('no input provided', null, 2);

  const [result, setResult] = useState(initalResult);
  const [resultDisplay, setResultDisplay] = useState(false);

  const NewFormSchema = Yup.object().shape({
    companyName: Yup.string().required('Company name is required')
  });

  const formik = useFormik({
    initialValues: {
      companyName: '',
      pdfLink: ''
    },
    validationSchema: NewFormSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      const apiUrl = `${BASE_API_URL}:8080/carbon_emission`;

      const myHeaders = new Headers();
      myHeaders.append(`'Content-Type'`, `'application/json'`);
      // myHeaders.append(`'Content-Type'`, `'text/plain'`);

      const raw = JSON.stringify({
        company: values.companyName,
        pdf_link: values.pdfLink
      });

      // const raw = {
      //   company: 'Microsoft',
      //   pdf_link: 'test'
      // };

      // const Jstring = JSON.stringify(raw);
      // const JObject = JSON.parse(Jstring);

      const requestOptions = {
        method: 'GET',
        // headers: myHeaders,
        // body: raw,
        // redirect: 'follow',
        mode: 'cors'
      };
      try {
        // await fakeRequest(1500);
        // const response = await fetch(
        //   'http://ec2-3-144-114-201.us-east-2.compute.amazonaws.com:8080/carbon_emission',
        //   requestOptions
        // );
        // const response = await fetch('https://randomuser.me/api');
        // console.log(typeof raw);
        // console.log(raw);
        // console.log(raw.company);
        // console.log(raw.pdf_link);
        // console.log(Jstring);
        // console.log(JObject);

        const pdfLink = encodeURI(values.pdfLink);
        const company = encodeURI(values.companyName);
        const link = encodeURI('carbon_emission');
        // console.log(link);
        const response = await fetch(`http://${BASE_API_URL}:8080/${link}?company=${company}&pdfLink=${pdfLink}`);
        // console.log(response);
        const data = await response.json();
        // console.log(data);
        // console.log(response);

        // console.log('Test');
        const updatedResult = JSON.stringify(data, null, 2);
        setResult(updatedResult);
        setResultDisplay(true);

        // console.log(data);
        resetForm();
        // handleClosePreview();
        setSubmitting(false);
        enqueueSnackbar('Information processed', { variant: 'success' });
      } catch (error) {
        console.error(error);
        setSubmitting(false);
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setFieldValue('cover', {
          ...file,
          preview: URL.createObjectURL(file)
        });
      }
    },
    [setFieldValue]
  );

  async function apiRequest(baseAPIUrl, values) {
    const apiUrl = `${baseAPIUrl}:8080/carbon_emission`;

    const myHeaders = new Headers();
    myHeaders.append(`'Content-Type'`, `'application/json'`);

    const raw = JSON.stringify({
      company: values.companyName,
      pdf_link: values.pdfLink
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
      mode: 'no-cors'
    };

    // console.log(baseAPIUrl);
    // console.log(apiUrl);
    // console.log(raw);
    // console.log(values);

    // fetch('http://ec2-18-224-53-218.us-east-2.compute.amazonaws.com:8080/carbon_emission', requestOptions)
    //   .then((response) => response.text())
    //   .then((result) => console.log(result))
    //   .catch((error) => console.log('error', error));

    // return 'abc';

    const response = await fetch(
      'http://ec2-18-224-53-218.us-east-2.compute.amazonaws.com:8080/carbon_emission',
      requestOptions
    );
    // console.log(response);

    // await return 'abc';
    return new Promise(() => response);
  }

  return (
    <Page title="esgwize | ML API">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Machine Learning API"
          links={[{ name: 'Home', href: PATH_DASHBOARD.root }, { name: 'ML API Demo - Carbon Emission' }]}
        />
        <Grid container spacing={3}>
          <AppLinks />
        </Grid>
        <br />
        <br />
        <br />
        <Grid>
          <Typography variant="h5">Machine Learning API - Carbon Emission</Typography>
          <Typography variant="subtitle2">
            Sample demonstration of the working API for machine learning Model on carbon emission
          </Typography>
        </Grid>
        <br />
        <FormikProvider value={formik}>
          <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <Card sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    <TextField
                      fullWidth
                      label="Company Name"
                      {...getFieldProps('companyName')}
                      error={Boolean(touched.companyName && errors.companyName)}
                      helperText={touched.companyName && errors.companyName}
                    />

                    <TextField
                      fullWidth
                      // multiline
                      // minRows={3}
                      // maxRows={5}
                      label="pdf Document Link (Optional)"
                      {...getFieldProps('pdfLink')}
                      error={Boolean(touched.pdfLink && errors.pdfLink)}
                      helperText={touched.pdfLink && errors.pdfLink}
                    />

                    <LoadingButton fullWidth type="submit" variant="contained" size="large" loading={isSubmitting}>
                      Submit
                    </LoadingButton>
                    {resultDisplay && (
                      <div>
                        <Typography variant="h6">Machine Learning Algorithm - Result</Typography>
                        <br />
                        <pre>{result}</pre>
                      </div>
                    )}
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
