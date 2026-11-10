# List

> Renders a list of rows as a table.

## Setup

```jsx
import List from '@introduction-aws/list';
```

## Example

```jsx
<List
  style={{ width: '100%' }}
  headerCells={['id', 'value']}
  rows={[{id: 1, value: 'Hello World'}]}
  renderTableCell={(field, row) => <span>{row[field]}</span>}
  isLoading={loading}
  error={error}
/>
```