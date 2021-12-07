import { define } from '../../src/facade'
import { User } from '../entities/User.entity'
import { userFactoryFn } from './UserFactoryFunction'

define(User, userFactoryFn)
