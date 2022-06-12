import { Coin, Coins, LCDClient, MnemonicKey, MsgDelegate, MsgWithdrawDelegatorReward } from '@terra-money/terra.js'
import { B } from 'bhala'
// eslint-disable-next-line import/no-unresolved
import got from 'got'
import numeral from 'numeral'

import { waitFor } from './helpers/waitFor.js'

const { MNEMONIC, THRESHOLD } = process.env
const REWARD_AMOUNT_THRESHOLD = Number(THRESHOLD) * 1000000
/** @type {import('@terra-money/terra.js').Delegation[]} */
let DELEGATOR_ADDRESS = ''
let VALIDATOR_ADDRESS = ''

const mnemonicKey = new MnemonicKey({
  mnemonic: MNEMONIC,
})

export async function run() {
  const gasPrices = await got.get('https://pisco-api.terra.dev/gas-prices').json()
  const gasPricesCoins = new Coins(gasPrices)

  const lcdClient = new LCDClient({
    chainID: 'pisco-1',
    gasAdjustment: '1.5',
    gasPrices: gasPricesCoins,
    isClassic: false,
    URL: 'https://pisco-lcd.terra.dev',
  })

  const wallet = lcdClient.wallet(mnemonicKey)

  if (DELEGATOR_ADDRESS.length === 0) {
    DELEGATOR_ADDRESS = wallet.key.accAddress
    VALIDATOR_ADDRESS = (await lcdClient.staking.delegations(DELEGATOR_ADDRESS))[0][0].validator_address
  }

  const currentStakeAmount = (await lcdClient.staking.delegations(DELEGATOR_ADDRESS))[0][0].balance.amount
  const currentStakeAmountLog = numeral(currentStakeAmount / 1000000)
    .format('0,0.00')
    .padStart(12, ' ')
  B.info(`Current Stake:    ${currentStakeAmountLog} LUNA`)

  const pendingRewardAmount = (await lcdClient.distribution.rewards(DELEGATOR_ADDRESS)).rewards[VALIDATOR_ADDRESS].get(
    'uluna',
  ).amount
  const pendingRewardAmountLog = numeral(pendingRewardAmount / 1000000)
    .format('0,0.00')
    .padStart(12, ' ')
  B.info(`Pending Reward:   ${pendingRewardAmountLog} LUNA`)

  if (pendingRewardAmount >= REWARD_AMOUNT_THRESHOLD) {
    const pendingRewardWithdrawalMessage = new MsgWithdrawDelegatorReward(DELEGATOR_ADDRESS, VALIDATOR_ADDRESS)
    const pendingRewardWithdrawalTx = await wallet.createAndSignTx({ msgs: [pendingRewardWithdrawalMessage] })
    // eslint-disable-next-line no-unused-vars
    const pendingRewardWithdrawalTxResult = await lcdClient.tx.broadcast(pendingRewardWithdrawalTx)

    await waitFor(10)
    B.success(`Withdrawn Reward: ${pendingRewardAmountLog} LUNA`)

    const balanceAmount = (await lcdClient.bank.balance(DELEGATOR_ADDRESS))[0].get('uluna').amount
    const newStakeAmount = Math.floor((balanceAmount - 500000) / 1000000) * 1000000

    const newStakeCoin = new Coin('uluna', newStakeAmount)
    const newStakeMessage = new MsgDelegate(DELEGATOR_ADDRESS, VALIDATOR_ADDRESS, newStakeCoin)
    const newStakeTx = await wallet.createAndSignTx({ msgs: [newStakeMessage] })
    // eslint-disable-next-line no-unused-vars
    const newStakeTxResult = await lcdClient.tx.broadcast(newStakeTx)

    const newStakeAmountLog = numeral(newStakeAmount / 1000000)
      .format('0,0.00')
      .padStart(12, ' ')
    B.success(`New Stake:        ${newStakeAmountLog} LUNA`)
  }

  await waitFor(10)
  run()
}

run()
