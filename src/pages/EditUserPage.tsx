import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router";

import { updateUser } from "../api/users";
import type { User } from "../types/users";

type EditUserPageProps = {
  users: User[];
};

type EditUserForm = {
  name: string;
  email: string;
  phonenumber: string;
};

const emptyForm: EditUserForm = {
  name: "",
  email: "",
  phonenumber: "",
};

function EditUserPage({ users }: EditUserPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const userID = Number(id);

  const user = users.find((currentUser) => currentUser.ID === userID);

  const [formData, setFormData] = useState<EditUserForm>(emptyForm);

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }

    setFormData({
      name: user.Name ?? "",
      email: user.Email ?? "",
      phonenumber: user.phonenumber?.[0]?.number ?? "",
    });
  }, [user]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) {
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const payload: any = {
        name: formData.name,
        email: formData.email,
        Phone_numbers: [ 
          {
          number:formData.phonenumber
          }
        ]
          };

      await updateUser(user.ID, payload);

      window.location.href = `/users/${user.ID}`;
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setSubmitting(false);
    }
  }

  if (!Number.isInteger(userID) || userID <= 0) {
    return <p>Invalid user ID</p>;
  }

  if (!user) {
    return <p>User not found</p>;
  }

  return (
    <main className="page">
      <h1>Edit user</h1>

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>

          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
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
            required
          />
        </div>

        <div>
          <label htmlFor="phonenumber">Phone number</label>

          <input
            id="phonenumber"
            name="phonenumber"
            type="tel"
            value={formData.phonenumber}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save changes"}
        </button>
    
      </form>
    </main>
  );
}

export default EditUserPage;
