import React from 'react';
import * as R from 'ramda';
import moment from 'moment';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';

export const getRandomInt = () => {
  return Math.floor(Math.random() * Math.floor(99999));
};

export const isNothing = R.either(R.isEmpty, R.isNil);
export const isSomething = R.complement(isNothing);

export const sumAll = R.reduce(R.add, 0);

export const isNegative = R.gt(0);

export const matchDate = time => {
  return new moment(time).format('MMM DD');
};

const sortComparator = (a, b) => a - b;
export const sortList = list => R.sort(sortComparator, list);

export const maxLength = max => value =>
  value && value.length > max ? `Must be ${max} characters or less.` : undefined;
export const minValue = min => value =>
  value && value < min ? `Must be at least ${min}.` : undefined;

export const required = value => (isNothing(value) ? 'Required' : undefined);

export const matchTime = time => {
  return new moment(time).format('hh:mm A');
};

export const getPlayerPosition = position => {
  switch (position) {
    case 'f':
      return 'F';
    case 'm':
      return 'M';
    case 'd':
      return 'D';
    case 'gk':
    default:
      return 'GK';
  }
};

const useStyles = makeStyles(theme => ({
  span: {
    float: 'right'
  },
  live: {
    color: 'red'
  },
  ft: {
    color: 'green'
  },
  pending: {
    color: 'grey'
  }
}));

export const getMatchStatus = status => {
  switch (status) {
    case 'live':
      return 'Live';
    case 'ft':
      return 'FT';
    default:
    case 'pending':
      return 'To be Played';
  }
};
