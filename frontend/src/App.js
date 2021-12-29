import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import AddReview from './components/add-review';
import Login from './components/login';
import RestaurantsList from './components/restaurants-list';
import Restaurant from './components/restaurant';
import './App.css';

function App() {
  const [user, setUser] = React.useState(null);

  async function login(user = null) {
    setUser(user);
    console.log("User logged in. User: ", user)
  }

  async function logout() {
    setUser(null);
    console.log("User logged out. User: ", null)
  }

  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <Link to={"/"} className="navbar-brand">
          Restaurant Reviews
        </Link>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/"} className="btn nav-link">
              Restaurants
            </Link>
          </li>
          <li className="nav-item">
            {user ? (
              <button onClick={logout} className="btn nav-link" style={{ cursor: 'pointer' }}>
                Logout | {user.name}
              </button>
            ) : (
              <Link to={"/login"} className="btn nav-link">
                Login
              </Link>
            )}
          </li>
        </div>
      </nav>

      <div className="container mt-3">
        <Routes>
          <Route index element={<RestaurantsList />} />
          <Route path="/restaurants/:id/review" element={<AddReview user={user} />} />
          <Route path="/restaurants/:id" element={<Restaurant user={user} />} />
          <Route exact path="/login" element={<Login login={login} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
