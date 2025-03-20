import React, { useState } from "react";
import Form from "../components/Form";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLoginClick = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Logging in:", { email, password });
  };

  return (
    <Form
      title="Login"
      inputs={[
        { id: "email", label: "Email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true },
        { id: "password", label: "Password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true },
      ]}
      errorMessage={error}
      buttonText="Login"
      onSubmit={handleLoginClick}
    />
  );
};

export default Login;
