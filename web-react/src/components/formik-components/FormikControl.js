import React from 'react'
import Input from './Input'
import Textarea from './Textarea'
import Select from './Select'
import SelectWithQuery from './SelectWithQuery'
import RadioButtons from './RadioButtons'
import CheckboxGroup from './CheckboxGroup'
import Combobox from './Combobox'
import Combobox2 from './Combobox2'
import FormikSearchbox from './FormikSearchbox'

function FormikControl(props) {
  const { control, ...rest } = props

  switch (control) {
    case 'input':
      return <Input {...rest} />
    case 'combobox':
      return <Combobox {...rest} />
    case 'combobox2':
      return <Combobox2 {...rest} />
    case 'searchbox':
      return <FormikSearchbox {...rest} />
    case 'textarea':
      return <Textarea {...rest} />
    case 'select':
      return <Select {...rest} />
    case 'selectWithQuery':
      return <SelectWithQuery {...rest} />
    case 'radio':
      return <RadioButtons {...rest} />
    case 'checkbox':
      return <CheckboxGroup {...rest} />
    default:
      return null
  }
}

export default FormikControl
