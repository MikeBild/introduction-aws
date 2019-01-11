import * as React from 'react';

export interface Row {
  id: string;
  value?: string;
}

interface TProps {
  rows: [Row];
  renderRow: (item: Row) => JSX.Element;
  isLoading?: boolean;
  renderLoading?: () => JSX.Element;
  error?: Error;
  renderError?: (error: Error) => JSX.Element;
}

export const List: React.StatelessComponent<TProps> = ({
  rows,
  renderRow,
  isLoading,
  renderLoading,
  error,
  renderError,
}) => {
  if (isLoading && renderLoading) return renderLoading();
  if (error && renderError) return renderError(error);

  return (
    <table>
      <tbody>{rows.map(renderRow)}</tbody>
    </table>
  );
};

export default List;
