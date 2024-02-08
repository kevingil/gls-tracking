import Image from "next/image";
import AccountNav from "./components/AccountNav"



export default function Home() {
  return (
    <div className="w-full h-max">
      
      <div className="text-white bg-[#124280] p-4">
      <p className="text-3xl">GLS Tracking</p>
      </div>

      <div className="flex h-full w-full flex-row text-black">
        <AccountNav />
         
        <div className="w-full h-full">
        <p className="text-2xl">Shipments</p>

        </div>

      </div>

    </div>
  );
}
