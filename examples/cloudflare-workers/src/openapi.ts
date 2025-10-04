import { default as app } from './index';
import fs from 'node:fs';

const docs = app.getOpenAPIDocument({
  openapi: '3.0.0',
  info: {
    title: 'hono + @hono/zod-openapi + zod-openapi-share sample',
    version: '1.0.0',
    description: 'This is a sample project to generate OpenAPI documents with Hono and Zod.',
  },
});

const json = JSON.stringify(docs, null, 2);

fs.writeFileSync('./openapi.json', json);
console.log(json);
