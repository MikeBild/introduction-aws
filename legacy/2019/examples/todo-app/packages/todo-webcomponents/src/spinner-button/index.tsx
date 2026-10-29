import React from 'react';
import { Button, CircularProgress } from '@material-ui/core';

interface TProps {
  value: string;
  isLoading?: boolean;
  onClick?: () => void;
  style?: object;
  className?: string;
  color?: 'primary' | 'secondary' | 'default' | undefined;
  autoFocus?: boolean;
}

export default ({
  isLoading,
  onClick,
  value,
  style,
  className,
  color = 'default',
  autoFocus,
}: TProps) => {
  return (
    <Button
      autoFocus={autoFocus}
      variant='contained'
      color={color}
      onClick={onClick}
      style={style}
      className={className}
      disabled={isLoading}>
      {isLoading ? (
        <CircularProgress size={20} color='primary' />
      ) : (
        <span>{value}</span>
      )}
    </Button>
  );
};
