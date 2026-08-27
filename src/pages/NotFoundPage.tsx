import { Link } from "react-router";

function NotFoundPage() {
  return (
    <main>
      <h1>404</h1>
      <p>Page not found.</p>

      <Link to="/"
className="inline-flex items-center justify-center rounded-xl bg-phonebook-button px-8 py-4 text-lg font-semibold text-phonebook-button-text shadow-lg transition-all hover:bg-phonebook-button-hover hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-phonebook-button-ring"
      >Go back home 
    </Link>
    </main>
  );
}

export default NotFoundPage;