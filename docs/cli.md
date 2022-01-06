## CLI Configuration

There are two possible commands to execute, one to see the current configuration and one to run a seeder.

Add the following scripts to your `package.json` file to configure them.

```json
"scripts": {
  "seed:config": "typeorm-seeding config",
  "seed:run": "typeorm-seeding seed",
  ...
}
```

### `config`

This command just print the connection configuration.

```bash
typeorm-seeding config
```

Example result

```json
{
  "name": "default",
  "type": "sqlite",
  "database": "/home/jorgebodega/projects/typeorm-seeding/test.db",
  "entities": ["sample/entities/**/*{.ts,.js}"],
  "seeders": ["sample/seeders/**/*{.ts,.js}"],
  "defaultSeeder": "RootSeeder"
}
```

##### Options

| Option                 | Default               | Description                                                                  |
| ---------------------- | --------------------- | ---------------------------------------------------------------------------- |
| `--seed` or `-s`       | null                  | Option to specify a seeder class to run individually. (Only on seed command) |
| `--connection` or `-c` | TypeORM default value | Name of the TypeORM connection. Required if there are multiple connections.  |
| `--configName` or `-n` | TypeORM default value | Name to the TypeORM config file.                                             |
| `--root` or `-r`       | TypeORM default value | Path to the TypeORM config file.                                             |

### `seed`

This command execute a seeder, that could be specified as a parameter.

```bash
typeorm-seeding seed
```

##### Options

| Option                 | Default                              | Description                                                                 |
| ---------------------- | ------------------------------------ | --------------------------------------------------------------------------- |
| `--seed` or `-s`       | Default seeder specified config file | Option to specify a seeder class to run individually.                       |
| `--connection` or `-c` | TypeORM default value                | Name of the TypeORM connection. Required if there are multiple connections. |
| `--configName` or `-n` | TypeORM default value                | Name to the TypeORM config file.                                            |
| `--root` or `-r`       | TypeORM default value                | Path to the TypeORM config file.                                            |
