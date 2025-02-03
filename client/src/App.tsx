import "./App.css";
import { useEffect, useState } from "react";
import AddUser from "./components/AddUser";
import Login from "./components/Login";

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [connectedUser, setConnectedUser] = useState<User | null>(null);

  const fetchUsers = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/users`)
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(fetchUsers, []);

  // -------------- STEP 2  -------------------------
  const executeScript = (element: HTMLElement) => {
    const scripts = element.getElementsByTagName("script");
    for (const script of scripts) {
      const newScript = document.createElement("script");
      newScript.text = script.innerHTML; // Récupère le contenu du script injecté
      document.body.appendChild(newScript); // Ajoute le script au DOM
    }
  };

  useEffect(() => {
    const table = document.getElementById("users-table");
    if (table) {
      executeScript(table);
    }
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  }, [executeScript]);
  // -------------- // STEP 2  -------------------------

  return (
    <>
      <main>
        <section className="section_container">
          <h2>Ajouter un utilisateur</h2>
          <AddUser />
        </section>
        <section className="section_container">
          <h2>Se connecter</h2>
          <Login
            connectedUser={connectedUser}
            setConnectedUser={setConnectedUser}
          />
        </section>
        {users && users.length > 0 ? (
          <table id="users-table">
            <caption>Liste des utilisateurs</caption>
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Firstname</th>
                <th scope="col">Lastname</th>
                <th scope="col">Email</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <th scope="row">{user.id}</th>
                  {/* -----------  STEP 2  ----------------  */}
                  {/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
                  <td dangerouslySetInnerHTML={{ __html: user.firstname }} />
                  {/* -----------  // STEP 2  ----------------  */}
                  <td>{user.lastname}</td>
                  <td>{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>pas de données à afficher</p>
        )}
      </main>
    </>
  );
}

export default App;
