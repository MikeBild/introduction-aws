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

export const ConfirmPage: StatelessComponent<
  TProps & WithStyles<typeof styles> & RouteComponentProps
> = ({ history }) => {
  const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  return (
    <Consumer>
      {context => {
        return (
          <Dialog open>
            <DialogTitle>Confirm you account</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Enter your confirmation code.
              </DialogContentText>
              <TextField
                margin='dense'
                label='Code'
                type='password'
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={e => setCode(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Typography
                variant='subtitle1'
                gutterBottom
                color='error'
                style={{
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                }}>
                {errorMessage}
              </Typography>
              <Button
                onClick={async () => {
                  try {
                    await context.apis.auth.confirm({
                      code,
                      email: context.user.get().username,
                    });
                    setErrorMessage('');
                    history.replace('/login');
                  } catch (e) {
                    setErrorMessage(e.message);
                    context.setError(e);
                  }
                }}
                color='primary'>
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        );
      }}
    </Consumer>
  );
};

const styles = createStyles({});

export default withStyles(styles)(withRouter(ConfirmPage));
