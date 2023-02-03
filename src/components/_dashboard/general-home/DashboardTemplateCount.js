import { PropTypes } from 'prop-types';
import { Icon } from '@iconify/react';
// material
import { alpha, styled } from '@mui/material/styles';
import { Card, Typography } from '@mui/material';
// utils
import { ICONS } from '../../../utils/getIcons';
import { fShortenNumber } from '../../../utils/formatNumber';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(5, 0),
  color: theme.palette.primary.darker,
  backgroundColor: theme.palette.primary.lighter
}));

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.dark,
  backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0)} 0%, ${alpha(
    theme.palette.primary.dark,
    0.24
  )} 100%)`
}));

// ----------------------------------------------------------------------

export default function DashboardTemplateCount(props) {
  const { data } = props;
  return (
    <RootStyle>
      <IconWrapperStyle>
        <Icon src={ICONS.banking} alt="companies" width={24} height={24}>
          {ICONS.booking}
        </Icon>
      </IconWrapperStyle>
      <Typography variant="h3">{fShortenNumber(data['template-count'])}</Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        Number of Templates
      </Typography>
    </RootStyle>
  );
}

DashboardTemplateCount.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      'template-count': PropTypes.number,
      'portfolio-count': PropTypes.number,
      'simulation-count': PropTypes.number,
      'company-count': PropTypes.number
    })
  )
};
