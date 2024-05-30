/* eslint-disable @typescript-eslint/no-explicit-any */

import { FieldRules, Fields } from './types'

export const validateEmail = (email: string) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  return re.test(String(email).toLowerCase())
}

export const validateMinLength = (valueLength: number, minLength: number) =>
  valueLength < minLength

export const validateUrl = (url: string) => {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' +
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
      '((\\d{1,3}\\.){3}\\d{1,3}))' +
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
      '(\\?[;&a-z\\d%_.~+=-]*)?' +
      '(\\#[-a-z\\d_]*)?$',
    'i'
  )
  return !!pattern.test(url)
}

export const validatePassword = (password: string) => {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/
  return regex.test(password)
}

export interface ValidateParams {
  fields: Fields
  fieldRules: FieldRules
}

export const Validate = ({
  fields,
  fieldRules,
}: ValidateParams): Fields['fields'] => {
  const validatedFields = Object.values(fields ?? {})?.reduce(
    (acc: any, field) => {
      let currentField = {
        ...field,
      }

      const value = currentField?.value

      const { required, isValidEmail, isValidPassword, isValidUrl, minLength } =
        fieldRules?.[currentField.name] ?? {}

      // check for required fields
      if (required?.check && !value) {
        currentField = {
          ...currentField,
          error: true,
          errorText: required?.message,
        }
      }

      // check for valid emails
      else if (isValidEmail?.check && !validateEmail(value)) {
        currentField = {
          ...currentField,
          error: true,
          errorText: isValidEmail?.message,
        }
      }

      // check for valid urls
      else if (isValidUrl?.check && !validateUrl(value)) {
        currentField = {
          ...currentField,
          error: true,
          errorText: isValidUrl?.message,
        }
      }

      // check for valid minimum lengths
      else if (
        minLength?.check &&
        validateMinLength(value.length, minLength?.check as number)
      ) {
        currentField = {
          ...currentField,
          error: true,
          errorText: minLength?.message,
        }
      }

      // check for valid passwords
      else if (isValidPassword?.check && !validatePassword(value)) {
        currentField = {
          ...currentField,
          error: true,
          errorText: isValidPassword?.message,
        }
      }

      return {
        ...acc,
        [currentField.name]: currentField,
      }
    },
    {}
  )

  return validatedFields
}
