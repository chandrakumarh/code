import { orderBy } from 'lodash';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink, useParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useEffect, useCallback, useState } from 'react';
import { object } from 'prop-types';
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
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  LinearProgress,
  CardContent,
  CardHeader,
  TableContainer,
  TablePagination
} from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getPostsInitial, getMorePosts } from '../../redux/slices/blog';
// hooks
import useSettings from '../../hooks/useSettings';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { AppLinks, ChartDonut, ChartDonutCustom, ChartDonutPortfolio } from '../../components/_dashboard/templates';
//
import { COMPANY_DATA, PORTFOLIO_DATA, TEMPLATE_DATA } from '../../data/data';

// ----------------------------------------------------------------------

export default function CompaniesView() {
  const { themeStretch } = useSettings();
  const { code, id } = useParams();

  console.log(code);
  console.log(id);

  function createData(
    name,
    weight,
    companyName,
    industry,
    country,
    score,
    risk,
    publicIdentifier,
    esgwizeCode,
    ecomponentscore,
    scomponentscore,
    gcomponentscore,
    ecomponentrisk,
    scomponentrisk,
    gcomponentrisk
  ) {
    return [
      {
        name,
        weight,
        companyName,
        industry,
        country,
        score,
        risk,
        publicIdentifier,
        esgwizeCode,
        ecomponentscore,
        scomponentscore,
        gcomponentscore,
        ecomponentrisk,
        scomponentrisk,
        gcomponentrisk
      }
    ];
  }

  const portfolio = PORTFOLIO_DATA[code];
  const template = TEMPLATE_DATA[id];
  // const company = COMPANY_DATA[portfolio.portfolio[1].companyCode];
  let selectedPortfolio = [];
  Object.values(portfolio.portfolio).forEach((x) => {
    selectedPortfolio = [
      ...selectedPortfolio,
      ...createData(
        x.companyCode,
        x.weight,
        COMPANY_DATA[x.companyCode].companyName,
        COMPANY_DATA[x.companyCode].industry,
        COMPANY_DATA[x.companyCode].country,
        COMPANY_DATA[x.companyCode].score,
        COMPANY_DATA[x.companyCode].risk,
        COMPANY_DATA[x.companyCode].publicIdentifier,
        COMPANY_DATA[x.companyCode].esgwizeCode,
        COMPANY_DATA[x.companyCode]['e-component-score'],
        COMPANY_DATA[x.companyCode]['s-component-score'],
        COMPANY_DATA[x.companyCode]['g-component-score'],
        COMPANY_DATA[x.companyCode]['e-component-risk'],
        COMPANY_DATA[x.companyCode]['s-component-risk'],
        COMPANY_DATA[x.companyCode]['g-component-risk']
      )
    ];
    // console.log(x.companyCode);
  });

  console.log(COMPANY_DATA);
  // console.log(company);
  console.log(selectedPortfolio);

  let total = 0;
  let templateTotal = 0;
  const templateWeights = {};
  let esgScore = 0;
  let eScore = 0;
  let sScore = 0;
  let gScore = 0;

  Object.values(selectedPortfolio).forEach((x) => {
    total += x.weight;
    // esgScore += x.score * x.weight;
    eScore += x.ecomponentscore * x.weight;
    sScore += x.scomponentscore * x.weight;
    gScore += x.gcomponentscore * x.weight;
  });

  Object.values(template.template).forEach((x) => {
    templateTotal += x.weight;
    templateWeights[x.axisCode] = x.weight;
    // esgScore += company[x.axisCode] * x.weight;
  });

  // console.log(total);
  // console.log(esgScore);
  // console.log(eScore);
  // console.log(sScore);
  // console.log(gScore);
  console.log(templateTotal);
  console.log(templateWeights);

  esgScore =
    eScore * templateWeights['e-component-score'] +
    sScore * templateWeights['s-component-score'] +
    gScore * templateWeights['g-component-score'];

  esgScore = Math.round(esgScore / (total * templateTotal));
  eScore = Math.round(eScore / total);
  sScore = Math.round(sScore / total);
  gScore = Math.round(gScore / total);

  const esgRisk = (esgScore > 7.5 && 'Low') || (esgScore < 3.5 && 'High') || 'Medium';
  const eRisk = (eScore > 7.5 && 'Low') || (eScore < 3.5 && 'High') || 'Medium';
  const sRisk = (sScore > 7.5 && 'Low') || (sScore < 3.5 && 'High') || 'Medium';
  const gRisk = (gScore > 7.5 && 'Low') || (gScore < 3.5 && 'High') || 'Medium';

  console.log(esgRisk);
  console.log(eRisk);
  console.log(sRisk);
  console.log(gRisk);

  // let sum = 0;
  // const key = '3m-inc';
  // const y = COMPANY_DATA[key];
  // const z = {};
  // Object.defineProperty(z, key, { value: y });
  // z = Object.assign(z, y);
  // ABC
  // <br />
  // fads
  // <br />
  // {y.companyName}
  // <br />
  // {z[key].companyName}
  // <br />
  // {Math.round(sum / 3)}
  // <br />

  // Object.values(COMPANY_DATA).forEach((x) => (sum += x.score));
  // console.log(sum)

  return (
    <Page title="esgwize | Templates">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Templates"
          links={[
            { name: 'Home', href: PATH_DASHBOARD.root },
            { name: 'Templates', href: PATH_DASHBOARD.general.templates },
            { name: 'Custom Portfolio Score', href: PATH_DASHBOARD.general.customPortfolioSelect },
            { name: 'View' }
          ]}
        />
        <Grid container spacing={3}>
          <AppLinks />
          <Grid item xs={12} key="blank">
            &nbsp;
          </Grid>
          <Grid item xs={12} key="header">
            <Typography variant="h5">Custom Portfolio View</Typography>
            <Typography variant="subtitle2">Custom esg score details of the selected portfolio</Typography>
          </Grid>
          <Grid item xs={12} key="name">
            <Card dir="ltr" sx={{ p: 3 }}>
              <Grid container>
                <Grid item xs={12} key="Companyname">
                  <Typography variant="h3">{portfolio.portfolioName}</Typography>
                </Grid>
                <Grid item xs={12} key="identifier">
                  <Typography variant="subtitle1" sx={{ color: 'text.disabled' }}>
                    {`Portfolio Description: ${portfolio.description}`}
                  </Typography>
                </Grid>
              </Grid>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} key="main-score1">
            <Card>
              <Box sx={{ flexGrow: 1, p: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h5">ESG Score</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography fontSize="96px" sx={{ color: 'text.primary' }} align="center">
                      {esgScore}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography fontSize="32px" sx={{ color: 'text.primary' }}>
                      {esgRisk}
                      <br />
                      Risk
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <LinearProgress
                      variant="determinate"
                      value={esgScore * 10}
                      color={(esgScore > 7.5 && 'success') || (esgScore < 3.5 && 'error') || 'warning'}
                      sx={{ height: 12, bgcolor: 'grey.50016' }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} key="main-score2">
            <Card>
              <Grid container>
                <Grid item xs={6}>
                  <Box sx={{ flexGrow: 1, p: 3 }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Typography variant="h6">ESG Score</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography fontSize="30px" sx={{ color: 'text.primary' }} align="center">
                          {esgScore}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography fontSize="14px" sx={{ color: 'text.primary' }}>
                          {esgRisk}
                          <br />
                          Risk
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <LinearProgress
                          variant="determinate"
                          value={esgScore * 10}
                          color={(esgScore > 7.5 && 'success') || (esgScore < 3.5 && 'error') || 'warning'}
                          sx={{ height: 8, bgcolor: 'grey.50016' }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ flexGrow: 1, p: 3 }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Typography variant="h6">Environment Score</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography fontSize="30px" sx={{ color: 'text.primary' }} align="center">
                          {eScore}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography fontSize="14px" sx={{ color: 'text.primary' }}>
                          {eRisk}
                          <br />
                          Risk
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <LinearProgress
                          variant="determinate"
                          value={eScore * 10}
                          color={(eScore > 7.5 && 'success') || (eScore < 3.5 && 'error') || 'warning'}
                          sx={{ height: 8, bgcolor: 'grey.50016' }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ flexGrow: 1, p: 3 }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Typography variant="h6">Social Score</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography fontSize="30px" sx={{ color: 'text.primary' }} align="center">
                          {sScore}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography fontSize="14px" sx={{ color: 'text.primary' }}>
                          {sRisk}
                          <br />
                          Risk
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <LinearProgress
                          variant="determinate"
                          value={sScore * 10}
                          color={(sScore > 7.5 && 'success') || (sScore < 3.5 && 'error') || 'warning'}
                          sx={{ height: 8, bgcolor: 'grey.50016' }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ flexGrow: 1, p: 3 }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Typography variant="h6">Governance Score</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography fontSize="30px" sx={{ color: 'text.primary' }} align="center">
                          {gScore}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography fontSize="14px" sx={{ color: 'text.primary' }}>
                          {gRisk}
                          <br />
                          Risk
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <LinearProgress
                          variant="determinate"
                          value={gScore * 10}
                          color={(gScore > 7.5 && 'success') || (gScore < 3.5 && 'error') || 'warning'}
                          sx={{ height: 8, bgcolor: 'grey.50016' }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} key="donut1">
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
                <ChartDonutCustom />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} key="donut2">
            <Card dir="ltr">
              <CardHeader title="Portfolio Composition" />
              <CardContent
                sx={{
                  height: 420,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ChartDonutPortfolio />
              </CardContent>
            </Card>
          </Grid>
          {/* <Grid item xs={12} md={8} key="table">
            <Card>
              <SortingSelecting />
            </Card>
          </Grid> */}
        </Grid>

        {/* <br />
        <br />
        <br /> */}
        {/* <Grid Container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5">Company View</Typography>
            <Typography variant="subtitle2">esgwise score details of the selected company</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
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
                <ChartDonut />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card>
              <SortingSelecting />
            </Card>
          </Grid>
        </Grid> */}
      </Container>
    </Page>
  );
}
