/* eslint-disable prettier/prettier */
import { useCallback, useState, useEffect } from 'react';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { Form, FormikProvider, useFormik } from 'formik';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
// material
import {
  Grid,
  Container,
  Stack,
  Button,
  TextField,
  Typography,
  Autocomplete,
  FormHelperText,
  Box,
  Card,
  CardHeader,
  CardContent,
  Switch,
  FormControlLabel,
  Stepper,
  Step,
  StepLabel,
  Table,
  TableHead,
  TableCell,
  TableContainer,
  TableRow,
  TableBody,
  Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveStep } from '../../redux/company/company.actions';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// utils
// import { fData } from '../../utils/formatNumber';
import fakeRequest from '../../utils/fakeRequest';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import {
  AppLinks,
  PortfolioDonut,
  Steeper,
  Intro,
  CompanyList,
  SecondaryCompanyTable,
  CompanyChart
} from '../../components/_dashboard/portfolios';
//
import { UploadSingleFile } from '../../components/upload';
//
import { COMPANY_DATA } from '../../data/data';
import axios from '../../axios';
import LoadingScreen from '../../components/LoadingScreen';

const SecondContainer = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-width: 0;
  border-style: solid;
  border-color: rgba(145, 158, 171, 0.24);
  border-left-width: thin;

  @media only screen and (max-width: 900px) {
    border-left-width: 0;
  }
`;

const MyNewBox = styled(Box)`
  border-width: 0;
  border-style: solid;
  height: ${(props) => (props.activeStep === 0 ? '100%' : 'fit-content')};
  border-color: rgba(145, 158, 171, 0.24);
  border-left-width: thin;

  @media only screen and (max-width: 900px) {
    border-left-width: 0;
  }
