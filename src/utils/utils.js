import React from 'react';
import * as R from 'ramda';
import moment from 'moment';

import * as alphaImage from '../assets/alpha.png';
import * as bravoImage from '../assets/bravo.jpg';
import * as charlieImage from '../assets/charlie.png';
import * as deltaImage from '../assets/delta.png';
import * as eagleImage from '../assets/eagle.png';
import * as defaultTeam from '../assets/default-team.png';

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

export const getTeamIcon = team => {
  switch (team) {
    case 'Alpha':
      return alphaImage;
    case 'Bravo':
      return bravoImage;
    case 'Charlie':
      return charlieImage;
    case 'Delta':
      return deltaImage;
    case 'Eagles':
    case 'Eagle':
      return eagleImage;
    case 'Foxtrot':
    default:
      return defaultTeam;
  }
};

export const getScorerList = R.pipe(
  R.propOr([], 'scorer'),
  R.pluck('name'),
  R.sort(R.ascend(R.identity)),
  R.groupBy(R.identity),
  R.map(R.length),
  R.toPairs,
  R.map(([player, goals]) => `${player} (${goals})`)
);
