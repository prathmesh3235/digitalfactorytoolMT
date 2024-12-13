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
    router.push('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await login(username, password);
      // data now includes { token, user: { role: 'admin' or something else } }
      const isAdmin = data.user.role === 'admin';

      // Store token and isAdmin in sessionStorage
      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('isAdmin', isAdmin ? 'true' : 'false');
      setIsDialogOpen(true);
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Server error');
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-lg w-96">
          <h2 className="text-3xl mb-6 text-center font-bold text-[#32699B]">Login</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Email address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#32699B] focus:ring-1 focus:ring-[#32699B]"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#32699B] focus:ring-1 focus:ring-[#32699B]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <button
              type="submit"
              className="w-full bg-[#3F8271] text-white py-2 px-4 rounded hover:bg-[#367363] transition duration-200 font-medium"
            >
              Register
            </button>
            
            <div className="text-center text-sm">
              <a href="#" className="text-[#32699B] hover:underline">
                Have you forgotten your password?
              </a>
            </div>
          </div>
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
