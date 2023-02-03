import { useCallback, useState, useReducer, useEffect } from 'react';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { Form, FormikProvider, useFormik } from 'formik';
import { PropTypes } from 'prop-types';
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
  Paper,
  Slider,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { LoadingButton, TreeView, TreeItem } from '@mui/lab';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useSelector, useDispatch } from 'react-redux';
// import { TreeView, TreeItem } from '@mui/lab';

// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// utils
import { fData } from '../../utils/formatNumber';
import fakeRequest from '../../utils/fakeRequest';
// hooks
import useSettings from '../../hooks/useSettings';
import { setTemplateActiveStep, setTemplateName } from '../../redux/company/company.actions';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// eslint-disable-next-line import/named
import { AppLinks, TemplateDonut, Block, CreateTable } from '../../components/_dashboard/templates';
//
import { DASHBOARD_TEMPLATE_DATA } from '../../data/data';
import { UploadSingleFile } from '../../components/upload';
import axios from '../../axios';
import Label from '../../components/Label';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

// ----------------------------------------------------------------------
// ----------------------------------------------------------------------

const TreeViewStyle = styled(TreeView)({
  height: 240,
  flexGrow: 1,
  maxWidth: 400
});

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
  color: theme.palette.text.secondary
}));

function StyledTreeItem(props) {
  const { bgColor, color, coloured, labelInfo, labelText, tooltipInfo, ...other } = props;
  const returnColor = (score) => {
    if (score > 7.5) return 'success';
    if (score < 3.5) return 'error';
    return 'warning';
  };

  return (
    <StyledTreeItemRoot
      label={
        <Box sx={{ display: 'flex', alignItems: 'center', p: 0.5, pr: 0 }}>
          <Typography variant="body2" sx={{ fontWeight: 'inherit', flexGrow: 1 }}>
            {labelText}
          </Typography>
          {labelInfo && (
            <Tooltip arrow title={tooltipInfo} sx={{ color: 'blue' }}>
              <Typography>
                <Label color={coloured ? 'primary' : 'default'} variant="ghost">
                  {labelInfo}
                </Label>
              </Typography>
            </Tooltip>
          )}
        </Box>
      }
      style={{
        '--tree-view-color': color,
        '--tree-view-bg-color': bgColor
      }}
      {...other}
    />
  );
}

StyledTreeItem.propTypes = {
  bgColor: PropTypes.string,
  color: PropTypes.string,
  labelIcon: PropTypes.elementType,
  labelInfo: PropTypes.number,
  labelText: PropTypes.string.isRequired
};

// ----------------------------------------------------------------------

