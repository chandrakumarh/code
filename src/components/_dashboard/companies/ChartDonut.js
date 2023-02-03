import PropTypes from 'prop-types';
import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
//
import BaseOptionChart from './BaseOptionChart';

// ----------------------------------------------------------------------

export default function ChartDonut(props) {
  const { data } = props;
  const theme = useTheme();
  const envScore = data[0]['environment-score'].score;
  const socScore = data[2]['social-score'].score;
  const govScore = data[1]['governance-score'].score;
  const total = envScore + socScore + govScore;
  const DATA = [
    Math.round((envScore * 10000) / total) / 100,
    Math.round((socScore * 10000) / total) / 100,
    Math.round((govScore * 10000) / total) / 100
  ];
  const chartOptions = merge(BaseOptionChart(), {
    colors: [theme.palette.primary.lighter, theme.palette.primary.main, theme.palette.primary.darker],
    labels: ['Environment', 'Social', 'Governance'],
    stroke: { show: false },
    legend: { horizontalAlign: 'center' },
    plotOptions: { pie: { donut: { size: '90%' } } }
  });

  return <ReactApexChart type="donut" series={DATA} options={chartOptions} width={400} />;
}

ChartDonut.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      'environment-score': PropTypes.shape({ score: PropTypes.number }),
      'social-score': PropTypes.shape({ score: PropTypes.number }),
      'governance-score': PropTypes.shape({ score: PropTypes.number })
    })
  )
};
