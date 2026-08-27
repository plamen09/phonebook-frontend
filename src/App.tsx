import { Navigate, Outlet, Route, Routes } from "react-router";
import AddContactPage from "./pages/users/create";
import EditUserPage from "./pages/users/view";
import HomePage from "./pages";
import NotFoundPage from "./pages/NotFoundPage";
import { ContactsPage } from "./pages/users";
import Login from "./pages/users/login";
import ProtectedRoute from "../ProtectedRoute";
import { useAuth } from "../auth/AuthContext";

export const AdminRoute = () => {
  const { isAdmin, loading } = useAuth();
  if (loading) return <p>loading ...</p>;
  return isAdmin ? <Outlet /> : <Navigate to="/users" replace />;
};
const publicRoutes = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/users/new",
    element: <AddContactPage />,
  },
];
const protectedRoutes = [
  {
    path: "/users",
    element: <ContactsPage />,
  },

  {
    path: "/users/:id",
    element: <EditUserPage />,
  },
];

function App() {
  return (
    <Routes>
      {publicRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}

      <Route element={<AdminRoute />}>
        <Route path="/create-admin" element={<AddContactPage />} />
      </Route>

      {protectedRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={<ProtectedRoute>{route.element}</ProtectedRoute>}
        />
      ))}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
