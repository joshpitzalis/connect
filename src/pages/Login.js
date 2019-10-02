import React, { Component } from 'react';
// import ReactRouterPropTypes from 'react-router-prop-types';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { toast$ } from '../features/notifications/toast';
import firebase from '../utils/firebase';

const loginPropTypes = {
  // location: ReactRouterPropTypes.location.isRequired,
  authStatus: PropTypes.bool.isRequired,
  userId: PropTypes.string.isRequired,
};
export class Login extends Component {
  state = { redirectToDashboard: false, email: '', password: '' };

  // componentDidMount() {
  //   const { location } = this.props;
  //   toast$.next({
  //     type: 'ERROR',
  //     message: `You must log in to view the page at ${(location &&
  //       location.state &&
  //       location.state.pathname &&
  //       location.state.pathname) ||
  //       '/'}`,
  //   });
  // }

  login = (email, password) => async e => {
    e.preventDefault();
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(({ uid }) => this.setState({ uid }))
      .then(() => this.setState({ redirectToDashboard: true }))
      .catch(error =>
        toast$.next({
          type: 'ERROR',
          message: error.message || error,
        })
      );
  };

  render() {
    const { redirectToDashboard, email, password, uid } = this.state;
    const { authStatus, userId } = this.props;

    console.log({ authStatus, userId });

    if (authStatus) {
      return <Redirect to={`/user/${userId}/dashboard`} />;
    }
    if (redirectToDashboard) {
      return <Redirect to={`/user/${uid}/dashboard`} />;
    }
    return (
      <div>
        <div className="pa4 black-80">
          <form
            className="measure center"
            onSubmit={this.login(email, password)}
          >
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <legend className="f4 fw6 ph0 mh0">
                Client Tree is currently invite only.
              </legend>
              <small>
                If you do not have credentials please join the waiting list.
              </small>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="email-address">
                  Email
                  <input
                    className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                    type="email"
                    name="email-address"
                    id="email-address"
                    value={email}
                    onChange={e => this.setState({ email: e.target.value })}
                  />
                </label>
              </div>
              <div className="mv3">
                <label className="db fw6 lh-copy f6" htmlFor="password">
                  Password
                  <input
                    className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                    type="password"
                    name="password"
                    id="password"
                    value={password}
                    onChange={e => this.setState({ password: e.target.value })}
                  />
                </label>
              </div>
            </fieldset>
            <div className="">
              <input
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                type="submit"
                value="Sign in"
              />
            </div>
          </form>
        </div>
      </div>
    );
  }
}
Login.propTypes = loginPropTypes;
