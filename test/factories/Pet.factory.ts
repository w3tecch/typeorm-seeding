import { define } from '../../src/facade'
import { Pet } from '../entities/Pet.entity'
import { petFactoryFn } from './PetFactoryFunction'

define(Pet, petFactoryFn)
