# Web-Components

- [List](#list)
- [InputDialog](#input-dialog)
- [Layout](#layout)

## List

```jsx
import { List, Row } from '@introduction-aws/todo-webcomponents';
```

## API

```jsx
<List
  headerCells={['id', 'value', 'actions']}
  rows={[{ id: 'id-xyz', value: 'value-xyz' }]}
  renderTableCell={(field: string, row: Row) => <span>{row[field]}</span>}
  isLoading={true}
  error={new Error('Custom error!')}
/>
```

## Input Dialog

```jsx
import { InputDialog, Input } from '@introduction-aws/todo-webcomponents';
```

## API

```jsx
<InputDialog
  explanation='Example Explanation'
  title='Example Title'
  isVisible={true}
  onCancel={() => {}}
  onDone={(input: Input) => {}}
/>
```

## Layout

```jsx
import { Layout } from '@introduction-aws/todo-webcomponents';
```

## API

```jsx
<Layout
  name="ExampleApp"
  version="1.0.0">
  <h1>Example Layout</h1>
/>
```
