import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import type { User } from "../types/users";

type EditUserPageProps = {
    users: User[];
};

function EditUserPage({ users }: EditUserPageProps) {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const user = users.find(
        (currentUser) => currentUser.ID === Number(id)
    );

    const [name, setName] = useState(user?.Name ?? "");
    const [email, setEmail] = useState(user?.Email ?? "");
    const [phoneNumber, setPhoneNumber] = useState(
        user?.phonenumber?.number ?? ""
    );

    if (!user) {
        return <p>User not found</p>;
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!user) {
            return;
        }

        const response = await fetch(
            `http://localhost:8080/api/v1/users/${user.ID}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    phonenumber: phoneNumber,
                }),
            }
        );

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error ?? "Failed to update user");
        }

        navigate(`/users/${user.ID}`);

        window.location.href = `/users/${user.ID}`;
    }

    return (
        <main className="page">
            <h1>Edit user</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name</label>

                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="email">Email</label>

                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="phone">Phone number</label>

                    <input
                        id="phone"
                        type="text"
                        value={phoneNumber}
                        onChange={(event) => setPhoneNumber(event.target.value)}
                    />
                </div>

                <button type="submit">Save changes</button>
            </form>
        </main>
    );
}

export default EditUserPage;