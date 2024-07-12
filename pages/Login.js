import { useState } from 'react';
import { useRouter } from 'next/router';
import { login } from '../utils/users';
import Navbar from './Navbar';
import SuccessDialog from './SuccessDialog';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    router.push('/'); // Redirect to home page or any other page
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await login(username, password);
      sessionStorage.setItem('token', data.token);
      setIsDialogOpen(true);
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Server error');
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
          <h2 className="text-3xl mb-6 text-center">Login</h2>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <div className="mb-6">
            <label className="block mb-2 text-gray-600">Username</label>
            <input
              type="text"
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-gray-600">Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
      <SuccessDialog
        open={isDialogOpen}
        handleClose={handleDialogClose}
        message="Logged in Successfully"
      />
    </>
  );
};

export default Login;
