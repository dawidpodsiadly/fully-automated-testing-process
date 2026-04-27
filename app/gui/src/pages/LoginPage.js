import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import api from '../api/api';
import Cookies from 'js-cookie';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const response = await api.loginUser({email, password});

      if (response.status === 403) {
        setError('Your account has been deactivated. Please contact your administrator.');
        return;
      }

      if (response.status === 401) {
        setError('Invalid email or password.');
        return;
      }

      const token = response.data.token;
      Cookies.set('token', token, {secure: false, sameSite: 'Lax'});

      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const isAdmin = decodedToken.isAdmin;

      if (isAdmin) {
        navigate('/');
      } else {
        const userId = decodedToken.id;
        navigate(`/userDetails/${userId}`);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 403) {
          setError('Your account has been deactivated. Please contact your administrator.');
        } else if (error.response.status === 401) {
          setError('Invalid email or password.');
        }
      } else {
        setError('Something went wrong. Please try again later.');
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="w-50 bg-white rounded p-3">
        <form onSubmit={handleSubmit}>
          <h2>Login</h2>
          {error && <p className="text-danger">{error}</p>}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="form-control"
              placeholder="Enter email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
