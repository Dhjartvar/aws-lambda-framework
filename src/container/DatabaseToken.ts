import Store from './Database'
import { Token } from 'typedi'

export const DatabaseToken = new Token<Store>('databases')
