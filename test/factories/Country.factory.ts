import { faker } from '@faker-js/faker'
import { Factory } from '../../src/factory'
import { InstanceAttribute } from '../../src/instanceAttribute'
import type { FactorizedAttrs } from '../../src/types'
import { Country } from '../entities/Country.entity'

export class CountryFactory extends Factory<Country> {
  protected entity = Country
  protected attrs: FactorizedAttrs<Country> = {
    name: faker.name.findName(),
    isoCode: new InstanceAttribute((instance) => instance.name.slice(0, 2).toUpperCase()),
  }
}
