import React from 'react'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import fromUnixTime from 'date-fns/fromUnixTime'
import { useMachine } from '@xstate/react'
import { Machine } from 'xstate'
import { useDispatch } from 'react-redux'
// import { OptimizelyFeature } from '@optimizely/react-sdk';
import { PersonModal } from './PersonBox'
import { handleContactDelete } from '../peopleAPI'
import { toast$ } from '../../notifications/toast'
// import Check from '../../../images/Check';
import allDone from '../../../images/allDone.png'

const peopleMachine = Machine({
  id: 'people',
  initial: 'closed',
  states: {
    closed: {
      on: {
        OPENED: {
          target: 'opened',
          actions: ['setSelectedUser']
        }
      }
    },
    opened: {
      on: {
        CLOSED: {
          target: 'closed',
          actions: ['clearSelectedUser']
        }
      }
    }
  }
})

/**
 * @param {Date} timestamp
 */

/**
 * @param {{
 * uid: string,
 * contact: {
      uid: String,
      lastContacted: Number,
      activeTaskCount: Number,
      name: String,
      photoURL: String,
    }
  }} [Props] There used to be more parameters thats why it is still shaped as an object
*/

/* eslint-disable react/prop-types */
export const Person = ({ contact, uid }) => {
  const dispatch = useDispatch()

  const [current, send] = useMachine(peopleMachine, {
    actions: {
      setSelectedUser: (ctx, event) =>
        dispatch({ type: 'people/setSelectedUser', payload: event.payload }),
      clearSelectedUser: () => dispatch({ type: 'people/clearSelectedUser' })
    }
  })

  const handleDelete = async (_name, _uid, _userId) => {
    try {
      dispatch({ type: 'people/clearSelectedUser' })
      await handleContactDelete(_uid, _userId)
      send({ type: 'CLOSED' })
    } catch (error) {
      toast$.next({ type: 'ERROR', message: error.message || error })
    }
  }

  switch (current.value) {
    case 'closed':
      return <MiniPerson contact={contact} uid={uid} send={send} />

    case 'opened':
      return (
        <li key={contact.uid} className='mb3' data-testid='openedPeopleBox'>
          <PersonModal
            uid={uid}
            contactId={contact.uid}
            onClose={() => send({ type: 'CLOSED' })}
            handleDelete={handleDelete}
            setVisibility={() => send({ type: 'CLOSED' })}
          />
        </li>
      )
    default:
      return null
    // tk throw an error here
  }
}

const isWithinYear = contact => {
  const { lastContacted, notes } = contact
  const noteDates = notes &&
      Object.values(notes)
        .map(note => note && note.lastUpdated)
        .filter(item => item !== 9007199254740991)
  const mostRecentNote = noteDates && Math.max(...noteDates)
  const lastContact = Math.max(lastContacted, mostRecentNote)
  const now = Date.now()
  return now - lastContact < 3.154e+10
}

const MiniPerson = ({ contact, uid, send }) => <li className=" flex items-center bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden "
  data-testid='closedPeopleBox'
>
  <img
    alt={`${contact.name} avatar`}
    className="w-42 h-42 object-cover "
    src={contact.photoURL}
    style={{ margin: 0 }}
  />

  <div className="flex-1 px-4 py-2 truncate">
    <a href="#" className="text-gray-900 text-sm leading-5 font-medium hover:text-gray-600 transition ease-in-out duration-150"
      onClick={() => send({ type: 'OPENED', payload: contact.uid })}>{contact.name}</a>
    <LastContacted contact={contact} />

  </div>
  { isWithinYear(contact) && <img
    alt={'all done'}
    className="w-20 h-20 relative right-2 top-2"
    src={allDone}
    style={{ margin: 0 }}
  />}
  <div className="flex-shrink-0 pr-2">

    <button className="w-8 h-8 inline-flex items-center justify-center text-gray-400 rounded-full bg-transparent hover:text-gray-500 focus:outline-none focus:text-gray-500 focus:bg-gray-100 transition ease-in-out duration-150"
      onClick={() => send({ type: 'OPENED', payload: contact.uid })}
    >
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
      </svg>
    </button>
  </div>
</li>

function LastContacted ({ contact }) {
  const isValidDate = timestamp => new Date(timestamp).getTime() > 0

  const lastContact = contact => {
    const { lastContacted, notes } = contact
    const noteDates = notes &&
      Object.values(notes)
        .map(note => note && note.lastUpdated)
        .filter(item => item !== 9007199254740991)

    const mostRecentNote = noteDates && Math.max(...noteDates)
    return Math.max(lastContacted, mostRecentNote)
  }
  return (<p className="text-sm leading-5 text-gray-500">
    {contact && isValidDate(fromUnixTime(lastContact(contact) / 1000)) && `Last contacted ${formatDistanceToNow(fromUnixTime(lastContact(contact) / 1000), {
    addSuffix: true
  })}`}
  </p>)
}
