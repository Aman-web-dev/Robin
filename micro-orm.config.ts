import { defineConfig } from '@mikro-orm/mongodb';
import 'dotenv/config';
import { User } from './entities/User';
import { Request } from './entities/Request';
import { Options } from '@mikro-orm/mongodb';
import { MikroORM } from '@mikro-orm/mongodb';

// export default  defineConfig( {
//   clientUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/robin',
//   entities: [User,Request],
//   forceEntityConstructor: true,
// });

export default defineConfig({
  clientUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/robin',
  entities: ['./dist/entities/*.js'], // for production
  entitiesTs: ['./src/entities/*.ts'], // for development
  forceEntityConstructor: true,
});

