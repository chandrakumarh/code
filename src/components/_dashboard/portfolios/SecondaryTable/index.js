import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TablePagination,
  TableRow,
  TableHead,
  Grid,
  Slider,
  Divider,
  TextField,
  Paper,
  FormControlLabel,
  Switch,
  Toolbar,
  Button,
  styled,
  IconButton
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import MuiInput from '@mui/material/Input';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import { setCompanyName } from '../../../../redux/company/company.actions';

const Alert = React.forwardRef((props, ref) => <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />);

const Input = styled(MuiInput)`
  width: 42px;
  & input {
    text-align: center;
  }
`;

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
    flex-direction: column;
    margin: 1rem 0;
  }
`;

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired
};

export default function CustomPaginationActionsTable({
  setCondition,
  activeStep,
  handleBack,
  handleNext,
  setFieldValue,
  condition
}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [value, setValue] = React.useState(30);
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState({
    data: null,
    type: null
  });
  const [_, forceUpdate] = React.useReducer((x) => x + 1, 0);

  const nextActive = false;

  const vertical = 'bottom';
  const horizontal = 'right';
  const [selectedParams, setSelectedParams] = React.useState('Percentage Weights');
  const dispatch = useDispatch();
  const company = useSelector((state) => state.company.company);
  const [rows, setRows] = React.useState(
    company.map((item) => {
      if (item.weight === undefined) item.weight = '';
      return item;
    })
  );
  React.useEffect(() => {
    if (rows !== company) setCondition(dispatchResults());
  }, [rows, selectedParams]);

  const handleSliderChange = (event, newValue, name, id) => {
    let tot = 0;
    setRows(
      rows.map((item) => {
        if (item['company-uuid'] === id)
          item = {
            ...item,
            weight: newValue
          };

        tot += item.weight === '' ? 0 : item.weight;
        return item;
      })
    );
    setValue(tot);
  };

  const handleInputChange = (event, name, id) => {
    if (event.target.value === '') {
      setRows(
        rows.map((item) => {
          if (item['company-uuid'] === id)
            item = {
              ...item,
              weight: ''
            };
          return item;
        })
      );
      return;
    }

    let val = Number(event.target.value);
    if (val >= 100) val = 100;

    let tot = 0;
    setRows(
      rows.map((item) => {
        if (item['company-uuid'] === id)
          item = {
            ...item,
            weight: val
          };
        tot += item.weight === '' ? 0 : item.weight;
        return item;
      })
    );
    setValue(tot);
  };

  const dispatchResults = () => {
    try {
      rows.map((row) => {
        if (row.weight < 0 || row.weight === undefined || row.weight === '') throw new Error('Weights are undefined');
        return row;
      });

      let tot = 0;

      rows.forEach((item) => (tot += item.weight));

      if (tot !== 100 && selectedParams === 'Percentage Weights') throw new Error('Total is not 100');

      setFieldValue('portfolioCompanies', rows);

      dispatch(setCompanyName(rows));

      return true;
    } catch (E) {
      return false;
    }
  };

  const handleChange = (value, companyName, uuid) => {
    if (/[a-zA-Z]/.test(value)) return;

    if (value === '') {
      setRows(
        rows.map((row) => {
          if (row['company-uuid'] === uuid) row = { ...row, weight: '' };
          return row;
        })
      );
      forceUpdate();
      return;
    }

    setRows(
      rows.map((row) => {
        if (row['company-uuid'] === uuid) row.weight = parseInt(value, 10);
        return row;
      })
    );
  };

  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > 100) {
      setValue(100);
    }
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSwitchChange = (e) => {
    if (e.target.checked) setSelectedParams('Absolute Weights');
    else setSelectedParams('Percentage Weights');
  };

  return (
    <>
      <RootStyle>
        <h1>Add Company Weights</h1>
        <FormControlLabel control={<Switch />} onChange={handleSwitchChange} label="Absolute Weights" />
      </RootStyle>
      <Divider />
      <TableContainer component={Paper}>
        <Table aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell>Company Name</TableCell>
              <TableCell>Weight</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0 ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : rows).map(
              (row, i) => (
                <TableRow key={i}>
                  <TableCell component="th" scope="row" width="30%">
                    {row.companyName}
                  </TableCell>
                  <TableCell component="th" scope="row" width="70%">
                    {selectedParams === 'Absolute Weights' ? (
                      <TextField
                        size="small"
                        value={row.weight}
                        onChange={(e) => handleChange(e.target.value, row.companyName, row['company-uuid'])}
                      />
                    ) : (
                      <>
                        <Grid container spacing={2}>
                          <Grid item xs={8}>
                            <Slider
                              size="small"
                              valueLabelDisplay="auto"
                              value={typeof row.weight === 'number' ? row.weight : 0}
                              onChange={(e, v) => handleSliderChange(e, v, row.companyName, row['company-uuid'])}
                              labeller="input-slider"
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <Input
                              value={row.weight}
                              size="small"
                              onChange={(e) => handleInputChange(e, row.companyName, row['company-uuid'])}
                              onBlur={handleBlur}
                              inputProps={{
                                step: 1,
                                min: 0,
                                max: 100,
                                type: 'number'
                              }}
                            />
                            %
                          </Grid>
                        </Grid>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              )
            )}

            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                colSpan={3}
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    'aria-label': 'rows per page'
                  },
                  native: true
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      <Divider />
      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
        <Button disabled={activeStep === 0} onClick={handleBack} sx={{ ml: 1 }} variant="outlined">
          Back
        </Button>
        <Box sx={{ flex: '1 1 auto' }} />
        <Button onClick={handleNext} disabled={!condition} variant="contained">
          Next
        </Button>
      </Box>
      {open ? (
        <Snackbar
          open={open}
          autoHideDuration={6000}
          anchorOrigin={{ vertical, horizontal }}
          key={vertical + horizontal}
          onClose={() => setOpen(false)}
        >
          <Alert onClose={() => setOpen(false)} severity={message.type} sx={{ width: '100%' }}>
            {message.data}
          </Alert>
        </Snackbar>
      ) : null}
    </>
  );
}
