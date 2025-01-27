import { useState } from "react";
import "./components.css";
import { toast } from "react-toastify";
import type { User } from "../App";

interface LoginProps {
  connectedUser: User | null;
  setConnectedUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const Login = ({ connectedUser, setConnectedUser }: LoginProps) => {
  const [loginInfos, setLoginInfos] = useState({});

  // fonction pour remplir le state lié au formulaire
  const handleFillForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginInfos({ ...loginInfos, [e.target.name]: e.target.value });
  };

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginInfos),
    })
      .then((res) => {
        if (res.status === 200) {
          toast.success("Bienvenue");
        } else {
          toast.error("Un problème est survenu, veuillez réessayer");
        }
        return res.json();
      })
      .then((data) => {
        console.info(data);
        setConnectedUser(data);
      });
  };
  return (
    <>
      {connectedUser === null ? (
        <p>Pas connecté</p>
      ) : (
        <p>{`connecté en tant que : ${connectedUser?.firstname}`}</p>
      )}
      <form className="login_form" onSubmit={handleLogin}>
        <label htmlFor="email">
          email
          <input type="text" name="email" onChange={handleFillForm} />
        </label>
        <label htmlFor="password">
          password
          <input type="text" name="password" onChange={handleFillForm} />
        </label>
        <input type="submit" value={"Login"} />
      </form>
    </>
  );
};

export default Login;
