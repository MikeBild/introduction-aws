# List

> Renders a table as list.

## Setup

```jsx
import List from 'cms-webapp-component-list';
```

## Example

```jsx
<List
  rows={[{id: 1, value: 'Hello World'}]}
  renderHeadRow={() => (
    <tr>
      <th>ID</th>
      <th>Value</th>
    </tr>
  )}
  renderRow={({ id, value }) => (
    <tr key={id}>
      <td>ID: {id}</td>
      <td>Value: {value}</td>
    </tr>
  )}
/>
```