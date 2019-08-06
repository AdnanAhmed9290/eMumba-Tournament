import { fireStoreRef } from '../config/firebase';
import { FETCH_TEAMS, FETCH_TEAMS_LOADING } from './types';
// import * as R from 'ramda';

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
