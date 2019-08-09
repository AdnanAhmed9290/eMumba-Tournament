import React, { Component } from 'react';
import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableBody,
  CircularProgress
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';

import * as R from 'ramda';
import { StyledTableCell, StyledTableRow } from '../../components';

import * as TopGoalScorerIcon from './../../assets/goal-scorer.png';

const useStyles = theme => ({
  root: {
    padding: theme.spacing(2),
    backgroundColor: 'unset',
    overflowX: 'auto',
    margin: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      margin: 0
    }
  },
  table: {
    marginTop: 20,
    minHeight: 400
  },
  alignContent: {
    display: 'flex',
    alignItems: 'center',
    minWidth: 300
  }
});

class Stats extends Component {
  render() {
    const { classes, topGoalScorers, isLoading } = this.props;
    return (
      <Paper className={classes.root}>
        <div className={classes.alignContent}>
          <img src={TopGoalScorerIcon} width="35" alt="Top Goal Scorer Icon" />
          &nbsp;
          <Typography variant="h5" component="span">
            Top Goal Scorers
          </Typography>
        </div>
        {isLoading ? (
          <div className="loader-wrapper">
            <CircularProgress />
          </div>
        ) : (
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <StyledTableCell align="left">Pos.</StyledTableCell>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell align="center">Goals</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {topGoalScorers.map((item, index) => (
                <StyledTableRow key={item.player.id}>
                  <StyledTableCell align="left">{index + 1}</StyledTableCell>
                  <StyledTableCell>{item.player.name}</StyledTableCell>
                  <StyledTableCell align="center">{item.goals}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    );
  }
}

Stats = withStyles(useStyles)(Stats);

const mapStateToProps = ({ teams }) => ({
  topGoalScorers: R.propOr([], 'topGoalScorers', teams),
  isLoading: R.propOr(false, 'isLoading', teams)
});

export default connect(
  mapStateToProps,
  null
)(Stats);
