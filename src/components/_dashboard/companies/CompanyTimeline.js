import PropTypes from 'prop-types';
// material
import { Card, Typography, CardHeader, CardContent } from '@mui/material';
import { Timeline, TimelineDot, TimelineItem, TimelineContent, TimelineConnector, TimelineSeparator } from '@mui/lab';
// utils
import { fDateTime } from '../../../utils/formatTime';
import Label from '../../Label';

// ----------------------------------------------------------------------

function compare(a, b) {
  if (a.time < b.time) {
    return 1;
  }
  if (a.time > b.time) {
    return -1;
  }
  return 0;
}

OrderItem.propTypes = {
  item: PropTypes.object,
  isLast: PropTypes.bool
};

const returnColor = (score) => {
  if (score > 7.5) return 'success';
  if (score < 3.5) return 'error';
  return 'warning';
};

function OrderItem({ item, isLast }) {
  const { color, score, time } = item;
  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot color={color} />
        {isLast ? null : <TimelineConnector />}
      </TimelineSeparator>
      <TimelineContent>
        <Typography variant="subtitle2">
          Score -{' '}
          <Label color={returnColor(parseInt(score, 10))} variant="ghost">
            {score}
          </Label>
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {fDateTime(time * 10000)}
        </Typography>
      </TimelineContent>
    </TimelineItem>
  );
}

export default function CompanyTimeline(props) {
  const { data } = props;
  function getColor(arr) {
    const result = arr.map((obj, index) => {
      if (index === arr.length - 1) return 'info';
      if (arr[index].score > arr[index + 1].score) return 'success';
      if (arr[index].score < arr[index + 1].score) return 'error';
      return 'warning';
    });

    return result;
  }
  const colorArray = getColor(data);
  const sortedArray = data.sort(compare);
  return (
    <Card
      sx={{
        '& .MuiTimelineItem-missingOppositeContent:before': {
          display: 'none'
        }
      }}
    >
      <CardHeader title="Historical Data" />
      <CardContent>
        <Timeline>
          {sortedArray.map((item, index) => (
            <OrderItem
              key={item.title}
              item={{ ...item, color: colorArray[index] }}
              isLast={index === data.length - 1}
            />
          ))}
        </Timeline>
      </CardContent>
    </Card>
  );
}

CompanyTimeline.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      time: PropTypes.number,
      score: PropTypes.number
    })
  )
};
