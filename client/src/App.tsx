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
                  <td>{user.firstname}</td>
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
