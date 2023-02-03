import { React } from 'react';
import PropTypes from 'prop-types';
import { Card, CardActions, CardContent, Typography, Grid, Avatar, CardHeader, Tooltip } from '@mui/material';
// import Page from '../../components/Page';
import Label from '../../Label';

// import Typography from 'src/theme/overrides/Typography';

export default function NewsCard(props) {
  // console.log(props);
  const { data } = props;
  const getColor = (sentiment) => {
    if (sentiment === 'positive') return 'success';
    return 'error';
  };
  const handleMagnitude = (object) => {
    const mul = object.sentiment === 'positive' ? 1 : -1;
    return object.magnitude * mul;
  };
  return (
    <Card variant="outlined" xs={4} style={{ textAlign: 'left' }}>
      <CardHeader
        avatar={
          <Avatar
            alt="Adani Enterprise"
            src={data.logo}
            // src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Adani_2012_logo.png/1024px-Adani_2012_logo.png"
            sx={{ width: 56, height: 56 }}
            variant="rounded"
          />
        }
        title={data.title}
        // title="Gautam Adani becomes world's third-richest person as wealth surges"
      />
      <CardContent>
        {/* <Typography variant="caption" style={{ display: 'inline-block' }}>
          <span style={{ display: 'inline-block' }}>Adani Enterprises &bull; 22 August 2022 </span>
        </Typography> */}
        <Typography variant="subtitle2">
          {data.summary.substring(0, 150)}...{' '}
          <span>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={data.link}
              // href="https://timesofindia.indiatimes.com/business/india-business/gautam-adani-becomes-worlds-third-richest-person-as-wealth-surges/articleshow/93868021.cms"
            >
              Learn more
            </a>
          </span>
        </Typography>
      </CardContent>
      {/* </CardActionArea> */}
      <CardActions>
        <Grid
          container
          spacing={2}
          alignContent="space-around"
          style={{ margin: '0px 4px 4px 4px', textAlign: 'left' }}
        >
          <Grid item xs={6}>
            <Typography variant="button" style={{ display: 'inline-block' }}>
              Title Sentiment:{' '}
              <Tooltip title={handleMagnitude(data.title_sentiment)}>
                <span>
                  <Label color={getColor(data.title_sentiment.sentiment)} variant="ghost">
                    {data.title_sentiment.sentiment}
                  </Label>
                </span>
              </Tooltip>
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="button" style={{ display: 'inline-block' }}>
              text Sentiment:{' '}
              <Tooltip title={handleMagnitude(data.text_sentiment)}>
                <span>
                  <Label color={getColor(data.text_sentiment.sentiment)} variant="ghost">
                    {data.text_sentiment.sentiment}
                  </Label>
                </span>
              </Tooltip>
            </Typography>
          </Grid>
        </Grid>
        {/* <Button size="small">Share</Button> */}
      </CardActions>
    </Card>
  );
}

NewsCard.propTypes = {
  data: PropTypes.shape({
    link: PropTypes.string,
    logo: PropTypes.string,
    title: PropTypes.string,
    summary: PropTypes.string,
    text_sentiment: PropTypes.shape({
      sentiment: PropTypes.string,
      magnitude: PropTypes.number
    }),
    title_sentiment: PropTypes.shape({
      sentiment: PropTypes.string,
      magnitude: PropTypes.number
    })
  })
};

// export default NewsCard;
