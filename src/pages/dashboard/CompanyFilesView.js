import { orderBy } from 'lodash';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink, useParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { styled, useTheme } from '@mui/material/styles';
// material
import {
  Box,
  Grid,
  Card,
  Button,
  Container,
  Typography,
  LinearProgress,
  CardContent,
  CardHeader,
  Chip,
  FormControlLabel,
  Switch,
  Table,
  TableCell,
  TableContainer,
  TableRow,
  TableBody,
  TableHead,
  Tab
} from '@mui/material';
import { TreeView, TreeItem } from '@mui/lab';
import { fNumber } from '../../utils/formatNumber';

// hooks
import useSettings from '../../hooks/useSettings';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Scrollbar from '../../components/Scrollbar';
import Page from '../../components/Page';
import Label from '../../components/Label';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { AppLinks } from '../../components/_dashboard/companies';

import AuthGuard from '../../guards/AuthGuard';

//
import { COMPANY_DATA } from '../../data/data';
import LoadingScreen from '../../components/LoadingScreen';
import FileUploadDialog from 'src/components/dialogs/FileUploadDialog';
import axios from '../../axios';
import PDF from '../../assets/adidasag_q12021results_final_en.pdf';
import PDF2 from '../../assets/Nike10k2021.pdf';
import { FlashAutoOutlined } from '@mui/icons-material';

// ----------------------------------------------------------------------

const TreeViewStyle = styled(TreeView)({
  height: 240,
  flexGrow: 1,
  maxWidth: 400
});

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
  color: theme.palette.text.secondary
}));

const returnColor = (score) => {
  if (score > 7.5) return 'success';
  if (score < 3.5) return 'error';
  return 'warning';
};

function StyledTreeItem(props) {
  const { bgColor, color, labelInfo, labelText, ...other } = props;

  return (
    <StyledTreeItemRoot
      label={
        <Box sx={{ display: 'flex', alignItems: 'center', p: 1, pr: 0 }}>
          <Typography variant="body2" sx={{ fontWeight: 'inherit', flexGrow: 1 }}>
            {labelText}
          </Typography>
          <Label color={returnColor(parseInt(labelInfo, 10))} variant="ghost">
            {labelInfo}
          </Label>
        </Box>
      }
      style={{
        '--tree-view-color': color,
        '--tree-view-bg-color': bgColor
      }}
      {...other}
    />
  );
}

StyledTreeItem.propTypes = {
  bgColor: PropTypes.string,
  color: PropTypes.string,
  labelIcon: PropTypes.elementType.isRequired,
  labelInfo: PropTypes.string,
  labelText: PropTypes.string.isRequired
};

// --------------------------------------------------------

