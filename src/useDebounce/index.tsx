/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from 'react'

interface ISend {
  type: string
  payload?: any
}

interface IDebounceParams {
  input: any
  actions_type: Partial<string>
  send: (params: ISend) => void
}
export const useDebounce = ({ input, actions_type, send }: IDebounceParams) => {
  const value = useRef({})
  useEffect(() => {
    value.current = {
      ...value.current,
      ...input,
    }
  }, [input])

  useEffect(() => {
    const timeout = setTimeout(() => {
      send({
        type: actions_type,
        payload: value.current,
      })
    }, 1000)
    return () => {
      clearTimeout(timeout)
    }
  }, [value.current])
}
