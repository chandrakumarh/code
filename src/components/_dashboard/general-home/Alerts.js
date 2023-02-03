import { PropTypes } from 'prop-types';
import { Icon } from '@iconify/react';
import governmentLine from '@iconify/icons-ri/government-fill';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
import fileExclamationFilled from '@iconify/icons-ant-design/file-exclamation-filled';
import deviceAnalytics from '@iconify/icons-tabler/device-analytics';
import calendarOutlined from '@iconify/icons-ant-design/calendar-outlined';
// material
import { Box, Card, Stack, Button, Typography, CardHeader } from '@mui/material';

import Label from '../../Label';

// ----------------------------------------------------------------------

export default function Alerts(props) {
  const { data } = props;
  function createData(datetime, type, details, priority, icon) {
    return { datetime, type, details, priority, icon };
  }

  const getIcon = {
    'Data Files': <Icon icon={fileExclamationFilled} height="7%" width="7%" color="#036bfc" inline />,
    'Risk Monitoring': <Icon icon={deviceAnalytics} height="7%" width="7%" color="grey" inline />,
    'Company Setup': <Icon icon={governmentLine} height="7%" width="7%" color="black" inline />,
    'Portfolio Simulation': <Icon icon={calendarOutlined} color="green" height="7%" width="7%" inline />
  };

  const getColor = (priority) => {
    if (priority === 'Low') return 'info';
    if (priority === 'Medium') return 'warning';
    if (priority === 'Completed') return 'success';
    return 'error';
  };

  const newRows = data
    .slice(0, 4)
    .map((row) => createData(row.datetime, row.type, row.details, row.priority, getIcon[row.type]));

  function capitalize(s) {
    return s[0].toUpperCase() + s.slice(1);
  }

  return (
    <Card style={{ height: '100%' }}>
      <CardHeader title="Alerts" />
      <Stack spacing={3} sx={{ p: 4 }} style={{ filter: 'blur(6px)' }}>
        {newRows.map((row) => (
          <Stack direction="row" alignItems="center" key={row.details}>
            {row.icon}
            <Box sx={{ flexGrow: 1, ml: 2, minWidth: 100 }}>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }} noWrap>
                {row.type.length > 100 ? `${capitalize(row.type).slice(0, 100)}...` : `${capitalize(row.type)}`}
                {'\t'}
                <Label color={getColor(row.priority)} variant="ghost">
                  {capitalize(row.priority)}
                </Label>
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                {row.details.length > 100
                  ? `${capitalize(row.details).slice(0, 100)}...`
                  : `${capitalize(row.details)}`}
              </Typography>
            </Box>

            {/* <Tooltip title="Source Link" style={{ alignItems: 'right' }}>
              <a href={row.answerSource} target="_blank" rel="noreferrer" style={{ alignItems: 'right' }}>
                <MIconButton size="small">
                  <Icon icon={linkExternal} color="#9da39d" width={22} height={22} inline />
                </MIconButton>
              </a>
            </Tooltip> */}
          </Stack>
        ))}

        <Button variant="outlined" size="large" color="inherit" endIcon={<Icon icon={arrowIosForwardFill} />}>
          View All
        </Button>
      </Stack>
    </Card>
  );
}

Alerts.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      datetime: PropTypes.number,
      type: PropTypes.string,
      details: PropTypes.string,
      priority: PropTypes.string
    })
  )
};
