import React from 'react';

import { Divider, Toolbar, styled, TextField, Button, Box } from '@mui/material';

const RootStyle = styled(Toolbar)`
  display: flex;
  justify-content: space-between;
  min-height: 64px;
  height: 96px;

  & h1 {
    @media only screen and (max-width: 410px) {
      font-size: 1.8rem;
    }
  }

  @media only screen and (max-width: 900px) {
    border-color: rgba(145, 158, 171, 0.24);
    border-width: 0;
    border-style: solid;
    border-top-width: 1px;
  }

  @media only screen and (max-width: 500px) {
    margin: 1rem 0;
  }
`;

export default function Intro({
  touched,
  errors,
  getFieldProps,
  activeStep,
  formik,
  handleBack,
  handleNext,
  setCondition,
  condition
}) {
  if (formik.values.portfolioName === '' || formik.values.portfolioCode === '') setCondition(() => false);
  else setCondition(() => true);

  return (
    <div>
      <RootStyle>
        <h1>Enter Basic Details</h1>
      </RootStyle>
      <Divider />
      <div>
        <div style={{ margin: '2rem', minHeight: '5rem' }}>
          <TextField
            fullWidth
            label="Portfolio Name"
            {...getFieldProps('portfolioName')}
            error={Boolean(touched.portfolioName && errors.portfolioName)}
            helperText={touched.portfolioName && errors.portfolioName}
            required
          />
          <br />
          <br />
          <TextField
            fullWidth
            label="Portfolio Code"
            {...getFieldProps('portfolioCode')}
            error={Boolean(touched.portfolioCode && errors.portfolioCode)}
            helperText={touched.portfolioCode && errors.portfolioCode}
            required
          />
        </div>
        <br />
        <br />
        <Divider />
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, margin: 'auto 2rem' }}>
          <Button variant="outlined" disabled={activeStep === 0} onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
            Back
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          <Button
            variant="contained"
            onClick={handleNext}
            sx={{ mt: 1, mr: 1 }}
            disabled={formik.values.portfolioName === '' || formik.values.portfolioCode === ''}
          >
            Next
          </Button>
        </Box>
      </div>
    </div>
  );
}
