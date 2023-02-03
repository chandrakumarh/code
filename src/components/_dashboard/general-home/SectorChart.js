import { PropTypes } from 'prop-types';
import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
// material
import { Box, Card, CardHeader } from '@mui/material';
// utils
import { fNumber } from '../../../utils/formatNumber';
//
import { BaseOptionChart } from '../../charts';

// ----------------------------------------------------------------------

export default function SectorChart(props) {
  const { data } = props;
  const chartOptions = merge(BaseOptionChart(), {
    tooltip: {
      marker: { show: false },
      y: {
        formatter: (seriesName) => fNumber(seriesName),
        title: {
          formatter: () => ''
        }
      }
    },
    plotOptions: {
      bar: { horizontal: true, barHeight: '28%', borderRadius: 2 }
    },
    xaxis: {
      categories: data.map((sector) => sector.sector)
    }
  });
  const values = [{ data: data.map((sector) => sector.count) }];

  return (
    <Card style={{ height: '100%' }}>
      <CardHeader title="Sectors" />
      <Box sx={{ mx: 3 }} dir="ltr">
        <ReactApexChart type="bar" series={values} options={chartOptions} height={364} />
      </Box>
    </Card>
  );
}

SectorChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      count: PropTypes.number,
      'avg-esgscore': PropTypes.number,
      sector: PropTypes.string,
      'sector-code': PropTypes.string
    })
  )
};
