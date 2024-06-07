import fraunhaufer_logo from '../public/Fraunhofer_Logo.png'
import Link from 'next/link';

const Navbar = () => {
    return (
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img src= {fraunhaufer_logo} alt="Logo" className="h-8 w-8 mr-2" />
            <span className="text-white text-xl font-bold">The Digital Factory Planning Tool</span>
          </div>
          <div>
            <Link href='/admin'>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Login
            </button>
            </Link>
          </div>
        </div>
      </nav>
    );
  };
  
  export default Navbar;
  