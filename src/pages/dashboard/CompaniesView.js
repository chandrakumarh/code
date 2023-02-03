import { Link as RouterLink, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { styled, useTheme } from '@mui/material/styles';
// material
import {
  Box,
  Grid,
  Card,
  Button,
  Container,
  Typography,
  LinearProgress,
  CardContent,
  CardHeader,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup
} from '@mui/material';
import { TreeView, TreeItem } from '@mui/lab';
import ReactApexChart from 'react-apexcharts';

// hooks
import useSettings from '../../hooks/useSettings';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Page from '../../components/Page';
import Label from '../../components/Label';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { AppLinks, ChartDonut, CompanyTimeline, Block, NewsTable } from '../../components/_dashboard/companies';
import SortingSelecting from '../../components/_dashboard/companies/comparative-table';

//
import LoadingScreen from '../../components/LoadingScreen';

import axios from '../../axios';

// ----------------------------------------------------------------------

const TreeViewStyle = styled(TreeView)({
  height: 260,
  flexGrow: 1,
  maxWidth: 400
});

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
  color: theme.palette.text.secondary
}));

const returnColor = (score) => {
  if (score > 7.5) return 'success';
  if (score < 3.5) return 'error';
  return 'warning';
};

const barColors = (score) => {
  if (score > 7.5) return '#54D62C';
  if (score < 3.5) return '#FF4842';
  return '#FFC107';
};
function StyledTreeItem(props) {
  const { bgColor, color, labelInfo, labelText, ...other } = props;

  return (
    <StyledTreeItemRoot
      label={
        <Box sx={{ display: 'flex', alignItems: 'center', p: 1, pr: 0 }}>
          <Typography variant="body2" sx={{ fontWeight: 'inherit', flexGrow: 1 }}>
            {labelText}
          </Typography>
          <Label color={returnColor(parseInt(labelInfo, 10))} variant="ghost">
            {labelInfo}
          </Label>
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
  labelIcon: PropTypes.elementType.isRequired,
  labelInfo: PropTypes.string,
  labelText: PropTypes.string.isRequired
};

// --------------------------------------------------------

export default function CompaniesView() {
  const { themeStretch } = useSettings();
  const { code } = useParams();
  const [data, setData] = useState({});
  const [envData, setEnvData] = useState({});
  const [socData, setSocData] = useState({});
  const [govData, setGovData] = useState({});
  const [envToggle, setEnvToggle] = useState(true);
  const [socToggle, setSocToggle] = useState(false);
  const [govToggle, setGovToggle] = useState(false);
  const [envChart, setEnvChart] = useState();
  const [socChart, setSocChart] = useState();
  const [govChart, setGovChart] = useState();
  const [envLabels, setEnvLabels] = useState([]);
  const [socLabels, setSocLabels] = useState([]);
  const [govLabels, setGovLabels] = useState([]);
  const [envColors, setEnvColors] = useState([]);
  const [socColors, setSocColors] = useState([]);
  const [govColors, setGovColors] = useState([]);

  const [label, setLabel] = useState([]);
  const [color, setColor] = useState([]);

  const theme = useTheme();

  const chartOptions = {
    colors: [...color],
    chart: { sparkline: { enabled: true } },
    plotOptions: { bar: { columnWidth: '60%', borderRadius: 4, distributed: true } },
    labels: [...label],
    tooltip: {
      x: {
        show: false
      },
      y: {
        formatter: (seriesName) => seriesName,
        title: {
          formatter: (val, opt) => `${opt.w.globals.labels[opt.dataPointIndex]} :`
        }
      },
      marker: { show: false }
    }
  };

  const handleChange = (event) => {
    // console.log(event.target.value);
    if (event.target.value === 'Environment') {
      setEnvToggle(true);
      setSocToggle(false);
      setGovToggle(false);
      setLabel(envLabels);
      setColor(envColors);
    } else if (event.target.value === 'Social') {
      setEnvToggle(false);
      setSocToggle(true);
      setGovToggle(false);
      setLabel(socLabels);
      setColor(socColors);
    } else {
      setEnvToggle(false);
      setSocToggle(false);
      setGovToggle(true);
      setLabel(govLabels);
      setColor(govColors);
    }
  };

  function capitalize(sentence) {
    const words = sentence.split(' ');
    for (let i = 0; i < words.length; i += 1) {
      words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }
    return words.join(' ');
  }

  useEffect(() => {
    const getCompanyData = async (uuid) => {
      const url = `/company/data/${uuid}`;
      const response = await axios.get(url);
      setData(response.data.data);
      setEnvData(response.data.data['esg-score'].children[0]);
      setSocData(response.data.data['esg-score'].children[2]);
      setGovData(response.data.data['esg-score'].children[1]);
    };
    getCompanyData(code);
  }, [code]);

  useEffect(() => {
    const a = [{ data: [] }];
    const aLabels = [];
    const aColors = [];
    Object.keys(envData).forEach((x) => {
      Object.keys(envData[x].children[0]).forEach((y) => {
        a[0].data.push(envData[x].children[0][y].score);
        aLabels.push(capitalize(y.replace(/-/g, ' ')));
        const temp = barColors(parseInt(envData[x].children[0][y].score, 10));
        aColors.push(temp);
      });
    });
    setEnvChart(a);
    setEnvLabels(aLabels);
    setEnvColors(aColors);
    setLabel(aLabels);
    setColor(aColors);
    // console.log(envLabels);
    const b = [{ data: [] }];
    const bLabels = [];
    const bColors = [];
    Object.keys(socData).forEach((x) => {
      Object.keys(socData[x].children[0]).forEach((y) => {
        b[0].data.push(socData[x].children[0][y].score);
        bLabels.push(capitalize(y.replace(/-/g, ' ')));
        const temp = barColors(parseInt(socData[x].children[0][y].score, 10));
        bColors.push(temp);
      });
    });
    setSocChart(b);
    setSocLabels(bLabels);
    setSocColors(bColors);
    const c = [{ data: [] }];
    const cLabels = [];
    const cColors = [];
    Object.keys(govData).forEach((x) => {
      Object.keys(govData[x].children[0]).forEach((y) => {
        c[0].data.push(govData[x].children[0][y].score);
        cLabels.push(capitalize(y.replace(/-/g, ' ')));
        const temp = barColors(parseInt(govData[x].children[0][y].score, 10));
        cColors.push(temp);
      });
    });
    setGovChart(c);
    setGovLabels(cLabels);
    setGovColors(cColors);
  }, [govData]);

  const getRisk = (score) => {
    if (score < 4) return 'High';
    if (score < 8) return 'Medium';
    return 'Low';
  };

  return (
    <>
      {Object.keys(data).length === 0 ? (
        <LoadingScreen />
      ) : (
        <Page title="esgwize | Companies">
          <Container maxWidth={themeStretch ? false : 'lg'}>
            <HeaderBreadcrumbs
              heading="Companies"
              links={[
                { name: 'Home', href: PATH_DASHBOARD.root },
                { name: 'Companies', href: PATH_DASHBOARD.general.companies },
                { name: 'View' }
              ]}
            />
            <Grid container spacing={3}>
              <AppLinks />
              <Grid item xs={12} key="blank">
                &nbsp;
              </Grid>
              <Grid item xs={12} key="header">
                <Typography variant="h5">Company View</Typography>
                <Typography variant="subtitle2">esgwise score details of the selected company</Typography>
              </Grid>
              <Grid item xs={12} key="name">
                <Card dir="ltr" sx={{ p: 3 }}>
                  <Grid container>
                    <Grid item xs={12} key="Companyname">
                      {/* <Typography variant="h3">{company.companyName}</Typography> */}
                      <Typography variant="h3">{data['company-name']}</Typography>
                    </Grid>
                    <Grid item xs={4} key="identifier">
                      <Typography variant="subtitle1" sx={{ color: 'text.disabled' }}>
                        {/* {`Public Identifier: ${company.publicIdentifier}`} */}
                        {`Public Identifier: ${data['company-symbol']}`}
                      </Typography>
                    </Grid>
                    <Grid item xs={4} key="industry">
                      <Typography variant="subtitle1" sx={{ color: 'text.disabled' }}>
                        {/* {`Industry: ${company.industry}`} */}
                        {`Industry: ${data['sector-data'][0].sector}`}
                      </Typography>
                    </Grid>
                    <Grid item xs={4} key="country">
                      <Typography variant="subtitle1" sx={{ color: 'text.disabled' }}>
                        {/* {`Country: ${company.country}`} */}
                        {`Country: ${data['country-data'][0].country}`}
                      </Typography>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
              <Grid item xs={12} md={6} key="main-score">
                <Card>
                  <Box sx={{ flexGrow: 1, p: 3 }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Typography variant="h5">ESG Score</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography fontSize="84px" sx={{ color: 'text.primary' }} align="center">
                          {data['esg-score'].score}
                          {/* {company.score} */}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography fontSize="32px" sx={{ color: 'text.primary' }}>
                          {/* {company.risk} */}
                          {getRisk(data['esg-score'].score)}
                          <br />
                          Risk
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <LinearProgress
                          variant="determinate"
                          value={data['esg-score'].score * 10}
                          color={
                            (data['esg-score'].score > 7.5 && 'success') ||
                            (data['esg-score'].score < 3.5 && 'error') ||
                            'warning'
                          }
                          sx={{ height: 12, bgcolor: 'grey.50016' }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={12} md={6} key="main-score">
                <Card>
                  <Grid container>
                    <Grid item xs={12}>
                      <Box sx={{ flexGrow: 1, p: 3, pb: 0 }}>
                        <FormControl justified>
                          <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            defaultValue="Environment"
                            justified
                          >
                            <FormControlLabel
                              value="Environment"
                              onChange={handleChange}
                              onSelect={() => setEnvToggle(true)}
                              control={<Radio />}
                              label="Environment"
                            />
                            <FormControlLabel
                              value="Social"
                              onChange={handleChange}
                              control={<Radio />}
                              label="Social"
                            />
                            <FormControlLabel
                              value="Governance"
                              onChange={handleChange}
                              control={<Radio />}
                              label="Governance"
                            />
                          </RadioGroup>
                        </FormControl>
                      </Box>
                    </Grid>
                    {envToggle === true && (
                      <>
                        <Grid item xs={12}>
                          <Box sx={{ flexGrow: 1, p: 3 }}>
                            <Grid container spacing={3}>
                              <Grid item xs={12}>
                                <Typography variant="h5">Environment Score</Typography>
                              </Grid>
                              <Grid item xs={4}>
                                <Typography fontSize="44px" sx={{ color: 'text.primary' }} align="center">
                                  {data['esg-score'].children[0]['environment-score'].score}
                                </Typography>
                              </Grid>
                              <Grid item xs={4}>
                                <Typography fontSize="20px" sx={{ color: 'text.primary' }} align="center">
                                  {getRisk(data['esg-score'].children[0]['environment-score'].score)}
                                  <br />
                                  Risk
                                </Typography>
                              </Grid>
                              <Grid
                                item
                                xs={4}
                                style={{
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  paddingRight: 2
                                }}
                              >
                                <ReactApexChart
                                  type="bar"
                                  series={envChart}
                                  options={chartOptions}
                                  width={65}
                                  height={50}
                                />
                              </Grid>
                              <Grid item xs={12}>
                                <LinearProgress
                                  variant="determinate"
                                  value={data['esg-score'].children[0]['environment-score'].score * 10}
                                  color={
                                    (data['esg-score'].children[0]['environment-score'].score > 7.5 && 'success') ||
                                    (data['esg-score'].children[0]['environment-score'].score < 3.5 && 'error') ||
                                    'warning'
                                  }
                                  sx={{ height: 8, bgcolor: 'grey.50016' }}
                                />
                              </Grid>
                            </Grid>
                          </Box>
                        </Grid>
                      </>
                    )}
                    {socToggle === true && (
                      <Grid item xs={12}>
                        <Box sx={{ flexGrow: 1, p: 3 }}>
                          <Grid container spacing={3}>
                            <Grid item xs={12}>
                              <Typography variant="h5">Social Score</Typography>
                            </Grid>
                            <Grid item xs={4}>
                              <Typography fontSize="44px" sx={{ color: 'text.primary' }} align="center">
                                {data['esg-score'].children[2]['social-score'].score}
                              </Typography>
                            </Grid>
                            <Grid item xs={4}>
                              <Typography fontSize="20px" sx={{ color: 'text.primary' }} align="center">
                                {getRisk(data['esg-score'].children[2]['social-score'].score)}
                                <br />
                                Risk
                              </Typography>
                            </Grid>
                            <Grid
                              item
                              xs={4}
                              style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                paddingRight: 2
                              }}
                            >
                              <ReactApexChart
                                type="bar"
                                series={socChart}
                                options={chartOptions}
                                width={65}
                                height={50}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <LinearProgress
                                variant="determinate"
                                value={data['esg-score'].children[2]['social-score'].score * 10}
                                color={
                                  (data['esg-score'].children[2]['social-score'].score > 7.5 && 'success') ||
                                  (data['esg-score'].children[2]['social-score'].score < 3.5 && 'error') ||
                                  'warning'
                                }
                                sx={{ height: 8, bgcolor: 'grey.50016' }}
                              />
                            </Grid>
                          </Grid>
                        </Box>
                      </Grid>
                    )}
                    {govToggle === true && (
                      <Grid item xs={12}>
                        <Box sx={{ flexGrow: 1, p: 3 }}>
                          <Grid container spacing={3}>
                            <Grid item xs={12}>
                              <Typography variant="h5">Governance Score</Typography>
                            </Grid>
                            <Grid item xs={4}>
                              <Typography fontSize="44px" sx={{ color: 'text.primary' }} align="center">
                                {data['esg-score'].children[1]['governance-score'].score}
                              </Typography>
                            </Grid>
                            <Grid item xs={4}>
                              <Typography fontSize="20px" sx={{ color: 'text.primary' }} align="center">
                                {getRisk(data['esg-score'].children[1]['governance-score'].score)}
                                <br />
                                Risk
                              </Typography>
                            </Grid>
                            <Grid
                              item
                              xs={4}
                              style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                paddingRight: 2
                              }}
                            >
                              <ReactApexChart
                                type="bar"
                                series={govChart}
                                options={chartOptions}
                                width={65}
                                height={50}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <LinearProgress
                                variant="determinate"
                                value={data['esg-score'].children[1]['governance-score'].score * 10}
                                color={
                                  (data['esg-score'].children[1]['governance-score'].score > 7.5 && 'success') ||
                                  (data['esg-score'].children[1]['governance-score'].score < 3.5 && 'error') ||
                                  'warning'
                                }
                                sx={{ height: 8, bgcolor: 'grey.50016' }}
                              />
                            </Grid>
                          </Grid>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </Card>
              </Grid>
              <Grid item xs={12} md={4} key="donut">
                <Card dir="ltr">
                  <CardHeader title="ESG Score Composition" />
                  <CardContent
                    sx={{
                      height: 420,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <ChartDonut data={data['esg-score'].children} />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={8} key="table">
                <Card>
                  <SortingSelecting data={data} />
                </Card>
              </Grid>
              <Grid item xs={12} md={8}>
                <Card>
                  <NewsTable companyName={data['company-name']} />
                </Card>
              </Grid>
              <Grid item xs={12} md={4} key="donut1">
                <Card dir="ltr">
                  <CompanyTimeline data={data['historical-data']} />
                </Card>
              </Grid>
              <Grid item xs={12} md={4} key="e-Component">
                <Block title="Environment Component" sx={{ overflow: 'auto', p: 3 }}>
                  <TreeViewStyle
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}
                    defaultExpanded={['environment-score']}
                    defaultEndIcon={null}
                  >
                    {Object.keys(envData).map((x) => (
                      <StyledTreeItem
                        nodeId={x}
                        labelText={capitalize(x.replace(/-/g, ' '))}
                        key={x}
                        labelInfo={envData[x].score}
                        color="#000"
                        bgColor="#e8f0fe"
                      >
                        {Object.keys(envData[x].children[0]).map((y) => (
                          <StyledTreeItem
                            nodeId={y}
                            labelText={capitalize(y.replace(/-/g, ' '))}
                            key={y}
                            labelInfo={envData[x].children[0][y].score}
                            color="#000"
                            bgColor="#e8f0fe"
                          >
                            {Object.keys(envData[x].children[0][y].children[0]).map((z) => (
                              <StyledTreeItem
                                nodeId={z}
                                labelText={capitalize(z.replace(/-/g, ' '))}
                                key={z}
                                labelInfo={envData[x].children[0][y].children[0][z].score}
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
                <Block title="Social Component" sx={{ overflow: 'auto', p: 3 }}>
                  <TreeViewStyle
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}
                    defaultExpanded={['social-score']}
                    defaultEndIcon={null}
                  >
                    {Object.keys(socData).map((x) => (
                      <StyledTreeItem
                        nodeId={x}
                        labelText={capitalize(x.replace(/-/g, ' '))}
                        key={x}
                        labelInfo={socData[x].score}
                        color="#000"
                        bgColor="#e8f0fe"
                      >
                        {Object.keys(socData[x].children[0]).map((y) => (
                          <StyledTreeItem
                            nodeId={y}
                            labelText={capitalize(y.replace(/-/g, ' '))}
                            key={y}
                            labelInfo={socData[x].children[0][y].score}
                            color="#000"
                            bgColor="#e8f0fe"
                          >
                            {Object.keys(socData[x].children[0][y].children[0]).map((z) => (
                              <StyledTreeItem
                                nodeId={z}
                                labelText={capitalize(z.replace(/-/g, ' '))}
                                key={z}
                                labelInfo={socData[x].children[0][y].children[0][z].score}
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
                <Block title="Governance Component" sx={{ overflow: 'auto', p: 3 }}>
                  <TreeViewStyle
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}
                    defaultExpanded={['governance-score']}
                    defaultEndIcon={null}
                  >
                    {Object.keys(govData).map((x) => (
                      <StyledTreeItem
                        nodeId={x}
                        labelText={capitalize(x.replace(/-/g, ' '))}
                        key={x}
                        labelInfo={govData[x].score}
                        color="#000"
                        bgColor="#e8f0fe"
                      >
                        {Object.keys(govData[x].children[0]).map((y) => (
                          <StyledTreeItem
                            nodeId={y}
                            labelText={capitalize(y.replace(/-/g, ' '))}
                            key={y}
                            labelInfo={govData[x].children[0][y].score}
                            color="#000"
                            bgColor="#e8f0fe"
                          >
                            {Object.keys(govData[x].children[0][y].children[0]).map((z) => (
                              <StyledTreeItem
                                nodeId={z}
                                labelText={capitalize(z.replace(/-/g, ' '))}
                                key={z}
                                labelInfo={govData[x].children[0][y].children[0][z].score}
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
              <Grid item>
                <Button variant="contained" disabled style={{ marginRight: '20px' }}>
                  Archives
                </Button>
                <Button
                  to={`/dashboard/companies/view/${code}/files`}
                  component={RouterLink}
                  variant="contained"
                >
                  Data Files
                </Button>
              </Grid>
            </Grid>
          </Container>
        </Page>
      )}
    </>
  );
}
