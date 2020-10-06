import React from 'react'
import Select, { createFilter } from 'react-select'
import CreatableSelect from "react-select/creatable"
import DatePicker from 'react-datepicker'
import CurrencyInput from 'react-currency-input'
import Switch from 'rc-switch'
import * as R from 'ramda'
import { inputTypes } from '../consts'
import { optimizeSelect } from '../utils/optimizeSelect'

const errorBuilder = ({ error, id }) => error.map(r => <div key={`${r}-${id}-error`}>{r}<br /></div>)

export const FormGroup = ({ labelStr, htmlFor, error, children, required, customError = null, customLabel = null }) => {
  let errorComp
  if (!customError && error) {
    errorComp = <div className='invalid-feedback'>{errorBuilder({ error, id: htmlFor })}</div>
  } else if (customError && error) {
    errorComp = customError({ error, id: htmlFor })
  }

  let labelComp
  if (customLabel) {
    labelComp = customLabel({ labelStr, required })
  } else if (labelStr) {
    labelComp = <label htmlFor={htmlFor}>{`${labelStr} ${required ? ' *' : ''}`}</label>
  }

  return (
    <div className='form-group zero-space'>
      {labelComp}
      {children}
      {errorComp}
    </div>
  )
}

/**
 * Some components (such as InputDate, InputSwitch, ect.) do not work well with
 * invalid-feedback, so a special component was created to show the error message.
 *
 * @property: { list } error - list of strings containing error messages
 */

const CustomErrorComponent = ({ error, id }) =>
  <div style={{ 'fontSize': '80%', 'color': '#dc3545' }}>{errorBuilder({ error, id })}</div>

/**
 * Singular component for Date Type.
 *
 * See React DatePicker for details on: dateFormat, isClearable
 *
 * should NOT have onKeyDown because the 'enter' key should be reserved for DatePicker operations

 * @property { function } onChange - returns evt:
 *      evt => onChange(evt)
 * @property { string } id
 * @property { string } [labelStr]
 * @property { string } [error]
 * @property { any } value - FlexibleInput component sets default to: null
 * @property { string } dateFormat
 * @property { string } className - FlexibleInput component sets default to: 'form-control'
 * @property { boolean } isClearable - FlexibleInput component sets default to: true
 * @property { object } [customInput] - Can override the following default
 *      settings : { placeholderText: 'Click to select a date', fixedHeight: true,
 *          dateFormat: 'YYYY-MM-DD'}. See React DatePicker docs for full list.
 * @property { boolean } required
 * @property { function } customError
 * @property { function } customLabel
 */

// TODO: get classname for invalid from new react-datepicker
export const InputDate = ({ onChange, id, labelStr, error, value, dateFormat, isClearable, required, customInput, customError, customLabel }) => {
  let date
  if (value) {
    date = new Date(value)
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset())
  } else {
    date = ''
  }

  return (
    <FormGroup labelStr={labelStr} htmlFor={id} error={error} required={required}
      customError={R.defaultTo(CustomErrorComponent, customError)}
      customLabel={customLabel}>
      <div style={{ display: 'inherit' }}>
        <DatePicker
          placeholderText='Click to select a date'
          fixedHeight={true}
          dateFormat={dateFormat}
          selected={date} // yyyy/MM/dd required for Date()
          onChange={evt => {
            if (evt === undefined || evt === null) {
              return (onChange(null))
            }
            return onChange(
              `${evt.getFullYear()}-${(evt.getUTCMonth() + 1)}-${evt.getUTCDate()}`
            )
          }}
          className='form-control'
          isClearable={isClearable}
          {...customInput}
        />
      </div>
    </FormGroup>
  )
}

const inputStringTypeMap = {
  [inputTypes.STRING_TYPE]: 'text',
  [inputTypes.EMAIL_TYPE]: 'email',
  [inputTypes.PHONE_TYPE]: 'tel',
  [inputTypes.URL_TYPE]: 'url'
}

/**
 * Singular component for String Type.
 * @property { string } type - can be 'String', 'Email', 'URL', or 'Phone'. This
 *     dictates the input validation that the input component has.
 * @property { function } onChange - returns evt.target.value:
 *     evt => onChange(evt.target.value)
 * @property { string } id
 * @property { string } [labelStr]
 * @property { string } [error]
 * @property { any } value - FlexibleInput component sets default to: ''
 * @property { string } className - FlexibleInput component sets default to: 'form-control'
 * @property { object } [customInput]
 * @property { boolean } required
 * @property { function } customError
 * @property { function } customLabel
 * @property { boolean } autoFocus; update isAutoFocusInput() when changing
 * @property { boolean } spellCheck
 */

