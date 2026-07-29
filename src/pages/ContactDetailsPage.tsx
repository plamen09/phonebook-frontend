import { useState, type FormEvent } from "react";
import { Link, useParams } from "react-router";

import type { User } from "../types/users";
import { createPhone } from "../api/phone";

type ContactDetailsPageProps = {
  users: User[];
};

function ContactDetailsPage({ users }: ContactDetailsPageProps) {
  const { id } = useParams<{ id: string }>();

  const [showPhoneForm, setShowPhoneForm] = useState(false);
  const [phonenumber, setPhoneNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const user = users.find((currentUser) => currentUser.ID === Number(id));
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  const [editPhones, setEditPhones] = useState<
    Array<{
      ID: number;
      number: string;
    }>
  >([]);
  function handleCancelEdit() {
    if (!user) {
      return;
    }

    setEditName(user.Name);
    setEditEmail(user.Email);

    setEditPhones(
      user.phonenumber?.map((phone) => ({
        ID: phone.ID,
        number: phone.number,
      })) ?? [],
    );

    setError("");
    setIsEditing(false);
  }

  if (user) {
    return (
      <main className="phonebook-home flex min-h-screen items-start justify-center px-4 py-10">
        <div className="w-full max-w-3xl rounded-2xl border-2 border-white bg-white/80 p-6 shadow-xl backdrop-blur-sm">
          <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
            {/* User information */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-500 text-2xl font-bold text-black shadow">
                  {(isEditing ? editName : user.Name).charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(event) => setEditName(event.target.value)}
                      disabled={submitting}
                      className="w-full rounded-md border border-black/40 bg-white px-3 py-2 text-2xl font-bold text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      required
                    />
                  ) : (
                    <h1 className="break-words text-2xl font-bold text-black">
                      {user.Name}
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
                        type="email"
                        value={editEmail}
                        onChange={(event) => setEditEmail(event.target.value)}
                        disabled={submitting}
                        className="w-full rounded-md border border-black/40 bg-white px-3 py-2 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        required
                      />
                    ) : (
                      <a
                        href={`mailto:${user.Email}`}
                        className="break-all text-blue-700 hover:underline"
                      >
                        {user.Email}
                      </a>
                    )}
                  </dd>
                </div>

                <div className="flex flex-col sm:flex-row sm:gap-4">
                  <dt className="w-32 shrink-0 font-semibold">
                    Phone numbers:
                  </dt>

                  <dd className="min-w-0 flex-1">
                    {isEditing ? (
                      <div className="space-y-2">
                        {editPhones.length ? (
                          editPhones.map((phone) => (
                            <input
                              key={phone.ID}
                              type="tel"
                              value={phone.number}
                              onChange={(event) =>
                                handleEditPhoneChange(
                                  phone.ID,
                                  event.target.value,
                                )
                              }
                              disabled={submitting}
                              className="w-full rounded-md border border-black/40 bg-white px-3 py-2 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                              required
                            />
                          ))
                        ) : (
                          <p className="text-gray-500">
                            No existing phone numbers
                          </p>
                        )}
                      </div>
                    ) : user.phonenumber?.length ? (
                      <ul className="space-y-2">
                        {user.phonenumber.map((phone) => (
                          <li key={phone.ID ?? phone.number}>
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
                      submitting || !editName.trim() || !editEmail.trim()
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
                      value={phonenumber}
                      onChange={(event) => setPhoneNumber(event.target.value)}
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
                        setPhoneNumber("");
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
}
export default ContactDetailsPage;
