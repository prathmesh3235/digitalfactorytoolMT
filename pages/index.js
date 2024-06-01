import "../src/app/globals.css"
import PhasesComponent from "./phasesComponent"
export default function Home() {
  return (
    <div> 
    <div className="mt-2">
    <div className="text-4xl font-bold text-blue-800 my-6 text-center">
       The Digital Factory Planning Tool
      </div>
    <PhasesComponent/>
    </div>
    </div>
  );
}
