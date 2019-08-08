import React from 'react';
import { Card, Grid, Button } from '@material-ui/core';
import classnames from 'classnames';

import { SmartSelect } from '../FormFields';
import { isNothing } from '../../utils';

import * as R from 'ramda';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  title: {
    margin: '10px 0px'
  },
  alignContent: {
    display: 'flex',
    alignItems: 'center'
  },
  alignContentRight: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  uppercase: {
    textTransform: 'uppercase'
  },
  cardStyling: {
    padding: 10,
    margin: '20px 0'
  },
  goalBtn: {
    marginLeft: 10,
    '&:disabled': {
      cursor: 'no-drop'
    }
  }
}));

const MatchControlComponent = ({
  homeTeam,
  awayTeam,
  matchStatus,
  matchId,
  teamOneScorer,
  teamTwoScorer,
  handleGoalClick,
  handleSelectChange,
  updateMatchStatus,
  endMatch
}) => {
  const classes = useStyles();

  const isMatchToBePlayed = R.equals('pending', matchStatus);

  return (
    <Card className={classes.cardStyling}>
      <Grid container spacing={2} alignItems="center">
        {isMatchToBePlayed && (
          <Grid item xs={12} sm={12} md={12} style={{ textAlign: 'center' }}>
            <Button
              color="primary"
              variant="contained"
              onClick={() => updateMatchStatus('live', matchId)}>
              Start Match
            </Button>
          </Grid>
        )}
        {R.equals('live', matchStatus) && (
          <>
            <Grid
              item
              xs={12}
              sm={4}
              md={4}
              className={classnames(classes.alignContent, 'goals-select-wrapper')}>
              <SmartSelect
                width={200}
                value={teamOneScorer}
                handleOnChange={e => handleSelectChange(e.target.value, 'teamOneScorer')}
                label="Select Goal Scorer"
                options={R.map(
                  ({ name, id }) => ({ value: `${id}?${name}`, label: name }),
                  R.propOr([], 'players', homeTeam)
                )}
              />
              <Button
                className={classes.goalBtn}
                variant="contained"
                disabled={isNothing(teamOneScorer)}
                onClick={() => handleGoalClick(homeTeam.id, teamOneScorer)}>
                Goal
              </Button>
            </Grid>
            <Grid item xs={12} sm={4} md={4} style={{ textAlign: 'center' }}>
              <Button color="primary" variant="contained" onClick={endMatch}>
                End Match
              </Button>
            </Grid>
            <Grid
              item
              xs={12}
              sm={4}
              md={4}
              alignItems="baseline"
              className={classnames(classes.alignContentRight, 'goals-select-wrapper')}>
              <SmartSelect
                width={200}
                value={teamTwoScorer}
                handleOnChange={e => handleSelectChange(e.target.value, 'teamTwoScorer')}
                label="Select Goal Scorer"
                options={R.map(
                  ({ name, id }) => ({ value: `${id}?${name}`, label: name }),
                  R.propOr([], 'players', awayTeam)
                )}
              />
              <Button
                className={classes.goalBtn}
                variant="contained"
                onClick={() => handleGoalClick(awayTeam.id, teamTwoScorer)}
                disabled={isNothing(teamTwoScorer)}>
                Goal
              </Button>
            </Grid>
          </>
        )}
      </Grid>
    </Card>
  );
};

export default MatchControlComponent;
