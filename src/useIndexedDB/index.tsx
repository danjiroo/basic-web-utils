import { get, set, createStore } from 'idb-keyval'

import { UseIndexedDBParams } from './types'

export const useIndexedDB = (params: UseIndexedDBParams) => {
  const { dbName = 'LocalDB' } = params

  const store = createStore(dbName, `${dbName}Store`)

  const getKey = async (key: string) => await get(key, store)

  const setKey = async (key: string, data: unknown) =>
    await set(key, data, store)

  return {
    getKey,
    setKey,
  }
}
