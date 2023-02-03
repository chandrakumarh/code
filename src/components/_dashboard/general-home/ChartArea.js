import { PropTypes } from 'prop-types';
import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
//
import BaseOptionChart from './BaseOptionChart';

// ----------------------------------------------------------------------

export default function ChartArea(props) {
  const { data } = props;
  const chartOptions = merge(BaseOptionChart(), {
    xaxis: {
      type: 'category',
      categories: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
    },
    tooltip: { x: { format: 'score:' }, marker: { show: false } }
  });

  const DATA = [
    { name: 'current', data: data.current },
    { name: 'previous quarter', data: data['previous-quarter'] },
    { name: '2 previous quarter', data: data['2-previous-quarter'] }
  ];

  return <ReactApexChart type="area" series={DATA} options={chartOptions} height={320} />;
}

ChartArea.propTypes = {
  data: PropTypes.shape({
    current: PropTypes.arrayOf(PropTypes.number),
    'previous-quarter': PropTypes.arrayOf(PropTypes.number),
    '2-previous-quarter': PropTypes.arrayOf(PropTypes.number)
  })
};
