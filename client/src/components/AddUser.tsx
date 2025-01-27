import { useState } from "react";
import "./components.css";
import { toast } from "react-toastify";

const AddUser = () => {
  const [userInfos, setUserInfos] = useState({});

  // fonction pour remplir le state lié au formulaire
  const handleFillForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfos({ ...userInfos, [e.target.name]: e.target.value });
  };

  const handleAddUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfos),
    }).then((res) => {
      if (res.status === 201) {
        toast.success("L'utilsateur à bien été rajouté ");
      } else if (res.status === 401) {
        toast.error("Vous n'avez pas le droit d'effectuer cette action !");
      } else {
        toast.error("Un problème est survenu, veuillez réessayer");
      }
    });
  };

  return (
    <form className="add_user_form" onSubmit={handleAddUser}>
      <label htmlFor="firstname">
        firstname
        <input type="text" name="firstname" onChange={handleFillForm} />
      </label>
      <label htmlFor="lastname">
        lastname
        <input type="text" name="lastname" onChange={handleFillForm} />
      </label>
      <label htmlFor="email">
        email
        <input type="text" name="email" onChange={handleFillForm} />
      </label>
      <label htmlFor="password">
        password
        <input type="text" name="password" onChange={handleFillForm} />
      </label>
      <input type="submit" value={"Ajouter"} />
    </form>
  );
};

export default AddUser;
