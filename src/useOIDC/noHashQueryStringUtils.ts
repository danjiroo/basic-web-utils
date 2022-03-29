/* eslint-disable @typescript-eslint/no-explicit-any */
import { BasicQueryStringUtils } from '@openid/appauth'

export class NoHashQueryStringUtils extends BasicQueryStringUtils {
  parse(input: any) {
    return super.parse(input, false /* never use hash */)
  }
}
