import { Link, useParams } from "react-router";
import type { User } from "../types/users";

type ContactDetailsPageProps = {
  users: User[];
};

function ContactDetailsPage({
  users,
}: ContactDetailsPageProps) {
  const { id } = useParams<{ id: string }>();

  const user = users.find(
    (currentUser) => currentUser.ID === Number(id)
  );

  if (!user) {
    return (
      <main className="page">
        <div className="details-card">
          <h1>User not found</h1>

          <Link className="secondary-button" to="/users">
            Back to users
          </Link>
        </div>
      </main>
    );
  }

  const displayName = user.Name ?? "Unknown user";

  return (
    <main className="page">
      <div className="details-card">
        <div className="details-header">
          <div className="avatar">
            {displayName.charAt(0).toUpperCase()}
          </div>

          <div>
            <h1>{displayName}</h1>
            <p>User details</p>
          </div>
        </div>

        <div className="details-content">
          <div className="detail-row">
            <span className="detail-label">ID</span>
            <span>{user.ID}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Email</span>

            <a href={`mailto:${user.Email}`}>
              {user.Email}
            </a>
          </div>

          <div className="detail-row">
            <span className="detail-label">Phonenumber</span>

            {user.phonenumber?.number ? (
              <a href={`tel:${user.phonenumber.number}`}>
                {user.phonenumber.number}
              </a>
            ) : (
              <span>No phone number</span>
            )}
          </div>
        </div>

        <div className="details-actions">
          <Link
            className="primary-button"
            to={`/users/${user.ID}/edit`}
          >
            Edit user
          </Link>

          <Link className="secondary-button" to="/users">
            Back to users
          </Link>
        </div>
      </div>
    </main>
  );
}

export default ContactDetailsPage;