import "../src/app/globals.css"
import PhasesComponent from "./phasesComponent"
import Navbar from "./Navbar";

export default function Home() {
  return (
    <div> 
      <Navbar />
    <div className="mt-2">
    <div className="text-4xl font-bold text-blue-800 my-6 text-center">
       
      </div>
    <PhasesComponent/>
    </div>
    </div>
  );
}
