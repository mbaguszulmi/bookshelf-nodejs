import Hapi from '@hapi/hapi';
import router from './routes/router';

const init = async () => {
  const port = 9000;
  const server = Hapi.server({
    port,
    host: 'localhost',
    state: {
      strictHeader: false,
    },
  });

  server.route(router);

  await server.start();
  console.log(`Server running on port ${port}`);
};

init();
