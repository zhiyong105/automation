export interface EnvironmentConfig {
  baseUrl: string;
  username: string;
  password: string;
  env: string;
}

export function getConfig(): EnvironmentConfig {
  const env = process.env.ENV || 'test';
  const baseUrl = process.env.BASE_URL;
  const username = process.env.USERNAME;
  const password = process.env.PASSWORD;

  if (!baseUrl || !username || !password) {
    throw new Error(
      `Missing required environment variables for ENV=${env}. ` +
      `Please check .env.${env} file or GitHub Secrets.`
    );
  }

  return { baseUrl, username, password, env };
}

export const config = getConfig();
