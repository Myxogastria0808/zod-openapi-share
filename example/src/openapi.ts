import { api } from './app/app.js';
import fs from 'node:fs';

const docs = api().getOpenAPIDocument({
  openapi: '3.0.0',
  info: {
    title: 'hono + @hono/zod-openapi sample',
    version: '1.0.0',
    description: 'HonoとZodでOpenAPIドキュメントを生成するサンプルです。',
  },
});

const json = JSON.stringify(docs, null, 2);

fs.writeFileSync('./openapi.json', json);
console.log(json);
