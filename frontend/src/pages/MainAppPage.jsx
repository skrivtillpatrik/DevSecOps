import { Link } from "react-router-dom";

export default function MainAppPage() {
  const modules = [
    { name: "Kalender", path: "/app/calendar" },
    { name: "Anteckningar", path: "/app/notes" },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h1>Välj modul</h1>

      <div style={{ display: "flex", gap: 20 }}>
        {modules.map(m => (
          <Link
            name={`${m.name}Link`}
            key={m.path}
            to={m.path}
            style={{
              padding: 20,
              border: "1px solid #ccc",
              borderRadius: 8,
              textDecoration: "none",
              color: "black",
              width: 150,
              textAlign: "center"
            }}
          >
            {m.name}
          </Link>
        ))}
      </div>
    </div>
  );
}