export default function CompanyFilesView() {
  const { themeStretch } = useSettings();
  const { code } = useParams();
  const [data, setData] = useState({});
  const [envData, setEnvData] = useState({});
  const [socData, setSocData] = useState({});
  const [govData, setGovData] = useState({});
  const [previewPDF, setPreviewPDF] = useState(PDF);
  const [showFileUploadDialog, setShowFileUploadDialog] = useState(false)

  const theme = useTheme();

  const headLabel = [
    {
      id: 'type',
      alignLeft: true,
      disablePadding: true,
      label: 'Name'
    },
    {
      id: 'value',
      alignLeft: false,
      disablePadding: false,
      label: 'Description'
    }
  ];

  const companyDocuments = [
    {
      Name: 'Annual Report 2019',
      Description:
        'Sat Jan 29 2022 02:20:17 GMT+0530 (India Standard Time)_Grade 9 second formative schedule and portion_edited.pdf',
      Key: '123',
      Location: PDF
    },
    {
      Name: 'Annual Report 2020',
      Description:
        'Sat Jan 29 2022 02:20:18 GMT+0530 (India Standard Time)_Worksheet_Understanding Child Development.pdf',
      Key: '456',
      Location: PDF2
    }
  ];

  const [company, setCompany] = useState(COMPANY_DATA['bmw-group'].companyDocuments);
  const [review, setReview] = useState(PDF);

  useEffect(() => {
    const getCompanyData = async (uuid) => {
      const url = `/company/data/${uuid}`;
      const response = await axios.get(url);
      setData(response.data.data);
      setEnvData(response.data.data['esg-score'].children[0]);
      setSocData(response.data.data['esg-score'].children[2]);
      setGovData(response.data.data['esg-score'].children[1]);
    };
    getCompanyData(code);
  }, [code]);

  const hideFileConfirmationDialog = () => {
    setShowFileUploadDialog(false)
  }

  const showFileConfirmationDialog = () => {
    setShowFileUploadDialog(true)
  }

  return (
    <>
      {Object.keys(data).length === 0 ? (
        <LoadingScreen />
      ) : (
        <Page title="esgwize | Companies">
          <Container maxWidth={themeStretch ? false : 'lg'}>
            <HeaderBreadcrumbs
              heading="Companies"
              links={[
                { name: 'Home', href: PATH_DASHBOARD.root },
                { name: 'Companies', href: PATH_DASHBOARD.general.companies },
                { name: 'View', href: `/dashboard/companies/view/${code}` },
                { name: 'Files' }
              ]}
            />
            <Grid container spacing={3}>
              <AppLinks />
              <Grid item xs={12} key="blank">
                &nbsp;
              </Grid>
              <Grid item xs={12} key="header">
                <Typography variant="h5">Company Files</Typography>
                <Typography variant="subtitle2">esgwise file details of the selected company</Typography>
              </Grid>
              <Grid item xs={12} key="name">
                <Card dir="ltr" sx={{ p: 3 }}>
                <Button
                  variant="contained"
                  onClick={showFileConfirmationDialog}
                >
                 Add Data Files
                </Button>
                  <Grid container>
                    <Grid item xs={12} key="Companyname">
                      <Typography variant="h3">{data['company-name']}</Typography>
                    </Grid>
                    <Grid item xs={4} key="identifier">
                      <Typography variant="subtitle1" sx={{ color: 'text.disabled' }}>
                        {`Public Identifier: ${data['company-symbol']}`}
                      </Typography>
                    </Grid>
                    <Grid item xs={4} key="industry">
                      <Typography variant="subtitle1" sx={{ color: 'text.disabled' }}>
                        {`Industry: ${data['sector-data'][0].sector}`}
                      </Typography>
                    </Grid>
                    <Grid item xs={4} key="country">
                      <Typography variant="subtitle1" sx={{ color: 'text.disabled' }}>
                        {`Country: ${data['country-data'][0].country}`}
                      </Typography>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            </Grid>
            <Grid item xs={12} key="blank">
              &nbsp;
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={4} key="table">
                <Card>
                  <div
                    style={{
                      height: 72,
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: theme.spacing(2, 1, 0, 3)
                    }}
                  >
                    <Typography variant="h6" id="tableTitle" component="div">
                      Files list
                    </Typography>
                  </div>

                  <Scrollbar>
                    <TableContainer sx={{ minWidth: 200 }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            {headLabel.map((headCell) => (
                              <TableCell
                                key={headCell.id}
                                align={headCell.alignLeft ? 'left' : 'center'}
                                padding={headCell.disablePadding ? 'none' : 'normal'}
                              >
                                {headCell.label}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {companyDocuments.map((file) => (
                            <TableRow
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={file.Key}
                              style={{ cursor: 'pointer' }}
                              onClick={() => setPreviewPDF(file.Location)}
                              selected={file.Location === previewPDF}
                            >
                              <TableCell align="left">{file.Name}</TableCell>
                              <TableCell align="center">{file.Description}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Scrollbar>
                </Card>
              </Grid>
              <br />

              <Grid item xs={8} md={8}>
                <Card style={{ height: '500px' }}>
                  <iframe src={previewPDF} style={{ zIndex: 10, height: '100%', width: '100%' }} title="file-preview" />
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Page>
      )}
      <FileUploadDialog showDialog={showFileUploadDialog} title="Upload Data Files" destroyButtonTitle="Cancel" successButtonTitle="Submit"/>
    </>
  );
}