`;

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

// ----------------------------------------------------------------------

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.heading1,
  padding: theme.spacing(1),
  textAlign: 'right'
  // color: theme.palette.text.secondary
}));

// ----------------------------------------------------------------------------

export default function Companies() {
  const { themeStretch } = useSettings();
  const { enqueueSnackbar } = useSnackbar();

  const NewFormSchema = Yup.object().shape({
    portfolioName: Yup.string().required('Portfolio name is required'),
    portfolioCode: Yup.string().required('Unique portfolio code is required'),
    portfolioCompanies: Yup.array().required('Please add companies'),
    cover: Yup.object(),
    url: Yup.string()
  });

  const formik = useFormik({
    initialValues: {
      portfolioName: '',
      portfolioCode: '',
      portfolioCompanies: [],
      cover: {}
    },
    validationSchema: NewFormSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      console.log("before try");
      try {
        console.log(values);
        const res = await axios.post('/portfolio/create', values);
        // await fakeRequest(1500);
        resetForm();
        // handleClosePreview();
        setSubmitting(false);
        enqueueSnackbar('Submitted for review', { variant: 'success' });
        
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        enqueueSnackbar('Some error occured', { variant: 'error' });
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        if (file.path.slice(-4) === '.csv') {
          reader.onload = (e) => {
            const parseData = [];
            const newLinebrk = reader.result.split('\n');
            for (let i = 1; i < newLinebrk.length - 1; i += 1) {
              parseData.push(newLinebrk[i].split(','));
            }
            const comp = [];
            parseData.forEach((company) => {
              const obj = {
                companyName: company[0],
                // companyCode: company[1],
                // publicIdentifier: company[1],
                weight: company[2].trim('\r')
              };
              comp.push(obj);
            });
            setFieldValue('portfolioCompanies', comp);
          };
          reader.readAsText(file);
        } else {
          reader.onload = (evt) => {
            // evt = on_file_select event
            /* Parse data */
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: 'binary' });
            /* Get first worksheet */
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            /* Convert array of arrays */
            const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
            /* Update state */
            const parseData = [];
            const newLinebrk = data.split('\n');
            for (let i = 1; i < newLinebrk.length - 1; i += 1) {
              parseData.push(newLinebrk[i].split(','));
            }
            const comp = [];
            parseData.forEach((company) => {
              const obj = {
                companyName: company[0],
                companyCode: company[1],
                publicIdentifier: company[1],
                weight: company[2].trim('\r')
              };
              comp.push(obj);
            });
            setFieldValue('portfolioCompanies', comp);
          };
          reader.readAsBinaryString(file);
        }
        setFieldValue('cover', {
          ...file,
          preview: URL.createObjectURL(file)
        });
        setCondition(() => true);
      }
    },
    [setFieldValue]
  );

  const steps = ['Portfolio name', 'Add Companies', 'Add weights', 'Verify'];
  const cols = ['Company Name', 'Company Code', 'Weight', 'Percentage'];
  const [fileUpload, setFileUpload] = useState(false);
  const [comps, setComps] = useState([]);

  const activeStep = useSelector((state) => state.company.activeStep);
  const dispatch = useDispatch();

  const [condition, setCondition] = useState(() => false);

  const handleNext = () => {
    if (condition) {
      if (Object.keys(formik.values.cover).length && activeStep === 1) {
        dispatch(setActiveStep(activeStep + 2));
      } else {
        dispatch(setActiveStep(activeStep + 1));
      }
    }
  };

  const handleBack = () => {
    if (Object.keys(formik.values.cover).length && activeStep === steps.length - 1) {
      dispatch(setActiveStep(activeStep - 2));
    } else {
      dispatch(setActiveStep(activeStep - 1));
    }
  };

  const handleReset = () => {
    dispatch(setActiveStep(0));
  };

  const companies = Object.keys(COMPANY_DATA).map((key) => COMPANY_DATA[key]);

  const calcPercentage = (val, arr) => {
    const v = parseFloat(val);
    const total = arr.reduce((sum, current) => sum + parseFloat(current.weight), 0);
    if (!total) return 0;
    let percentage = (v / total).toFixed(4) * 100;
    percentage = percentage.toString().slice(0, 5);
    percentage += ' %';
    return percentage;
  };

  const toggleUpload = () => {
    setFileUpload(!fileUpload);
  };

  useEffect(() => {
    const getAllCompanies = async () => {
      const url = '/company/list';
      const response = await axios.get(url);
      setComps(response?.data?.data?.companyData);
      console.log(response?.data?.data?.companyData);
      console.log(companies);
    };
    getAllCompanies();
  }, []);

  return (
    <>
      {comps?.length === 0 ? (
        <LoadingScreen />
      ) : (
        <Page title="esgwize | Portfolios">
          <Container maxWidth={themeStretch ? false : 'lg'}>
            <HeaderBreadcrumbs
              heading="Portfolios"
              links={[
                { name: 'Home', href: PATH_DASHBOARD.root },
                { name: 'Portfolios', href: PATH_DASHBOARD.general.portfolios },
                { name: 'Create' }
              ]}
            />
            <Grid container spacing={3}>
              <AppLinks />
            </Grid>
            <br />
            <br />
            <br />
            <Grid>
              <Typography variant="h5">Create a Portfolio</Typography>
              <Typography variant="subtitle2">
                Provide the portfolio name, code-identifier and weights for review and additon
              </Typography>
            </Grid>
            <br />
            <FormikProvider value={formik}>
              <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={12}>
                    <Card sx={{ p: 3 }}>
                      <Stack spacing={3}>
                        <Box sx={{ width: '100%' }}>
                          <Grid container spacing={0}>
                            <Grid item xs={12} md={4}>
                              <Steeper
                                activeStep={activeStep}
                                setActiveStep={setActiveStep}
                                condition={condition}
                                handleNext={handleNext}
                                handleBack={handleBack}
                                handleReset={handleReset}
                                isSubmitting={isSubmitting}
                              />
                            </Grid>
                            <Grid item xs={12} md={8}>
                              <MyNewBox activeStep={activeStep}>
                                {activeStep === 0 && (
                                  <Intro
                                    touched={touched}
                                    errors={errors}
                                    getFieldProps={getFieldProps}
                                    activeStep={activeStep}
                                    formik={formik}
                                    handleBack={handleBack}
                                    setCondition={setCondition}
                                    handleNext={handleNext}
                                    condition={condition}
                                  />
                                )}
                                {activeStep === 1 && (
                                  <CompanyList
                                    setCondition={setCondition}
                                    fileUpload={fileUpload}
                                    toggleUpload={toggleUpload}
                                    activeStep={activeStep}
                                    handleNext={handleNext}
                                    handleBack={handleBack}
                                    formik={formik}
                                    touched={touched}
                                    errors={errors}
                                    setFieldValue={setFieldValue}
                                    handleDrop={handleDrop}
                                    values={values}
                                    condition={condition}
                                  />
                                )}
                                {activeStep === 2 && (
                                  <SecondaryCompanyTable
                                    setCondition={setCondition}
                                    activeStep={activeStep}
                                    handleBack={handleBack}
                                    handleNext={handleNext}
                                    setFieldValue={setFieldValue}
                                    condition={condition}
                                  />
                                )}
                                {activeStep === steps.length - 1 && (
                                  <CompanyChart
                                    activeStep={activeStep}
                                    handleBack={handleBack}
                                    isSubmitting={isSubmitting}
                                    condition={condition}
                                  />
                                )}
                              </MyNewBox>
                            </Grid>
                          </Grid>
                        </Box>
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