export const InputString = ({ type, onChange, id, labelStr, error, value, className, required, customInput, customError, customLabel, autoFocus, onKeyDown, spellCheck }) => (
  <FormGroup labelStr={labelStr} htmlFor={id} error={error} required={required}
    customError={R.defaultTo(null, customError)}
    customLabel={customLabel}>
    <input
      autoFocus={autoFocus}
      type={inputStringTypeMap[type]}
      onChange={evt => onChange(evt.target.value)}
      className={`${className}${error ? ' is-invalid' : ''}`}
      id={id}
      value={value}
      onKeyDown={onKeyDown}
      spellCheck={spellCheck}
      {...customInput}
    />
  </FormGroup>
)

/**
 * Singular component for Password Type.
 *
 * @property { function } onChange - returns evt.target.value from event:
 *     evt => onChange(evt.target.value)
 * @property { string } id
 * @property { string } [labelStr]
 * @property { string } [error]
 * @property { any } value - FlexibleInput component sets default to: ''
 * @property { string } className - FlexibleInput component sets default to: 'form-control'
 * @property { object } [customInput]
 * @property { boolean } required
 * @property { function } customError
 * @property { function } customLabel
 * @property { boolean } autoFocus; update isAutoFocusInput() when changing
 */

export const InputPassword = ({ onChange, id, labelStr, error, value, className, required, customInput, customError, customLabel, autoFocus, onKeyDown }) => (
  <FormGroup labelStr={labelStr} htmlFor={id} error={error} required={required}
    customError={R.defaultTo(null, customError)}
    customLabel={customLabel}>
    <input
      autoFocus={autoFocus}
      type='password'
      onChange={evt => onChange(evt.target.value)}
      className={`${className}${error ? ' is-invalid' : ''}`}
      id={id}
      value={value}
      onKeyDown={onKeyDown}
      {...customInput}
    />
  </FormGroup>
)

/**
 * Singular component for Integer Type.
 *
 * @property { function } onChange - returns evt.target.value
 *      evt => onChange(evt.target.value)
 * @property { string } id
 * @property { string } [labelStr]
 * @property { string } [error]
 * @property { any } value - FlexibleInput component sets default to: ''
 * @property { string } className - FlexibleInput component sets default to: 'form-control'
 * @property { object } [customInput] - Can change step increment (default
 *      integer value is 1). For example: {step: 3}
 * @property { boolean } required
 * @property { function } customError
 * @property { function } customLabel
 * @property { boolean } autoFocus; update isAutoFocusInput() when changing
 */

const MAX_SQL_INT_SIZE = Math.pow(2, 31) - 1

const MIN_SQL_INT_SIZE = - Math.pow(2, 31)

export const InputInt = ({ onChange, id, labelStr, error, value, className, required, customInput, customError, customLabel, autoFocus, onKeyDown }) => {
  if (value > MAX_SQL_INT_SIZE || value < MIN_SQL_INT_SIZE) {
    error = R.append('Number too large.', error)
  }
  return (
    <FormGroup labelStr={labelStr} htmlFor={id} error={error} required={required}
      customError={R.defaultTo(null, customError)}
      customLabel={customLabel}>
      <input
        autoFocus={autoFocus}
        type='number'
        step={1}
        onChange={evt => {
          if (evt.target.value === '') {
            return onChange(null)
          }
          return (
            onChange(Number(evt.target.value))
          )
        }}
        className={`${className}${error ? ' is-invalid' : ''}`}
        id={id}
        onKeyDown={onKeyDown}
        value={value.toString()}
        {...customInput}
      />
    </FormGroup>
  )
}

export const InputCurrency = ({ onChange, id, labelStr, error, value, className, required, customInput, customError, customLabel, autoFocus, onKeyDown }) => (
  <FormGroup labelStr={labelStr} htmlFor={id} error={error} required={required}
    customError={R.defaultTo(null, customError)}
    customLabel={customLabel}>
    <div className='input-group'>
      <div className='input-group-prepend'>
        <span className='input-group-text'>$</span>
      </div>
      <CurrencyInput
        autoFocus={autoFocus}
        className={`${className}${error ? ' is-invalid' : ''}`}
        placeholder={'0.00'}
        value={value}
        onKeyDown={onKeyDown}
        onChange={evt => {
          if (evt === '' || evt === undefined || evt === null) {
            return (onChange(null))
          }
          return onChange((evt).replace(/,/g, ''))
        }}
        {...customInput}
      />
    </div>
  </FormGroup>
)

