import { useEffect, useState } from "react";

import {
  deleteUser,
  getUsers,
} from "../api/users";
import type { User } from "../types/users";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadUsers(): Promise<void> {
    try {
      setLoading(true);
      setError("");

      const loadedUsers = await getUsers();
      setUsers(loadedUsers);
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not load users",
      );
    } finally {
      setLoading(false);
    }
  }

  async function removeUser(id: number): Promise<void> {
    try {
      setError("");

      await deleteUser(id);

      setUsers((currentUsers) =>
        currentUsers.filter((user) => user.ID !== id),
      );
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not delete user",
      );
    }
  }

  function addUser(createdUser: User): void {
    setUsers((currentUsers) => [
      ...currentUsers,
      createdUser,
    ]);
  }

  function updateUserInState(updatedUser: User): void {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.ID === updatedUser.ID ? updatedUser : user,
      ),
    );
  }

  useEffect(() => {
    void loadUsers();
  }, []);

  return {
    users,
    loading,
    error,
    loadUsers,
    removeUser,
    addUser,
    updateUserInState,
  };
}