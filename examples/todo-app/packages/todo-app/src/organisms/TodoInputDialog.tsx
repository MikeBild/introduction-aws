import React, { StatelessComponent, Fragment, useState } from 'react';
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

type Input = {
  name: string;
  description: string;
};

type TProps = {
  isVisible: boolean;
  onCancel: () => void;
  onDone: (input: Input) => void;
} & WithStyles<typeof styles>;

const TodoInputDialog: StatelessComponent<TProps> = ({
  classes,
  isVisible,
  onCancel,
  onDone,
}) => {
  const [
    name,
    setName,
  ] = useState('');

  const [
    description,
    setDescription,
  ] = useState('');

  return (
    <Dialog open={isVisible}>
      <DialogTitle>New Todo</DialogTitle>
      <DialogContent>
        <DialogContentText>Enter ...</DialogContentText>
        <TextField
          autoFocus
          margin='dense'
          label='Name'
          type='text'
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin='dense'
          label='Description'
          type='text'
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(e) => setDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color='primary'>
          Cancel
        </Button>
        <Button
          onClick={() =>
            onDone({
              name,
              description,
            })}
          color='primary'>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const styles = createStyles({});

export default withStyles(styles)(TodoInputDialog);
