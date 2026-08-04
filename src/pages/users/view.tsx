import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router";
import { Phone } from "../../types/phone";
import { phonesClient } from "../../api/phone";
import { usersClient } from "../../api/usersClient";
import { User } from "../../types/users";
const emptyForm: EditUserForm = {
  name: "",
  email: "",
  phonenumber: [],
};
type EditUserForm = {
  name: string;
  email: string;
  phonenumber: Phone[];
};
function EditUserPage() {
  const [showPhoneForm, setShowPhoneForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<EditUserForm>(emptyForm);
  const [originalForm, setOriginalForm] = useState<EditUserForm>(emptyForm);
  const [error, setError] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | undefined>(undefined);

  const loadData = useCallback(async () => {
    const userID = Number(id);

    if (!Number.isInteger(userID) || userID <= 0) {
      setError("Invalid user ID");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const [loadedUser] = await Promise.all([usersClient.getByID(userID)]);

      const phones = Array.isArray(loadedUser.phonenumber)? loadedUser.phonenumber: []

      const loadedForm: EditUserForm = {
        name: loadedUser.Name,
        email: loadedUser.Email,
        phonenumber: phones.map((phone) => ({
          ...phone,
        })),
      };

      setUser(loadedUser);
      setForm(loadedForm);

      setOriginalForm({
        ...loadedForm,
        phonenumber: loadedForm.phonenumber.map((phone) => ({
          ...phone,
        })),
      });
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not load user information",
      );
    } finally {
      setLoading(false);
    }
  }, [id]);
  useEffect(() => {
    loadData();
  }, [loadData]);

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }
  async function handleDeletePhone(phoneID: number) {
    const phoneToDelete = form.phonenumber.find(
      (phone) => phone.id === phoneID,
    );

    const confirmed = window.confirm(
      `Are you sure you want to delete ${
        phoneToDelete?.number ?? "this phone"
      }?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await phonesClient.delete(phoneID);

      setForm((currentForm) => ({
        ...currentForm,
        phonenumber: currentForm.phonenumber.filter(
          (phone) => phone.id !== phoneID,
        ),
      }));

      setOriginalForm((currentForm) => ({
        ...currentForm,
        phonenumber: currentForm.phonenumber.filter(
          (phone) => phone.id !== phoneID,
        ),
      }));
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not delete phone number",
      );
    } finally {
      setSubmitting(false);
    }
  }
  function handleEditPhoneChange(phoneID: number, newNumber: string) {
    setForm((currentForm) => ({
      ...currentForm,
      phonenumber: currentForm.phonenumber.map((phone) =>
        phone.id === phoneID
          ? {
              ...phone,
              number: newNumber,
            }
          : phone,
      ),
    }));
  }

  function handleCancelEdit() {
    setForm({
      ...originalForm,
      phonenumber: originalForm.phonenumber.map((phone) => ({
        ...phone,
      })),
    });

    setError("");
    setIsEditing(false);
  }
  async function handleSaveEdit() {
    if (!user) {
      setError("User not found");
      return;
    }

    const cleanedName = form.name.trim();
    const cleanedEmail = form.email.trim();

    if (!cleanedName) {
      setError("Name is required");
      return;
    }

    if (!cleanedEmail) {
      setError("Email is required");
      return;
    }

    const invalidPhone = form.phonenumber.some((phone) => !phone.number.trim());
    if (invalidPhone) {
      setError("Phone numbers cannot be empty");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await usersClient.update(user.ID, {
        name: cleanedName,
        email: cleanedEmail,
      });

      await Promise.all(
        form.phonenumber.map((phone) =>
          phonesClient.update(phone.id, {
            number: phone.number.trim(),
          }),
        ),
      );
      await loadData();

      setIsEditing(false);
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "Could not update user",
      );
    } finally {
      setSubmitting(false);
    }
  }
  async function handleAddPhone(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) {
      setError("User not found");
      return;
    }

    const cleanedPhoneNumber = newPhoneNumber.trim();

    if (!cleanedPhoneNumber) {
      setError("Phone number is required");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await phonesClient.create({
        user_id: user.ID,
        number: cleanedPhoneNumber,
      });

      setNewPhoneNumber("");
      setShowPhoneForm(false);

      await loadData();
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "Could not add phone number",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!user) {
    return (
      <main className="phonebook-home flex min-h-screen items-start justify-center px-4 py-10">
        <div className="w-full max-w-xl rounded-2xl bg-white p-8 text-center shadow-xl">
          <h1 className="text-2xl font-bold text-black">User not found</h1>

          <Link
            to="/users"
            className="mt-6 inline-block rounded-md bg-phonebook-button px-4 py-2"
          >
            Back to users
          </Link>
        </div>
      </main>
    );
  }
  const avatarLetter = (isEditing ? form.name : user.Name)
    .trim()
    .charAt(0)
    .toUpperCase();
  return (
    <main className="phonebook-home flex min-h-screen items-start justify-center px-4 py-10">
      <div className="w-full max-w-3xl rounded-2xl border-2 border-white bg-white/80 p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          {/* User information */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-500 text-2xl font-bold text-black shadow">
                {avatarLetter || "?"}
              </div>

              <div className="min-w-0 flex-1">
                {isEditing ? (
                  <input
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleInputChange}
                    disabled={submitting}
                    className="w-full rounded-md border border-black/40 bg-white px-3 py-2 text-2xl font-bold text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    required
                  />
                ) : (
                  <h1 className="wrap-break-word text-2xl font-bold text-black">
                    {form.name}
                  </h1>
                )}

                <p className="mt-1 text-sm text-gray-600">User details</p>
              </div>
            </div>

            <hr className="my-5 border-t-2 border-black/70" />

            <dl className="space-y-4 text-black">
              <div className="flex flex-col sm:flex-row sm:gap-4">
                <dt className="w-32 shrink-0 font-semibold">ID:</dt>

                <dd>{user.ID}</dd>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                <dt className="w-32 shrink-0 font-semibold">Email:</dt>

                <dd className="min-w-0 flex-1">
                  {isEditing ? (
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleInputChange}
                      disabled={submitting}
                      className="w-full rounded-md border border-black/40 bg-white px-3 py-2 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      required
                    />
                  ) : (
                    <a
                      href={`mailto:${form.email}`}
                      className="break-all text-blue-700 hover:underline"
                    >
                      {form.email}
                    </a>
                  )}
                </dd>
              </div>

              <div className="flex flex-col sm:flex-row sm:gap-4">
                <dt className="w-32 shrink-0 font-semibold">Phone numbers:</dt>

                <dd className="min-w-0 flex-1">
                  {isEditing ? (
                    <div className="space-y-2">
                      {form.phonenumber.length ? (
                        form.phonenumber.map((phone) => (
                          <div
                            key={phone.id}
                            className="flex items-center gap-2"
                          >
                            <input
                              type="tel"
                              value={phone.number}
                              onChange={(event) =>
                                handleEditPhoneChange(
                                  phone.id,
                                  event.target.value,
                                )
                              }
                              disabled={submitting}
                              className="min-w-0 flex-1 rounded-md border border-black/40 bg-white px-3 py-2 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                              required
                            />

                            <button
                              type="button"
                              onClick={() => handleDeletePhone(phone.id)}
                              disabled={submitting}
                              aria-label={`Delete ${phone.number}`}
                              title="Delete number"
                              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-lg font-bold text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50"
                            >
                              ×
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">
                          No existing phone numbers
                        </p>
                      )}
                    </div>
                  ) : form.phonenumber?.length ? (
                    <ul className="space-y-2">
                      {form.phonenumber.map((phone) => (
                        <li key={phone.id}>
                          <a
                            href={`tel:${phone.number}`}
                            className="text-blue-700 hover:underline"
                          >
                            {phone.number}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-500">No phone numbers</span>
                  )}
                </dd>
              </div>
            </dl>

            {error && (
              <div
                role="alert"
                className="mt-5 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            {/* Edit save/cancel buttons */}
            {isEditing && (
              <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  disabled={
                    submitting || !form.name.trim() || !form.email.trim()
                  }
                  className="rounded-md bg-phonebook-button px-4 py-2 text-sm font-medium text-phonebook-button-text ring-1 ring-phonebook-button-ring transition-colors hover:bg-phonebook-button-hover disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Saving..." : "Save changes"}
                </button>

                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={submitting}
                  className="rounded-md bg-phonebook-button px-4 py-2 text-sm font-medium text-phonebook-button-text ring-1 ring-phonebook-button-ring transition-colors hover:bg-phonebook-button-hover disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel editing
                </button>
              </div>
            )}
            {/* Add a new number form */}
            {showPhoneForm && !isEditing && (
              <form onSubmit={handleAddPhone} className="mt-6">
                <label
                  htmlFor="new-phone"
                  className="block text-sm font-semibold text-black"
                >
                  New phone number
                </label>

                <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                  <input
                    id="new-phone"
                    type="tel"
                    value={newPhoneNumber}
                    onChange={(event) => setNewPhoneNumber(event.target.value)}
                    placeholder="+359 888 123 456"
                    disabled={submitting}
                    required
                    className="min-w-0 flex-1 rounded-md border border-black/40 bg-white px-3 py-2 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />

                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-md bg-phonebook-button px-4 py-2 text-sm font-medium text-phonebook-button-text ring-1 ring-phonebook-button-ring transition-colors hover:bg-phonebook-button-hover disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? "Adding..." : "Save number"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowPhoneForm(false);
                      setNewPhoneNumber("");
                      setError("");
                    }}
                    disabled={submitting}
                    className="rounded-md bg-phonebook-button px-4 py-2 text-sm font-medium text-phonebook-button-text ring-1 ring-phonebook-button-ring transition-colors hover:bg-phonebook-button-hover"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right action buttons */}
          <div className="flex shrink-0 flex-col gap-3 sm:items-end">
            {!isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(true);
                  setShowPhoneForm(false);
                  setError("");
                }}
                className="w-full rounded-md bg-phonebook-button px-4 py-2 text-sm font-medium text-phonebook-button-text ring-1 ring-phonebook-button-ring transition-colors hover:bg-phonebook-button-hover sm:w-40"
              >
                Edit user
              </button>
            )}

            {!isEditing && (
              <button
                type="button"
                onClick={() => {
                  setShowPhoneForm((current) => !current);
                  setError("");
                }}
                className="w-full rounded-md bg-phonebook-button px-4 py-2 text-sm font-medium text-phonebook-button-text ring-1 ring-phonebook-button-ring transition-colors hover:bg-phonebook-button-hover sm:w-40"
              >
                {showPhoneForm ? "Close form" : "Add number"}
              </button>
            )}

            <Link
              to="/users"
              className="w-full rounded-md bg-phonebook-button px-4 py-2 text-center text-sm font-medium text-phonebook-button-text ring-1 ring-phonebook-button-ring transition-colors hover:bg-phonebook-button-hover sm:w-40"
            >
              Back to users
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
export default EditUserPage;
