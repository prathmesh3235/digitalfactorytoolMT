// components/Navbar.js
import fraunhaufer_logo from '../public/asset/logo.png';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    setIsLoggedIn(false);
    router.push('/Login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <Image src={fraunhaufer_logo} height={50} width={100} alt="Fraunhofer Logo" />
          <span className="text-[#1F2937] text-xl font-bold text-center">
            The Digital Factory Planning Tool
          </span>
        </div>
        <div>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="btn-secondary hover:bg-red-50 hover:text-red-600 hover:border-red-600"
            >
              Logout
            </button>
          ) : (
            <Link href='/Login'>
              <button className="btn-primary">
                Login
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;