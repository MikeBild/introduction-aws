export interface Todo {
  id: string;
  done: boolean;
  description: string;
  name: string;
}

export class TodosApi {
  url: string;
  getToken: () => string;
  constructor({ url, getToken }: { url: string; getToken: () => string }) {
    this.url = url;
    this.getToken = getToken;
  }

  async toggleDone({ id }: { id: string }) {
    const token = this.getToken();
    const authHeader = token ? { Authorization: `Bearer ${token}` } : undefined;
    const response = await fetch(`${this.url}todos/done`, {
      method: 'PUT',
      body: JSON.stringify({ id }),
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
    });

    const payload = (await response.json()) || {};

    if (response.status >= 400)
      throw new Error(payload.message || response.statusText);

    return payload;
  }

  async add(input: Todo) {
    const token = this.getToken();
    const authHeader = token ? { Authorization: `Bearer ${token}` } : undefined;

    const response = await fetch(`${this.url}todos`, {
      method: 'POST',
      body: JSON.stringify(input),
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
    });

    const payload = (await response.json()) || {};

    if (response.status >= 400)
      throw new Error(payload.message || response.statusText);

    return payload;
  }

  async remove({ id }: { id: string }) {
    const token = this.getToken();
    const authHeader = token ? { Authorization: `Bearer ${token}` } : undefined;

    const response = await fetch(`${this.url}todos/${id}`, {
      method: 'DELETE',
      headers: {
        ...authHeader,
      },
    });

    const payload = (await response.json()) || {};

    if (response.status >= 400)
      throw new Error(payload.message || response.statusText);

    return payload;
  }
}
