import './SignIn.scss';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { signIn } from './../../actions';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';

class SignIn extends Component {
  static contextTypes = {
    router: PropTypes.object
  };

  componentWillUpdate(nextProps) {
    if (nextProps.auth) {
      this.context.router.history.push('/');
    }
  }

  render() {
    return (
      <div className="row social-signin-container">
        <div className="col s10 offset-s1 center-align">
          <h4 id="sign-in-header">Sign In to start</h4>
          <Button
            className="social-signin"
            color="primary"
            variant="contained"
            onClick={this.props.signIn}>
            <i className="fa fa-google social-signin-icon" />
            Sign In With Google
          </Button>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(
  mapStateToProps,
  { signIn }
)(SignIn);
