import { createServer } from 'http';
import UserGroupModel from './models/group.model';
import AuthorityModel from './models/authority.model';
import UserModel from './models/user.model';
import { bootstrap as sequelizeBootstrap } from './persistance';
import { bootstrap as koaBootstrap } from './server';

async function bootstrap() {
  await sequelizeBootstrap({
    logging: console.log,
    database: 'some_db',
    dialect: 'sqlite',
    username: 'root',
    password: '',
    storage: ':memory:',
    models: [__dirname + '/models'],
  });

  const koaServer = await koaBootstrap();

  const httpServer = createServer(koaServer.callback());

  httpServer.listen(3000);
  return httpServer;
}

bootstrap()
  .then((server) => {
    console.log(`🚀 Server listening on ${JSON.stringify(server.address())}!`);
  })
  .catch((err) => {
    setImmediate(() => {
      console.error('Unable to run the server because of the following error:');
      console.error(err);
      process.exit();
    });
  });
