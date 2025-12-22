export default function UserList({ users, onEdit, onDelete }) {
  return (
    <ul>
      {users.map((u) => (
        <li key={u.id}>
          {u.name}
          <button onClick={() => onEdit(u)}>Ändra</button>
          <button onClick={() => onDelete(u.id)}>Ta bort</button>
        </li>
      ))}
    </ul>
  );
}