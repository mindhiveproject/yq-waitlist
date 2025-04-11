"use client";
import { SetStateAction, useState } from "react";
import clsx from "clsx";
import { Client } from "@notionhq/client";
import { Dispatch } from "react";

const notion = new Client({
  auth: process.env.NOTION_KEY,
});

type navStages = "start" | "form" | "success";

export default function Home() {
  const [navStage, setNavStage] = useState<navStages>("start");

  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <div className="text-center d-flex flex-column align-items-center">
        <h3 className="mt-5">
          <span className="fw-light">You: </span>Quantified
        </h3>
        <p className="w-75 mb-5">
          We’re building a platform for creative, multimodal data representations
          of biometric data.
        </p>
      </div>
      <div className="w-100 position-fixed bottom-0 mb-4 d-flex flex-column align-items-center text-center">
        {navStage === "start" && (
          <button
            className="btn btn-primary btn-outline-dark text-white"
            onClick={() => setNavStage("form")}
          >
            Join the waitlist
          </button>
        )}
        {navStage === "form" && <WaitlistForm setNavStage={setNavStage} />}
        {navStage === "success" && (
          <div className="d-flex flex-column align-items-center ms-5 me-5">
            <p className="text-primary">
              Thank you for joining the waitlist! We will get in touch soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function RoleButton({
  role,
  selectedRole,
  setSelectedRole,
}: {
  role: string;
  selectedRole: string | undefined;
  setSelectedRole: (role: string | undefined) => void;
}) {
  const style = clsx(
    "btn btn-outline-dark m-1",
    selectedRole === role ? "active" : ""
  );

  return (
    <button
      className={style}
      onClick={() => setSelectedRole(role)}
      type="button"
    >
      {role}
    </button>
  );
}

function WaitlistForm({
  setNavStage,
}: {
  setNavStage: Dispatch<SetStateAction<navStages>>;
}) {
  const roles = ["Educator", "Artist", "Scientist"];

  const [selectedRole, setSelectedRole] = useState<string | undefined>(
    undefined
  );

  const [email, setEmail] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>(
    "Please select a role"
  );

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    if (!selectedRole) {
      setErrorMessage("Please select a role");
      setIsSubmitting(false);
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email");
      setIsSubmitting(false);
      return;
    }

    const res = await fetch("/api/notion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, selectedRole }),
    });

    if (!res.ok || res.status !== 200) {
      console.error("Error submitting form");
      setErrorMessage("There was an error submitting the form.");
      setIsSubmitting(false);
      return;
    }
    
    setNavStage("success");
  }

  if (isSubmitting) {
    return (
      <div className="d-flex flex-column align-items-center">
        <p className="placeholder-wave text-primary">Submitting...</p>
      </div>
    );
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="d-flex flex-column align-items-center"
    >
      {<p className="text-body-tertiary mb-0">{errorMessage}</p>}
      <div className="d-flex w-100 justify-content-center mb-1">
        {roles.map((role) => (
          <RoleButton
            key={role}
            role={role}
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
          />
        ))}
      </div>
      <div className="d-flex w-50 mt-0 w-100">
        <input
          className="form-control"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <button
          className={clsx("btn btn-outline-dark btn-secondary ms-n1")}
          type="submit"
        >
          Submit
        </button>
      </div>
    </form>
  );
}

// Utility
const validateEmail = (email: String) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};
