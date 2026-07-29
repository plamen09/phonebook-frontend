import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";

import { createUser, type CreateUserRequest } from "../api/users";

// We keep the form state completely flat so typing works naturally!
type LocalFormState = {
  username: string;
  email: string;
  phonenumber: string;
};

function AddContactPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<LocalFormState>({
    username: "",
    email: "",
    phonenumber: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // This single function now handles all text inputs smoothly
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      // We translate the flat form data into the exact nested structure
      // that your API and Go backend are demanding right here:
      const payload: CreateUserRequest = {
        username: formData.username,
        email: formData.email,
        phone_numbers: [formData.phonenumber],
      };

      await createUser(payload);

      navigate("/users");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Unknown error");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="phonebook-home flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-2xl border-2 border-black bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-3xl font-bold text-black">
          Add user
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="font-medium text-black">
              Name
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              autoComplete="name"
              placeholder="Enter name"
              className="rounded-lg border border-gray-300 px-4 py-3 text-black outline-none focus:ring-2 focus:ring-(--phonebook-button-ring)"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="font-medium text-black">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              autoComplete="email"
              onChange={handleChange}
              placeholder="Enter email"
              className="rounded-lg border border-gray-300 px-4 py-3 text-black outline-none focus:ring-2 focus:ring-(--phonebook-button-ring)"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="phonenumber" className="font-medium text-black">
              Phone number
            </label>
            <input
              id="phonenumber"
              name="phonenumber"
              type="tel"
              value={formData.phonenumber}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="rounded-lg border border-gray-300 px-4 py-3 text-black outline-none focus:ring-2 focus:ring-(--phonebook-button-ring)"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 rounded-lg bg-(--phonebook-button) px-6 py-3 font-semibold text-(--phonebook-button-text) transition hover:bg-(--phonebook-button-hover)"
          >
            {submitting ? "Adding..." : "Add user"}{" "}
          </button>
        </form>
      </div>
    </main>
  );
}
export default AddContactPage;
