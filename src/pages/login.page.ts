import { LoginUserModel } from '../models/user.model';
import { Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(protected page: Page) {
    this.emailInput = this.page.getByPlaceholder('Enter User Email');
    this.passwordInput = this.page.getByPlaceholder('Enter Password');
    this.loginButton = this.page.getByRole('button', { name: 'LogIn' });
  }

  async loginToApplication(LoginUserModel: LoginUserModel): Promise<void> {
    console.log('Input email');
    await this.emailInput.fill(LoginUserModel.userEmail);

    console.log('Input password');
    await this.passwordInput.fill(LoginUserModel.userPassword);

    console.log('Click login button');
    await this.loginButton.click();
  }
}
