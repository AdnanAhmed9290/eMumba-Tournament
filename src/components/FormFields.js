import React from 'react';
import {
  FormControl,
  InputLabel,
  FormHelperText,
  Input,
  MenuItem,
  Select,
  Grid
} from '@material-ui/core';
import * as R from 'ramda';
import { makeStyles } from '@material-ui/styles';
import moment from 'moment';

import MomentUtils from '@date-io/moment'; // choose your lib
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

import { isSomething } from '../utils';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 400,
    marginBottom: 10
  },
  input: {
    marginBottom: '0 !important'
  }
}));

export const SmartTextField = props => {
  const classes = useStyles();
  const {
    id,
    input,
    label,
    placeholder,
    disabled = false,
    multiline,
    rowsMax,
    fullWidth = true,
    meta: { touched, error }
  } = props;

  return (
    <FormControl error={Boolean(touched && error)} fullWidth={fullWidth}>
      <InputLabel htmlFor={`${id}_label`}>{label}</InputLabel>
      <Input
        {...input}
        id={id}
        placeholder={placeholder}
        multiline={multiline}
        rowsMax={rowsMax}
        disabled={disabled}
        classes={{
          root: classes.root,
          input: classes.input
        }}
      />
      <FormHelperText id={`${id}_help`}>{touched && error ? error : ''}</FormHelperText>
    </FormControl>
  );
};

export const SmartSelectField = props => {
  const {
    id,
    input,
    label,
    disabled = false,
    options = [],
    multiple = false,
    fullWidth = true,
    className = '',
    meta: { touched, error },
    trigger = 'hover'
  } = props;

  const isError = R.equals(trigger, 'hover')
    ? Boolean(touched && error)
    : Boolean(input.value && error);

  return (
    <Grid container alignItems="center">
      <div className="material-select-wrapper">
        <FormControl
          style={{
            width: 400
          }}
          error={isError}
          fullWidth={fullWidth}
          className={className}>
          <InputLabel htmlFor={`${id}_label`}>{label}</InputLabel>
          <Select
            {...input}
            multiple={multiple}
            disabled={disabled}
            MenuProps={{
              PaperProps: {
                style: {
                  transform: 'translate3d(0, 0, 0)',
                  maxHeight: '300px'
                }
              }
            }}
            input={<Input id={id} />}>
            {R.map(
              ({ value, label }) => (
                <MenuItem key={value} title={value} value={value}>
                  {label}
                </MenuItem>
              ),
              options
            )}
          </Select>
          <FormHelperText id={`${id}_help`} />
        </FormControl>
      </div>
    </Grid>
  );
};

export const SmartSelect = props => {
  const {
    id,
    label,
    disabled = false,
    options = [],
    multiple = false,
    fullWidth = true,
    className = '',
    handleOnChange = () => {},
    value = '',
    width = 400
  } = props;
  return (
    <FormControl
      style={{
        width
      }}
      fullWidth={fullWidth}
      className={className}>
      <InputLabel htmlFor={`${id}_label`}>{label}</InputLabel>
      <Select
        value={value}
        onChange={handleOnChange}
        multiple={multiple}
        disabled={disabled}
        MenuProps={{
          PaperProps: {
            style: {
              transform: 'translate3d(0, 0, 0)',
              maxHeight: '300px'
            }
          }
        }}
        input={<Input id={id} />}>
        {R.map(
          ({ value, label }) => (
            <MenuItem key={value} title={value} value={value}>
              {label}
            </MenuItem>
          ),
          options
        )}
      </Select>
      <FormHelperText id={`${id}_help`} />
    </FormControl>
  );
};

export const SmartDateTimePicker = ({
  input,
  placeholder,
  defaultValue,
  meta: { touched, error },
  label = '',
  handleDateChange = () => {}
}) => {
  const classes = useStyles();

  return (
    <div>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <DateTimePicker
          value={input.value ? moment(input.value) : moment()}
          onChange={dateTime => input.onChange(moment(dateTime).format())}
          label={label}
          showTodayButton
          InputProps={{
            classes: {
              input: classes.input,
              root: classes.root
            }
          }}
        />
      </MuiPickersUtilsProvider>
      {touched && error && <span>{error}</span>}
    </div>
  );
};
