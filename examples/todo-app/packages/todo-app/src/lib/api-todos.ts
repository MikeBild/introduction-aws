
declare global {
  namespace NodeJS {
    interface Global {
      API_URL: string
    }
  }
}

export interface Todo {
  id: string;
  done: boolean;
  description: string;
  name: string;
}

export async function toggleDone({ id }: { id: string }) {
  const response = await fetch(
    `${global.API_URL}/todos/done`,
    {
      method: 'PUT',
      body: JSON.stringify({ id }),
      headers:
      {
        'Content-Type': 'application/json',
      },
    }
  );

  const payload = await response.json() || {};

  if (response.status >= 400) throw new Error(response.statusText);
  if (payload.failure) throw new Error(payload.failure.message);

  return payload.result;
}

export async function add(input: Todo) {
  const response = await fetch(
    `${global.API_URL}/todos`,
    {
      method: 'POST',
      body: JSON.stringify(input),
      headers:
      {
        'Content-Type': 'application/json',
      },
    }
  );

  const payload = await response.json() || {};

  if (response.status >= 400) throw new Error(response.statusText);
  if (payload.failure) throw new Error(payload.failure.message);

  return payload.result;
}

export async function remove({ id }: { id: string }) {
  const response = await fetch(
    `${global.API_URL}/todos/${id}`,
    {
      method: 'DELETE'
    }
  );

  const payload = await response.json() || {};

  if (response.status >= 400) throw new Error(response.statusText);
  if (payload.failure) throw new Error(payload.failure.message);

  return payload.result;
}