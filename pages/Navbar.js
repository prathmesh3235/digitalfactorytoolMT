import fraunhaufer_logo from '../public/asset/logo.png'
import Image from 'next/image';
import Link from 'next/link';

const Navbar = () => {
    return (
      <nav className="bg-gray-500 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-10rem">
            <Image src={fraunhaufer_logo} height={100} width={200}/>
            <span className="text-white text-xl font-bold text-center ">The Digital Factory Planning Tool</span>
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
  