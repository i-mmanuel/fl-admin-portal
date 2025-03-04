import { average } from 'global-utils'

const numberOfWeeks = 4
export const getMonthlyStatAverage = (data, stat) => {
  if (!data) {
    return
  }

  const statArray = data.map((service) => parseFloat(service[`${stat}`]))

  //filter and remove all zeros
  const nonZeroArray = statArray.filter((value) => {
    return value > 0
  })

  //Calculate average of the last four weeks of service
  return average(nonZeroArray.slice(-numberOfWeeks))?.toFixed(2)
}

export const sortingFunction = (key, order = 'asc') => {
  //used for sorting services data according to date
  return function innerSort(a, b) {
    // eslint-disable-next-line no-prototype-builtins
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      //property doesn't exist on either object
      return 0
    }

    const varA = typeof a[key] === 'string' ? a[key].toLowerCase() : a[key]
    const varB = typeof b[key] === 'string' ? b[key].toLowerCase() : b[key]

    let comparison = 0
    if (varA > varB) {
      comparison = 1
    } else if (varA < varB) {
      comparison = -1
    }
    return order === 'desc' ? comparison * -1 : comparison
  }
}

export const getServiceGraphData = (church, category) => {
  if (!church) {
    return
  }
  let data = []

  const pushIntoData = (array) => {
    if (!array || array?.length === 0) {
      return
    }

    if (
      ['ComponentServiceAggregate', 'ComponentBussingAggregate'].includes(
        array[0].__typename
      )
    ) {
      array.forEach((record) => {
        data.push({
          id: record?.id,
          date: record?.serviceDate,
          week: record.week,
          attendance: record.attendance,
          income: record.income?.toFixed(2),
        })
      })

      return
    }

    if (array[0]?.__typename === 'Sonta') {
      array.forEach((record) => {
        data.push({
          id: record?.id,
          date: record?.serviceDate,
          week: record.week,
          attendance: record.attendance,
        })
      })

      return
    }

    array.forEach((record) => {
      data.push({
        id: record?.id,
        date: record?.serviceDate?.date || record.date,
        week: record.week,
        attendance: record.attendance,
        income: record.income?.toFixed(2),
      })
    })
  }

  if (category === 'bussing') {
    pushIntoData(church.bussing)
    pushIntoData(church.componentBussingAggregate)
  }
  //Pushing in direct service data eg. Joint Services and Fellowship Services
  else {
    pushIntoData(church.componentServiceAggregate) //Push in Service Aggregates
    pushIntoData(church.services)
  }

  data = data.sort(sortingFunction('week'))

  if (!data.length) {
    return [
      {
        date: '',
        week: null,
        attendance: null,
        income: null,
      },
    ]
  }

  if (data.length <= 3) {
    return data
  }
  return data.slice(data.length - numberOfWeeks, data.length)
}
