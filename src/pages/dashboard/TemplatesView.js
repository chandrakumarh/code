import { Link as RouterLink, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
// material
import { styled } from '@mui/material/styles';
import { Box, Grid, Card, Container, Typography, CardContent, CardHeader, Tooltip } from '@mui/material';
import { TreeView, TreeItem } from '@mui/lab';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// hooks
import useSettings from '../../hooks/useSettings';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Page from '../../components/Page';
import Label from '../../components/Label';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { AppLinks, ChartDonutCustom, Block } from '../../components/_dashboard/templates';
import SortingSelecting from '../../components/_dashboard/templates/component-table';
// import {
//   TEMPLATE_DATA,
//   ENVIRONMENT_DATA,
//   SOCIAL_DATA,
//   GOVERNENCE_DATA,
//   DASHBOARD_TEMPLATE_DATA
// } from '../../data/data';
import LoadingScreen from '../../components/LoadingScreen';
import axios from '../../axios';

// ----------------------------------------------------------------------

const TreeViewStyle = styled(TreeView)({
  height: 240,
  flexGrow: 1,
  maxWidth: 400
});

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
  color: theme.palette.text.secondary
}));

function StyledTreeItem(props) {
  const { bgColor, color, labelInfo, labelText, tooltipInfo, ...other } = props;
  const returnColor = (score) => {
    if (score > 7.5) return 'success';
    if (score < 3.5) return 'error';
    return 'warning';
  };

  return (
    <StyledTreeItemRoot
      label={
        <Box sx={{ display: 'flex', alignItems: 'center', p: 0.5, pr: 0 }}>
          <Typography variant="body2" sx={{ fontWeight: 'inherit', flexGrow: 1 }}>
            {labelText}
          </Typography>
          {labelInfo && (
            <Tooltip arrow title={tooltipInfo} sx={{ color: 'blue' }}>
              <Typography>
                <Label color="primary" variant="ghost">
                  {labelInfo}
                </Label>
              </Typography>
            </Tooltip>
          )}
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

// ----------------------------------------------------------------------

export default function CompaniesView() {
  const { themeStretch } = useSettings();
  const { code } = useParams();
  const [data, setData] = useState({});
  const [envData, setEnvData] = useState({});
  const [socData, setSocData] = useState({});
  const [govData, setGovData] = useState({});
  const [donutData, setDonutData] = useState({ env: 10, soc: 10, gov: 10 });

  function capitalize(sentence) {
    const words = sentence.split(' ');
    for (let i = 0; i < words.length; i += 1) {
      words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }
    return words.join(' ');
  }

  useEffect(() => {
    const getTemplateData = async (uuid) => {
      const url = `/template/data/${uuid}`;
      const response = await axios.get(url);
      setData(response.data.data);
      setEnvData(response.data.data['esg-weights'].children[0]);
      setSocData(response.data.data['esg-weights'].children[2]);
      setGovData(response.data.data['esg-weights'].children[1]);
      setDonutData({
        env: response.data.data['esg-weights'].children[0]['environment-score'].weight,
        soc: response.data.data['esg-weights'].children[2]['social-score'].weight,
        gov: response.data.data['esg-weights'].children[1]['governance-score'].weight
      });
    };

    getTemplateData(code);
  }, [code]);

  return (
    <>
      {Object.keys(data).length === 0 ? (
        <LoadingScreen />
      ) : (
        <Page title="esgwize | Templates">
          {/* {console.log(donutData)} */}
          <Container maxWidth={themeStretch ? false : 'lg'}>
            <HeaderBreadcrumbs
              heading="Templates"
              links={[
                { name: 'Home', href: PATH_DASHBOARD.root },
                { name: 'Templates', href: PATH_DASHBOARD.general.templates },
                { name: 'View' }
              ]}
            />
            <Grid container spacing={3}>
              <AppLinks />
              <Grid item xs={12} key="blank">
                &nbsp;
              </Grid>
              <Grid item xs={12} key="header">
                <Typography variant="h5">Template View</Typography>
                <Typography variant="subtitle2">esgwise score compostion details of the selected template</Typography>
              </Grid>
              <Grid item xs={12} key="name">
                <Card dir="ltr" sx={{ p: 3 }}>
                  <Grid container>
                    <Grid item xs={12} key="Companyname">
                      <Typography variant="h3">{data['template-name']}</Typography>
                    </Grid>
                    <Grid item xs={8} key="description">
                      <Typography variant="subtitle1" sx={{ color: 'text.disabled' }}>
                        {`Descriptions: ${data['template-description']}`}
                      </Typography>
                    </Grid>
                    <Grid item xs={4} key="identifier">
                      <Typography variant="subtitle1" sx={{ color: 'text.disabled' }}>
                        {`ESGWize Template Identifier: ${data['template-code']}`}
                      </Typography>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
              <Grid item xs={12} md={4} key="donut">
                <Card dir="ltr">
                  <CardHeader title="ESG Score Composition" />
                  <CardContent
                    sx={{
                      height: 500,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <ChartDonutCustom data={donutData} />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={8} key="table">
                <Card>
                  <SortingSelecting data={donutData} />
                </Card>
              </Grid>
              <Grid item xs={12} md={4} key="e-Component">
                <Block title="Environment Component - weight" sx={{ overflow: 'auto', p: 3 }}>
                  <TreeViewStyle
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpanded={['environment-score']}
                    defaultExpandIcon={<ChevronRightIcon />}
                    defaultEndIcon={null}
                  >
                    {Object.keys(envData).map((x) => (
                      <StyledTreeItem
                        nodeId={x}
                        labelText={capitalize(x.replace(/-/g, ' '))}
                        key={x}
                        tooltipInfo="default"
                        labelInfo={envData[x].weight}
                        color="#000"
                        bgColor="#e8f0fe"
                      >
                        {Object.keys(envData[x].children[0]).map((y) => (
                          <StyledTreeItem
                            nodeId={y}
                            labelText={capitalize(y.replace(/-/g, ' '))}
                            key={y}
                            tooltipInfo={envData[x]['children-weight-type']}
                            labelInfo={envData[x].children[0][y].weight}
                            color="#000"
                            bgColor="#e8f0fe"
                          >
                            {Object.keys(envData[x].children[0][y].children[0]).map((z) => (
                              <StyledTreeItem
                                nodeId={z}
                                labelText={capitalize(z.replace(/-/g, ' '))}
                                key={z}
                                tooltipInfo={envData[x].children[0][y]['children-weight-type']}
                                labelInfo={envData[x].children[0][y].children[0][z].weight}
                                color="#1a73e8"
                                bgColor="#e8f0fe"
                              />
                            ))}
                          </StyledTreeItem>
                        ))}
                      </StyledTreeItem>
                    ))}
                  </TreeViewStyle>
                </Block>
              </Grid>

              <Grid item xs={12} md={4} key="s-Component">
                <Block title="Social Component - weight" sx={{ overflow: 'auto', p: 3 }}>
                  <TreeViewStyle
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}
                    defaultExpanded={['social-score']}
                    defaultEndIcon={null}
                  >
                    {Object.keys(socData).map((x) => (
                      <StyledTreeItem
                        nodeId={x}
                        labelText={capitalize(x.replace(/-/g, ' '))}
                        tooltipInfo="default"
                        key={x}
                        labelInfo={socData[x].weight}
                        color="#000"
                        bgColor="#e8f0fe"
                      >
                        {Object.keys(socData[x].children[0]).map((y) => (
                          <StyledTreeItem
                            nodeId={y}
                            labelText={capitalize(y.replace(/-/g, ' '))}
                            key={y}
                            tooltipInfo={socData[x]['children-weight-type']}
                            labelInfo={socData[x].children[0][y].weight}
                            color="#000"
                            bgColor="#e8f0fe"
                          >
                            {Object.keys(socData[x].children[0][y].children[0]).map((z) => (
                              <StyledTreeItem
                                nodeId={z}
                                labelText={capitalize(z.replace(/-/g, ' '))}
                                key={z}
                                tooltipInfo={socData[x].children[0][y]['children-weight-type']}
                                labelInfo={socData[x].children[0][y].children[0][z].weight}
                                color="#1a73e8"
                                bgColor="#e8f0fe"
                              />
                            ))}
                          </StyledTreeItem>
                        ))}
                      </StyledTreeItem>
                    ))}
                  </TreeViewStyle>
                </Block>
              </Grid>
              {/* {console.log(Object.keys(govData))} */}
              <Grid item xs={12} md={4} key="g-Component">
                <Block title="Governence Component - weight" sx={{ overflow: 'auto', p: 3 }}>
                  <TreeViewStyle
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}
                    defaultExpanded={['governance-score']}
                    defaultEndIcon={null}
                  >
                    {Object.keys(govData).map((x) => (
                      <StyledTreeItem
                        nodeId={x}
                        labelText={capitalize(x.replace(/-/g, ' '))}
                        tooltipInfo="default"
                        key={x}
                        labelInfo={govData[x].weight}
                        color="#000"
                        bgColor="#e8f0fe"
                      >
                        {Object.keys(govData[x].children[0]).map((y) => (
                          <StyledTreeItem
                            nodeId={y}
                            labelText={capitalize(y.replace(/-/g, ' '))}
                            key={y}
                            tooltipInfo={govData[x]['children-weight-type']}
                            labelInfo={govData[x].children[0][y].weight}
                            color="#000"
                            bgColor="#e8f0fe"
                          >
                            {Object.keys(govData[x].children[0][y].children[0]).map((z) => (
                              <StyledTreeItem
                                nodeId={z}
                                labelText={capitalize(z.replace(/-/g, ' '))}
                                key={z}
                                tooltipInfo={govData[x].children[0][y]['children-weight-type']}
                                labelInfo={govData[x].children[0][y].children[0][z].weight}
                                color="#1a73e8"
                                bgColor="#e8f0fe"
                              />
                            ))}
                          </StyledTreeItem>
                        ))}
                      </StyledTreeItem>
                    ))}
                  </TreeViewStyle>
                </Block>
              </Grid>
            </Grid>
          </Container>
        </Page>
      )}
    </>
  );
}
