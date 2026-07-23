import { Link } from "react-router";


function HomePage() {
  return (
    <main className="page">
      <h1>My Phonebook</h1>
      <p>Choose what you want to do.</p>

      <div className="home-actions">
        <Link to="/users">View all users</Link>


        
        <Link to="/users/new">Add user</Link>

      </div>
    </main>
  );
}

export default HomePage;