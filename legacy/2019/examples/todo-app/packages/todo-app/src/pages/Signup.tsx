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

interface TProps {}

export const SignupPage: StatelessComponent<
  TProps & WithStyles<typeof styles> & RouteComponentProps
> = ({ history }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  return (
    <Consumer>
      {context => {
        return (
          <Dialog open>
            <DialogTitle>Sign up account</DialogTitle>
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
              <TextField
                margin='dense'
                label='Confirm'
                type='password'
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={e => setConfirm(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Typography variant='subtitle1' gutterBottom color='error'>
                {errorMessage}
              </Typography>
              <Button href='/login'>Login</Button>
              <Button
                onClick={async () => {
                  try {
                    const user = await context.apis.auth.signup({
                      email,
                      password,
                      confirm,
                    });
                    setErrorMessage('');
                    context.user.set(user);
                    history.replace('/confirm');
                  } catch (e) {
                    setErrorMessage(e.message);
                    context.setError(e);
                  }
                }}
                color='primary'>
                Sign up
              </Button>
            </DialogActions>
          </Dialog>
        );
      }}
    </Consumer>
  );
};

const styles = createStyles({});

export default withStyles(styles)(withRouter(SignupPage));
