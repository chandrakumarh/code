import { PropTypes } from 'prop-types';
import React from 'react';
import WorldMap from 'react-svg-worldmap';
import { useTheme } from '@mui/material/styles';
import { Card, CardHeader, CardContent } from '@mui/material';

export default function MapDisplay(props) {
  const { data } = props;
  const theme = useTheme();
  const DATA = data.map((obj) => ({ country: obj['country-code'], value: obj.count }));
  return (
    <Card
      dir="ltr"
      style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', height: '100%' }}
    >
      <CardHeader title="Company Distribution by Country" />
      <CardContent sx={{ display: 'flex', alignItems: 'center', alignContent: 'center', justifyContent: 'center' }}>
        <WorldMap
          color={theme.palette.primary.main}
          tooltipBgColor={theme.palette.primary.darker}
          valueSuffix="companies"
          size="responsive"
          data={DATA}
        />
      </CardContent>
    </Card>
  );
}

MapDisplay.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      count: PropTypes.number,
      'avg-esgscore': PropTypes.number,
      country: PropTypes.string,
      'country-code': PropTypes.string
    })
  )
};
