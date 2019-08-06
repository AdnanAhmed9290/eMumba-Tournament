import { fireStoreRef } from '../config/firebase';
import { FETCH_MATCHES, FETCH_MATCHES_LOADING, FETCH_MATCH } from './types';
import * as R from 'ramda';
import { isSomething } from './../utils';

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

  fireStoreRef.collection('matches').add(match);
};

export const setMatchStatus = (matchStatus, matchId) => {
  fireStoreRef.doc(`matches/${matchId}`).set(
    {
      matchStatus
    },
    { merge: true }
  );
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

    fireStoreRef.doc(`matches/${matchId}`).set(updatedMatch, { merge: true });
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
