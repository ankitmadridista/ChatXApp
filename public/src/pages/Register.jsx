import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from 'styled-components';
import Logo from "../assets/logo.svg";
import axios from "axios";
import { registerRoute } from "../utils/APIRoutes";

function Register() {

  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  }
  );
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("chat-app-user")) {
      navigate("/");
    }
  }, [])

  const toastOptions = {
    position: "bottom-right",
    autoClose: 6000,
    pauseOnHover: true,
    draggable: false,
    theme: "dark",
  }

  const handleValidation = () => {
    const { username, email, password, confirmPassword } = values;
    if (password !== confirmPassword) {
      toast.error("password and confirm password are not matching", toastOptions);
      return false;
    }
    else if (username.length < 3) {
      toast.error("Username should be more than 3 chars", toastOptions);
      return false;
    }
    else if (password.length < 6) {
      toast.error("Password should be equal or more than 6 chars", toastOptions);
      return false;
    }
    else if (email === "") {
      toast.error("Email is required", toastOptions);
      return false;
    }
    return true;
  }

  const handleSubmit = async (e) => {    
    e.preventDefault();
    if (handleValidation()) {
      //api call
      const { username, email, password } = values;
      const { data } = await axios.post(registerRoute, { username, email, password });
      if(data.status === false){
        toast.error(data.msg, toastOptions);
        return false;
      }
      if(data.status === true){
        localStorage.setItem('chat-app-user', JSON.stringify(data.user));
      }
      navigate("/");
    }
    else {

    }
  }

  const handleChange = (e) => {
    e.preventDefault();
    setValues({ ...values, [e.target.name]: e.target.value });
  }

  return <>
    <FormContainer>
      <form onSubmit={(event) => handleSubmit(event)} >
        <div className="brand">
          <img src={Logo} alt="Logo" />
          <h1>Hushline</h1>
        </div>
        <input type="text" placeholder="username" name="username" onChange={e => handleChange(e)} />
        <input type="email" placeholder="email" name="email" onChange={e => handleChange(e)} />
        <input type="password" placeholder="password" name="password" onChange={e => handleChange(e)} />
        <input type="password" placeholder="confirm password" name="confirmPassword" onChange={e => handleChange(e)} />

        <button type="submit">Create User </button>
        <span>Already have an account? <Link to="/Login">Login</Link></span>

      </form>

    </FormContainer>
    <ToastContainer />
  </>;
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  button {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;

export default Register;