import { define } from '../../src/factoriesMap'
import { Pet } from '../entities/Pet.entity'
import { petFactoryFn } from './PetFactoryFunction'

define(Pet, petFactoryFn)
