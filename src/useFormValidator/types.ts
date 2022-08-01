/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { Dispatch, SetStateAction } from 'react'

export interface OnChangeEvent {
  name: string
  value: string
}

export interface Actions {
  /**
   * @onChangeSideEffect Other functions you can fire on input change like sending events to machine
   */
  onChangeSideEffect: (payload: any) => void
  /**
   * @onSubmitSideEfect Other functions you can fire on submit event
   */
  onSubmitSideEfect: () => void
}

export interface UseFormValidatorProps {
  /**
   * @fields contains the key:value pair of inputs where key is the field name and value are the input attributes
   */
  fields: Fields
  /**
   * @fieldRules based on the field inputs, add field rules for validation here
   */
  fieldRules: FieldRules
  /**
   * @onChangeSideEffect onChange event side effects
   * @onSubmitSideEfect onSubmit event side effects
   */
  actions?: Partial<Actions>
  /**
   * @options Hook options
   *
   * Available options:
   *
   * - errorOnChange
   * - debounceTime
   */
  options?: {
    /**
     * @errorOnChange Debounce inputs and get errors if its invalid right away without clicking on submit button
     */
    errorOnChange?: boolean
    /**
     * @debounceTime Time in milliseconds before firing input | Default: 200
     */
    debounceTime?: number
  }
}

export interface UseFormValidatorReturnType {
  fields: Fields
  onChange: (event: OnChangeEvent) => void
  onSubmit: () => void
  onReset: () => void
  isValidated: boolean
}

export type FieldRuleTypes =
  | 'required'
  | 'isValidEmail'
  | 'isValidPassword'
  | 'isValidUrl'
  | 'minLength'

export interface FieldDefinition<TFieldOptions = any[]> {
  id: string
  type: string
  name: string
  label: string
  placeholder: string
  icon: string
  error?: boolean
  errorText?: string
  value?: any
  options?: TFieldOptions[]
}

export interface FieldRuleDefinition {
  /**
   * @check Enable checking of field rule | For minimum length, check will be a number.
   */
  check: boolean | number
  /**
   * @message Error message displayed
   */
  message: string
}

/**
 * @TFieldNames E.g.: type FieldNames = 'name' | 'question' | 'type'
 * @TFieldOptions E.g.: Interface for array of options | E.g.: interface FieldOptions { id: string, type: string }
 */
export type Fields<
  TFieldNames extends string = string,
  TFieldOptions = Record<string, any>[]
> = {
  [P in TFieldNames]: FieldDefinition<TFieldOptions>
}

/**
 * Field names as keys here with optional objects as follows:
 *
 * @required Makes the input required and returns error if empty
 * @isValidEmail Checks for email validity
 * @isValidPassword Checks for password validity (allowed characters to be created)
 * @isValidUrl Checks for a valid url
 * @minLength Check if value reached the minimum length specified
 */
export type FieldRules<TFieldNames extends string = string> = {
  [P in TFieldNames]?: {
    [K in FieldRuleTypes]?: FieldRuleDefinition
  }
}
