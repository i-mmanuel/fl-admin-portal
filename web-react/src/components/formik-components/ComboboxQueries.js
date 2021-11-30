import { gql } from '@apollo/client'

export const BISHOP_BACENTA_DROPDOWN = gql`
  query($id: ID!, $bacentaName: String!) {
    bishopBacentaDropdown(id: $id, bacentaName: $bacentaName) {
      id
      name
      centre {
        id
        name
        campus {
          id
          name
        }
        town {
          id
          name
        }
      }
    }
  }
`

export const COUNCIL_CENTRE_DROPDOWN = gql`
  query($id: ID!, $nameSearch: String!) {
    councilCentreDropdown(id: $id, nameSearch: $nameSearch) {
      id
      name
      campus {
        id
        name
      }
      town {
        id
        name
      }
    }
  }
`
