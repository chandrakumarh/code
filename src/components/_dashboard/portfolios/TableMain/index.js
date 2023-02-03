import { filter } from 'lodash';
import { useState, useEffect, useReducer } from 'react';
import ApiConstants from 'src/_apis_/ApiConstants';
import axios from '../../../../axios'
import { useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
// material
import {
  Box,
  Button,
  Table,
  TableRow,
  Checkbox,
  Grid,
  TableBody,
  TableCell,
  Typography,
  Divider,
  TableContainer,
  TablePagination
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setCompanyName } from '../../../../redux/company/company.actions';
// components
import Page from '../../../Page';
import Label from '../../../Label';
import Scrollbar from '../../../Scrollbar';
import SearchNotFound from '../../../SearchNotFound';
import FileUpload from './FileUpload';
import UserListHead from './UserListHead';
import UserListToolbar from './UserListToolbar';
import UserMoreMenu from './UserMoreMenu';

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

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

const getRisk = (score) => {
  if (score < 4) return 'High';
  if (score < 8) return 'Medium';
  return 'Low';
};

export default function User({
  setCondition,
  fileUpload,
  toggleUpload,
  activeStep,
  handleNext,
  handleBack,
  formik,
  touched,
  errors,
  handleDrop,
  values,
  setFieldValue
}) {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState(null);
  const [proxy, setProxy] = useState(null);
  const [selectAll, setSelectedAll] = useState(false);
  const [_, forceUpdate] = useReducer((x) => x + 1, 0);
  const [searched, setSearched] = useState('');
  const theme = useTheme();
  const dispatch = useDispatch();

  if (formik.values.portfolioCompanies.length === 0 && Object.keys(formik.values.cover).length === 0) {
    setCondition(() => false);
  } else {
    setCondition(() => true);
  }

  console.log(fileUpload);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    console.log(!selectAll);
    setRows(
      rows.map((row) => {
        row.selected = !selectAll;
        return row;
      })
    );
    setSelectedAll(!selectAll);
    if (!selectAll) dispatchResults();
    forceUpdate();
  };

  const dispatchResults = () => {
    const items = proxy.filter((item) => item.selected === true);
    setFieldValue('portfolioCompanies', items);
    dispatch(setCompanyName(items));
    setCondition(() => true);
  };

  useEffect(() => {
    const fetcher = async () => {
      const res = await axios.get(ApiConstants.COMPANY_LIST);
      const data = res.data?.data?.companyData;
      setRows(
        data.map((item) => {
          item.selected = false;
          return item;
        })
      );
      setProxy(
        data.map((item) => {
          item.selected = false;
          return item;
        })
      );
    };

    fetcher();
  }, []);

  const handleClick = (row) => {
    let index1 = 0;
    let index2 = 0;
    let state = false;

    for (let i = 0; i < rows.length; i += 1)
      if (rows[i]['company-uuid'] === row['company-uuid']) {
        index1 = i;
        state = rows[i].selected;
      }

    for (let j = 0; j < proxy.length; j += 1) if (proxy[j]['company-uuid'] === row['company-uuid']) index2 = j;

    setRows(() => {
      rows[index1].selected = !state;
      return rows;
    });
    setProxy(() => {
      proxy[index2].selected = !state;
      return proxy;
    });
    setSelectedAll(false);
    dispatchResults();
    forceUpdate();
  };

  const requestSearch = (searchedVal) => {
    if (searchedVal) setRows(rows.filter((item) => item.companyName === searchedVal));
    else setRows(proxy);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const handleSearch = (e, v) => {
    requestSearch(v);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  return (
    <>
      {rows && proxy ? (
        <>
          <UserListToolbar
            numSelected={proxy.filter((item) => item.selected === true).length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            requestSearch={requestSearch}
            options={proxy.map((n) => n.companyName)}
            value={searched}
            fileUpload={fileUpload}
            toggleUpload={toggleUpload}
          />
          <Divider />
          {fileUpload ? (
            <FileUpload formik={formik} touched={touched} errors={errors} handleDrop={handleDrop} values={values} />
          ) : (
            <>
              <Autocomplete
                id="search-input"
                freeSolo
                onChange={handleSearch}
                options={proxy.map((n) => n.companyName)}
                value={searched}
                style={{
                  margin: '10px',
                  width: '97%'
                }}
                renderInput={(params) => <TextField {...params} label="Search Company" />}
              />
              <Divider />
              <Scrollbar>
                <TableContainer>
                  <Table>
                    <UserListHead
                      order={order}
                      orderBy={orderBy}
                      headLabel={TABLE_HEAD}
                      rowCount={rows.length}
                      allSelected={selectAll}
                      onRequestSort={handleRequestSort}
                      onSelectAllClick={handleSelectAllClick}
                    />
                    <TableBody>
                      {applySortFilter(rows, getComparator(order, orderBy), filterName)
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row, index) => {
                          const isItemSelected = isSelected(row.companyName);
                          const labelId = `enhanced-table-checkbox-${index}`;
                          row.risk = getRisk(row.score);
                          return (
                            <TableRow
                              hover
                              role="checkbox"
                              aria-checked={isItemSelected}
                              tabIndex={-1}
                              key={row.companyName}
                              selected={isItemSelected}
                            >
                              <TableCell padding="checkbox">
                                <Checkbox
                                  color="primary"
                                  checked={row.selected}
                                  inputProps={{
                                    'aria-labelledby': labelId
                                  }}
                                  onClick={() => handleClick(row)}
                                />
                              </TableCell>
                              <TableCell component="th" id={labelId} scope="row">
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
                              <TableCell>{row.industry}</TableCell>
                              <TableCell>{row.country}</TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                    {rows.length === 0 && (
                      <TableBody>
                        <TableRow>
                          <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                            <SearchNotFound searchQuery={filterName} />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    )}
                  </Table>
                </TableContainer>
              </Scrollbar>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          )}
          <Divider />
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button variant="outlined" disabled={activeStep === 0} onClick={handleBack} sx={{ ml: 1 }}>
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button
              onClick={handleNext}
              variant="contained"
              disabled={formik.values.portfolioCompanies.length === 0 && Object.keys(formik.values.cover).length === 0}
            >
              Next
            </Button>
          </Box>
        </>
      ) : null}
    </>
  );
}
