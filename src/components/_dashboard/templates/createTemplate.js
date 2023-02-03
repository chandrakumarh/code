import React from 'react';
import MuiInput from '@mui/material/Input';
import PropTypes from 'prop-types';

import { Slider, Grid, styled, Collapse, Typography, Stack, Divider, FormControlLabel, Switch } from '@mui/material';

// ---------------------------------------------------

import Label from '../../Label';

// ---------------------------------------------------

const StyledSlider = styled(Slider)`
  @media (max-width: 500px) {
    width: 95%;
  }
`;

const ArrowDown = styled('div')`
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  cursor: pointer;
  border-top: ${(props) => (props.active === 'true' ? '' : '5px solid #000')};
  border-bottom: ${(props) => (props.active === 'true' ? '5px solid #000' : '')};
`;

const StyledGrid = styled(Grid)`
  padding-bottom: 1rem;
  @media (max-width: 900px) {
    border-right-width: 0;
  }
`;

const Input = styled(MuiInput)`
  width: 42px;
  & input {
    text-align: center;
  }
`;

const Capatalize = (name) => name.substr(0, 1).toUpperCase() + name.substr(1);

function Secondary({
  onLevel1Change,
  level1name,
  primaryLevel2Data,
  level1Pos,
  setGraphTitle,
  onLevel2Change,
  updateGraphData,
  setActiveOpen,
  activeOpen,
  setGraphData,
  level1Weight,
  intialLevel2
}) {
  const [value, setValue] = React.useState(level1Weight);
  const [checkedIn, setCheckedIn] = React.useState(activeOpen === level1Pos);
  const [once, setOnce] = React.useState(true);
  const [editable, setEditable] = React.useState(true);
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  let labelData = '';
  let labelColor = '';

  if (level1Pos === 0) {
    labelData = 'Enviroment';
    labelColor = 'success';
  } else if (level1Pos === 1) {
    labelData = 'Governance';
    labelColor = 'info';
  } else {
    labelData = 'Social';
    labelColor = 'warning';
  }

  React.useEffect(() => {
    setCheckedIn(activeOpen === level1Pos);
  }, [activeOpen]);

  const level2Keys = Object.keys(primaryLevel2Data);

  const [level2Data, setLevel2Data] = React.useState(
    level2Keys.map((name) => {
      const newName = Capatalize(name.split('-')[0]);

      return {
        params: newName,
        value: primaryLevel2Data[name].weight,
        max: 100
      };
    })
  );

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
    onLevel1Change(level1name, newValue, level1Pos);
  };

  const handleInputChange = (event) => {
    if (event.target.value === '') {
      setValue('');
      onLevel1Change(level1name, 0, level1Pos);

      return;
    }

    let val = Number(event.target.value);
    if (val >= 100) val = 100;
    setValue(val);

    onLevel1Change(level1name, val, level1Pos);
  };

  React.useEffect(() => {
    setOnce(false);
    if (once) return;
    level2Data.forEach((item, index) => {
      onLevel2Change(level2Keys[index], item.value, level1Pos);
    });
    if (checkedIn) setGraphData(level2Data);
  }, [level2Data]);

  const handleNestedSliderChange = (event, newValue, name) => {
    setLevel2Data(
      level2Data.map((item) => {
        if (item.params === name) item.value = newValue;
        return item;
      })
    );
  };

  const handleNestedInputChange = (event, name) => {
    if (event.target.value === '') {
      setLevel2Data(
        level2Data.map((item) => {
          if (item.params === name) item.value = 0;
          return item;
        })
      );

      return;
    }

    const val = Number(event.target.value);

    setLevel2Data(
      level2Data.map((item) => {
        if (item.params === name) item.value = val;
        return item;
      })
    );
  };

  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > 100) {
      setValue(100);
    }
  };

  const handleEditableChange = (e) => {
    setEditable(!e.target.checked);
  };

  const updateCheckedIn = () => {
    if (checkedIn) {
      updateGraphData();
      setActiveOpen(-1);
      setGraphTitle('ESG - Composition Data');
    } else {
      setGraphData(level2Data);
      setActiveOpen(level1Pos);
      setGraphTitle(`${labelData} - Composition`);
    }
    setCheckedIn(!checkedIn);
  };

  return (
    <>
      <Grid container spacing={2} sx={{ marginLeft: '2rem', marginBottom: '1rem' }}>
        <Grid item xs={11} md={8}>
          <StyledSlider
            size="small"
            valueLabelDisplay="auto"
            value={typeof value === 'number' ? value : 0}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
            name={level1name}
          />
        </Grid>
        <Grid item xs={6} md={1}>
          <Input
            value={value}
            size="small"
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: 1,
              min: 0,
              max: 100,
              type: 'number'
            }}
          />
        </Grid>
        <Grid
          item
          xs={6}
          md={1}
          style={{
            paddingTop: '8px',
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
            marginLeft: '15px'
          }}
        >
          <ArrowDown active={checkedIn.toString()} onClick={updateCheckedIn} />
        </Grid>
      </Grid>
      <Collapse in={checkedIn}>
        <Divider />
        <Grid container spacing={0}>
          <Grid item xs={1}>
            &nbsp;
          </Grid>
          <StyledGrid item xs={11} md={11}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '1rem auto',
                marginLeft: '-4.5rem'
              }}
            >
              Standard Weights
              <Switch checked={!editable} onChange={handleEditableChange} />
              Customizable Weights
            </div>
            {level2Data.map((item, index) => (
              <Stack sx={{ paddingLeft: '2rem', marginTop: '1rem', marginLeft: '1rem' }} key={index}>
                <div style={{ display: 'flex' }}>
                  <Typography gutterBottom>{item.params}</Typography>
                  <Label color={labelColor} variant="ghost" sx={{ ml: 2 }}>
                    {labelData}
                  </Label>
                </div>
                <Grid container spacing={2}>
                  <Grid item xs={9}>
                    <Slider
                      size="small"
                      valueLabelDisplay="auto"
                      value={Math.round(item.value)}
                      onChange={(e, v) => handleNestedSliderChange(e, v, item.params)}
                      aria-labelledby="input-slider"
                      max={100}
                      disabled={editable}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <Input
                      value={Math.round(item.value) === 0 ? '' : Math.round(item.value)}
                      size="small"
                      disabled={editable}
                      onChange={(e) => handleNestedInputChange(e, item.params)}
                      onBlur={handleBlur}
                      inputProps={{
                        step: 1,
                        min: 0,
                        max: 100,
                        type: 'number'
                      }}
                    />
                  </Grid>
                </Grid>
              </Stack>
            ))}
          </StyledGrid>
        </Grid>
        <Divider />
        <br />
        <br />
      </Collapse>
    </>
  );
}

Secondary.propTypes = {
  onLevel1Change: PropTypes.func,
  level1name: PropTypes.string,
  primaryLevel2Data: PropTypes.object,
  intialLevel2: PropTypes.object,
  level1Pos: PropTypes.number,
  onLevel2Change: PropTypes.func,
  updateGraphData: PropTypes.func,
  setGraphData: PropTypes.func,
  activeOpen: PropTypes.number,
  setActiveOpen: PropTypes.func,
  setGraphTitle: PropTypes.func,
  level1Weight: PropTypes.number
};

export default Secondary;
