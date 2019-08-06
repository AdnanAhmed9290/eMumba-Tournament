import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableHead, TableRow, Paper, CircularProgress } from '@material-ui/core';
import { connect } from 'react-redux';

import * as R from 'ramda';

import { StyledTableCell, StyledTableRow } from '../../components';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto'
  },
  table: {
    minWidth: 700,
    minHeight: 400
  }
}));

const PointsTable = ({ teams }) => {
  const { isLoading = false, list = [] } = teams;

  const classes = useStyles();

  const pointsCalculator = (wins = 0, tie = 0) => {
    return wins * 3 + tie;
  };

  const sortedList = R.sortWith([
    R.descend(R.prop('wins')),
    R.descend(x => R.prop('gs', x) - R.prop('ga', x))
  ]);

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">Pos.</StyledTableCell>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell align="center">W</StyledTableCell>
            <StyledTableCell align="center">L</StyledTableCell>
            <StyledTableCell align="center">T</StyledTableCell>
            <StyledTableCell align="center">Goals</StyledTableCell>
            <StyledTableCell align="center">GD</StyledTableCell>
            <StyledTableCell align="center">Pts</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <StyledTableRow>
              <StyledTableCell align="center" colSpan={8}>
                <CircularProgress />
              </StyledTableCell>
            </StyledTableRow>
          ) : (
            sortedList(list).map((team, idx) => (
              <StyledTableRow key={team.name}>
                <StyledTableCell align="center">{idx + 1}</StyledTableCell>
                <StyledTableCell component="th" scope="row">
                  {team.name}
                </StyledTableCell>
                <StyledTableCell align="center">{team.wins}</StyledTableCell>
                <StyledTableCell align="center">{team.loss}</StyledTableCell>
                <StyledTableCell align="center">{team.tie}</StyledTableCell>
                <StyledTableCell align="center">
                  {team.gs}:{team.ga}
                </StyledTableCell>
                <StyledTableCell align="center">{team.gs - team.ga}</StyledTableCell>
                <StyledTableCell align="center">
                  {pointsCalculator(team.wins, team.tie)}
                </StyledTableCell>
              </StyledTableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Paper>
  );
};

const mapStateToProps = ({ teams }) => ({ teams });

export default connect(mapStateToProps)(PointsTable);
