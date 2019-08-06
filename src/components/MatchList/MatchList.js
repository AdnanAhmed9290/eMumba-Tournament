import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, CircularProgress, Grid, Typography } from '@material-ui/core';
import MatchCard from '../MatchCard/MatchCard';

import * as R from 'ramda';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    padding: theme.spacing(2)
  }
}));

const MatchList = ({ matches, handleOnMatchClick }) => {
  const { isLoading = false, list = [] } = matches;

  const classes = useStyles();

  const groupedMatches = R.groupBy(R.prop('matchday'), list);

  console.log('Grouped Matches: ', groupedMatches);

  return (
    <Paper className={classes.root}>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          {R.map(([key, list]) => {
            return (
              <>
                <Grid item sm={12} md={12}>
                  <Typography variant="h5">{key}</Typography>
                </Grid>
                {list.map(match => (
                  <Grid item xs={12} sm={12} md={6}>
                    <MatchCard match={match} handleOnClick={handleOnMatchClick} />
                  </Grid>
                ))}
              </>
            );
          }, R.toPairs(groupedMatches))}
        </Grid>
      )}
    </Paper>
  );
};

export default MatchList;
