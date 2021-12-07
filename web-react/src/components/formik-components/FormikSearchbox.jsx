import React, { useState, useEffect, useContext } from 'react'
import Autosuggest from 'react-autosuggest'
import './react-autosuggest.css'
import { useLazyQuery } from '@apollo/client'
import { ErrorMessage } from 'formik'
import TextError from './TextError'
import { useHistory } from 'react-router-dom'
import {
  COUNCIL_SEARCH,
  CONSTITUENCY_SEARCH,
  FEDERAL_SEARCH,
} from '../../pages/mobile/SearchQuery.js'
import { ChurchContext } from '../../contexts/ChurchContext'
import { capitalise, isAuthorised } from '../../global-utils'
import { MemberContext } from '../../contexts/MemberContext'

function FormikSearchbox(props) {
  const { label, name, placeholder, setFieldValue } = props

  const [searchString, setSearchString] = useState('')
  const [debouncedText, setDebouncedText] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const { clickCard } = useContext(ChurchContext)
  const { currentUser } = useContext(MemberContext)
  const history = useHistory()

  const getSuggestions = (data) => {
    setSuggestions(
      data.slice(0, 10).map((row) => ({
        name: row.name,
        __typename: row.__typename,
        firstName: row.firstName,
        lastName: row.lastName,
        bacenta: row.bacenta,
        centre: row.centre,
        town: row.town,
        campus: row.campus,
        bishop: row.bishop,
        leadsBacenta: row.leadsBacenta,
        leadsCentre: row.leadsCentre,
        leadsCampus: row.leadsCampus,
        leadsTown: row.leadsTown,
        leadsCouncil: row.leadsCouncil,
        id: row.id,
      }))
    )
  }
  const [federalSearch] = useLazyQuery(FEDERAL_SEARCH, {
    onCompleted: (data) => {
      const combinedData = [
        ...data.federalMemberSearch,
        ...data.federalCampusSearch,
        ...data.federalTownSearch,
        ...data.federalSontaSearch,
        ...data.federalCentreSearch,
        ...data.federalBacentaSearch,
      ]
      if (currentUser.roles.includes('adminFederal')) {
        getSuggestions(combinedData)
      }
    },
  })
  const [councilSearch] = useLazyQuery(COUNCIL_SEARCH, {
    onCompleted: (data) => {
      const combinedData = [
        ...data.councilMemberSearch,
        ...data.councilCampusSearch,
        ...data.councilTownSearch,
        ...data.councilSontaSearch,
        ...data.councilCentreSearch,
        ...data.councilBacentaSearch,
      ]

      if (currentUser.roles.includes('adminCouncil')) {
        getSuggestions(combinedData)
      }
    },
  })
  const [constituencySearch] = useLazyQuery(CONSTITUENCY_SEARCH, {
    onCompleted: (data) => {
      const combinedData = [
        ...data.constituencyMemberSearch,
        ...data.constituencySontaSearch,
        ...data.constituencyCentreSearch,
        ...data.constituencyBacentaSearch,
      ]

      if (currentUser.roles.includes('adminCampus', 'adminTown')) {
        getSuggestions(combinedData)
      }
    },
  })

  const whichSearch = (searchString) => {
    if (isAuthorised(['adminFederal'], currentUser.roles)) {
      federalSearch({
        variables: { searchKey: capitalise(searchString.trim()) },
      })
    } else if (isAuthorised(['adminCouncil', 'bishop'], currentUser.roles)) {
      councilSearch({
        variables: {
          bishopId: currentUser.bishop,
          searchKey: capitalise(searchString.trim()),
        },
      })
    } else if (
      isAuthorised(
        ['adminCampus', 'adminTown', 'leaderCampus', 'leaderTown'],
        currentUser.roles
      )
    ) {
      constituencySearch({
        variables: {
          constituencyId: currentUser.constituency,
          searchKey: capitalise(searchString.trim()),
        },
      })
    }
  }
  useEffect(() => {
    const timerId = setTimeout(() => {
      whichSearch(debouncedText)
      setDebouncedText(searchString)
      return
    }, 200)

    return () => {
      clearTimeout(timerId)
    }
  }, [searchString, debouncedText])

  return (
    <div>
      {label ? (
        <label className="label" htmlFor={name}>
          {label}
        </label>
      ) : null}
      <Autosuggest
        inputProps={{
          placeholder: placeholder,
          id: name,
          autoComplete: 'off',
          value: searchString,
          name: name,
          className: 'nav-search-box',
          onChange: (_event, { newValue }) => {
            setSearchString(newValue)
          },
        }}
        suggestions={suggestions}
        onSuggestionsFetchRequested={async () => {
          setSuggestions([])
        }}
        onSuggestionsClearRequested={() => {
          setSuggestions([])
        }}
        onSuggestionSelected={(event, { suggestion, method }) => {
          if (method === 'enter') {
            event.preventDefault()
          }
          setDebouncedText(
            suggestion.name ?? suggestion.firstName + ' ' + suggestion.lastName
          )
          setFieldValue(`${name}`, suggestion.id)
          clickCard(suggestion)
          history.push(`/${suggestion.__typename.toLowerCase()}/displaydetails`)
        }}
        getSuggestionValue={(suggestion) =>
          `${
            suggestion.name
              ? suggestion.name
              : suggestion.firstName + ' ' + suggestion.lastName
          }`
        }
        highlightFirstSuggestion={true}
        renderSuggestion={(suggestion) => (
          <div className="combobox-control">
            <span>{`${
              suggestion.name
                ? suggestion.name
                : suggestion.firstName + ' ' + suggestion.lastName
            }`}</span>
            <br />
            {suggestion.__typename && (
              <small className="text-secondary">{`${suggestion?.__typename}`}</small>
            )}
          </div>
        )}
      />
      <ErrorMessage name={name} component={TextError} />
    </div>
  )
}

export default FormikSearchbox
