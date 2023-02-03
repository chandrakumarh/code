import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import { Toolbar, Divider } from '@mui/material';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { LoadingButton } from '@mui/lab';

const steps = [
  {
    label: 'Portfolio name'
  },
  {
    label: 'Add Companies'
  },
  {
    label: 'Add Weights'
  },
  {
    label: 'Verify'
  }
];

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

export default function VerticalLinearStepper({
  activeStep,
  handleReset,
  setActiveStep,
  handleNext,
  handleBack,
  condition,
  isSubmitting
}) {
  return (
    <Box>
      <RootStyle>
        <h1>Progress</h1>
      </RootStyle>
      <Divider />
      <Stepper
        activeStep={activeStep}
        orientation="vertical"
        style={{
          marginLeft: '1.5rem',
          paddingTop: '1.5rem'
        }}
      >
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel>{step.label}</StepLabel>
            <StepContent>
              <Typography>{step.description}</Typography>
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    onClick={index === 0 ? null : handleBack}
                    disabled={index === 0}
                    variant="outlined"
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                  {index === steps.length - 1 ? (
                    <LoadingButton type="submit" variant="contained" loading={isSubmitting} sx={{ mt: 1, mr: 1 }}>
                      Submit
                    </LoadingButton>
                  ) : (
                    <Button variant="contained" onClick={handleNext} sx={{ mt: 1, mr: 1 }} disabled={!condition}>
                      Next
                    </Button>
                  )}
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
