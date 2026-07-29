import { Route, Routes } from "react-router";
import "./App.css";
import AddContactPage from "./pages/AddContactPage";
import ContactDetailsPage from "./pages/ContactDetailsPage";
import ContactsPage from "./pages/ContactsPage";
import EditUserPage from "./pages/EditUserPage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import { useUsers } from "./hooks/useUser";
function App() {
  const { users, loading, error, removeUser, loadUsers } = useUsers();

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
            onDeleteUser={removeUser}
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
