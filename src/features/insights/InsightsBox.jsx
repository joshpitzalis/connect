import React from 'react'
// import { Sparklines, SparklinesLine, SparklinesSpots } from 'react-sparklines';
import { useSelector } from 'react-redux'
// import { Tooltip } from 'antd'

// function percentage (value, total) {
//   return Math.round((value / total) * 100)
// }
/* eslint-disable react/prop-types */
export const findRecentlyContacted = (contacts, timePeriod) => {
  const recentlyContacted = (_lastContacted, _threshold) => {
    const now = +new Date()
    const timeDifference = now - _lastContacted
    return timeDifference > 0 && timeDifference < _threshold
  }

  return (
    contacts &&
    contacts.filter(item => {
      const lastContacted =
        item.lastContacted && recentlyContacted(item.lastContacted, timePeriod)

      if (lastContacted) {
        return true
      }

      const lastNote =
        item &&
        item.notes &&
        Object.values(item.notes).some(
          note =>
            note &&
            note.lastUpdated &&
            recentlyContacted(note.lastUpdated, timePeriod)
        )

      return lastNote
    }).length
  )
}

export function InsightsBox () {
  const sixMonthsAgo = 1.577e10
  const sevenDaysAgo = 6.048e8
  const people = useSelector(
    store =>
      store.contacts &&
      store.contacts.length
      // store.contacts.filter(
      //   item =>
      //     !!item.lastContacted && (!item.bucket || item.bucket === 'active')
      // ).length
  )

  const inTouchWith = useSelector(store =>
    findRecentlyContacted(store.contacts, sixMonthsAgo)
  )

  const thisWeek = useSelector(store =>
    findRecentlyContacted(store.contacts, sevenDaysAgo)
  )

  return (
    <>
      <Counters people={people} inTouchWith={inTouchWith} thisWeek={thisWeek} />
    </>
  )
}

export const Counters = ({ people, inTouchWith, thisWeek }) => (
  <div className='flex justify-end'>
    {/* {!!thisWeek && (
      <dl className='dib mr5 w4 pt5'>
        <div>
          <Tooltip
            title={
              <p className='white'>
                Staying in touch with 150 in a year means reaching out to 3 new
                people each week. Reach out to more if you can but consistently
                reaching out to 3 new people a week is a good goal to start
                with.
              </p>
            }
          >
            <dd className='f6 f5-ns b ml0'>Connected</dd>
            <dd className='f3 f2-ns b ml0'>
              <span data-testid='contacted7Days'> {thisWeek}</span>
              <small className='text3 f6  pl3'>/ 56</small>
            </dd>
          </Tooltip>
        </div>
        {/* <SparkLine data={[0, thisWeek]} />
      </dl>
    )} */}
    {!!inTouchWith && !!people && (

      <div>

        <dd className='f3 f2-ns b ml0 silver'>
          <span data-testid='inTouchWith'>{inTouchWith}</span>
          {/* <small className='text3 f6 pl3'>
                {percentage(inTouchWith, people)}%
              </small> */}
          <small className='text3 f6'>/  {people}</small>
        </dd>

      </div>
    )}

  </div>
)

// const SparkLine = ({ data, fill = 'none' }) => (
//   <div className="h3 w4">
//     <Sparklines data={data}>
//       <SparklinesLine style={{ fill }} />
//       <SparklinesSpots />
//     </Sparklines>
//   </div>
// );
