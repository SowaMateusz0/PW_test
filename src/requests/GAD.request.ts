import { faker } from '@faker-js/faker';
import { request } from '@playwright/test';
import * as fs from 'fs';

export async function loginAndSaveToken(): Promise<void> {
  const apiRequestContext = await request.newContext();
  console.log('Sending request 1...');
  const response = await apiRequestContext.post(
    'http://localhost:3000/api/login',
    {
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
      data: {
        email: 'Moses.Armstrong@Feest.ca',
        password: 'test1',
      },
    },
  );
  console.log('Request 1 sended');

  const responseBody = await response.json();

  if (responseBody.access_token) {
    // is needed to save the token instead just:
    // process.env.TOKEN = responseBody.access_token;
    
    const token = responseBody.access_token;

    let envContent = '';
    if (fs.existsSync('.env')) {
      envContent = fs.readFileSync('.env', { encoding: 'utf-8' });
    }
    const tokenRegex = /^TOKEN=.*$/m;
    if (tokenRegex.test(envContent)) {
      envContent = envContent.replace(tokenRegex, `TOKEN=${token}`);
    } else {
      envContent += `\nTOKEN=${token}`;
    }

    fs.writeFileSync('.env', envContent.trim() + '\n', { encoding: 'utf-8' });
    //after modification of .env file we need to reload dotenv config like i.e.  dotenv.config({ override: true });
  }
}

export async function createArticleAndGetTitle(): Promise<string> {
  const context = await request.newContext();

  const requestBody = {
    title: faker.lorem.words(10),
    body: 'string',
    date: new Date().toISOString(),
    image: 'string',
  };
  console.log('Sending request 2...');
  const response = await context.post('http://localhost:3000/api/articles', {
    // referencing to process.env.TOKEN will fail - this was injected to .env file after dotenv initialisation
    headers: {
      Authorization: `Bearer ${process.env.TOKEN}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    data: requestBody,
  });
  console.log('Request 2 sended');
  const responseBody = await response.json();
  return await responseBody.title;
}
