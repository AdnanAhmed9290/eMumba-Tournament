import React from 'react';
import { Card, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import { matchDate, matchTime, getMatchStatus, getTeamIcon } from '../../utils';

import { equals } from 'ramda';

const useStyles = makeStyles(theme => ({
  root: {
    padding: '1em',
    cursor: 'pointer',
    width: '100%'
  },
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
  },
  alignContent: {
    display: 'flex',
    alignItems: 'center'
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 10
  }
}));

function MatchCard({ match, handleOnClick }) {
  const { teams = [], id, time, matchStatus } = match;
  const classes = useStyles();

  return (
    <Card
      onClick={() => {
        handleOnClick(id);
      }}>
      <Grid container className={classes.root} alignItems="center">
        <Grid item xs={12} sm={12} style={{ marginBottom: 10 }}>
          {matchDate(time)} - {matchTime(time)}
          <span className={classnames(classes.span, classes[matchStatus])}>
            {getMatchStatus(matchStatus)}
          </span>
        </Grid>
        <Grid item xs={12} sm={12}>
          {teams.map(team => (
            <Grid container style={{ marginBottom: 10 }} alignItems="center">
              <Grid item xs={9} sm={9}>
                <Typography className={classes.alignContent}>
                  <img className={classes.icon} alt="Team Icon" src={getTeamIcon(team.name)} />
                  <b>{team.name}</b>
                </Typography>
              </Grid>
              <Grid item xs={3} sm={3}>
                <Typography align="right">
                  {match.status === 'pending' ? '-' : team.score}
                </Typography>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Card>
  );
}

export default MatchCard;
