# [2.0.0](https://github.com/jorgebodega/typeorm-seeding/compare/v1.6.2...v2.0.0) (2021-12-14)


### BREAKING CHANGES

* `useSeeders` has been renamed to `useFactories` to be more consistent with functionality
* New `useSeeders` has been created. Returns every Seeder that complies glob pattern and could execute them.
* `Seeder` is now an abstract class instead of an interface
* `Seeder` must export default, as that is the one that is chosen on `useSeeder`
* `tearDownDatabase` and `useRefreshDatabase` are deprecated
