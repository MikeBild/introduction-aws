import * as React from 'react';
import Table from '@material-ui/core/Table';
import { TableHead, TableBody, TableRow, TableCell } from '@material-ui/core';

export interface Row {
  id: string;
}

interface TProps {
  isLoading?: boolean;
  error?: Error;
  style: object;
  headerCells: Array<string>;
  rows: Array<Row>;
  renderTableCell?: (field: string, row: Row) => JSX.Element;
}

export const List: React.StatelessComponent<TProps> = ({
  isLoading,
  error,
  style,
  headerCells = [],
  rows = [],
  renderTableCell = (field: string, row: Row) => (<span>{row[field]}</span>)
}) => (
    <Table style={style}>
      <TableHead>
        <TableRow>
          {
            headerCells.map((x, i) => {
              return (
                <TableCell key={i} style={{ textTransform: 'capitalize' }}>{x}</TableCell>
              )
            })
          }
        </TableRow>
      </TableHead>
      <TableBody>
        {
          isLoading &&
          (
            <TableRow>
              <TableCell align={'center'} colSpan={headerCells.length}>Loading</TableCell>
            </TableRow>
          )
        }
        {
          error &&
          (
            <TableRow>
              <TableCell align={'center'} colSpan={headerCells.length}>{error.message}</TableCell>
            </TableRow>
          )
        }
        {!isLoading && !error && rows.map((row: Row) => {
          return (
            <TableRow key={row.id}>
              {
                headerCells.map((x, i) => {
                  return (
                    <TableCell key={i}>{renderTableCell(x, row)}</TableCell>
                  )
                })
              }
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );

export default List;
