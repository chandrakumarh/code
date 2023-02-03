import { merge } from 'lodash';
import React from 'react';
import ReactApexChart from 'react-apexcharts';

import { Divider, Toolbar, styled, Box, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useSelector, useDispatch } from 'react-redux';
import { setCompanyName } from '../../../../redux/company/company.actions';
import BaseOptionChart from '../../../charts/BaseOptionChart';

const RootStyle = styled(Toolbar)`
  display: flex;
  justify-content: space-between;
  min-height: 64px;
  height: 96px;

  & h1 {
    @media only screen and (max-width: 410px) {
      font-size: 1.8rem;
    }
  }

  @media only screen and (max-width: 900px) {
    border-color: rgba(145, 158, 171, 0.24);
    border-width: 0;
    border-style: solid;
    border-top-width: 1px;
  }

  @media only screen and (max-width: 500px) {
    margin: 1rem 0;
  }
`;

function PieChart({ company }) {
  const options = merge(BaseOptionChart(), {
    labels: company.map((item) => item.companyName),
    stroke: { show: false },
    legend: { horizontalAlign: 'center' },
    plotOptions: { pie: { donut: { size: '90%' } } }
  });

  console.log(typeof options);

  const series = company.map((item) => item.weight);

  return <ReactApexChart options={options} series={series} type="donut" height={320} />;
}

function BarChart({ company, height }) {
  const options = merge(BaseOptionChart(), {
    chart: {
      type: 'bar',
      height
    },
    labels: company.map((item) => item.companyName),
    plotOptions: {
      bar: {
        barHeight: '100%',
        distributed: true,
        horizontal: true,
        dataLabels: {
          position: 'bottom'
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      width: 1,
      colors: ['#fff']
    },
    xaxis: {
      categories: company.map((item) => item.companyName)
    },
    yaxis: {
      labels: {
        show: true
      }
    },
    tooltip: {
      x: {
        show: true
      },
      y: {
        title: {
          formatter: () => ''
        }
      }
    }
  });

  const series = [
    {
      data: company.map((item) => item.weight)
    }
  ];

  return <ReactApexChart options={options} series={series} type="bar" height={height} />;
}

const MakeChart = ({ activeStep, handleBack, isSubmitting }) => {
  const company = useSelector((state) => state.company.company);

  return (
    <>
      <RootStyle>
        <h1>Shares Of Each Company</h1>
      </RootStyle>
      <Divider />
      <div style={{ marginTop: '2rem' }}>
        {company.length < 10 ? <PieChart company={company} /> : <BarChart company={company} height={600} />}
      </div>
      <Divider />
      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
        <Button variant="outlined" disabled={activeStep === 0} onClick={handleBack} sx={{ ml: 1 }}>
          Back
        </Button>
        <Box sx={{ flex: '1 1 auto' }} />
        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          Submit
        </LoadingButton>
      </Box>
    </>
  );
};

export default MakeChart;
