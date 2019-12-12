import Store from './Store'
import { Token } from 'typedi'

export const StoreToken = new Token<Store>('stores')
