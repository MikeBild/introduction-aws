export class AuthApi {
  url: string;

  constructor({ url }: { url: string }) {
    this.url = url;
  }

  async signup({
    email,
    password,
    confirm,
  }: {
    email: string;
    password: string;
    confirm: string;
  }) {
    const response = await fetch(`${this.url}auth/signup`, {
      method: 'POST',
      body: JSON.stringify({ username: email, password, confirm }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const payload = (await response.json()) || {};

    if (response.status >= 400)
      throw new Error(payload.message || response.statusText);

    return payload;
  }

  async confirm({ email, code }: { email: string; code: string }) {
    const response = await fetch(`${this.url}auth/confirm`, {
      method: 'POST',
      body: JSON.stringify({ username: email, code }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const payload = (await response.json()) || {};

    if (response.status >= 400)
      throw new Error(payload.message || response.statusText);

    return payload;
  }

  async login({ email, password }: { email: string; password: string }) {
    const response = await fetch(`${this.url}auth/login`, {
      method: 'POST',
      body: JSON.stringify({ username: email, password }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const payload = (await response.json()) || {};

    if (response.status >= 400)
      throw new Error(payload.message || response.statusText);

    return payload;
  }
}
