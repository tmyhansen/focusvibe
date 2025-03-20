import React, { useState } from "react";
import Form from "../components/Form";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginClick = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/Auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        alert("Failed to login");
      }

      const data = await response.json();

      localStorage.setItem("token", data.token);

      setIsLoggedIn(true);
    } catch (error) {
      setError("An error occurred");
    }
  };

  return (
    <div>
      {!isLoggedIn ? (
        <Form
          title="Login"
          inputs={[
            {
              id: "email",
              label: "Email",
              type: "email",
              value: email,
              onChange: (e) => setEmail(e.target.value),
              required: true,
            },
            {
              id: "password",
              label: "Password",
              type: "password",
              value: password,
              onChange: (e) => setPassword(e.target.value),
              required: true,
            },
          ]}
          errorMessage={error}
          buttonText="Login"
          onSubmit={handleLoginClick}
        />
      ) : (
        <div>My focus session</div>
      )}
    </div>
  );
};

export default Login;
