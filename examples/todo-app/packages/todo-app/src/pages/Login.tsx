import * as React from 'react';
import { StatelessComponent, useState } from 'react';
import {
  withStyles,
  WithStyles,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
  Typography,
} from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { Consumer } from '../lib/appContext';
import { SpinnerButton } from '@introduction-aws/todo-webcomponents';

interface TProps {}

export const LoginPage: StatelessComponent<
  TProps & WithStyles<typeof styles> & RouteComponentProps
> = ({ history, classes }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Consumer>
      {context => {
        return (
          <Dialog open maxWidth='sm' fullWidth>
            <DialogTitle>Login</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Enter your email and password.
              </DialogContentText>
              <TextField
                autoFocus
                margin='dense'
                label='Email'
                type='email'
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={e => setEmail(e.target.value)}
              />
              <TextField
                margin='dense'
                label='Password'
                type='password'
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={e => setPassword(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button href='/signup'>Sign up</Button>
              <SpinnerButton
                autoFocus
                value='Login'
                isLoading={isLoading}
                style={{ width: 160, height: 35 }}
                onClick={async () => {
                  setIsLoading(true);
                  try {
                    const user = await context.apis.auth.login({
                      email,
                      password,
                    });
                    setErrorMessage('');
                    context.user.set(user);
                    history.replace('/');
                  } catch (e) {
                    setIsLoading(false);
                    setErrorMessage(e.message);
                    context.setError(e);
                  }
                }}
                color='primary'
              />
            </DialogActions>
            <Typography
              style={{ height: 40 }}
              variant='subtitle1'
              gutterBottom
              color='error'
              className={classes.errorMessage}>
              {errorMessage}
            </Typography>
          </Dialog>
        );
      }}
    </Consumer>
  );
};

const styles = createStyles({
  errorMessage: {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    padding: '0 24px',
  },
});

export default withStyles(styles)(withRouter(LoginPage));
