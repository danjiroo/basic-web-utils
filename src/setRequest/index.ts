/**
 * @remarks
 * This method invokes the setters of param 'request' that are provided on param 'properties'
 * */
export const setRequest = <R, P>(request: R, properties: P): R => {
  const propKeys = Object.keys(properties)

  for (let c = 0; c < propKeys.length; c++) {
    const key = propKeys[c]
    const funcName = `set${key.charAt(0).toUpperCase() + key.slice(1)}`

    // @ts-ignore
    request[funcName](properties[key])
  }

  return request
}

