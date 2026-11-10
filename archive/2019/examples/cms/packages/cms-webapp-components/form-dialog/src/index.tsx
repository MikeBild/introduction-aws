import * as React from 'react'
import { FunctionComponent } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

type TProps = {
  title?: string;
  headline?: string;
  isOpen?: boolean;
  onCancel?: () => void;
  onDone?: () => void;
};

export const FormDialog: FunctionComponent<TProps> = ({
  title = '',
  headline = '',
  children = <div />,
  isOpen = true,
  onCancel = () => { },
  onDone = () => { },
}) => {
  return (
    <Dialog open={isOpen}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {headline}
        </DialogContentText>
        {children}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onCancel}
          color='primary'>
          Cancel
        </Button>
        <Button
          onClick={onDone}
          color='primary'>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FormDialog;