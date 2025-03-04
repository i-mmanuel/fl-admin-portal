import { gql } from '@apollo/client'

export const COUNCIL_BY_CONSTITUENCY_ARRIVALS = gql`
  query ($id: ID!) {
    councils(where: { id: $id }, options: { limit: 1 }) {
      id
      name

      constituencies {
        id
        name
        activeBacentaCount
        bacentasNoActivityCount
        bacentasMobilisingCount
        bacentasOnTheWayCount
        bacentasHaveArrivedCount
        bacentasBelow8Count

        bussingMembersOnTheWayCount
        bussingMembersHaveArrivedCount
      }
    }
  }
`

export const STREAM_BY_COUNCIL_ARRIVALS = gql`
  query ($id: ID!) {
    streams(where: { id: $id }, options: { limit: 1 }) {
      id
      name

      councils {
        id
        name
        activeBacentaCount
        bacentasNoActivityCount
        bacentasMobilisingCount
        bacentasOnTheWayCount
        bacentasHaveArrivedCount
        bacentasBelow8Count

        bussingMembersOnTheWayCount
        bussingMembersHaveArrivedCount
      }
    }
  }
`

export const GATHERINGSERVICE_BY_STREAM_ARRIVALS = gql`
  query ($id: ID!) {
    gatheringServices(where: { id: $id }, options: { limit: 1 }) {
      id
      name

      streams {
        id
        name
        activeBacentaCount
        bacentasNoActivityCount
        bacentasMobilisingCount
        bacentasOnTheWayCount
        bacentasHaveArrivedCount
        bacentasBelow8Count

        bussingMembersOnTheWayCount
        bussingMembersHaveArrivedCount
      }
    }
  }
`
