import React, { useContext } from 'react'
import { useQuery } from '@apollo/client'
import DisplayChurchDetails from '../../components/DisplayChurchDetails/DisplayChurchDetails'

import { DISPLAY_CENTRE } from './ReadQueries'
import { ChurchContext } from '../../contexts/ChurchContext'
import BaseComponent from 'components/base-component/BaseComponent'

const DetailsCentre = () => {
  const { centreId } = useContext(ChurchContext)
  const { data, loading, error } = useQuery(DISPLAY_CENTRE, {
    variables: { id: centreId },
  })

  const displayCentre = data?.centres[0]

  let breadcrumb = [
    displayCentre?.town
      ? displayCentre?.town.council
      : displayCentre?.campus.council,
    displayCentre?.town ? displayCentre?.town : displayCentre?.campus,
    displayCentre,
  ]

  return (
    <BaseComponent loading={loading} error={error} data={data}>
      <DisplayChurchDetails
        name={displayCentre?.name}
        leaderTitle="Centre Leader"
        leader={displayCentre?.leader}
        churchHeading="Bacentas"
        churchType="Centre"
        subChurch="Bacenta"
        membership={displayCentre?.memberCount}
        churchCount={displayCentre?.bacentas.length}
        editlink="/centre/editcentre"
        editPermitted={[
          'leaderCampus',
          'leaderTown',
          'adminCampus',
          'adminTown',
          'adminCouncil',
          'adminFederal',
        ]}
        history={displayCentre?.history.length !== 0 && displayCentre?.history}
        breadcrumb={breadcrumb && breadcrumb}
        buttons={displayCentre ? displayCentre?.bacentas : []}
      />
    </BaseComponent>
  )
}

export default DetailsCentre
