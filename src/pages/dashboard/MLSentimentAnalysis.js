import { useCallback, useState, useEffect } from 'react';
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
import axios from '../../axios';
import LoadingScreen from '../../components/LoadingScreen';
import Label from '../../components/Label';

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
  const [isLoading, setIsLoading] = useState(false);
  const [accessToken, setAccessToken] = useState([]);
  const [account, setAccount] = useState([]);

  const NewFormSchema = Yup.object().shape({
    link: Yup.string().required('link is required')
  });

  const formik = useFormik({
    initialValues: {
      link: ''
    },
    validationSchema: NewFormSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      // const apiUrl = `${BASE_API_URL}:8080/carbon_emission`;

      const myHeaders = new Headers();
      myHeaders.append(`'Content-Type'`, `'application/json'`);

      try {
        // console.log(account.maxQueries);
        if (account.maxQueries <= 0) {
          // throw 'You have reached maximum limit';
          throw new Error('You have reached maximum limit');
        }
        setIsLoading(true);
        const response = await axios.post('/sentiment', values, { headers: { Authorization: accessToken } });
        setIsLoading(false);
        const { data } = response;
        // console.log(response.data);

        setResult(data.obj);
        setResultDisplay(true);
        resetForm();

        setSubmitting(false);
        enqueueSnackbar('Information processed', { variant: 'success' });
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setResultDisplay(false);
        setIsLoading(false);
        resetForm();
        enqueueSnackbar('Some error occured', { variant: 'error' });
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  const handleMagnitude = (object) => {
    const mul = object.sentiment === 'positive' ? 1 : -1;
    return object.magnitude * mul * 100;
  };

  useEffect(() => {
    const at = window.localStorage.getItem('accessToken');
    setAccessToken(at);
    const getUser = async () => {
      const response = await axios.get('/myAccount', { headers: { Authorization: at } });
      const { user } = response.data;
      // console.log(user);
      setAccount(user);
    };
    getUser();
  }, []);

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
        <Grid style={{ marginBottom: isLoading ? '50px' : null }}>
          <Typography variant="h5">Machine Learning API - Sentiment Analysis</Typography>
          <Typography variant="subtitle2">
            Sample demonstration of the working API for machine learning Model on sentiment analysis
          </Typography>
        </Grid>
        <br />

        <FormikProvider value={formik}>
          <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                {isLoading ? (
                  <LoadingScreen />
                ) : (
                  <Card sx={{ p: 3 }}>
                    <Stack spacing={3}>
                      <TextField
                        fullWidth
                        label="Link to the news article"
                        {...getFieldProps('link')}
                        error={Boolean(touched.link && errors.link)}
                        helperText={touched.link && errors.link}
                      />

                      <LoadingButton fullWidth type="submit" variant="contained" size="large" loading={isSubmitting}>
                        Submit
                      </LoadingButton>

                      {/* {isLoading ? <LoadingScreen style={{ margin: '15px 0 15px 0' }} /> : null} */}
                      {resultDisplay && (
                        <div>
                          <Typography variant="h6">Machine Learning Algorithm - Result</Typography>
                          <br />
                          <h3>{result.content.title}</h3>
                          <br />
                          <Typography variant="body1" noWrap={false}>
                            <strong>Summary:</strong> {result.summary}
                          </Typography>
                          <br />
                          <Typography style={{ textTransform: 'capitalize' }}>
                            <strong>Title Sentiment: </strong>{' '}
                            <Label
                              color={result.title_sentiment.sentiment === 'positive' ? 'success' : 'error'}
                              style={{ marginRight: '4px' }}
                            >
                              {result.title_sentiment.sentiment}{' '}
                            </Label>
                            <Label variant="ghost" color="info">
                              {' '}
                              {handleMagnitude(result.title_sentiment)}{' '}
                            </Label>
                          </Typography>
                          <Typography style={{ textTransform: 'capitalize' }}>
                            <strong>Text Sentiment: </strong>
                            <Label
                              color={result.text_sentiment.sentiment === 'positive' ? 'success' : 'error'}
                              style={{ marginRight: '4px' }}
                            >
                              {result.text_sentiment.sentiment}{' '}
                            </Label>
                            <Label variant="ghost" color="info">
                              {handleMagnitude(result.text_sentiment)}
                            </Label>
                          </Typography>
                        </div>
                      )}
                    </Stack>
                  </Card>
                )}
              </Grid>
            </Grid>
          </Form>
        </FormikProvider>
      </Container>
    </Page>
  );
}
