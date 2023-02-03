import { PropTypes } from 'prop-types';
import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
//
import BaseOptionChart from './BaseOptionChart';

// ----------------------------------------------------------------------

export default function ChartDonut(props) {
  const { data } = props;
  let total = 0;
  data.forEach((obj) => (total += obj.count));
  // const DATA = data.map((obj) => obj.count);
  const DATA = data.map((obj) => Math.round((obj.count * 10000) / total) / 100);
  const chartOptions = merge(BaseOptionChart(), {
    labels: data.map((sector) => sector.sector),
    stroke: { show: false },
    legend: { show: false, horizontalAlign: 'center', position: 'top' },
    plotOptions: { pie: { donut: { size: '50%' } } }
  });

  return <ReactApexChart type="donut" series={DATA} options={chartOptions} width={400} height={400} />;
}

ChartDonut.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      count: PropTypes.number,
      'avg-esgscore': PropTypes.number,
      sector: PropTypes.string,
      'sector-code': PropTypes.string
    })
  )
};
