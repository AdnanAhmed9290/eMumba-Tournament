import { fireStoreRef } from '../config/firebase';
import { FETCH_MATCHES, FETCH_MATCHES_LOADING, FETCH_MATCH } from './types';
import * as R from 'ramda';
import { isNothing } from './../utils';
import { setToast } from './app.actions';

const fetchingMatches = bool => {
  return {
    type: FETCH_MATCHES_LOADING,
    payload: bool
  };
};

const splitNameWithId = team => {
  const [id, name] = R.split('?', team);
  return {
    id,
    name
  };
};

export const addMatch = values => {
  return dispatch => {
    const { time, matchday, matchStatus, team1 = '', team2 = '' } = values;

    const match = {
      time: time,
      matchday: matchday,
      matchStatus: matchStatus,
      teams: [
        {
          ...splitNameWithId(team1),
          score: 0
        },
        {
          ...splitNameWithId(team2),
          score: 0
        }
      ]
    };

    fireStoreRef
      .collection('matches')
      .add(match)
      .then(() => {
        dispatch(setToast('Match Successfully Added!', 'success'));
      });
  };
};

export const setMatchStatus = (matchStatus, matchId) => {
  return (dispatch, getState) => {
    fireStoreRef.doc(`matches/${matchId}`).set(
      {
        matchStatus
      },
      { merge: true }
    );

    if (matchStatus === 'live') {
      const selectedMatch = R.pathOr({}, ['matches', 'selectedMatch'], getState());
      const [homeTeam = '', awayTeam = ''] = R.pipe(
        R.propOr([], 'teams'),
        R.pluck('name')
      )(selectedMatch);
      dispatch(
        setToast(`${homeTeam.toUpperCase()} vs ${awayTeam.toUpperCase()} match started!`, 'info')
      );
    }
  };
};

export const setMatchGoal = (teamId, player) => {
  return (dispatch, getState) => {
    const selectedMatch = R.pathOr({}, ['matches', 'selectedMatch'], getState());
    const matchId = R.propOr('', 'id', selectedMatch);
    const updatedMatch = R.evolve(
      {
        teams: R.map(team => {
          const teamWithoutPlayers = R.dissoc('players', team),
            { score = '', scorer = [] } = teamWithoutPlayers;

          if (team.id === teamId) {
            return {
              ...teamWithoutPlayers,
              score: score + 1,
              scorer: R.append(splitNameWithId(player), scorer)
            };
          } else return teamWithoutPlayers;
        })
      },
      selectedMatch
    );

    fireStoreRef
      .doc(`matches/${matchId}`)
      .set(updatedMatch, { merge: true })
      .then(() => {
        dispatch(
          setToast(`Goal Scored By ${splitNameWithId(player).name.toUpperCase()}`, 'success')
        );
      });
  };
};

const getTeamInfo = (currentScore, currentTeam, otherTeam) => {
  const { wins, loss, tie, gs, ga, id } = currentTeam;
  const scoreComparator = currentScore - otherTeam.score;
  const goalsObj = {
    id,
    gs: R.add(currentScore, gs),
    ga: R.add(otherTeam.score, ga)
  };
  if (scoreComparator < 0) {
    return {
      loss: R.inc(loss),
      ...goalsObj
    };
  } else if (scoreComparator === 0) {
    return {
      tie: R.inc(tie),
      ...goalsObj
    };
  } else if (scoreComparator > 0) {
    return {
      wins: R.inc(wins),
      ...goalsObj
    };
  }
};

export const endLiveMatch = () => {
  return (dispatch, getState) => {
    const state = getState();
    const selectedMatch = R.pathOr({}, ['matches', 'selectedMatch'], state);
    const matchId = R.propOr('', 'id', selectedMatch);
    const matchDay = R.propOr('', 'matchday', selectedMatch);
    const teamsList = R.pathOr([], ['teams', 'list'], state);
    const selectedTeams = R.pipe(
      R.propOr([], 'teams'),
      R.map(R.pick(['id', 'score'])),
      teams =>
        teams.map(({ id, score }, index) => {
          const currentTeam = R.find(R.propEq('id', id), teamsList);
          const otherTeam = R.equals(index, 0) ? teams[1] : teams[0];
          return getTeamInfo(score, currentTeam, otherTeam);
        })
    )(selectedMatch);

    fireStoreRef
      .doc(`matches/${matchId}`)
      .set(
        {
          matchStatus: 'ft'
        },
        { merge: true }
      )
      .then(() => {
        dispatch(setToast(`Match Ended!`, 'info'));
      });

    if (!R.contains(matchDay, ['Semifinal', 'Final'])) {
      selectedTeams.forEach(team => {
        fireStoreRef.doc(`teams/${team.id}`).set(team, { merge: true });
      });
    }
  };
};

export const fetchMatches = () => dispatch => {
  dispatch(fetchingMatches(true));
  try {
    fireStoreRef
      .collection('matches')
      .orderBy('time', 'asc')
      .onSnapshot(async snapshot => {
        let matches = [];
        await snapshot.forEach(async doc => {
          matches.push({
            id: doc.id,
            ...doc.data()
          });
        });

        dispatch({
          type: FETCH_MATCHES,
          payload: matches
        });
        dispatch(fetchingMatches(false));
      });
  } catch (err) {
    console.log('Error while fetching matches: ', err);
    dispatch(fetchingMatches(false));
  }
};

export function fetchMatch(id) {
  return (dispatch, getState) => {
    dispatch(fetchingMatches(true));

    try {
      fireStoreRef.doc(`matches/${id}`).onSnapshot(async snapshot => {
        const data = snapshot.data();

        if (isNothing(data)) return;
        let { teams = [] } = data;

        teams.forEach(async (team, index) => {
          const playersRef = await fireStoreRef
            .collection('players')
            .where('teamId', '==', team.id)
            .orderBy('position', 'desc')
            .get();

          let players = [];
          for (const player of playersRef.docs) {
            players.push({
              id: player.id,
              ...player.data()
            });
          }
          teams[index] = {
            ...team,
            players
          };
          dispatch({
            type: FETCH_MATCH,
            payload: {
              id: snapshot.id,
              ...data,
              teams
            }
          });
        });

        dispatch(fetchingMatches(false));
      });
    } catch (err) {
      console.log('Error while fetching matches: ', err);
      dispatch(fetchingMatches(false));
    }
  };
}
