import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Paper, CircularProgress, Grid, Typography } from '@material-ui/core';
import { MatchCard } from './../../components';
import PropTypes from 'prop-types';

import * as R from 'ramda';
import { connect } from 'react-redux';

const useStyles = theme => ({
  root: {
    padding: theme.spacing(2),
    backgroundColor: 'unset',
    minWidth: 325,
    [theme.breakpoints.down('sm')]: {
      padding: 0
    }
  },
  title: {
    padding: '5px'
  }
});

class MatchList extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  handleOnMatchClick = id => {
    this.context.router.history.push(`/matches/${id}`);
  };

  render() {
    const { classes, matches = [] } = this.props;
    const { isLoading = false, list = [] } = matches;
    const groupedMatches = R.groupBy(R.prop('matchday'), list);

    return (
      <Paper className={classes.root} elevation={0.2}>
        {isLoading ? (
          <div className="loader-wrapper">
            <CircularProgress />
          </div>
        ) : (
          <Grid container spacing={3}>
            {R.map(([key, list]) => {
              return (
                <>
                  <Grid item sm={12} md={12} style={{ paddingBottom: 0 }}>
                    <Typography variant="h5">{key}</Typography>
                  </Grid>
                  {list.map(match => (
                    <Grid item xs={12} sm={12} md={4}>
                      <MatchCard match={match} handleOnClick={this.handleOnMatchClick} />
                    </Grid>
                  ))}
                </>
              );
            }, R.toPairs(groupedMatches))}
          </Grid>
        )}
      </Paper>
    );
  }
}

const mapStateToProps = ({ matches }) => ({ matches });

MatchList = withStyles(useStyles)(MatchList);

export default connect(mapStateToProps)(MatchList);
