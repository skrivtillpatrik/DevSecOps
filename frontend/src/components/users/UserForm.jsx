import { useState, useEffect } from "react";

export default function UserForm({ onSubmit, existingUser }) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (existingUser) setName(existingUser.name);
  }, [existingUser]);

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ name });
    setName("");
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      <input
        placeholder="Namn 123"
        id="createUserName"
        name="createUserName"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="submit">
        {existingUser ? "Uppdatera" : "Skapa"}
      </button>
    </form>
  );
}