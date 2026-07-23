import { Link } from "react-router";
import type { User } from "../types/users";

type ContactsPageProps = {
  users: User[];
  loading: boolean;
  error: string;
  onDeleteUser: (id: number) => Promise<void>;
};

function ContactsPage({
  users,
  loading,
  error,
  onDeleteUser,
}: ContactsPageProps) {
  if (loading) {
    return <p>Loading users...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  async function handleDelete(id: number, username?: string) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${username ?? "this user"}?`
    );

    if (!confirmed) {
      return;
    }

    await onDeleteUser(id);
  }

  return (
    <main className="page">
      <h1>Users</h1>

      <Link to="/">Back to home</Link>

      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Phone number</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.ID}>
              <td>{user.ID}</td>
              <td>{user.Name}</td>

              <td>
                {user.phonenumber?.number ?? "No phone number"}
              </td>

              <td>
                <Link to={`/users/${user.ID}`}>View</Link>

                <button
                  type="button"
                  className="delete-button"
                  onClick={() => handleDelete(user.ID, user.Name)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

export default ContactsPage;