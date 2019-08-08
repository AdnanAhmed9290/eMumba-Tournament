import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as R from 'ramda';
import classnames from 'classnames';

import {
  Grid,
  Typography,
  Card,
  Button,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Paper,
  CircularProgress
} from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';

import { StyledTableCell, StyledTableRow, SmartSelect } from '../../components';
import { fetchMatch, setMatchStatus, setMatchGoal, endLiveMatch } from '../../actions';
import {
  matchDate,
  matchTime,
  getMatchStatus,
  isNothing,
  getTeamIcon,
  getScorerList
} from '../../utils';

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

  endMatch = () => {
    this.props.dispatch(endLiveMatch());
  };

  updateMatchStatus = (status, matchId) => {
    this.props.dispatch(setMatchStatus(status, matchId));
  };

  renderGoalScorers = scorer => {};

  renderTeamLineUp = team => {
    const { classes } = this.props;
    const { players = [], name = '' } = team;
    return (
      <Paper className={classes.root} elevation={0}>
        <Typography variant="h5" className={classnames(classes.alignContent, classes.title)}>
          <img className={classes.icon} alt="Team Icon" src={getTeamIcon(name)} />
          <b>{name}</b>
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
      matches: { selectedMatch = {}, isLoading = false },
      isAdmin = false
    } = this.props;

    const { matchStatus, time, id: matchId } = selectedMatch;
    const homeTeam = R.pathOr({}, ['teams', 0], selectedMatch);
    const homeTeamName = R.propOr('', 'name', homeTeam);
    const awayTeam = R.pathOr({}, ['teams', 1], selectedMatch);
    const awayTeamName = R.propOr('', 'name', awayTeam);

    const isMatchToBePlayed = R.equals('pending', matchStatus);

    return (
      <div className="match-container">
        <Card className={classes.cardStyling}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={3} sm={4}>
              <Typography
                variant="h6"
                align="right"
                className={classnames(classes.alignContentRight, classes.uppercase, 'team-title')}>
                <img className={classes.icon} alt="Team Icon" src={getTeamIcon(homeTeamName)} />
                <b>{homeTeamName}</b>
              </Typography>
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
            <Grid item xs={3} sm={4}>
              <Typography
                variant="h6"
                className={classnames(classes.alignContent, classes.uppercase, 'team-title')}>
                <img className={classes.icon} alt="Team Icon" src={getTeamIcon(awayTeamName)} />
                <b>{awayTeamName}</b>
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={6} sm={4}>
              <Typography variant="body2">{getScorerList(homeTeam).join(', ')}</Typography>
            </Grid>
            <Grid item xs={1} sm={4} />
            <Grid item xs={5} sm={4}>
              <Typography variant="body2">{getScorerList(awayTeam).join(', ')}</Typography>
            </Grid>
          </Grid>
        </Card>

        {isAdmin && matchStatus !== 'ft' && (
          <Card className={classes.cardStyling}>
            <Grid container spacing={2} alignItems="center">
              {isMatchToBePlayed && (
                <Grid item xs={12} sm={12} md={12} style={{ textAlign: 'center' }}>
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={() => this.updateMatchStatus('live', matchId)}>
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
                      value={this.state.teamOneScorer}
                      handleOnChange={e => this.handleSelectChange(e.target.value, 'teamOneScorer')}
                      label="Select Goal Scorer"
                      options={R.map(
                        ({ name, id }) => ({ value: `${id}?${name}`, label: name }),
                        R.propOr([], 'players', homeTeam)
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
                  <Grid item xs={12} sm={4} md={4} style={{ textAlign: 'center' }}>
                    <Button color="primary" variant="contained" onClick={this.endMatch}>
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
                      value={this.state.teamTwoScorer}
                      handleOnChange={e => this.handleSelectChange(e.target.value, 'teamTwoScorer')}
                      label="Select Goal Scorer"
                      options={R.map(
                        ({ name, id }) => ({ value: `${id}?${name}`, label: name }),
                        R.propOr([], 'players', awayTeam)
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
        )}

        <Card className={classes.cardStyling}>
          <Grid container spacing={3}>
            {isLoading ? (
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                style={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
              </Grid>
            ) : (
              <>
                <Grid item xs={12} sm={12} md={6}>
                  {this.renderTeamLineUp(homeTeam)}
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  {this.renderTeamLineUp(awayTeam)}
                </Grid>
              </>
            )}
          </Grid>
        </Card>
      </div>
    );
  }
}

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
  },
  icon: {
    width: 50,
    height: 50,
    marginRight: 10
  }
}))(Match);

const mapStateToProps = ({ teams, matches, isAdmin }) => ({
  teams,
  matches,
  isAdmin
});

export default connect(
  mapStateToProps,
  null
)(Match);