/**
 * Singular component for TextArea Type.
 *
 * should NOT have onKeyDown because 'enter' should be reserved for textarea operations
 *
 * @property { function } onChange - returns evt.target.value:
 *     evt => onChange(evt.target.value)
 * @property { string } id
 * @property { string } [labelStr]
 * @property { string } [error]
 * @property { any } value - FlexibleInput component sets default to: ''
 * @property { string } className - FlexibleInput component sets default to: 'form-control'
 * @property { object } [customInput]
 * @property { boolean } required
 * @property { function } customError
 * @property { function } customLabel
 * @property { boolean } autoFocus; update isAutoFocusInput() when changing
 * @property { boolean } spellCheck
 */

export const InputTextArea = ({ onChange, id, labelStr, error, value, className, required, customInput, customError, customLabel, autoFocus, spellCheck }) => (
  <FormGroup labelStr={labelStr} htmlFor={id} error={error} required={required}
    customError={R.defaultTo(null, customError)}
    customLabel={customLabel}>
    <textarea
      autoFocus={autoFocus}
      className={`${className}${error ? ' is-invalid' : ''}`}
      value={value}
      onChange={evt => onChange(evt.target.value)}
      id={id}
      spellCheck={spellCheck}
      {...customInput}
    />
  </FormGroup>
)

/**
 * Singular component for Radio Type.
 *
 * @property { function } onChange - returns evt.target.value:
 *     evt => onChange(evt.target.value)
 * @property { string } id
 * @property { string } [labelStr]
 * @property { string } [error]
 * @property { any } value - no default set
 * @property { string } className - FlexibleInput component sets default to: 'form-check'
 * @property { any } options
 * @property { boolean } inline - FlexibleInput component sets default to: false
 * @property { object } [customInput]
 * @property { boolean } required
 * @property { function } customError
 * @property { function } customLabel
 */

export const InputRadio = ({ onChange, id, labelStr, error, value, className, options, inline, required, customInput, customError, customLabel }) => (
  <FormGroup labelStr={labelStr} htmlFor={id} error={error} required={required}
    customError={R.defaultTo(CustomErrorComponent, customError)}
    customLabel={customLabel}>
    {options.map((option, idx) => (
      <div key={`radio-${idx}-${id}`} className={`${className} ${inline ? ' form-check-inline' : ''}`}>
        <input
          className='form-check-input'
          type='radio'
          id={option.value}
          value={option.value}
          checked={option.value === value}
          onChange={evt => onChange(evt.target.value)}
          {...customInput}
        />
        <label className='form-check-label' htmlFor={option.value}>{option.label}</label>
      </div>
    ))}
  </FormGroup>
)

/**
 * Singular component for File Type.
 *
 * @property { function } onChange
 * @property { string } id
 * @property { string } [labelStr]
 * @property { string } [error]
 * @property { string } className - FlexibleInput component sets default to: 'form-control-file'
 * @property { object } [customInput]
 * @property { boolean } required
 * @property { function } customError
 * @property { function } customLabel
 */

export const InputFile = ({ onChange, error, id, labelStr, className, required, customInput, customError, customLabel }) => {
  return (
    <FormGroup labelStr={labelStr} htmlFor={id} error={error} required={required}
      customError={R.defaultTo(null, customError)}
      customLabel={customLabel}>
      <input
        type='file'
        onChange={onChange}
        className={`${className}${error ? ' is-invalid' : ''}`}
        id={id}
        {...customInput}
      />
    </FormGroup>
  )
}

/**
 * Singular component for Switch Type.
 *
 * See React Switch documentation for details on which attributes to override
 *
 * @property { function } onChange
 * @property { string } id
 * @property { string } [labelStr]
 * @property { string } [error]
 * @property { boolean } inline
 * @property { any } value - FlexibleInput component sets default to: false
 * @property { string } className - FlexibleInput component sets default to: 'form-check'
 * @property { object } [customInput]
 * @property { boolean } required
 * @property { function } customError
 * @property { function } customLabel
 */

export const InputSwitch = ({ onChange, value, inline, id, className, labelStr, error, required, customInput, customError, customLabel }) => (
  <FormGroup labelStr={labelStr} htmlFor={id} error={error} required={required}
    customError={R.defaultTo(CustomErrorComponent, customError)}
    customLabel={customLabel}>
    <div key={`checkbox-${id}`} className={`${className} ${inline ? ' form-check-inline' : ''}`}>
      &nbsp;<Switch
        onChange={evt => {
          const val = (typeof (evt) === typeof (false)) ? evt : false
          return onChange(val)
        }}
        checked={value}
        {...customInput}
      />
    </div>
  </FormGroup>
)

