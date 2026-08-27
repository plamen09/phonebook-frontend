import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { usersClient } from "../../api/client/user";
import { CreateUserRequest } from "../../api/requests/UserRequest";
import axios from "axios";
import { useAuth } from "../../../auth/AuthContext";

// We keep the form state completely flat so typing works naturally!
type LocalFormState = {
  username: string;
  email: string;
  phonenumber: string;
  password: string;
};

function AddContactPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<LocalFormState>({
    username: "",
    email: "",
    phonenumber: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { isAdmin } = useAuth();
  const [makeAdmin, setMakeAdmin] = useState(false);
  // This single function now handles all text inputs smoothly
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload: CreateUserRequest = {
      username: formData.username,
      email: formData.email,
      phone_numbers: [formData.phonenumber],
      password: formData.password,
      is_admin: isAdmin ? makeAdmin : false,
    };
    try {
      if (isAdmin && makeAdmin) {
        await usersClient.createByAdmin(payload);
      } else {
        await usersClient.create(payload);
      }
      navigate("/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const backendError = error.response?.data?.error ?? "";
        if (backendError.includes("CreateUserRequest.Email")) {
          setError("Please enter a valid email address like example@gmail.com");
        } else if (backendError.includes("CreateUserRequest.Password")) {
          setError("Password must be at least 8 characters.");
        } else {
          setError("Faild to crete user");
        }
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="phonebook-home flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-2xl border-2 border-black bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-3xl font-bold text-black">
          -- Add user --
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="font-medium text-black">
              Name
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              autoComplete="name"
              placeholder="Enter name"
              className="rounded-lg border border-gray-300 px-4 py-3 text-black outline-none focus:ring-2 focus:ring-(--phonebook-button-ring)"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="font-medium text-black">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              autoComplete="email"
              onChange={handleChange}
              placeholder="Enter email "
              className="rounded-lg border border-gray-300 px-4 py-3 text-black outline-none focus:ring-2 focus:ring-(--phonebook-button-ring)"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="phonenumber" className="font-medium text-black">
              Phone number
            </label>
            <input
              id="phonenumber"
              name="phonenumber"
              type="tel"
              value={formData.phonenumber}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="rounded-lg border border-gray-300 px-4 py-3 text-black outline-none focus:ring-2 focus:ring-(--phonebook-button-ring)"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="font-medium text-black">
              Password
            </label>

            <div className="relative flex items-center">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 text-black outline-none focus:ring-2 focus:ring-(--phonebook-button-ring)"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-gray-500 hover:text-gray-700"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-500">
              <p>{error}</p>
            </div>
          )}

          {isAdmin && (
            <div className="flex items-center gap-2 pt-2 border-t mt-4">
              <input
                type="checkbox"
                id="adminCheckbox"
                checked={makeAdmin}
                onChange={(e) => setMakeAdmin(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <label
                htmlFor="adminCheckbox"
                className="text-sm font-bold text-red-600"
              >
                Admin priviliges
              </label>
            </div>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition duration-200 flex justify-center items-center disabled:opacity-50"
          >
            {submitting ? "Adding..." : "Add user"}{" "}
          </button>
        </form>
      </div>
    </div>
  );
}
export default AddContactPage;
