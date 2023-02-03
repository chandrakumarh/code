import { orderBy } from 'lodash';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink, useParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useEffect, useCallback, useState } from 'react';
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
import { AppLinks, ChartDonut, ChartDonutCustom } from '../../components/_dashboard/templates';
import SortingSelecting from '../../components/_dashboard/templates/comparative-table';
//
import { COMPANY_DATA, TEMPLATE_DATA } from '../../data/data';

// ----------------------------------------------------------------------

export default function CompaniesView() {
  const { themeStretch } = useSettings();
  const { code, id } = useParams();

  const company = COMPANY_DATA[code];
  const template = TEMPLATE_DATA[id];

  console.log(company);
  console.log(template);

  let total = 0;
  let esgScore = 0;

  Object.values(template.template).forEach((x) => {
    total += x.weight;
    esgScore += company[x.axisCode] * x.weight;
  });

  esgScore = Math.round(esgScore / total);
  const esgRisk = (esgScore > 7.5 && 'Low') || (esgScore < 3.5 && 'High') || 'Medium';

  return (
    <Page title="esgwize | Templates">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Templates"
          links={[
            { name: 'Home', href: PATH_DASHBOARD.root },
            { name: 'Templates', href: PATH_DASHBOARD.general.templates },
            { name: 'Custom Companies Score', href: PATH_DASHBOARD.general.customCompanySelect },
            { name: 'View' }
          ]}
        />
        <Grid container spacing={3}>
          <AppLinks />
          <Grid item xs={12} key="blank">
            &nbsp;
          </Grid>
          <Grid item xs={12} key="header">
            <Typography variant="h5">Custom Company View</Typography>
            <Typography variant="subtitle2">Custom esg score details of the selected company</Typography>
          </Grid>
          <Grid item xs={12} key="name">
            <Card dir="ltr" sx={{ p: 3 }}>
              <Grid container>
                <Grid item xs={12} key="Companyname">
                  <Typography variant="h3">{company.companyName}</Typography>
                </Grid>
                <Grid item xs={4} key="identifier">
                  <Typography variant="subtitle1" sx={{ color: 'text.disabled' }}>
                    {`Public Identifier: ${company.publicIdentifier}`}
                  </Typography>
                </Grid>
                <Grid item xs={4} key="industry">
                  <Typography variant="subtitle1" sx={{ color: 'text.disabled' }}>
                    {`Industry: ${company.industry}`}
                  </Typography>
                </Grid>
                <Grid item xs={4} key="country">
                  <Typography variant="subtitle1" sx={{ color: 'text.disabled' }}>
                    {`Country: ${company.country}`}
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
                          {company['e-component-score']}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography fontSize="14px" sx={{ color: 'text.primary' }}>
                          {company['e-component-risk']}
                          <br />
                          Risk
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <LinearProgress
                          variant="determinate"
                          value={company['e-component-score'] * 10}
                          color={
                            (company['e-component-score'] > 7.5 && 'success') ||
                            (company['e-component-score'] < 3.5 && 'error') ||
                            'warning'
                          }
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
                          {company['s-component-score']}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography fontSize="14px" sx={{ color: 'text.primary' }}>
                          {company['s-component-risk']}
                          <br />
                          Risk
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <LinearProgress
                          variant="determinate"
                          value={company['s-component-score'] * 10}
                          color={
                            (company['s-component-score'] > 7.5 && 'success') ||
                            (company['s-component-score'] < 3.5 && 'error') ||
                            'warning'
                          }
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
                          {company['g-component-score']}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography fontSize="14px" sx={{ color: 'text.primary' }}>
                          {company['g-component-risk']}
                          <br />
                          Risk
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <LinearProgress
                          variant="determinate"
                          value={company['g-component-score'] * 10}
                          color={
                            (company['g-component-score'] > 7.5 && 'success') ||
                            (company['g-component-score'] < 3.5 && 'error') ||
                            'warning'
                          }
                          sx={{ height: 8, bgcolor: 'grey.50016' }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
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
                <ChartDonutCustom />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={8} key="table">
            <Card>
              <SortingSelecting />
            </Card>
          </Grid>
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
