import { Link } from "react-router";

function HomePage() {
  return (
    <main className="phonebook-home flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-phonebook-title drop-shadow-sm sm:text-6xl">
          Welcome to my Phonebook
        </h1>
        <p className="mt-4 text-lg text-phonebook-title/90 sm:text-xl">
          click here to test it
        </p>
        <p style={{ fontSize: "40px" }}>↓</p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-xl bg-phonebook-button px-8 py-4 text-lg font-semibold text-phonebook-button-text shadow-lg transition-all hover:bg-phonebook-button-hover hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-phonebook-button-ring"
          >
            Welcome
          </Link>
          {/* <Link
            to="/users/new"
            className="inline-flex items-center justify-center rounded-xl bg-phonebook-button px-8 py-4 text-lg font-semibold text-phonebook-button-text shadow-lg transition-all hover:bg-phonebook-button-hover hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-phonebook-button-ring"
          >
            Create account
          </Link> */}
        </div>
      </div>
    </main>
  );
}
export default HomePage;
