import { PropTypes } from 'prop-types';
import { useState, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Table,
  Switch,
  Grid,
  Tooltip,
  TableRow,
  TableBody,
  Stack,
  Typography,
  TableCell,
  TableContainer,
  TablePagination,
  FormControlLabel
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ConfirmationDialog from 'src/components/dialogs/ConfirmationDialog';
// components
import Scrollbar from '../../../Scrollbar';
import Label from '../../../Label';
import { MIconButton } from '../../../@material-extend';
//
import SortingSelectingHead from './SortingSelectingHead';
import SortingSelectingToolbar from './SortingSelectingToolbar';
// import { COMPANY_DATA, COMPANY_LIST } from '../../../../data/data';
import { getRisk } from '../../../../utils/getRisk';
import { createRegularExpressionLiteral } from 'typescript';

// ----------------------------------------------------------------------

function createData(name, companyName, industry, country, score, risk, publicIdentifier, esgwizeCode, uuid, disabled) {
  return { name, companyName, industry, country, score, risk, publicIdentifier, esgwizeCode, uuid, disabled };
}

const TABLE_HEAD = [
  {
    id: 'name',
    alignLeft: true,
    disablePadding: true,
    label: 'Company Name'
  },
  {
    id: 'industry',
    alignLeft: false,
    disablePadding: false,
    label: 'Industry'
  },
  {
    id: 'country',
    alignLeft: false,
    disablePadding: false,
    label: 'Country'
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
  const [orderBy, setOrderBy] = useState('name');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isShowDeleteConfirmationDialog, setIsShowDeleteConfirmationDialog] = useState(false)
  const theme = useTheme();
  const currentSelectedRow = useRef(null)
  const { data } = props;

  let SORTING_SELECTING_TABLE = [];

  SORTING_SELECTING_TABLE = data.map((obj) =>
    createData(
      obj.esgwizeCode,
      obj.companyName,
      obj.industry,
      obj.country,
      obj.score,
      getRisk(obj.score),
      obj.publicIdentifier,
      obj.esgwizeCode,
      obj['company-uuid'],
      obj.disabled
    )
  );

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

  const showDeleteCompanyDialog = (row) => {
    currentSelectedRow.current = row
    setIsShowDeleteConfirmationDialog(true)
  }

  const hideDeleteCompanyDialog = () => {
    setIsShowDeleteConfirmationDialog(false)
  }

  const onTapDeleteCompany = () => {
    props?.deleteCompany(currentSelectedRow.current)
    hideDeleteCompanyDialog()
  }

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
              {stableSort(SORTING_SELECTING_TABLE, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.name}
                      selected={isItemSelected}
                    >
                      <TableCell component="th" id={labelId} scope="row" padding="none">
                        <Grid container spacing={0}>
                          <Grid item xs={12}>
                            <Typography variant="h6">{row.companyName}</Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
                              {row.publicIdentifier}
                            </Typography>
                          </Grid>
                        </Grid>
                      </TableCell>
                      <TableCell align="center">{row.industry}</TableCell>
                      <TableCell align="center">{row.country}</TableCell>
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
                      <TableCell align="right">
                        <Stack direction="row">
                          <Tooltip title="View">
                            <MIconButton
                              color="success"
                              to={`/dashboard/companies/view/${row.uuid}`}
                              // to={`/dashboard/companies/view/${row.esgwizeCode}`}
                              component={RouterLink}
                              disabled={row.disabled}
                            >
                              <SearchIcon />
                            </MIconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <MIconButton
                              color="success"
                              onClick={() => showDeleteCompanyDialog(row)}

                              disabled={row.disabled}
                            >
                              <DeleteOutlineOutlinedIcon />
                            </MIconButton>
                          </Tooltip>
                        </Stack>

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
      <ConfirmationDialog
        showDialog={isShowDeleteConfirmationDialog} 
        title="Delete Company" 
        body={`Are you sure you want to delete ${currentSelectedRow.current?.companyName}?`} 
        successButtonTitle="Yes" 
        destroyButtonTitle="No"
        onTapDestroyButton={hideDeleteCompanyDialog}
        onTapSuccessButton={onTapDeleteCompany}
      />
    </>
  );
}

SortingSelecting.propTypes = {
  deleteCompany: PropTypes.func,
  data: PropTypes.shape({
    companyData: PropTypes.arrayOf(
      PropTypes.shape({
        count: PropTypes.number,
        'avg-esgscore': PropTypes.number,
        sector: PropTypes.string,
        'sector-code': PropTypes.string,
        'company-uuid': PropTypes.string,
        'company-name': PropTypes.string,
        'company-score': PropTypes.string,
        'company-code': PropTypes.string,
        'company-symbol': PropTypes.string,
        'company-status': PropTypes.string
      })
    )
  })
};
 