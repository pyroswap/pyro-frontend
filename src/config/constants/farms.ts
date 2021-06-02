import tokens from './tokens'
import { FarmConfig } from './types'

const farms: FarmConfig[] = [
  /**
   * These 3 farms (PID 0, 251, 252) should always be at the top of the file.
   */
  {
    pid: 0,
    lpSymbol: 'PYRO',
    lpAddresses: {
      97: '',
      4: '0x7e6dB6BA3ee86907C59fd4538e1040Cc7821Aa00',
    },
    token: tokens.cake,
    quoteToken: tokens.weth,
    harvestLockup: '1 Minute',
  },
  {
    pid: 1,
    lpSymbol: 'ETH-USDT LP',
    lpAddresses: {
      97: '',
      4: '0x8cEB98D0F4fb1eaC7bFa32914e39A3690F1dA378',
    },
    token: tokens.weth,
    quoteToken: tokens.usdt,
    harvestLockup: '1 Minute',
  },

]

export default farms
