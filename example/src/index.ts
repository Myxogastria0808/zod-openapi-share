import { serve } from '@hono/node-server';
import { api } from './app/app.js';

serve(
  {
    fetch: api().fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
