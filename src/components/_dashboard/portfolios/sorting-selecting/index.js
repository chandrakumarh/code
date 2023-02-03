import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Table,
  Switch,
  Checkbox,
  Grid,
  Tooltip,
  TableRow,
  TableBody,
  Typography,
  TableCell,
  TableContainer,
  TablePagination,
  FormControlLabel
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
// components
import Scrollbar from '../../../Scrollbar';
import Label from '../../../Label';
import { MFab, MIconButton } from '../../../@material-extend';
//
import SortingSelectingHead from './SortingSelectingHead';
import SortingSelectingToolbar from './SortingSelectingToolbar';
import { PORTFOLIO_DATA, PORTFOLIO_LIST } from '../../../../data/data';

// ----------------------------------------------------------------------

function createData(name, portfolioName, companyCount, description, esgwizeCode) {
  return [{ name, portfolioName, companyCount, description, esgwizeCode }];
}
function createData2(name, portfolioName, companyCount, description, esgwizeCode, uuid) {
  return { name, portfolioName, companyCount, description, esgwizeCode, uuid };
}

// let a = [];
// const b = [1, 2];
// const c = [2];
// a = [...a, ...b, ...c];
// console.log(SORTING_SELECTING_TABLE);

// console.log(COMPANY_DATA);
// console.log(SORTING_SELECTING_TABLE);
// console.log(x1);

const TABLE_HEAD = [
  {
    id: 'name',
    alignLeft: true,
    disablePadding: true,
    label: 'Portfolio Name'
  },
  {
    id: 'esgwizeCode',
    alignLeft: false,
    disablePadding: false,
    label: 'Portfolio Code'
  },
  {
    id: 'companyCount',
    alignLeft: false,
    disablePadding: false,
    label: 'Company Count'
  },
  {
    id: 'description',
    alignLeft: false,
    disablePadding: false,
    label: 'Description'
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
  const [orderBy, setOrderBy] = useState('calories');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const theme = useTheme();

  let SORTING_SELECTING_TABLE = [];
  let SORTING_SELECTING_TABLE_2 = [];
  // const data = PORTFOLIO_LIST;
  const { data } = props;
  SORTING_SELECTING_TABLE_2 = data.portfolioData.map((obj) =>
    createData2(
      obj.esgwizeCode,
      obj.portfolioName,
      obj.companyCount,
      obj.description,
      obj.esgwizeCode,
      obj['portfolio-uuid']
    )
  );
  const x1 = Object.values(PORTFOLIO_DATA).forEach((x) => {
    SORTING_SELECTING_TABLE = [
      ...SORTING_SELECTING_TABLE,
      ...createData(x.esgwizeCode, x.portfolioName, x.companyCount, x.description, x.esgwizeCode)
    ];
  });

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

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
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
        <TableContainer sx={{ minWidth: 800 }}>
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
              {stableSort(SORTING_SELECTING_TABLE_2, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  // console.log(row);
                  return (
                    <TableRow
                      hover
                      // onClick={(event) => handleClick(event, row.name)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.name}
                      selected={isItemSelected}
                    >
                      {/* <TableCell padding="checkbox">
                        <Checkbox checked={isItemSelected} />
                      </TableCell> */}
                      <TableCell component="th" id={labelId} scope="row" padding="none">
                        <Grid container spacing={0}>
                          <Grid item xs={12}>
                            <Typography variant="h6">{row.portfolioName}</Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
                              {row.publicIdentifier}
                            </Typography>
                          </Grid>
                          {/* <Grid xs={6}>
                            <Typography variant="subtitle2">{row.esgwizeCode}</Typography>
                          </Grid> */}
                        </Grid>
                      </TableCell>
                      <TableCell align="center">{row.esgwizeCode}</TableCell>
                      <TableCell align="center">{row.companyCount}</TableCell>
                      <TableCell align="center">{row.description}</TableCell>
                      <TableCell align="right" style={{ display: 'flex' }}>
                        <Tooltip title="Edit">
                          <MIconButton>
                            <EditIcon />
                          </MIconButton>
                        </Tooltip>
                        <Tooltip title="View">
                          <MIconButton
                            color="primary"
                            to={`/dashboard/portfolios/view/${row.uuid}`}
                            // to={`/dashboard/portfolios/view/${row.esgwizeCode}`}
                            component={RouterLink}
                          >
                            <SearchIcon color="primary" />
                          </MIconButton>
                        </Tooltip>
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
