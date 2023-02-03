import { PropTypes } from 'prop-types';
import { useState } from 'react';
// material
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Table,
  Switch,
  TableRow,
  TableBody,
  Typography,
  TableCell,
  TableContainer,
  TablePagination,
  FormControlLabel
} from '@mui/material';
// components
import Scrollbar from '../../../Scrollbar';
import Label from '../../../Label';
//
import SortingSelectingHead from './SortingSelectingHead';
import SortingSelectingToolbar from './SortingSelectingToolbar';
import { getRisk } from '../../../../utils/getRisk';

// ----------------------------------------------------------------------

let SORTING_SELECTING_TABLE = [];

const TABLE_HEAD = [
  {
    id: 'type',
    alignLeft: true,
    disablePadding: true,
    label: 'Description'
  },
  {
    id: 'value',
    alignLeft: false,
    disablePadding: false,
    label: 'Value'
  },
  {
    id: 'score',
    alignLeft: false,
    disablePadding: false,
    label: 'Score/Risk'
  }
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export default function SortingSelecting(props) {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('score');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const theme = useTheme();

  function createData(type, value, score, risk) {
    return { type, value, score, risk };
  }

  const { data } = props;
  const companyName = data['company-name'];
  const companyScore = data['esg-score'].score;
  const industry = data['sector-data'][0].sector;
  const industryScore = data['sector-data'][0]['avg-esgscore'];
  const { country } = data['country-data'][0];
  const countryScore = data['country-data'][0]['avg-esgscore'];

  SORTING_SELECTING_TABLE = [
    createData('Company', companyName, companyScore, getRisk(companyScore)),
    createData('Industry', industry, industryScore, getRisk(industryScore)),
    createData('Country', country, countryScore, getRisk(countryScore))
  ];

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = SORTING_SELECTING_TABLE.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty SORTING_SELECTING_TABLE.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - SORTING_SELECTING_TABLE.length) : 0;

  return (
    <>
      <SortingSelectingToolbar numSelected={selected.length} />

      <Scrollbar>
        <TableContainer sx={{ minWidth: 750 }}>
          <Table size={dense ? 'small' : 'medium'}>
            <SortingSelectingHead
              order={order}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              numSelected={selected.length}
              onRequestSort={handleRequestSort}
              rowCount={SORTING_SELECTING_TABLE.length}
              onSelectAllClick={handleSelectAllClick}
            />
            <TableBody>
              {stableSort(SORTING_SELECTING_TABLE, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  const isItemSelected = isSelected(row.type);
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.type}
                      selected={isItemSelected}
                    >
                      <TableCell align="left">{row.type}</TableCell>
                      <TableCell align="center">{row.value}</TableCell>
                      <TableCell align="center">
                        <div>
                          <Typography variant="h6">{row.score}</Typography>
                        </div>
                        <Label
                          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                          color={
                            (row.risk === 'High' && 'error') ||
                            (row.risk === 'Medium' && 'warning') ||
                            (row.risk === 'Low' && 'success') ||
                            'error'
                          }
                        >
                          {`${row.risk} Risk`}
                        </Label>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

      <Box sx={{ position: 'relative' }}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={SORTING_SELECTING_TABLE.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <Box
          sx={{
            px: 3,
            py: 1.5,
            top: 0,
            position: { md: 'absolute' }
          }}
        >
          <FormControlLabel control={<Switch checked={dense} onChange={handleChangeDense} />} label="Compact view" />
        </Box>
      </Box>
    </>
  );
}

SortingSelecting.propTypes = {
  data: PropTypes.shape({
    'company-uuid': PropTypes.string,
    'company-name': PropTypes.string,
    'company-score': PropTypes.string,
    'company-code': PropTypes.string,
    'company-symbol': PropTypes.string,
    'company-status': PropTypes.string,
    'sector-data': PropTypes.arrayOf(
      PropTypes.shape({
        count: PropTypes.number,
        'avg-esgscore': PropTypes.number,
        sector: PropTypes.string,
        'sector-code': PropTypes.string
      })
    ),
    'country-data': PropTypes.arrayOf(
      PropTypes.shape({
        count: PropTypes.number,
        'avg-esgscore': PropTypes.number,
        country: PropTypes.string,
        'country-code': PropTypes.string
      })
    ),
    'esg-score': PropTypes.shape({
      score: PropTypes.number,
      children: PropTypes.arrayOf()
    })
  })
};
