import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import * as R from 'ramda';

import { addPlayer } from '../../actions';
import { SmartSelectField, SmartTextField } from '../../components';
import { Button } from '@material-ui/core';

import { playingPositions } from '../../constants';

class AddPlayer extends Component {
  render() {
    const {
      handleSubmit,
      teams: { list = [] }
    } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <Field
          id="name"
          className="fld-new"
          name="name"
          label="Player Name"
          component={SmartTextField}
        />

        <Field
          id="position"
          className="fld-new"
          name="position"
          label="Position"
          options={playingPositions}
          trigger="click"
          component={SmartSelectField}
        />
        <Field
          id="teamId"
          className="fld-new"
          name="teamId"
          label="Team"
          options={R.map(({ name, id }) => ({ value: id, label: name }), list)}
          trigger="click"
          component={SmartSelectField}
        />
        <Button type="submit" variant="contained" color="secondary">
          Submit
        </Button>
      </form>
    );
  }
}

function onSubmit(values) {
  addPlayer(values);
}

AddPlayer = reduxForm({
  // a unique name for the form
  form: 'addPlayerForm',
  onSubmit
})(AddPlayer);

const mapStateToProps = ({ teams, matches }) => ({
  teams,
  matches
});

export default connect(
  mapStateToProps,
  null
)(AddPlayer);
