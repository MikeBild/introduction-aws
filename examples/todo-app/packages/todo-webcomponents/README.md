# Web-Components

```jsx
import { List } from '@introduction-aws/todo-webcomponents';
```

## API

```jsx
<List
  headerCells={['id', 'value', 'actions']}
  rows={ [{ id: 'id-xyz', value: 'value-xyz' }]}
  renderTableCell={(field, row) => <span>{row[field]}</span>}
  isLoading={true}
  error={new Error('Custom error!')}
/>
```