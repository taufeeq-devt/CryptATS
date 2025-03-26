"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import "./style.css";
import { usePathname, useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const path = usePathname();

  // State for form data
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials),
      });

      const json = await response.json();
      console.log(json);

      if (json.success) {
        localStorage.setItem("token", json.token);
        router.push("/");
      } else {
        alert("Signup failed!");
      }
    } catch (err) {
      console.error("Error: ", err);
    }
  };

  // Handle input changes
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* Name Input */}
        <div className="form-outline mb-4">
          <input
            type="text"
            id="name"
            name="name"
            className="form-control input"
            value={credentials.name}
            onChange={onChange}
            required
          />
          <label className="form-label" htmlFor="name">
            Name
          </label>
        </div>

        {/* Email Input */}
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

        {/* Password Input */}
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

        {/* Signup Button */}
        <button type="submit" className="btn btn-primary btn-block mb-4">
          Sign Up
        </button>

        {/* Login Link */}
        <div className="text-center">
          <p>
            Already a member?{" "}
            <a
              className="login"
              onClick={() => router.push("/login")}
              style={{ cursor: "pointer", textDecoration: "underline" }}
            >
              Login
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Page;
