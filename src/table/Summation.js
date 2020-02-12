import React from 'react'
import { inputTypes } from '../consts'
import * as R from 'ramda'
import { getField } from '../utils/schemaGetters'
import { getType } from '../utils/getType'

export const Summation = ({ schema, modelName, fieldName, summary, customProps }) => {
  let total

  if (summary && summary[modelName]) {
    const currentTotal = R.path([modelName, fieldName], summary)
    if (currentTotal === undefined)
      total = 'N/A'
    else if (getType({ schema, modelName, fieldName }) === 'currency')
      total = new Intl.NumberFormat('en-US', {
        style: 'currency', currency: 'USD'
      }).format(currentTotal)
  } else {
    total = 'N/A'
  }

  return <span>{total}</span>
}

export const DetailSummation = ({ schema, modelName, fieldName, parentModelName, parentFieldName, summary, customProps }) => {
  let total

  if (summary) {
    if (getType({ schema, modelName, fieldName }) === 'currency') {
      const fieldTotal = R.path([parentModelName, parentFieldName, fieldName], summary)
      if (total !== undefined) {
        total = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(fieldTotal)
      }
      total = 'N/A'
    } else {
      total = 'N/A'
    }

    return <span>{total}</span>
  }
}
