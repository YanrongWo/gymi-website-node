import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';

import { validatePassword } from '../../common/passwords';
import { validateUsername } from '../../common/usernames';
import Modal from './Modal';
import Button from './Button';
import { logIn } from '../actions';

import './LogInModal.less';
import messages from '../messages';

export class LogInModalView extends React.Component {
  constructor(props) {
    super(props);
    this.parseLoginEntries = this.parseLoginEntries.bind(this);
    this.handleLogIn = this.handleLogIn.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      formIsValid: false,
      validationError: null,
    };
  }

  parseLoginEntries() {
    const username = this.loginForm.elements.username.value;
    const password = this.loginForm.elements.password.value;
    const remember = this.loginForm.elements.remember.checked;
    return { username, password, remember };
  }

  validateForm() {
    const { username, password } = this.parseLoginEntries();

    if (username.length === 0) {
      return 'errors.username.missing';
    }

    if (password.length === 0) {
      return 'errors.password.missing';
    }

    const usernameValidationError = validateUsername(username);
    if (usernameValidationError) {
      return usernameValidationError;
    }

    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      return passwordValidationError;
    }

    return null;
  }

  handleLogIn(e) {
    e.preventDefault();
    const { username, password, remember } = this.parseLoginEntries();
    this.props.logIn(username, password, remember);
  }

  handleChange(e) {
    e.preventDefault();
    const formValidation = this.validateForm();
    this.setState({
      validationError: formValidation,
      formIsValid: !formValidation,
    });
  }

  render() {
    return (
      <Modal
        title="Log in"
        closeModal={this.props.closeModal}
      >
        { this.state.validationError &&
          <p className="LoginModal--errors">
            <FormattedMessage {..._.get(messages, this.state.validationError)} />
          </p>
        }
        { this.props.logInError &&
          <p className="LoginModal--errors">
            <FormattedMessage {..._.get(messages, this.props.logInError)} />
          </p>
        }
        <form
          ref={(el) => { this.loginForm = el; }}
          onSubmit={this.handleLogIn}
          className="LogInModal--form"
        >
          <ul className="LoginModal--form--entries">
            <li>
              <label htmlFor="LogInModal--form--username">
                <FormattedMessage {...messages.sessions.username} />
              </label>
              <input
                type="text" name="username" id="LogInModal--form--username"
                onChange={this.handleChange}
              />
            </li>

            <li>
              <label htmlFor="LogInModal--form--password">
                <FormattedMessage {...messages.sessions.password} />
              </label>
              <input
                type="password" name="password" id="LogInModal--form--password"
                onChange={this.handleChange}
              />
            </li>
            <li className="LogInModal--form--rememberItem">
              <input type="checkbox" name="remember" id="LogInModal--form--remember" />
              <label htmlFor="LogInModal--form--remember">
                <FormattedMessage {...messages.sessions.rememberMe} />
              </label>
            </li>
            <li className="LogInModal--form--submitItem">
              <Button type="primary" action="submit" disabled={!this.state.formIsValid}>
                <FormattedMessage {...messages.sessions.logIn} />
              </Button>
            </li>
          </ul>
        </form>
      </Modal>
    );
  }
}

LogInModalView.propTypes = {
  closeModal: PropTypes.func.isRequired,
  logIn: PropTypes.func.isRequired,
  logInError: PropTypes.string,
};

function mapStateToProps(state) {
  return {
    logInError: state.session.logInError,
  };
}

// Container
// Injects state and action dispatchers into the Component, thus decoupling the
// presentation from state management.
function mapDispatchToProps(dispatch) {
  return {
    logIn: (username, password, remember) => dispatch(logIn(username, password, remember)),
  };
}

const LogInModal = connect(
  mapStateToProps,
  mapDispatchToProps,
)(LogInModalView);

export default LogInModal;
