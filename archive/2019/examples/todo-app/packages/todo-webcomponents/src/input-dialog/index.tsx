import * as React from 'react';
import { StatelessComponent, useState } from 'react';
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
  Typography,
} from '@material-ui/core';
import SpinnerButton from '../spinner-button';

export interface Input {
  description: string;
}

type TProps = {
  isVisible: boolean;
  title: string;
  explanation: string;
  onCancel: () => void;
  onDone: (input: Input) => void;
  isLoading?: boolean;
  errorMessage?: string;
} & WithStyles<typeof styles>;

const InputDialog: StatelessComponent<TProps> = ({
  isVisible,
  isLoading,
  title,
  explanation,
  onCancel,
  onDone,
  errorMessage,
  classes,
}) => {
  const [description, setDescription] = useState('');

  return (
    <Dialog open={isVisible} maxWidth='sm' fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{explanation}</DialogContentText>
        <TextField
          margin='dense'
          label='Description'
          type='text'
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          onChange={e => setDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color='primary'>
          Cancel
        </Button>
        <SpinnerButton
          onClick={() => onDone({ description })}
          color='primary'
          value='Done'
          isLoading={isLoading}
          style={{ width: 120, height: 40 }}
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
};

const styles = createStyles({
  errorMessage: {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    padding: '0 24px',
  },
});

export default withStyles(styles)(InputDialog);
