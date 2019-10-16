import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { collectionData } from 'rxfire/firestore';
import { filter } from 'rxjs/operators';
import firebase from '../../utils/firebase';

const propTypes = {
  submitted: PropTypes.bool.isRequired,
  uid: PropTypes.string.isRequired,
};
const defaultProps = {};

export function Onboarding({ submitted, uid }) {
  return (
    <form className="pa4">
      <fieldset id="favorite_movies" className="bn">
        {/* <legend className="fw7 mb2">
          Getting Started {1 + (submitted ? 1 : 0)}/5
        </legend> */}

        <legend className="fw7 mb2">Activities</legend>
        <div className="flex items-center mb2">
          <label htmlFor="spacejam" className="lh-copy">
            <input
              className="mr2"
              type="checkbox"
              id="spacejam"
              value="spacejam"
              checked
            />
            <span className="strike">Sign up to Client Tree</span>
          </label>
        </div>

        <div className="flex items-center mb2">
          <label htmlFor="spacejam" className="lh-copy">
            <input
              className="mr2"
              type="checkbox"
              id="spacejam"
              value="spacejam"
              checked={submitted}
            />
            {submitted ? (
              <span className="strike">
                Create a referrable email signature by completing your profile.
              </span>
            ) : (
              <Link
                to={`/user/${uid}/profile`}
                className="f6 link dim mr3 mr4-ns"
              >
                Create a referrable email signature by completing your profile.
              </Link>
            )}
          </label>
        </div>
        <div className="flex items-center mb2">
          <label htmlFor="spacejam" className="lh-copy">
            <input
              className="mr2"
              type="checkbox"
              id="spacejam"
              value="spacejam"
            />

            <Link
              to={`/user/${uid}/profile`}
              className="f6 link dim mr3 mr4-ns"
            >
              Actually add the signature to your email account
            </Link>
          </label>
        </div>
        <div className="flex items-center mb2">
          <label htmlFor="spacejam" className="lh-copy">
            <input
              className="mr2"
              type="checkbox"
              id="spacejam"
              value="spacejam"
            />
            <small className="">Create a referral page</small>
          </label>
        </div>
        <div className="flex items-center mb2">
          <label htmlFor="spacejam" className="lh-copy">
            <input
              className="mr2"
              type="checkbox"
              id="spacejam"
              value="spacejam"
            />
            <small className="">
              Add one past client to your professional network
            </small>
          </label>
        </div>
        <HelpfulTaskList myUid={uid} />
      </fieldset>
    </form>
  );
}

Onboarding.propTypes = propTypes;
Onboarding.defaultProps = defaultProps;

const helpfulPropTypes = {
  myUid: PropTypes.string.isRequired,
};

const helpfulDefaultProps = {};

const HelpfulTaskList = ({ myUid }) => {
  const [helpfulTasks, setHelpfulTasks] = React.useState([]);

  React.useEffect(() => {
    const subscription = collectionData(
      firebase
        .firestore()
        .collectionGroup('helpfulTasks')
        .where('connectedTo', '==', myUid)
        .where('dateCompleted', '==', null)
    ).subscribe(tasks => {
      if (tasks && tasks.length) {
        setHelpfulTasks(tasks);
      }
    });
    return () => subscription.unsubscribe();
  }, [myUid]);

  return (
    <React.Fragment>
      {helpfulTasks &&
        helpfulTasks.map(({ taskId, name, dateCompleted }) => (
          <div className="flex items-center mb2" key={taskId}>
            <label htmlFor={name} className="lh-copy">
              <input
                className="mr2"
                type="checkbox"
                id={name}
                value={name}
                checked={dateCompleted}
              />
              <small className="">{name}</small>
            </label>
          </div>
        ))}
    </React.Fragment>
  );
};

HelpfulTaskList.propTypes = helpfulPropTypes;
HelpfulTaskList.defaultProps = helpfulDefaultProps;
