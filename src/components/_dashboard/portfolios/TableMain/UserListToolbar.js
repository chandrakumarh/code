import PropTypes from 'prop-types';
import React from 'react';
// material
import { styled } from '@mui/material/styles';
import { Box, Toolbar, Tooltip, IconButton, Typography, FormControlLabel, Switch } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

// ----------------------------------------------------------------------

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

// ----------------------------------------------------------------------

UserListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  requestSearch: PropTypes.func,
  options: PropTypes.array,
  value: PropTypes.string
};

export default function UserListToolbar({
  numSelected,
  filterName,
  onFilterName,
  requestSearch,
  options,
  value,
  fileUpload,
  toggleUpload
}) {
  return (
    <RootStyle
      sx={{
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter'
        })
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <h1>Company ESG Data</h1>
      )}

      {numSelected === 0 ? (
        <FormControlLabel
          value={fileUpload}
          checked={fileUpload}
          control={<Switch color="primary" />}
          label="Upload Excel/CSV File"
          labelPlacement="end"
          onChange={toggleUpload}
        />
      ) : null}
    </RootStyle>
  );
}
