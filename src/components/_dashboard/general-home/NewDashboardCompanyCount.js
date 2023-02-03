import { PropTypes } from 'prop-types';
import { Icon } from '@iconify/react';
// material
import { alpha, styled } from '@mui/material/styles';
import { Card, Typography } from '@mui/material';
// utils
import { ICONS } from '../../../utils/getIcons';
import { fShortenNumber } from '../../../utils/formatNumber';
import SvgIconStyle from '../../SvgIconStyle';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(5, 0),
  color: theme.palette.info.darker,
  backgroundColor: theme.palette.info.lighter
}));

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(9),
  height: theme.spacing(9),
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  color: theme.palette.info.dark,
  backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.info.dark, 0)} 0%, ${alpha(
    theme.palette.info.dark,
    0.24
  )} 100%)`
}));

// ----------------------------------------------------------------------

export default function DashboardCompanyCount(props) {
  const { data } = props;
  return (
    <RootStyle>
      <IconWrapperStyle>
        <Icon src={ICONS.banking} alt="companies" width={24} height={24}>
          {ICONS.banking}
        </Icon>
      </IconWrapperStyle>
      <Typography variant="h2">{fShortenNumber(data['company-count'])}</Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        Number of Companies
      </Typography>
    </RootStyle>
  );
}

DashboardCompanyCount.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      'template-count': PropTypes.number,
      'portfolio-count': PropTypes.number,
      'simulation-count': PropTypes.number,
      'company-count': PropTypes.number
    })
  )
};
