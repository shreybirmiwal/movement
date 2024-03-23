import { createPublicClient, http } from 'viem'
export { baseSepolia } from './definitions/baseSepolia.js'
 
export const publicClient = createPublicClient({ 
  chain: baseSepolia,
  transport: http()
})