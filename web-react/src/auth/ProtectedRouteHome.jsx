import React, { useContext, useEffect } from 'react'
import { Route } from 'react-router-dom'
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react'
import { UnauthMsg } from './UnauthMsg'
import { MemberContext } from '../contexts/MemberContext'
import BishopDashboard from '../pages/dashboards/BishopDashboard.jsx'
import { ChurchContext } from '../contexts/ChurchContext'
// import DisplayCampusTownDetails from '../pages/display/DetailsCampusTown.jsx'
import LoadingScreen from '../components/LoadingScreen'
import { isAuthorised } from '../global-utils'
import ServantsDashboard from 'pages/dashboards/ServantsDashboard'

const ProtectedRoute = ({ component, roles, ...args }) => {
  const { currentUser, setMemberId } = useContext(MemberContext)
  const { isAuthenticated } = useAuth0()
  const { setBishopId, setTownId, setCampusId, setChurch } = useContext(
    ChurchContext
  )

  useEffect(() => {
    if (isAuthenticated && !currentUser.roles.includes('adminFederal')) {
      setBishopId(currentUser.bishop)
      setChurch(currentUser.church)
      setTownId(currentUser.constituency)
      setCampusId(currentUser.constituency)
    }
    // eslint-disable-next-line
  }, [currentUser, setBishopId, setTownId, setCampusId, setChurch])

  if (isAuthorised(roles, currentUser.roles)) {
    //if the user has permission to access the route
    return (
      <Route
        component={withAuthenticationRequired(component, {
          // eslint-disable-next-line react/display-name
          onRedirecting: () => {
            return <LoadingScreen />
          },
        })}
        {...args}
      />
    )
  } else if (currentUser.roles.includes('adminBishop')) {
    //if the user does not have permission but is a Bishop's Admin
    return (
      <Route
        component={withAuthenticationRequired(BishopDashboard, {
          // eslint-disable-next-line react/display-name
          onRedirecting: () => {
            return <LoadingScreen />
          },
        })}
        {...args}
      />
    )
  } else if (currentUser.roles.includes('adminConstituency')) {
    setMemberId(currentUser.id)
    //If the user does not have permission but is a CO Admin
    return (
      <Route
        component={withAuthenticationRequired(ServantsDashboard, {
          // eslint-disable-next-line react/display-name
          onRedirecting: () => {
            return <LoadingScreen />
          },
        })}
        {...args}
      />
    )
  } else if (currentUser.roles.includes('leaderBacenta')) {
    //If the user does not have permission but is a Bacenta Leader
    return (
      <Route
        component={withAuthenticationRequired(ServantsDashboard, {
          // eslint-disable-next-line react/display-name
          onRedirecting: () => {
            return <LoadingScreen />
          },
        })}
        {...args}
      />
    )
  } else {
    return <UnauthMsg />
  }
}

export default ProtectedRoute
