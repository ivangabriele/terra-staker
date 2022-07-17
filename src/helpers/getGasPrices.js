// eslint-disable-next-line import/no-unresolved
import got from 'got'

import { cache } from '../libs/cache.js'

export async function getGasPrices() {
  try {
    const gasPrices = await got.get('https://pisco-api.terra.dev/gas-prices').json()
    cache.set('gasPrices', gasPrices)

    return gasPrices
  } catch (err) {
    const gasPrices = cache.get('gasPrices')

    return gasPrices
  }
}