export default function Companies() {
  const { themeStretch } = useSettings();
  const { enqueueSnackbar } = useSnackbar();
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const activeStep = useSelector((state) => state.company.templateActiveStep);
  const templateData = useSelector((state) => state.company.templateData);
  const esgTemplateData = useSelector((state) => state.company.esgTemplateData);
  const [graphTitle, setGraphTitle] = useState('ESG - Composition Data');
  const [activeOpen, setActiveOpen] = useState(-1);
  const dispatch = useDispatch();

  const initialData =
    esgTemplateData === null ? DASHBOARD_TEMPLATE_DATA['esg-weights'] : esgTemplateData['esg-weights'];

  const [data, setData] = useState({ ...initialData });

  const envData = data.children[0];
  const socData = data.children[2];
  const govData = data.children[1];

  const NewFormSchema = Yup.object().shape({
    templateName: Yup.string().required('Template name is required'),
    templateCode: Yup.string().required('Unique template code is required'),
    templateWeights: Yup.object()
      .shape({ env: Yup.number(), soc: Yup.number(), gov: Yup.number() })
      .required('Unique template code is required')
    // templateWeights: Yup.string().required('Template weights is required')
  });

  const formik = useFormik({
    initialValues: {
      templateName: templateData ? templateData.name : '',
      templateCode: templateData ? templateData.code : '',
      templateWeights: {
        env: envData[Object.keys(envData)[0]].weight,
        soc: socData[Object.keys(socData)[0]].weight,
        gov: govData[Object.keys(govData)[0]].weight
      },
      templateLevel2Weights: data.children.map((item, index) => {
        let dat = '';
        if (index === 0) dat = 'env';
        else if (index === 1) dat = 'gov';
        else dat = 'soc';

        const nested = item[Object.keys(item)[0]].children[0];

        return {
          [dat]: Object.keys(nested).map((val) => {
            const name = val.split('-')[0];
            const value = nested[val].weight;
            return {
              [name]: value
            };
          })
        };
      })
    },
    validationSchema: NewFormSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const res = await axios.post('/template/create', values);
        // await fakeRequest(1500);
        resetForm();
        // handleClosePreview();
        setSubmitting(false);
        // enqueueSnackbar('Submitted for review', { variant: 'warning' });
        enqueueSnackbar('Submitted for review', { variant: 'success' });
      } catch (error) {
        setSubmitting(false);
        enqueueSnackbar('Some error occured', { variant: 'error' });
      }
    }
  });

  const updateGraphData = () => {
    setGraphData([
      {
        params: 'enviroment',
        value: formik.values.templateWeights.env
      },
      {
        params: 'social',
        value: formik.values.templateWeights.soc
      },
      {
        params: 'governance',
        value: formik.values.templateWeights.gov
      }
    ]);
  };

  useEffect(() => {
    updateGraphData();
  }, [formik.values.templateWeights]);

  const [graphData, setGraphData] = useState(() => [
    {
      params: 'enviroment',
      value: formik.values.templateWeights.env
    },
    {
      params: 'social',
      value: formik.values.templateWeights.soc
    },
    {
      params: 'governance',
      value: formik.values.templateWeights.gov
    }
  ]);

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  const steps = ['Template name', 'Add weights'];
  // const cols = ['Company Name', 'Company Code', 'Weight', 'Percentage'];

  const handleNext = () => {
    dispatch(setTemplateActiveStep(activeStep + 1));
  };

  const handleBack = () => {
    dispatch(setTemplateActiveStep(activeStep - 1));
  };

  const handleLevel2Change = (name, value, level1pos) => {
    data.children[level1pos][Object.keys(data.children[level1pos])].children[0][name].weight = value;
    setData(data);
    forceUpdate();
  };

  const handleSlider = (name, value, pos) => {
    setFieldValue('templateWeights', { ...formik.values.templateWeights, [name]: value });
    data.children[pos][Object.keys(data.children[pos])].weight = value;
    setData(data);
  };

  function capitalize(sentence) {
    const words = sentence.split(' ');
    for (let i = 0; i < words.length; i += 1) {
      words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }
    return words.join(' ');
  }
  return (
    <Page title="esgwize | Scoring Templates">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Scoring Templates"
          links={[
            { name: 'Home', href: PATH_DASHBOARD.root },
            { name: 'Templates', href: PATH_DASHBOARD.general.templates },
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
          <Typography variant="h5">Save a template</Typography>
          <Typography variant="subtitle2">
            Provide the template name, code-identifier and weights for review and additon
          </Typography>
        </Grid>
        <br />
        <FormikProvider value={formik}>
          <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <Card sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    <Stepper activeStep={activeStep}>
                      {steps.map((label) => {
                        const stepProps = {};
                        const labelProps = {};
                        return (
                          <Step key={label} {...stepProps}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                          </Step>
                        );
                      })}
                    </Stepper>
                    {activeStep === 0 && (
                      <>
                        <TextField
                          fullWidth
                          label="Template Name"
                          {...getFieldProps('templateName')}
                          error={Boolean(touched.templateName && errors.templateName)}
                          helperText={touched.templateName && errors.templateName}
                        />

                        <TextField
                          fullWidth
                          // multiline
                          // minRows={3}
                          // maxRows={5}
                          label="Template Code"
                          {...getFieldProps('templateCode')}
                          error={Boolean(touched.templateCode && errors.templateCode)}
                          helperText={touched.templateCode && errors.templateCode}
                        />

                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                          <Button variant="outlined" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
                            Back
                          </Button>
                          <Box sx={{ flex: '1 1 auto' }} />
                          <Button
                            onClick={handleNext}
                            variant="contained"
                            disabled={formik.values.portfolioName === '' || formik.values.portfolioCode === ''}
                          >
                            Next
                          </Button>
                        </Box>
                      </>
                    )}
                    {activeStep === 1 && (
                      <>
                        <Grid container spacing={3} sx={{ padding: '0 20px' }}>
                          <Grid item xs={12} md={6} style={{ paddingLeft: '0px' }}>
                            <Card>
                              <CardHeader title="ESG Score Composition" />
                              <br />
                              <br />
                              <Typography sx={{ width: '80%', marginLeft: '10%' }}>Environment</Typography>
                              <CreateTable
                                onLevel1Change={handleSlider}
                                level1name="env"
                                primaryLevel2Data={envData['environment-score'].children[0]}
                                intialLevel2={initialData.children[0]['environment-score'].children[0]}
                                level1Pos={0}
                                onLevel2Change={handleLevel2Change}
                                activeOpen={activeOpen}
                                setActiveOpen={setActiveOpen}
                                updateGraphData={updateGraphData}
                                setGraphTitle={setGraphTitle}
                                setGraphData={setGraphData}
                                level1Weight={formik.values.templateWeights.env}
                              />
                              <Typography sx={{ width: '80%', marginLeft: '10%' }}>Social</Typography>
                              <CreateTable
                                onLevel1Change={handleSlider}
                                level1name="soc"
                                primaryLevel2Data={socData['social-score'].children[0]}
                                intialLevel2={initialData.children[2]['social-score'].children[0]}
                                level1Pos={2}
                                activeOpen={activeOpen}
                                setActiveOpen={setActiveOpen}
                                onLevel2Change={handleLevel2Change}
                                updateGraphData={updateGraphData}
                                setGraphTitle={setGraphTitle}
                                setGraphData={setGraphData}
                                level1Weight={formik.values.templateWeights.soc}
                              />
                              <Typography sx={{ width: '80%', marginLeft: '10%' }}>Governance</Typography>
                              <CreateTable
                                onLevel1Change={handleSlider}
                                level1name="gov"
                                primaryLevel2Data={govData['governance-score'].children[0]}
                                intialLevel2={initialData.children[1]['governance-score'].children[0]}
                                setActiveOpen={setActiveOpen}
                                level1Pos={1}
                                setGraphTitle={setGraphTitle}
                                activeOpen={activeOpen}
                                onLevel2Change={handleLevel2Change}
                                updateGraphData={updateGraphData}
                                setGraphData={setGraphData}
                                level1Weight={formik.values.templateWeights.gov}
                              />
                            </Card>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Card dir="ltr">
                              <CardHeader title={graphTitle} />
                              <CardContent
                                sx={{
                                  height: 420,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                <TemplateDonut data={graphData} />
                              </CardContent>
                            </Card>
                          </Grid>
                        </Grid>
                        <Grid container spacing={3} sx={{ padding: '0 20px' }}>
                          <Grid item xs={12} md={4} key="e-Component" style={{ paddingLeft: '0px' }}>
                            <Block title="Environment Component - weight" sx={{ overflow: 'auto', p: 3 }}>
                              <TreeViewStyle
                                defaultCollapseIcon={<ExpandMoreIcon />}
                                defaultExpandIcon={<ChevronRightIcon />}
                                defaultEndIcon={null}
                                defaultExpanded={[...Object.keys(envData)]}
                              >
                                {Object.keys(envData).map((x) => (
                                  <StyledTreeItem
                                    nodeId={x}
                                    labelText={capitalize(x.replace(/-/g, ' '))}
                                    key={x}
                                    tooltipInfo="default"
                                    labelInfo={formik.values.templateWeights.env}
                                    color="#000"
                                    bgColor="#e8f0fe"
                                    coloured
                                  >
                                    {Object.keys(envData[x].children[0]).map((y) => (
                                      <StyledTreeItem
                                        nodeId={y}
                                        labelText={capitalize(y.replace(/-/g, ' '))}
                                        key={y}
                                        tooltipInfo={envData[x]['children-weight-type']}
                                        labelInfo={
                                          data.children[0][Object.keys(data.children[0])].children[0][y].weight
                                        }
                                        // labelInfo={envData[x].children[0][y].weight}
                                        color="#000"
                                        bgColor="#e8f0fe"
                                      >
                                        {Object.keys(envData[x].children[0][y].children[0]).map((z) => (
                                          <StyledTreeItem
                                            nodeId={z}
                                            labelText={capitalize(z.replace(/-/g, ' '))}
                                            key={z}
                                            tooltipInfo={envData[x].children[0][y]['children-weight-type']}
                                            labelInfo={envData[x].children[0][y].children[0][z].weight}
                                            color="#1a73e8"
                                            bgColor="#e8f0fe"
                                          />
                                        ))}
                                      </StyledTreeItem>
                                    ))}
                                  </StyledTreeItem>
                                ))}
                              </TreeViewStyle>
                            </Block>
                          </Grid>

                          <Grid item xs={12} md={4} key="s-Component">
                            <Block title="Social Component - weight" sx={{ overflow: 'auto', p: 3 }}>
                              <TreeViewStyle
                                defaultCollapseIcon={<ExpandMoreIcon />}
                                defaultExpandIcon={<ChevronRightIcon />}
                                defaultEndIcon={null}
                                defaultExpanded={[...Object.keys(socData)]}
                              >
                                {Object.keys(socData).map((x) => (
                                  <StyledTreeItem
                                    nodeId={x}
                                    labelText={capitalize(x.replace(/-/g, ' '))}
                                    tooltipInfo="default"
                                    key={x}
                                    labelInfo={formik.values.templateWeights.soc}
                                    color="#000"
                                    bgColor="#e8f0fe"
                                    coloured
                                  >
                                    {Object.keys(socData[x].children[0]).map((y) => (
                                      <StyledTreeItem
                                        nodeId={y}
                                        labelText={capitalize(y.replace(/-/g, ' '))}
                                        key={y}
                                        tooltipInfo={socData[x]['children-weight-type']}
                                        labelInfo={
                                          data.children[2][Object.keys(data.children[2])].children[0][y].weight
                                        }
                                        // labelInfo={socData[x].children[0][y].weight}
                                        color="#000"
                                        bgColor="#e8f0fe"
                                      >
                                        {Object.keys(socData[x].children[0][y].children[0]).map((z) => (
                                          <StyledTreeItem
                                            nodeId={z}
                                            labelText={capitalize(z.replace(/-/g, ' '))}
                                            key={z}
                                            tooltipInfo={socData[x].children[0][y]['children-weight-type']}
                                            labelInfo={socData[x].children[0][y].children[0][z].weight}
                                            color="#1a73e8"
                                            bgColor="#e8f0fe"
                                          />
                                        ))}
                                      </StyledTreeItem>
                                    ))}
                                  </StyledTreeItem>
                                ))}
                              </TreeViewStyle>
                            </Block>
                          </Grid>

                          <Grid item xs={12} md={4} key="g-Component">
                            <Block title="Governence Component - weight" sx={{ overflow: 'auto', p: 3 }}>
                              <TreeViewStyle
                                defaultCollapseIcon={<ExpandMoreIcon />}
                                defaultExpandIcon={<ChevronRightIcon />}
                                defaultExpanded={[...Object.keys(govData)]}
                                defaultEndIcon={null}
                              >
                                {Object.keys(govData).map((x) => (
                                  <StyledTreeItem
                                    nodeId={x}
                                    labelText={capitalize(x.replace(/-/g, ' '))}
                                    tooltipInfo="default"
                                    key={x}
                                    labelInfo={formik.values.templateWeights.gov}
                                    // labelInfo={govData[x].weight}
                                    color="#000"
                                    bgColor="#e8f0fe"
                                    coloured
                                  >
                                    {Object.keys(govData[x].children[0]).map((y) => (
                                      <StyledTreeItem
                                        nodeId={y}
                                        labelText={capitalize(y.replace(/-/g, ' '))}
                                        key={y}
                                        tooltipInfo={govData[x]['children-weight-type']}
                                        labelInfo={
                                          data.children[1][Object.keys(data.children[1])].children[0][y].weight
                                        }
                                        // labelInfo={govData[x].children[0][y].weight}
                                        color="#000"
                                        bgColor="#e8f0fe"
                                      >
                                        {Object.keys(govData[x].children[0][y].children[0]).map((z) => (
                                          <StyledTreeItem
                                            nodeId={z}
                                            labelText={capitalize(z.replace(/-/g, ' '))}
                                            key={z}
                                            tooltipInfo={govData[x].children[0][y]['children-weight-type']}
                                            labelInfo={govData[x].children[0][y].children[0][z].weight}
                                            color="#1a73e8"
                                            bgColor="#e8f0fe"
                                          />
                                        ))}
                                      </StyledTreeItem>
                                    ))}
                                  </StyledTreeItem>
                                ))}
                              </TreeViewStyle>
                            </Block>
                          </Grid>
                        </Grid>
                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                          <Button onClick={handleBack} sx={{ ml: 1 }} variant="outlined">
                            Back
                          </Button>
                          <Box sx={{ flex: '1 1 auto' }} />
                          <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting} disabled>
                            Submit
                          </LoadingButton>
                        </Box>
                      </>
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
