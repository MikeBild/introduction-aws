import * as React from 'react';
export interface Row {
  id: string;
  value?: string;
}

interface TProps {
  rows: [Row];
  renderRow: (item: Row) => JSX.Element;
  renderHeadRow?: () => JSX.Element;
  isLoading?: boolean;
  renderLoading?: () => JSX.Element;
  error?: Error;
  renderError?: (error: Error) => JSX.Element;
}

export const List: React.StatelessComponent<TProps> = ({
  rows,
  renderRow,
  renderHeadRow = () => <tr />,
  isLoading,
  renderLoading,
  error,
  renderError,
}) => {
  if (isLoading && renderLoading) return renderLoading();
  if (error && renderError) return renderError(error);

  return (
    <table>
      <thead>{renderHeadRow()}</thead>
      <tbody>{rows.map(renderRow)}</tbody>
    </table>
  );
};

export default List;
