import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as R from 'ramda';

import {
  Grid,
  Typography,
  Card,
  Button,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Paper
} from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';

import { StyledTableCell, StyledTableRow, SmartSelect } from '../../components';
import { fetchMatch, setMatchStatus, setMatchGoal } from '../../actions';
import { matchDate, matchTime, getMatchStatus, isNothing } from '../../utils';

class Match extends Component {
  state = {
    teamOneScorer: '',
    teamTwoScorer: ''
  };

  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id }
      }
    } = this.props;
    dispatch(fetchMatch(id));
  }

  handleSelectChange = (value, state) => {
    this.setState({
      [state]: value
    });
  };

  handleGoalClick = (teamId, player) => {
    this.props.dispatch(setMatchGoal(teamId, player));
    this.setState({
      teamOneScorer: '',
      teamTwoScorer: ''
    });
  };

  renderTeamLineUp = team => {
    const { classes } = this.props;
    const { players = [], name = '' } = team;
    return (
      <Paper className={classes.root}>
        <Typography variant="h5" className={classes.title}>
          {name}
        </Typography>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <StyledTableCell>Pos.</StyledTableCell>
              <StyledTableCell>Name</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {players.map(player => (
              <StyledTableRow>
                <StyledTableCell>
                  <span className={classes.position}>{player.position}</span>
                </StyledTableCell>
                <StyledTableCell>{player.name}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    );
  };

  render() {
    const {
      classes,
      matches: { selectedMatch = {} }
    } = this.props;

    const { matchStatus, time, id: matchId } = selectedMatch;
    const homeTeam = R.pathOr({}, ['teams', 0], selectedMatch);
    const awayTeam = R.pathOr({}, ['teams', 1], selectedMatch);

    const isMatchToBePlayed = R.equals('pending', matchStatus);

    const getTeamPlayer = team =>
      R.pipe(
        R.propOr([], 'scorer'),
        R.pluck('name')
      )(team);

    return (
      <div className="match-container">
        <Card className={classes.cardStyling}>
          <Grid container spacing={3}>
            <Grid item xs={3} sm={4} className={classes.alignContentRight}>
              <Typography align="right">{R.propOr('', 'name', homeTeam)}</Typography>
              <Typography>{getTeamPlayer(homeTeam)}</Typography>
            </Grid>
            <Grid item xs={6} sm={4}>
              <Typography align="center">
                {matchDate(time)}{' '}
                {isMatchToBePlayed ? (
                  <>
                    <br />
                    Starts At
                  </>
                ) : (
                  '-'
                )}{' '}
                {matchTime(time)}
              </Typography>
              <Typography align="center" variant="h3">
                {R.propOr('', 'score', homeTeam)} - {R.propOr('', 'score', awayTeam)}
              </Typography>
              <Typography align="center" className={classes[matchStatus]}>
                {!isMatchToBePlayed && getMatchStatus(matchStatus)}
              </Typography>
            </Grid>
            <Grid item xs={3} sm={4} className={classes.alignContent}>
              <Typography>{R.propOr('', 'name', awayTeam)}</Typography>
              <Typography>{getTeamPlayer(awayTeam)}</Typography>
            </Grid>
          </Grid>
        </Card>

        <Card className={classes.cardStyling}>
          <Grid container spacing={2} alignItems="center">
            {isMatchToBePlayed && (
              <Grid item xs={12} sm={12} md={12} style={{ textAlign: 'center' }}>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => setMatchStatus('live', matchId)}>
                  Start Match
                </Button>
              </Grid>
            )}
            {R.equals('live', matchStatus) && (
              <>
                <Grid item xs={4} sm={4} md={4} className={classes.alignContent}>
                  <SmartSelect
                    width={200}
                    value={this.state.teamOneScorer}
                    handleOnChange={e => this.handleSelectChange(e.target.value, 'teamOneScorer')}
                    label="Select Goal Scorer"
                    options={R.map(
                      ({ name, id }) => ({ value: `${id}?${name}`, label: name }),
                      R.propOr([], 'players', awayTeam)
                    )}
                  />
                  <Button
                    className={classes.goalBtn}
                    variant="contained"
                    disabled={isNothing(this.state.teamOneScorer)}
                    onClick={() => this.handleGoalClick(homeTeam.id, this.state.teamOneScorer)}>
                    Goal
                  </Button>
                </Grid>
                <Grid item xs={4} sm={4} md={4} style={{ textAlign: 'center' }}>
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={() => setMatchStatus('ft', matchId)}>
                    End Match
                  </Button>
                </Grid>
                <Grid
                  item
                  xs={4}
                  sm={4}
                  md={4}
                  alignItems="baseline"
                  className={classes.alignContentRight}>
                  <SmartSelect
                    width={200}
                    value={this.state.teamTwoScorer}
                    handleOnChange={e => this.handleSelectChange(e.target.value, 'teamTwoScorer')}
                    label="Select Goal Scorer"
                    options={R.map(
                      ({ name, id }) => ({ value: `${id}?${name}`, label: name }),
                      R.propOr([], 'players', homeTeam)
                    )}
                  />
                  <Button
                    className={classes.goalBtn}
                    variant="contained"
                    onClick={() => this.handleGoalClick(awayTeam.id, this.state.teamTwoScorer)}
                    disabled={isNothing(this.state.teamTwoScorer)}>
                    Goal
                  </Button>
                </Grid>
              </>
            )}
          </Grid>
        </Card>

        <Card className={classes.cardStyling}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={6}>
              {this.renderTeamLineUp(homeTeam)}
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              {this.renderTeamLineUp(awayTeam)}
            </Grid>
          </Grid>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = ({ teams, matches }) => ({
  teams,
  matches
});

Match = withStyles(theme => ({
  root: {
    width: '100%',
    overflowX: 'auto'
  },
  flex: {
    display: 'flex'
  },
  table: {
    minHeight: 400
  },
  postion: {
    borderRadius: '50%',
    backgroundColor: '#f0f0f0',
    padding: '5px'
  },
  title: {
    margin: '10px 5px'
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
  cardStyling: {
    padding: 10,
    margin: '20px 0'
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
  goalBtn: {
    marginLeft: 10,
    '&:disabled': {
      cursor: 'no-drop'
    }
  }
}))(Match);

export default connect(
  mapStateToProps,
  null
)(Match);
