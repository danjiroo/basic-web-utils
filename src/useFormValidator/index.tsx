/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable indent */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'

import {
  OnChangeEvent,
  UseFormValidatorProps,
  UseFormValidatorReturnType,
} from './types'

import { Validate } from './validator'

const useFormValidator = <TRecord extends Record<string, any>>(
  props: UseFormValidatorProps
): UseFormValidatorReturnType => {
  const { fields, fieldRules, actions, options } = props
  const { onChangeSideEffect, onSubmitSideEfect } = actions ?? {}
  const { errorOnChange = false, debounceTime = 200 } = options ?? {}

  const [isValidated, setIsValidated] = useState<boolean>(false)

  const onChange = (event: OnChangeEvent) => {
    const { name, value: onChangeValue } = event

    onChangeSideEffect?.({
      ...fields,
      [name]: {
        ...fields[name],
        value: onChangeValue,
        error: fields?.error,
        errorText: fields?.errorText,
      },
    })
  }

  const onSubmit = () => {
    const validatedFields = Validate({
      fieldRules,
      fields: Object.entries(fields)?.reduce(
        (acc: any, [key, value]: any) => ({
          ...acc,
          [key]: {
            ...fields?.[key],
            ...value,
          },
        }),
        {}
      ),
    })

    const hasErrors = Object.values(validatedFields ?? {})?.some(
      (field) => field?.error
    )

    if (hasErrors) {
      onChangeSideEffect?.({
        ...fields,
        ...validatedFields,
      })

      return
    }

    onSubmitSideEfect?.()
  }

  const validate = ({ enableSubmit = false }: { enableSubmit?: boolean }) => {
    const validatedFields = Validate({ fieldRules, fields })

    const hasErrors = Object.values(validatedFields ?? {})?.some(
      (field) => field?.error
    )

    setIsValidated(enableSubmit ? enableSubmit : !hasErrors)

    return validatedFields
  }

  let timeout: any

  // Debounce errors on input change without pressing submit button
  useEffect(() => {
    if (errorOnChange) {
      const onDebouce = () => {
        const validatedFields = validate({ enableSubmit: false })

        onChangeSideEffect?.({
          ...fields,
          ...validatedFields,
        })
      }

      if (timeout) clearTimeout(timeout)

      timeout = setTimeout(() => onDebouce(), debounceTime)

      return () => {
        if (timeout) clearTimeout(timeout)
      }
    } else {
      validate({ enableSubmit: true })
    }
  }, [fields])

  const onReset = () => {}

  return {
    fields,
    onChange,
    onSubmit,
    onReset,
    isValidated,
  }
}

export default useFormValidator
