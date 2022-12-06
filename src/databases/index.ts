import { join } from 'path';
import { ConnectionOptions } from 'typeorm';

export const dbConnection: ConnectionOptions = {
  type: 'sqlite',
  database: 'data/birdview.sqlite',
  synchronize: true,
  logging: false,
  entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '../**/*.migration{.ts,.js}')],
  subscribers: [join(__dirname, '../**/*.subscriber{.ts,.js}')],
  cli: {
    entitiesDir: 'src/entities',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber',
  },
};
