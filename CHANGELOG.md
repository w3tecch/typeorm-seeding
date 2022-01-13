# [3.1.0](https://github.com/jorgebodega/typeorm-seeding/compare/v3.0.1...v3.1.0) (2022-01-13)


### Features

* add support to async definition on factory ([9432089](https://github.com/jorgebodega/typeorm-seeding/commit/9432089394b027552c12dc0a1dcb5f706cb6c107))

# [3.1.0-next.1](https://github.com/jorgebodega/typeorm-seeding/compare/v3.0.1...v3.1.0-next.1) (2022-01-09)


### Features

* add support to async definition on factory ([5fcca0e](https://github.com/jorgebodega/typeorm-seeding/commit/5fcca0e8d2016c68fda18fe1b202739558b07466))

## [3.0.1](https://github.com/jorgebodega/typeorm-seeding/compare/v3.0.0...v3.0.1) (2022-01-08)


### Bug Fixes

* update dependencies and add rimraf to dev deps ([504cef2](https://github.com/jorgebodega/typeorm-seeding/commit/504cef2f94b1b8e2e47d6bfa6e0bb1e8325490e2))

# [3.0.0](https://github.com/jorgebodega/typeorm-seeding/compare/v2.0.0...v3.0.0) (2022-01-06)

### Bug Fixes

- adapt seeder to new schema ([aecf7b4](https://github.com/jorgebodega/typeorm-seeding/commit/aecf7b46d40221d00d11ae15d40e36bc8c3293c0))
- remove factories option from config ([d66f0f1](https://github.com/jorgebodega/typeorm-seeding/commit/d66f0f184479eeca3fde1b3c5438ee17223ffa2f))

### chore

- remove all faker usages from source folder ([1e14718](https://github.com/jorgebodega/typeorm-seeding/commit/1e1471829c4b707fa8f0c9cb44289438ea4a1f85))
- remove faker from dependencies ([40f21c8](https://github.com/jorgebodega/typeorm-seeding/commit/40f21c86d5bab714581821f80480f091a91b6cf6))

### Features

- adapt use seeders to new structure ([5bca471](https://github.com/jorgebodega/typeorm-seeding/commit/5bca471339a3f8ccdc461160eb3f6c7d551daeab))
- move factory definition to new abstract class ([81ccdf6](https://github.com/jorgebodega/typeorm-seeding/commit/81ccdf6d295c9d36b68c803dffc197c84605a53b))
- remove context from factories ([#23](https://github.com/jorgebodega/typeorm-seeding/issues/23)) ([b7ecba4](https://github.com/jorgebodega/typeorm-seeding/commit/b7ecba4d4064525cd4f02da783ef885a12af08a2))
- remove deprecated elements ([d09e154](https://github.com/jorgebodega/typeorm-seeding/commit/d09e15479cbb49214a81ef5ef49bef6f6adce3a4))
- remove factory helper methods and test associateds ([#30](https://github.com/jorgebodega/typeorm-seeding/issues/30)) ([3393724](https://github.com/jorgebodega/typeorm-seeding/commit/3393724fe85bb59437ea9b307768ac157d70ec19))
- remove useFactories helper method ([#29](https://github.com/jorgebodega/typeorm-seeding/issues/29)) ([ddb5c2f](https://github.com/jorgebodega/typeorm-seeding/commit/ddb5c2f6576bdcde72cabb876a43013aff303e01))
- seed command will execute now default seeder or seed param ([314d8c3](https://github.com/jorgebodega/typeorm-seeding/commit/314d8c30e3ec59cc02074a3846e5df773f337bc6))

### BREAKING CHANGES

- `useSeeders` change its definition and is now incompatible with previous version
- Faker is not available anymore as function param
- Faker is removed from dependencies and now users must install it by themselves
- Deprecated functions are removed
- New abstract factory class is incompatible with previous version
- `useFactories` will no longer be available as is useless in new architecture
- Context is being removed from factories. This could break some applications that were using it

# [2.0.0](https://github.com/jorgebodega/typeorm-seeding/compare/v1.6.2...v2.0.0) (2021-12-14)

### BREAKING CHANGES

- `useSeeders` has been renamed to `useFactories` to be more consistent with functionality
- New `useSeeders` has been created. Returns every Seeder that complies glob pattern and could execute them.
- `Seeder` is now an abstract class instead of an interface
- `Seeder` must export default, as that is the one that is chosen on `useSeeder`
- `tearDownDatabase` and `useRefreshDatabase` are deprecated
