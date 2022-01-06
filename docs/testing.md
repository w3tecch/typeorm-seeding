## Testing features

We provide some testing features that we already use to test this package, like connection configuration.
The entity factories can also be used in testing. To do so call the `useFactories` or `useSeeders` function.

### `useFactories`

Loads the defined entity factories.

```typescript
useFactories(options?: Partial<ConnectionConfiguration>): Promise<void>
useFactories(factories?: string[], options?: Partial<ConnectionConfiguration>): Promise<void>
```

### `useSeeders`

Loads the seeders, and could execute them.

```typescript
useSeeders(executeSeeders?: boolean, options?: Partial<ConnectionConfiguration>): Promise<Seeder[]>
useSeeders(executeSeeders?: boolean, seeders?: string[], options?: Partial<ConnectionConfiguration>): Promise<Seeder[]>
```

### `runSeeder`

Runs the given seeder class.

```typescript
runSeeder(seeder: Seeder): Promise<void>
```

### `ConnectionConfiguration`

```typescript
interface ConnectionConfiguration {
  root?: string // path to the orm config file. Default = process.cwd()
  configName?: string // name of the config file. eg. ormconfig.js
  connection = 'default' // name of the database connection.
}
```
