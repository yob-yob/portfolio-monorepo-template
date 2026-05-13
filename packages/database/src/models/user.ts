import { table } from '../schema'
import { spreads } from '../utils'

export const db = {
	insert: spreads({
		user: table.users,
	}, 'insert'),
	select: spreads({
		user: table.users,
	}, 'select')
} as const
