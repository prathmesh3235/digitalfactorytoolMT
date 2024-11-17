import fraunhaufer_logo from "../public/asset/logo.png";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/Login");
  };

  return (
    <nav className="bg-gray-200 p-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <div style={{ position: 'relative', width: '100px', height: '50px' }}>
            <Image
              src={fraunhaufer_logo}
              alt="Fraunhofer Logo"
              fill
              sizes="100px"
              style={{
                objectFit: 'contain'
              }}
            />
          </div>
          <span className="text-black text-xl font-bold text-center">
            The Digital Factory Planning Tool
          </span>
        </div>
        <div>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Logout
            </button>
          ) : (
            <Link href="/Login">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
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