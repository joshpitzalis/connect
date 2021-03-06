import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { render } from '../../../utils/testSetup'
import { Contact } from '../components/NewPeopleBox'
import { chunkArrayInGroups, writeEachSyncronously } from '../contacts.api'

const mockProps = {
  contact: {
    uid: 56,
    photoURL: '',
    name: 'hello',
    handle: 'something',
    bucket: 'archived'
  },
  userId: '123',
  activateContact: jest.fn()
}

// redesign
it.todo('name overflow in conflict modal')
it.todo('error state')
it.todo('tshow loading sponner on import')
it.todo('delete guards for if contact is on workboard')
it.todo('confirm delete before deleteting')
it.todo('default image name')

it.todo('500 imporst erros')
it.todo('2K imports erros')
it.todo('what happens if you cancel import popup first time')
it.todo('what happens if you cancel import popup when already imported')
it.todo('if already imported show contacts first and resync button')
it.todo('optimistic task update')
it.todo('instrumentation')

it.todo(
  'what if reminder email is sent to peoplewithout archved or active contacts'
)
it.todo('add details to email footer')
it.todo('cancel email import reminder after 2 tries')
it.todo('send non import email')

describe('contact chunker', () => {
  it('lets you fetch user with pictures from google', () => {
    // click on button
    // ensure x fires
    // mock result
    // ensure firestore fires
    // ensure modal opens
  })

  describe('toggle contacts', () => {
    it.skip('activate contact', () => {
      const { getByTestId } = render(
        <Contact
          contact={mockProps.contact}
          activateContact={mockProps.activateContact}
        />
      )
      userEvent.click(getByTestId('activateContact'))
      expect(mockProps.activateContact).toHaveBeenCalled()
    })
    it.todo('archive contact  ')
    it.todo('trash a contact ')
  })
  it.todo('deduplicates incoming contacts')
  it.todo('shows you 818 potential total contacts count in chunker modal')
  it.todo('if contact already exist shows up as selected')
  it.todo('shorlist 10 contacts')
  it.todo('send email')
  it.todo('connect email to app')
  it.todo('send email if import cancelled mid process')
  it.todo('when you import people, set alreadyImported to true ')
  it.skip('when you close import modal update active and archived count', () =>
    false)
})

describe('helpers', () => {
  it.skip('it convert raw contact data into required output', () => {
    // expect(contactCleaner(raw)).toEqual(cleanResult);
  })
  it.skip('contact sorter sort constct by last contacted', () => {})
  it.skip('save contacts saves contacts', () => {})

  it('chunkArrayInGroups splits a large array into an array of smaller arrays', () => {
    const data = [{ a: 1 }, { a: 1 }, { a: 1 }, { a: 1 }]
    const result = [[{ a: 1 }, { a: 1 }], [{ a: 1 }, { a: 1 }]]
    expect(chunkArrayInGroups(data, 2)).toEqual(result)
  })

  it('chunkArrayInGroups returns remainder of the last chunk', () => {
    const data = [{ a: 1 }, { a: 1 }, { a: 1 }, { a: 1 }, { a: 2 }]
    const result = [[{ a: 1 }, { a: 1 }], [{ a: 1 }, { a: 1 }], [{ a: 2 }]]
    expect(chunkArrayInGroups(data, 2)).toEqual(result)
  })

  it('writeEachSyncronously processes each async item syncronously', () => {
    const createBatch = chunk => {
      const operations = chunk.map(
        ({ ms, count }) =>
          new Promise(resolve => setTimeout(resolve(count), ms))
      )
      return Promise.all(operations).catch(console.error)
    }

    // const createBatch = chunk => {
    //   const _batch = firebase.firestore().batch();
    //   const operations = chunk.forEach(contact => set(contact, userId, _batch));
    //   Promise.all(operations)
    //     .then(() => _batch.commit())
    //     .then(() => 'success')
    //     .catch(console.error);
    // };

    const data = [
      [{ ms: 10, count: 1 }, { ms: 10, count: 2 }],
      [{ ms: 10, count: 3 }, { ms: 10, count: 4 }]
    ]

    expect(writeEachSyncronously(data, createBatch)).resolves.toEqual([
      [1, 2],
      [3, 4]
    ])
  })

  it.skip('handles errors', () => {})

  it.skip('2K issue', () => {})
})

describe('bugs', () => {
  it.todo('show all three stats if ther are contacts present')

  it.todo(
    'when you forst import people they show up as green, not red for overdiue, despite saying last contacted a year ago'
  )
  it.todo('cannot delete natasha')
  it.todo('no names on tasks')
  describe('people nconsistently jump around when editing', () => {
    it.todo('add picture , jumps to top')
    it.todo('add note , no change')
    it.todo('complete task , jumps to bottom')
  })
  it.todo('add completed tasks to timeline')
  it.todo(
    'when you click on nevermind on an overdue task, it losed its overdue coloured outline'
  )
  it.todo('drag universal tasks around')
  it.todo('edit an existing task')
  it.todo('clikcing on a task takes you to that user')
  it.todo('force next task?')
})

describe('contact chunker phase 2', () => {
  it.todo('bucketing')
})
