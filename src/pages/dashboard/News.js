import { React, useEffect, useState } from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import Container from '@mui/material/Container';
import { LoadingButton } from '@mui/lab';
import Button from '@mui/material/Button';
import axios from '../../axios';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Page from '../../components/Page';
import useSettings from '../../hooks/useSettings';
import { PATH_DASHBOARD } from '../../routes/paths';
import { NewsCard } from '../../components/_dashboard/news';
import Label from '../../components/Label';

export default function OppositeContentTimeline() {
  const [accessToken, setAccessToken] = useState([]);
  const [account, setAccount] = useState([]);
  const [lastKey, setLastKey] = useState({});
  const [data, setData] = useState([]);
  const { themeStretch } = useSettings();
  useEffect(() => {
    const at = window.localStorage.getItem('accessToken');
    setAccessToken(at);
    const getNews = async () => {
      const url = '/get-news';
      const response = await axios.post(url, lastKey, { headers: { Authorization: at } });
      // console.log(response.data.LastEvaluatedKey);
      setData(response.data.data.reverse());
      setLastKey(response.data.LastEvaluatedKey);
    };
    getNews();
  }, []);

  const handleClick = () => {
    // console.log('button clicked');
    const getMoreNews = async () => {
      const response = await axios.post('/get-news', lastKey, { headers: { Authorization: accessToken } });
      // console.log(response);
    };
    getMoreNews();
  };

  const getDate = (ts) => {
    const date = new Date(ts);
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];
    const ordinalSuffixOf = (i) => {
      const j = i % 10;
      const k = i % 100;
      if (j === 1 && k !== 11) {
        return `${i}st`;
      }
      if (j === 2 && k !== 12) {
        return `${i}nd`;
      }
      if (j === 3 && k !== 13) {
        return `${i}rd`;
      }
      return `${i}th`;
    };
    return `${ordinalSuffixOf(date.getDate())} ${monthNames[date.getMonth()]}  ${date.getFullYear()}`;
  };

  return (
    <>
      <Page title="esgwize | News">
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading="Risk Monitoring"
            links={[{ name: 'Home', href: PATH_DASHBOARD.root }, { name: 'Risk Monitoring' }]}
          />
          <Timeline position="alternate">
            {data.map((news, ind) => (
              <TimelineItem key={news['news-id']}>
                <TimelineOppositeContent style={{ marginTop: '88px' }}>
                  <Label color="info"> {news.company} </Label> &bull; {getDate(news.timestamp)}{' '}
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot style={{ marginTop: '100px' }} />
                  {ind !== data.length - 1 && <TimelineConnector style={{ height: '230px', marginBottom: '-90px' }} />}
                </TimelineSeparator>
                <TimelineContent>
                  <NewsCard data={news} />
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
          {/* <Button onClick={handleClick}>Load More</Button> */}
          <LoadingButton size="medium" type="submit" variant="contained" color="info" onClick={handleClick}>
            Load More
          </LoadingButton>
        </Container>
      </Page>
    </>
  );
}
