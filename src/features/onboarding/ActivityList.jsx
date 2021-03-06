import React from 'react'
import { useSelector } from 'react-redux'
import { Progress } from 'antd'
import { OptimizelyFeature } from '@optimizely/react-sdk'
import { GettingStarted } from './GettingStarted'

export const completePercentage = _onboarding =>
  _onboarding &&
  Math.round(
    ((1 + Object.values(_onboarding).filter(_x => !!_x).length) / 7) * 100
  )

/** @param {{
 * uid:string,
 * children: JSX.Element,
 * contactSelected: string,
 * workboard:Boolean}} [Props] */

/* eslint-disable react/prop-types */
export function Onboarding ({ uid, children, contactSelected, workboard }) {
  // gets user onboarding details
  const onboarding = useSelector(
    store => store.user && store.user.onboarding && store.user.onboarding
  )
  const contact = useSelector(
    store =>
      store.contacts &&
      store.contacts.find(person => person.uid === contactSelected)
  )

  const onboardingComplete = onboarding && onboarding.complete === true

  const sidebarTitle = (
    _contactSelected,
    _onboardingComplete,
    _contact,
    isEnabled
  ) => {
    if (_contactSelected) {
      if (_contact && _contact.name) {
        return _contact.name
      }
      return 'Reminders'
    }
    if (_onboardingComplete) {
      // return null;
      return 'Activities'
    }
    if (isEnabled) {
      return 'Getting Started'
    }
  }

  return (
    <div className='pa4 fixed h-100 overflow-y-auto pb6'>
      <OptimizelyFeature feature='referralPage'>
        {isEnabled => (
          <fieldset className='bn ma0 pa0'>
            <details data-testid='detailBox' className='dn db-ns'>
              <summary>
                <legend className='fw7 mb3 dib ' data-testid='toggleAddBox'>
                  {sidebarTitle(
                    contactSelected,
                    onboardingComplete,
                    contact,
                    isEnabled
                  )}
                </legend>
              </summary>
            </details>

            {!onboardingComplete && !contactSelected && isEnabled && (
              <div className='mb4 dn db-ns'>
                <Progress percent={completePercentage(onboarding)} />
                <GettingStarted uid={uid} onboarding={onboarding} />
              </div>
            )}

            {children}
          </fieldset>
        )}
      </OptimizelyFeature>
    </div>
  )
}
