import { useQuery } from '@apollo/client'
import BaseComponent from 'components/base-component/BaseComponent'
import MemberDisplayCard from 'components/card/MemberDisplayCard'
import { HeadingPrimary } from 'components/HeadingPrimary/HeadingPrimary'
import HeadingSecondary from 'components/HeadingSecondary'
import { ChurchContext } from 'contexts/ChurchContext'
import { getWeekNumber } from 'global-utils'
import PlaceholderMemberDisplay from 'pages/services/defaulters/PlaceholderDefaulter'
import React, { useContext } from 'react'
import { Card, Container } from 'react-bootstrap'
import { CONSTITUENCY_BUSSING_DATA } from './arrivalsQueries'

const BacentasThatSubmitted = () => {
  const { constituencyId } = useContext(ChurchContext)
  const { data, loading, error } = useQuery(CONSTITUENCY_BUSSING_DATA, {
    variables: { id: constituencyId },
  })
  const constituency = data?.constituencies[0]

  return (
    <BaseComponent data={data} loading={loading} error={error} placeholder>
      <Container>
        <HeadingPrimary loading={loading}>
          Bacentas That Have Submitted Pictures
        </HeadingPrimary>
        <HeadingSecondary loading={!constituency?.name}>
          {constituency?.name} Constituency
        </HeadingSecondary>

        {constituency?.bacentas.map((bacenta, i) => {
          if (bacenta.bussing[0]?.week === getWeekNumber()) {
            return (
              <MemberDisplayCard
                key={i}
                member={bacenta}
                leader={bacenta.leader}
                contact
              />
            )
          } else if (i === 0) {
            return (
              <Card>
                <Card.Body>There is no data to display for you</Card.Body>
              </Card>
            )
          }
        })}

        {!constituency?.bacentas.length && <PlaceholderMemberDisplay />}
      </Container>
    </BaseComponent>
  )
}

export default BacentasThatSubmitted
