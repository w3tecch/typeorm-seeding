import { define } from '../../src/factoriesMap'
import { User } from '../entities/User.entity'
import { userFactoryFn } from './UserFactoryFunction'

define(User, userFactoryFn)
