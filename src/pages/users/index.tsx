import { Link, useNavigate } from "react-router";
import type { User } from "../../types/users";
import { useEffect, useState } from "react";
import { usersClient } from "../../api/client/user";
import { authClient, AuthClient } from "../../api/client/auth";
import { useAuth } from "../../../auth/AuthContext";
export const ContactsPage = () => {
  const { isAuthenticated, user: loggedInUser, isAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const getCanEdit = (targetUser: User) => {
    const loggedInID = loggedInUser?.ID || loggedInUser?.ID;
    return Boolean(
      isAdmin || (loggedInID && Number(loggedInID) === Number(targetUser.ID)),
    );
  };
  useEffect(() => {
    const fetchUsers = async () => {
      setError(null);
      if (!isAuthenticated) {
        setUsers([]);
        return;
      }

      try {
        setLoading(true);
        const resp = await usersClient.getAll();
        setUsers(resp);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isAuthenticated, loggedInUser?.ID]);

  if (loading) {
    return <p>Loading users...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }
  const handleLogout = async () => {
    try {
      await authClient.logout();
    } catch (error) {
      console.error("Logout backend error:", error);
    } finally {
      window.location.href = "/";
    }
  };

  async function onDeleteUser(userToDelete: User) {
    const canEdit = getCanEdit(userToDelete);
    if (!canEdit) {
      setError("You do not have permission to delete this user");
      return;
    }
    try {
      await usersClient.delete(userToDelete.ID);
      setUsers((currentUsers) =>
        currentUsers.filter((user) => user.ID !== userToDelete.ID),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete user");
    }
  }

  async function handleDelete(targetUser: User) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${targetUser.Name ?? "this user"}?`,
    );

    if (!confirmed) {
      return;
    }

    await onDeleteUser(targetUser);
  }

  return (
    <main className="phonebook-home flex min-h-screen flex-col items-center px-6 py-12">
      <div className="w-full max-w-4xl">
        <h1 className="text-center text-5xl font-extrabold tracking-tight text-phonebook-title drop-shadow-sm sm:text-6xl">
          Users
        </h1>

        <button
          type="button"
          onClick={handleLogout}
          className="w-min bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition duration-200 flex justify-center items-center disabled:opacity-50"
        >
          Logout
        </button>

        {isAdmin && (
          <Link
            to="/create-admin"
            className="bg-green-600 hover:bg-green-700 text-white font-right px-4 py-2 rounded-lg"
          >
            + Create Admin
          </Link>
        )}
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
                {users.map((user) => {
                  const canEdit = getCanEdit(user); // Проверяваме за всеки ред в таблицата

                  return (
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

                          {/* Показваме Delete бутона само ако потребителят има права (canEdit) */}
                          {canEdit && (
                            <button
                              type="button"
                              onClick={() => handleDelete(user)}
                              className="inline-flex items-center justify-center rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow transition-all hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
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
