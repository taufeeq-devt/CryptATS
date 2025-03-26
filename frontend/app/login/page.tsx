"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import "./style.css";
import { usePathname, useRouter } from "next/navigation";

const Page = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const router = useRouter();
  const path = usePathname();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token"); 
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjY4ZDliODU5ZDhkYWE2ZWY3NzhhZjlhIn0sImlhdCI6MTcyMTA5NzAxMX0.qLd3Tu43oZR0PQT4lusgsPGqcIYzU7zlByYnlpkwNhY`,
        },
        body: JSON.stringify(credentials),
      });

      const json = await response.json();
      if (json.success) {
        localStorage.setItem("token", json.token);
        router.push("/");
      } else {
        alert("Login Failed!");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="form-outline mb-4">
          <input
            type="email"
            id="email"
            name="email"
            className="form-control input"
            value={credentials.email}
            onChange={onChange}
            required
          />
          <label className="form-label" htmlFor="email">
            Email address
          </label>
        </div>

        <div className="form-outline mb-4">
          <input
            type="password"
            id="password"
            name="password"
            className="form-control input"
            value={credentials.password}
            onChange={onChange}
            required
          />
          <label className="form-label" htmlFor="password">
            Password
          </label>
        </div>

        <button type="submit" className="btn btn-primary btn-block mb-4">
          Login
        </button>

        <div className="text-center">
          <p>
            Not a member?{" "}
            <a
              className="register"
              onClick={() => router.push("/register")}
              style={{ cursor: "pointer", textDecoration: "underline" }}
            >
              Register
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Page;
