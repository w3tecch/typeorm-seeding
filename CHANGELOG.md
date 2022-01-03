# [3.0.0-next.1](https://github.com/jorgebodega/typeorm-seeding/compare/v2.0.0...v3.0.0-next.1) (2022-01-03)


### Bug Fixes

* adapt seeder to  new schema ([a1d4e27](https://github.com/jorgebodega/typeorm-seeding/commit/a1d4e272e89481d0163ef0d4594a32ae7942cb9d))
* remove factories option from config ([870a23d](https://github.com/jorgebodega/typeorm-seeding/commit/870a23d912a1d18964e52c5c172b38714a8aa042))


### chore

* remove all faker usages from source folder ([2e4b0fb](https://github.com/jorgebodega/typeorm-seeding/commit/2e4b0fb756050f5061d3c0ea38899d40ce30b5a0))
* remove faker from dependencies ([f41cef4](https://github.com/jorgebodega/typeorm-seeding/commit/f41cef4c32720fb36756ac117d6b74d30d6d8998))


### Features

* adapt use seeders to new structure ([7ea3607](https://github.com/jorgebodega/typeorm-seeding/commit/7ea360752e54b8694f148f9dad25bf4815c04224))
* move factory definition to new abstract class ([41cf349](https://github.com/jorgebodega/typeorm-seeding/commit/41cf3494e8a97b185d113191c9598e49a4e73ced))
* remove context from factories ([#23](https://github.com/jorgebodega/typeorm-seeding/issues/23)) ([c030e89](https://github.com/jorgebodega/typeorm-seeding/commit/c030e890add5d41099004f8542a8dd521873d91d))
* remove deprecated elements ([09006e8](https://github.com/jorgebodega/typeorm-seeding/commit/09006e8655f288ebc318d32136b10f720687449f))
* remove factory helper methods and test associateds ([#30](https://github.com/jorgebodega/typeorm-seeding/issues/30)) ([a335ca2](https://github.com/jorgebodega/typeorm-seeding/commit/a335ca232410e2d1d93011ceca33068e01a7f16e))
* remove useFactories helper method ([#29](https://github.com/jorgebodega/typeorm-seeding/issues/29)) ([6fbeaba](https://github.com/jorgebodega/typeorm-seeding/commit/6fbeabaf2988b3d71fa19c2b44e443f58b805495))
* seed command will execute now default seeder or seed param ([84025f9](https://github.com/jorgebodega/typeorm-seeding/commit/84025f9a948c2d0823c2f95e6fb0193f0e36716a))


### BREAKING CHANGES

* `useSeeders` change its definition and is now incompatible with previous version
* Faker is not available anymore as function param
* Faker is removed from dependencies and now users must install it by themselves
* Some of these functions were used on previous versions
* New abstract factory class is incompatible with previous version
* Helper methods removed were a core part of previous versions
* This method will no longer be available as is useless in new architecture
* Context is being removed from factories. This could break some applications that were using it

# [2.0.0](https://github.com/jorgebodega/typeorm-seeding/compare/v1.6.2...v2.0.0) (2021-12-14)


### BREAKING CHANGES

* `useSeeders` has been renamed to `useFactories` to be more consistent with functionality
* New `useSeeders` has been created. Returns every Seeder that complies glob pattern and could execute them.
* `Seeder` is now an abstract class instead of an interface
* `Seeder` must export default, as that is the one that is chosen on `useSeeder`
* `tearDownDatabase` and `useRefreshDatabase` are deprecated
