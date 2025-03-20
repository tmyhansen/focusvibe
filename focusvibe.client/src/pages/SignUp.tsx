import React, { useState } from "react";
import Form from "../components/Form";

interface User {
  userName: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegisterClick = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const newUser: User = { userName, email, password };

    try {
      const response = await fetch("/api/focusapp/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        alert("User signed up successfully");
      } else {
        alert("Failed to sign up user");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error occurred while signing up the user");
    }
  };

  return (
    <Form
      title="Sign Up"
      inputs={[
        { id: "userName", label: "User name", type: "text", value: userName, onChange: (e) => setUserName(e.target.value), required: true },
        { id: "email", label: "Email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true },
        { id: "password", label: "Password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true },
        { id: "confirmPassword", label: "Confirm Password", type: "password", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), required: true },
      ]}
      errorMessage={error}
      buttonText="Sign Up"
      onSubmit={handleRegisterClick}
    />
  );
};

export default SignUp;
