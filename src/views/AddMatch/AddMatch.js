import React, { Component } from 'react';
import { Button, Paper, Typography } from '@material-ui/core';
import * as R from 'ramda';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import { addMatch } from '../../actions';
import { SmartSelectField, SmartDateTimePicker } from '../../components';

import { matchDays, matchStatus } from '../../constants';
import { required } from '../../utils';
import moment from 'moment';

class AddMatch extends Component {
  render() {
    const {
      invalid,
      handleSubmit,
      teams: { list = [] }
    } = this.props;
    return (
      <Paper style={{ padding: 15, margin: '20px 0' }}>
        <Typography variant="h5">Add New Match</Typography>
        <form onSubmit={handleSubmit}>
          <Field
            id="matchday"
            className="fld-new"
            name="matchday"
            label="Matchday"
            options={matchDays}
            trigger="click"
            component={SmartSelectField}
            validate={[required]}
          />
          <Field
            id="matchStatus"
            className="fld-new"
            name="matchStatus"
            label="Match Status"
            options={matchStatus}
            trigger="click"
            component={SmartSelectField}
            validate={[required]}
          />

          <Field
            id="team1"
            className="fld-new"
            name="team1"
            label="Team 1"
            options={R.map(({ name, id }) => ({ value: `${id}?${name}`, label: name }), list)}
            trigger="click"
            component={SmartSelectField}
            validate={[required]}
          />

          <Field
            id="team2"
            className="fld-new"
            name="team2"
            label="Team 2"
            options={R.map(({ name, id }) => ({ value: `${id}?${name}`, label: name }), list)}
            trigger="click"
            component={SmartSelectField}
            validate={[required]}
          />

          <Field
            id="time"
            className="fld-new"
            name="time"
            label="Match Time"
            component={SmartDateTimePicker}
            validate={[required]}
          />

          <Button
            type="submit"
            variant="contained"
            color="secondary"
            disabled={invalid}
            style={{ margin: '20px 0 10px' }}>
            Submit
          </Button>
        </form>
      </Paper>
    );
  }
}

function onSubmit(values, dispatch) {
  dispatch(addMatch(values));
}

AddMatch = reduxForm({
  // a unique name for the form
  initialValues: {
    time: moment().format()
  },
  form: 'addMatchForm',
  onSubmit
})(AddMatch);

const mapStateToProps = ({ teams, matches }) => ({
  teams,
  matches
});

export default connect(
  mapStateToProps,
  null
)(AddMatch);
