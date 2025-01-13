import { LoginUserModel } from '../src/models/user.model';
import { LoginPage } from '../src/pages/login.page';
import {
  createArticleAndGetTitle,
  loginAndSaveToken,
} from '../src/requests/GAD.request';
import { testUser1 } from '../src/test-data/user.data';
import { expect, test } from '@playwright/test';

test('test1', async ({ page }) => {
  // Arrange
  await loginAndSaveToken();
  const articleName = await createArticleAndGetTitle();
  const loginPage = new LoginPage(page);
  const LoginUserModel: LoginUserModel = {
    userEmail: testUser1.userEmail,
    userPassword: testUser1.userPassword,
  };

  // Act
  console.log('Go to website');
  await page.goto('http://localhost:3000/login', { timeout: 60000 });
  console.log('Start login to app...');
  await loginPage.loginToApplication(LoginUserModel);
  console.log('Logged to app');
  await page.getByTestId('open-articles').click();
  await page.getByRole('link', { name: `${articleName}` }).click();
  await expect(page.getByTestId('article-title')).toContainText(articleName);
});