/**
 * Singular component for Checkbox Type.
 *
 * This component has no customLabel option
 *
 * @property { function } onChange - returns evt.target.checked:
 *     evt => onChange(evt.target.checked)
 * @property { string } id
 * @property { string } [labelStr]
 * @property { string } [error]
 * @property { any } value - FlexibleInput component sets default to: false
 * @property { string } className - FlexibleInput component sets default to: 'form-group form-check'
 * @property { object } [customInput]
 * @property { boolean } required
 * @property { function } customError
 */

export const InputCheckbox = ({ onChange, value, id, className, labelStr, error, required, customInput, customError }) => {
  customError = R.defaultTo(CustomErrorComponent, customError)
  return (
    <div key={`checkbox-${id}`} className={className}>
      <label className='form-check-label'>
        <input
          className='form-check-input'
          type='checkbox'
          id={id}
          value={value}
          checked={value}
          onChange={evt => {
            const val = (typeof (evt.target.checked) === typeof (false)) ? evt.target.checked : false
            return onChange(val)
          }}
          {...customInput}
        />{`${labelStr} ${required ? ' *' : ''}`}
      </label>
      {error && customError({ error, id })}
    </div>
  )
}

/**
 * Singular component for Select Type.
 *
 * See React Select docs for more details on: isClearable, isMulti, options, noOptionsMessage,
 * onMenuOpen
 *
* should NOT have onKeyDown because the 'enter' key should be reserved for Select operations
 *
 * @property { function } onChange
 * @property { string } id
 * @property { string } [labelStr]
 * @property { string } [error]
 * @property { any } value - no default set
 * @property { string } className - FlexibleInput component sets default to: 'basic-single'
 * @property { boolean } isClearable - FlexibleInput component sets default to: true
 * @property { boolean } isMulti - FlexibleInput component sets default to: false
 * @property { any } options
 * @property { function } noOptionsMessage - FlexibleInput component sets default to: () => 'No Options'
 * @property { function } onMenuOpen - See React Select for more details
 * @property { object } [customInput] - See React Select docs for full list of attributes
 * @property { boolean } required
 * @property { function } customError
 * @property { function } customLabel
 */

export const InputSelect = ({ labelStr, id, error, className, isClearable, isMulti, value, options, onChange, noOptionsMessage, onMenuOpen, required, customInput, customError, customLabel }) => (
  <FormGroup labelStr={labelStr} htmlFor={id} error={error} required={required}
    customError={R.defaultTo(CustomErrorComponent, customError)}
    customLabel={customLabel}>
    <Select
      className={className}
      classNamePrefix='select'
      isClearable={required ? false : isClearable}
      isMulti={isMulti}
      value={value}
      options={options}
      isOptionDisabled={(option) => R.prop('disabled', option) === true}
      onChange={onChange}
      id={id}
      onMenuOpen={onMenuOpen}
      noOptionsMessage={noOptionsMessage}
      filterOption={createFilter({ ignoreAccents: false })}
      components={optimizeSelect.components}
      {...customInput}
    />
  </FormGroup>
)

/**
 * Singular component for CreatableStringSelect Type.
 *
 * See React Select docs for more details on: isClearable, isMulti, options, noOptionsMessage,
 * onMenuOpen
 *
* should NOT have onKeyDown because the 'enter' key should be reserved for Select operations
 *
 * @property { function } onChange
 * @property { string } id
 * @property { string } [labelStr]
 * @property { string } [error]
 * @property { any } value - no default set
 * @property { any } options
 * @property { function } onMenuOpen - See React Select for more details
 * @property { object } [customInput] - See React Select docs for full list of attributes
 * @property { boolean } required
 * @property { function } customError
 * @property { function } customLabel
 */

export const InputCreatableStringSelect = ({
  labelStr,
  id,
  error,
  className,
  value,
  options,
  onChange,
  onMenuOpen,
  required,
  customInput,
  customError,
  customLabel
}) => {
  return (
    <FormGroup
      labelStr={labelStr}
      htmlFor={id}
      error={error}
      required={required}
      customError={R.defaultTo(CustomErrorComponent, customError)}
      customLabel={customLabel}
    >
      <CreatableSelect
        className={className}
        classNamePrefix='select'
        id={id}
        options={options}
        onChange={(selectedOption) => onChange(selectedOption.value)}
        value={{ label: value, value }}
        onMenuOpen={onMenuOpen}
        createOptionPosition={'first'}
        {...customInput}
      />
    </FormGroup>
  )
}
