import { React, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { Link as RouterLink } from 'react-router-dom';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
// material
import { Box, Stack, Card, Button, Typography, CardHeader } from '@mui/material';
// axios
import axios from 'axios';
//
import Scrollbar from '../../Scrollbar';

// ----------------------------------------------------------------------

NewsItem.propTypes = {
  news: PropTypes.shape({
    content: PropTypes.string,
    author: PropTypes.string,
    description: PropTypes.string,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number,
        customerId: PropTypes.string,
        date: PropTypes.string
      })
    ),
    source: PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.string
    }),
    title: PropTypes.string,
    url: PropTypes.string,
    urlToImage: PropTypes.string,
    publishedAt: PropTypes.string
  })
};

function NewsItem({ news }) {
  //   const { image, title, description, postedAt } = news;
  const { description, url, urlToImage, title } = news;

  function strip(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  }

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Box
        component="img"
        alt={`${title.slice(0, 5)}...`}
        src={urlToImage}
        sx={{ width: 48, height: 48, borderRadius: 1.5 }}
      />
      <Box sx={{ minWidth: 240 }}>
        <a href={url} style={{ color: 'black' }} target="_blank" rel="noreferrer">
          <Typography variant="subtitle2">{title}</Typography>
        </a>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {`${strip(description).slice(0, 100)}...`}
        </Typography>
      </Box>
      <br />
    </Stack>
  );
}

export default function NewsTable() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getNews = async () => {
      try {
        const url = 'https://nglg1k1kze.execute-api.us-west-1.amazonaws.com/dev/news';
        // 'https://newsapi.org/v2/top-headlines?language=en&category=business&apiKey=cc20898809b44b64b6e63982b82d7639';
        const response = await axios.get(url);
        setData(response.data.rawData.articles);
      } catch (err) {
        console.log(err);
        return err;
      }
    };

    getNews();
  }, []);
  return (
    <Card style={{ height: '100%' }}>
      <CardHeader title="News Update" />
      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3 }}>
          {data.slice(0, 3).map((news) => (
            <NewsItem key={news.title} news={news} />
          ))}
          <Button
            to="/dashboard/news"
            size="large"
            color="inherit"
            component={RouterLink}
            endIcon={<Icon icon={arrowIosForwardFill} />}
            variant="outlined"
          >
            View all
          </Button>
        </Stack>
      </Scrollbar>
    </Card>
  );
}
