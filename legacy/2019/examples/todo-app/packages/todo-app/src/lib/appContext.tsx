import * as React from 'react';
import { StatelessComponent, createContext } from 'react';
import { TodosApi } from './api-todos';
import { AuthApi } from './api-auth';
import useFetch from './useFetch';
import sessionStorage from 'sessionstorage';

declare global {
  namespace NodeJS {
    interface Global {
      API_URL: string;
    }
  }
}

type TProps = {};

export interface Context {
  apis: any;
  user: any;
  useFetch: () => {
    data: any;
    isLoading: boolean;
    error: Error | undefined;
    refetch: () => void;
  };
  setError: (e: Error) => void;
}

interface User {
  email: string;
  token: string;
  username: string;
}

const user = {
  set(user: User) {
    sessionStorage.setItem('user', JSON.stringify(user));
  },
  get(): User {
    return JSON.parse(sessionStorage.getItem('user') || '{}');
  },
  reset() {
    sessionStorage.removeItem('user');
  },
};

const value: Context = {
  apis: {
    todos: new TodosApi({
      url: global.API_URL,
      getToken: () => user.get().token,
    }),
    auth: new AuthApi({ url: global.API_URL }),
  },
  user,
  setError(e: Error) {
    console.error(e);
  },
  useFetch() {
    return useFetch({
      url: `${global.API_URL || ''}todos`,
      token: user.get().token,
    });
  },
};

const appContext = createContext(value);
const Provider = appContext.Provider;

export const Consumer = appContext.Consumer;

export const AppContext: StatelessComponent<TProps> = ({ children }) => {
  return <Provider value={value}>{children}</Provider>;
};

export default AppContext;
