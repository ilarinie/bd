import { promisify } from 'util'
import { scrypt } from 'crypto'

export const scryptAsync = promisify(scrypt)
