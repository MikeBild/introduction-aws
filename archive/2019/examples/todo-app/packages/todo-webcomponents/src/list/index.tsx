import * as React from 'react';
import { FunctionComponent } from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@material-ui/core';

export interface Row {
  id: string;
}

interface TProps {
  headerCells: Array<string>;
  rows: Array<Row>;
  isLoading?: boolean;
  error?: Error;
  style?: object;
  renderTableCell?: (field: string, row: Row) => JSX.Element;
}

export const List: FunctionComponent<TProps> = ({
  isLoading,
  error,
  style,
  headerCells = [],
  rows = [],
  renderTableCell = (field: string, row: Row) => (
    <span>{(row as any)[field]}</span>
  ),
}) => (
  <Table style={style}>
    <TableHead>
      <TableRow>
        {headerCells.map((x, i) => {
          return (
            <TableCell key={i} style={{ textTransform: 'capitalize' }}>
              {x}
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
    <TableBody>
      {isLoading && (
        <TableRow>
          <TableCell align={'center'} colSpan={headerCells.length}>
            Loading
          </TableCell>
        </TableRow>
      )}
      {error && (
        <TableRow>
          <TableCell align={'center'} colSpan={headerCells.length}>
            {error.message}
          </TableCell>
        </TableRow>
      )}
      {!isLoading &&
        !error &&
        rows.map((row: Row) => {
          return (
            <TableRow key={row.id}>
              {headerCells.map((x, i) => {
                return <TableCell key={i}>{renderTableCell(x, row)}</TableCell>;
              })}
            </TableRow>
          );
        })}
    </TableBody>
  </Table>
);

export default List;
