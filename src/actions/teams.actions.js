import { fireStoreRef } from '../config/firebase';
import { FETCH_TEAMS, FETCH_TEAMS_LOADING, SET_TOP_GOALSCORERS } from './types';
import * as R from 'ramda';

const fetchingTeams = bool => {
  return {
    type: FETCH_TEAMS_LOADING,
    payload: bool
  };
};

export function addPlayer(values) {
  fireStoreRef.collection('players').add({
    ...values,
    teamRef: `teams/${values.teamId}`
  });
}

export const getTopScorer = () => dispatch => {
  fireStoreRef.collection('matches').onSnapshot(snapshot => {
    let scorer = [];
    snapshot.forEach(match => {
      const goalScorers = R.pipe(
        R.propOr([], 'teams'),
        R.pluck('scorer'),
        R.without([undefined, null]),
        R.flatten,
        R.defaultTo([])
      )(match.data());
      scorer.push(goalScorers);
    });

    const topGoalScorers = R.pipe(
      R.flatten,
      R.sort(R.ascend(R.prop('id'))),
      R.groupBy(R.prop('id')),
      R.values,
      R.sort(R.descend(R.length)),
      R.map(item => ({
        player: R.head(item),
        goals: R.length(item)
      })),
      R.slice(0, 10)
    )(scorer);
    console.log(' ================== Scorers ===============');
    console.log('Scorers: ', topGoalScorers);
    dispatch({
      type: SET_TOP_GOALSCORERS,
      payload: topGoalScorers
    });
  });
};

export const fetchTeams = () => dispatch => {
  dispatch(fetchingTeams(true));
  try {
    fireStoreRef
      .collection('teams')
      .orderBy('name', 'asc')
      .onSnapshot(async snapshot => {
        let teams = [];
        await snapshot.forEach(async doc => {
          const playersRef = await fireStoreRef
            .collection('players')
            .where('teamId', '==', doc.id)
            .get();

          let players = [];
          for (const player of playersRef.docs) {
            players.push({
              id: player.id,
              ...player.data()
            });
          }

          teams.push({
            id: doc.id,
            players,
            ...doc.data()
          });
          dispatch({
            type: FETCH_TEAMS,
            payload: teams
          });
        });

        dispatch(fetchingTeams(false));
      });
  } catch (err) {
    console.log('Error while fetching teams: ', err);
    dispatch(fetchingTeams(false));
  }
};
