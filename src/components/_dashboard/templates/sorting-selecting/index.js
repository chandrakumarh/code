import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
// components
import Scrollbar from '../../../Scrollbar';
import Label from '../../../Label';
import { setTemplateName, setTemplateActiveStep } from '../../../../redux/company/company.actions';
import { MFab, MIconButton } from '../../../@material-extend';
//
import SortingSelectingHead from './SortingSelectingHead';
import SortingSelectingToolbar from './SortingSelectingToolbar';
import { TEMPLATE_DATA } from '../../../../data/data';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  {
    id: 'name',
    alignLeft: true,
    disablePadding: true,
    label: 'Scoring Template Name'
  },
  {
    id: 'esgwizeCode',
    alignLeft: false,
    disablePadding: false,
    label: 'Template Code'
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
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const theme = useTheme();
  const dispatch = useDispatch();
  function createData(name, templateName, description, esgwizeCode, uuid) {
    return { name, templateName, description, esgwizeCode, uuid };
  }
  let SORTING_SELECTING_TABLE = [];
  const { data } = props;
  SORTING_SELECTING_TABLE = data.templateData.map((obj) =>
    createData(obj.esgwizeCode, obj.templateName, obj.description, obj.esgwizeCode, obj['template-uuid'])
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

  const handleRowClick = async (row) => {
    row = {
      ...row,
      companyName: row.templateName
    };

    const mainData = await axios.get(
      `https://nglg1k1kze.execute-api.us-west-1.amazonaws.com/dev/template/data/${row.uuid}`
    );
    const { data } = mainData.data;
    const company = {
      name: data['template-name'],
      code: data['template-code']
    };

    dispatch(setTemplateActiveStep(1));
    dispatch(setTemplateName(company, data));
    navigate('/dashboard/templates/create');
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
              {stableSort(SORTING_SELECTING_TABLE, getComparator(order, orderBy))
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
                      {console.log(row)}
                      <TableCell component="th" id={labelId} scope="row" padding="none">
                        <Grid container spacing={0}>
                          <Grid item xs={12}>
                            <Typography variant="h6">{row.templateName}</Typography>
                          </Grid>
                        </Grid>
                      </TableCell>
                      <TableCell align="center">{row.esgwizeCode}</TableCell>
                      <TableCell align="center">{row.description}</TableCell>
                      <TableCell align="right" style={{ display: 'flex' }}>
                        <Tooltip title="Edit">
                          <MIconButton color="info" onClick={(e) => handleRowClick(row)}>
                            <EditIcon />
                          </MIconButton>
                        </Tooltip>
                        <Tooltip title="View">
                          <MIconButton
                            color="primary"
                            to={`/dashboard/templates/view/${row.uuid}`}
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
