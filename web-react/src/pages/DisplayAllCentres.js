import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { DisplayChurchList } from '../components/DisplayChurchList'
import { NavBar } from '../components/NavBar'
import { ErrorScreen, LoadingScreen } from '../components/StatusScreens'
import { GET_CAMPUS_CENTRES, GET_TOWN_CENTRES } from '../queries/ListQueries'
import { ChurchContext } from '../contexts/ChurchContext'

export const DisplayAllCentres = () => {
  const {
    capitalise,
    church,
    campusID,
    townID,
    setCentreID,
    setMemberID,
  } = useContext(ChurchContext)

  const { data: townCentreData, loading: townLoading } = useQuery(
    GET_TOWN_CENTRES,
    {
      variables: { townID: townID },
    }
  )
  const { data: campusCentreData, loading: campusLoading } = useQuery(
    GET_CAMPUS_CENTRES,
    {
      variables: { campusID: campusID },
    }
  )

  if (campusLoading || townLoading) {
    // Spinner Icon for Loading Screens
    return <LoadingScreen />
  } else if (campusCentreData && church.church === 'campus') {
    return (
      <div>
        <NavBar />
        <div className="body-container container">
          <div className="mb-4 border-bottom">
            <div className="row justify-content-between">
              <div className="col-auto">
                <Link
                  to="/member/displaydetails"
                  onClick={() => {
                    setMemberID(
                      `${campusCentreData.campusCentreList[0].campus.leader.memberID}`
                    )
                  }}
                >
                  <h4>{`${
                    campusCentreData.campusCentreList[0].campus.name
                  } ${capitalise(church.church)}`}</h4>
                </Link>{' '}
              </div>
              <div className="col-auto">
                <Link
                  to="/centre/addcentre"
                  className="btn btn-primary text-nowrap"
                >
                  Add Centre
                </Link>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <h6 className="text-muted">
                  Centre Leader:
                  {campusCentreData.campusCentreList[0].campus.leader
                    ? ` ${campusCentreData.campusCentreList[0].campus.leader.firstName} ${campusCentreData.campusCentreList[0].campus.leader.lastName}`
                    : null}
                </h6>
              </div>
            </div>

            <div className="row justify-content-between">
              <div className="py-1 px-2 m-2 card">{`Centres: ${campusCentreData.campusCentreList.length}`}</div>
              <div className="py-1 px-2 m-2 card">{`Sontas: `}</div>
              <div className="py-1 px-2 m-2 card">{`Membership: ${campusCentreData.campusMemberCount}`}</div>
            </div>
          </div>

          <DisplayChurchList
            data={campusCentreData.campusCentreList}
            setter={setCentreID}
            churchType="Centre"
          />
        </div>
      </div>
    )
  } else if (townCentreData && church.church === 'town') {
    return (
      <div>
        <NavBar />
        <div className="body-container container">
          <div className="mb-4 border-bottom">
            <div className="row justify-content-between">
              <div className="col-auto">
                <Link
                  to="/member/displaydetails"
                  onClick={() => {
                    setMemberID(
                      `${townCentreData.townCentreList[0].town.leader.memberID}`
                    )
                  }}
                >
                  <h4>{`${
                    townCentreData.townCentreList[0].town.name
                  } ${capitalise(church.church)}`}</h4>
                </Link>{' '}
              </div>
              <div className="col-auto">
                <Link
                  to="/centre/addcentre"
                  className="btn btn-primary text-nowrap"
                >
                  Add Centre
                </Link>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <h6 className="text-muted">
                  Centre Leader:
                  {townCentreData.townCentreList[0].town.leader
                    ? ` ${townCentreData.townCentreList[0].town.leader.firstName} ${townCentreData.townCentreList[0].town.leader.lastName}`
                    : null}
                </h6>
              </div>
            </div>

            <div className="row justify-content-between">
              <div className="py-1 px-2 m-2 card">{`Centres: ${townCentreData.townCentreList.length}`}</div>
              <div className="py-1 px-2 m-2 card">{`Sontas: `}</div>
              <div className="py-1 px-2 m-2 card">{`Membership: ${townCentreData.townMemberCount}`}</div>
            </div>
          </div>

          <DisplayChurchList
            data={townCentreData.townCentreList}
            setter={setCentreID}
            churchType="Centre"
          />
        </div>
      </div>
    )
  } else {
    return <ErrorScreen />
  }
}
