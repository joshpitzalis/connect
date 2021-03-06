import React from 'react'
import PropTypes from 'prop-types'
import './networkAnimations.css'
import { useSelector } from 'react-redux'
import { OptimizelyFeature } from '@optimizely/react-sdk'
import { Person } from './components/Person'
import { PersonModal } from './components/PersonBox'
import ErrorBoundary from '../../utils/ErrorBoundary'
import { InsightsBox } from '../insights/InsightsBox'
// import { HelpfulTaskList } from './components/UniversalTaskList'
import { ContactImporter } from '../googleImport'

const networkPropTypes = {
  uid: PropTypes.string.isRequired
}

const networkDefaultProps = {}

/* eslint-disable react/prop-types */
export const InnerNetwork = ({ uid, contactChunks }) => {
  const [visible, setVisibility] = React.useState(false)
  const [selectedUser, setSelectedUser] = React.useState('')

  const allContacts = useSelector(
    store =>
      store &&
      store.contacts &&
      store.contacts.filter(contact => contact && contact.uid))

  React.useEffect(() => {
    const { gapi } = window
    gapi.load('client', () =>
      gapi.client.init({
        apiKey: process.env.REACT_APP_API_KEY,
        clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        discoveryDocs: [
          'https://www.googleapis.com/discovery/v1/apis/people/v1/rest'
        ],
        scope: 'https://www.googleapis.com/auth/contacts.readonly'
      })
    )
  }, [])

  return (
    <ErrorBoundary fallback="Oh no! This bit is broken 🤕">
      <div data-testid="outreachPage">

        {/* <OptimizelyFeature feature="insights">
          {insights => insights &&
         <InsightsBox />}
        </OptimizelyFeature> */}

        {/* <HelpfulTaskList myUid={uid} insights={true} /> */}

        {/* <OptimizelyFeature feature="workboard">
          {workboard =>
            !workboard && <HelpfulTaskList myUid={uid} insights={workboard} />
          }
        </OptimizelyFeature> */}

        {visible ? (
          <PersonModal
            uid={uid}
            contactId={selectedUser}
            onClose={() => {
              setVisibility(false)
              setSelectedUser('')
            }}
            newPerson
            setVisibility={() =>
              setVisibility(false)}
          />
        ) : (
          <ContactImporter uid={uid} allContacts={allContacts}>
            <button
              type="button"
              onClick={() => setVisibility(true)}
              className="btn3 b grow black tl pv2  pointer bn br1 white"
              data-testid="addPeopleButton"
            >
              Add Someone
            </button>
          </ContactImporter>
        )}

        {/* <div>
          <div className="sm:hidden">
            <label htmlFor="tabs" className="sr-only">Select a tab</label>
            <select id="tabs" name="tabs" className="block w-full focus:ring-green-500 focus:border-green-500 border-gray-300 rounded-md">
              <option>Every three weeks</option>
              <option>Every two months</option>
              <option selected>Every six months</option>
              <option>Once a year</option>
            </select>
          </div>
          <div className="hidden sm:block">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex" aria-label="Tabs">
                <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm">
                Every three weeks
                </a>
                <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm">
                Every two months
                </a>

                <a href="#" className="border-green-500 text-green-600 w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm" aria-current="page">
                Every six months
                </a>
                <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm">
                Once a year
                </a>
              </nav>
            </div>
          </div>
        </div> */}
        <InsightsBox />
        <ActiveContactList contacts={allContacts} uid={uid} />
      </div>
    </ErrorBoundary>
  )
}

InnerNetwork.propTypes = networkPropTypes
InnerNetwork.defaultProps = networkDefaultProps

const WrappedNetwork = props => (
  <OptimizelyFeature feature='contactsSync'>
    {isEnabled => <InnerNetwork {...props} bulkImportFeature={isEnabled} />}
  </OptimizelyFeature>
)

export const Network = React.memo(WrappedNetwork)

const ActiveContactList = ({ contacts, uid }) => {
  if (!contacts) {
    return <p data-testid="loader">Loading...</p>
  }

  if (contacts.length) {
    return (
      <ul className="list pl0 mt0 pb4">
        {contacts.map(contact => (
          <Person key={contact.uid} contact={contact} uid={uid} />
        ))}
      </ul>
    )
  }

  return <p data-testid="emptyContacts">No Contacts Yet.</p>
}
