import { Link } from "react-router";
import type { User } from "../../types/users";
import { useEffect, useState } from "react";
import { usersClient } from "../../api/usersClient";

export const ContactsPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);

      try {
        const resp = await usersClient.getAll();
        setUsers(resp);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <p>Loading users...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  async function onDeleteUser(id: number) {
    try {
      await usersClient.delete(id);
      setUsers((currentUsers) => currentUsers.filter((user) => user.ID !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete user");
    }
  }

  async function handleDelete(id: number, username?: string) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${username ?? "this user"}?`,
    );

    if (!confirmed) {
      return;
    }

    await onDeleteUser(id);
  }

  return (
    <main className="phonebook-home flex min-h-screen flex-col items-center px-6 py-12">
      <div className="w-full max-w-4xl">
        <h1 className="text-center text-5xl font-extrabold tracking-tight text-phonebook-title drop-shadow-sm sm:text-6xl">
          Users
        </h1>

        <div className="mt-6 flex justify-center">
          <Link
            to="/"
            className="text-base font-medium text-black underline underline-offset-4 hover:opacity-80"
          >
            Back to home
          </Link>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-white bg-white shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-black">
                    ID
                  </th>
                  <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-black">
                    Username
                  </th>
                  <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-black">
                    Phone number
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider text-black">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.ID}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 text-black">{user.ID}</td>
                    <td className="px-6 py-4 text-black">{user.Name}</td>
                    <td className="px-6 py-4 text-black">
                      {user.phonenumber?.[0]?.number ?? "No phone number"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <Link
                          to={`/users/${user.ID}`}
                          className="inline-flex items-center justify-center rounded-lg bg-phonebook-button px-4 py-2 text-sm font-semibold text-black shadow transition-all hover:bg-phonebook-button-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-phonebook-button-ring"
                        >
                          View
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(user.ID, user.Name)}
                          className="inline-flex items-center justify-center rounded-lg bg-phonebook-button px-4 py-2 text-sm font-semibold text-black shadow transition-all hover:bg-phonebook-button-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-phonebook-button-ring"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-8 text-center text-black"
                    >
                      No users yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
};
