import { Route, Routes } from "react-router";
import { useEffect, useState } from "react";

import HomePage from "./pages/HomePage";
import ContactsPage from "./pages/ContactsPage";
import ContactDetailsPage from "./pages/ContactDetailsPage";
import NotFoundPage from "./pages/NotFoundPage";
import AddContactPage from "./pages/AddContactPage";
import type { User } from "./types/users";
// @ts-ignore
import "./App.css";
import EditUserPage from "./pages/EditUserPage";

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function loadUsers(): Promise<void> {
      try {
        const response = await fetch("http://localhost:8080/api/v1/users");

        if (!response.ok) {
          throw new Error("Could not load users");
        }

        const data: User[] = await response.json();
        setUsers(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Unknown error");
        }
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);
  async function DeleteUser(id: number): Promise<void> {
    try {
      const response = await fetch(`http://localhost:8080/api.v/users/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Could not delete user");
      }

      setUsers((currentUsers) => currentUsers.filter((user) => user.ID !== id));
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Unknown error");
      }
    }
  }
  function hadleUserUpdated(updatedUser: User): void {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.ID === updatedUser.ID ? updatedUser : user,
      ),
    );
  }
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route
        path="/users"
        element={
          <ContactsPage
            users={users}
            loading={loading}
            error={error}
            onDeleteUser={DeleteUser}
          />
        }
      />

      <Route path="/users/new" element={<AddContactPage />} />

      <Route path="/users/:id" element={<ContactDetailsPage users={users} />} />
      <Route path="/users/:id/edit" element={<EditUserPage users={users} />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
