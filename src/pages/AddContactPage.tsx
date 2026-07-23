import {
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { Link, useNavigate } from "react-router";


type NewUser = {
  username: string;
  email: string;
  phonenumber: string;
};

function AddContactPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<NewUser>({
    username: "",
    email: "",
    phonenumber: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

      const response = await fetch(
        "http://localhost:8080/api/v1/create-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Could not create user");
      }

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
    <div>
      <h1>Add user</h1>

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit} autoComplete="on">
        <div>
          <label htmlFor="username">Name</label>
          <input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            autoComplete="name"
            required
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />
        </div>

        <div>
          <label htmlFor="phonenumber">phonenumber</label>
          <input
            id="phonenumber"
            name="phonenumber"
            type="tel"
            value={formData.phonenumber}
            onChange={handleChange}
            autoComplete="tel"
            required
          />
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? "Adding..." : "Add user"}
        </button>
      </form>
    </div>
  );
}

export default AddContactPage;