import { Route, Routes } from "react-router";
import "./App.css";
import AddContactPage from "./pages/users/create";
import EditUserPage from "./pages/users/view";
import HomePage from "./pages";
import NotFoundPage from "./pages/NotFoundPage";
import { ContactsPage } from "./pages/users";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="/users" element={<ContactsPage />} />

      <Route path="/users/new" element={<AddContactPage />} />

      <Route path="/users/:id" element={<EditUserPage />} />

      {/* <Route path="/users/:id/edit" element={<EditUserPage />} />  */}

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
