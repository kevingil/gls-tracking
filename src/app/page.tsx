import AccountNav from "../app/components/AccountNav"
import Packages from "../app/components/Packages"

export default function Home() {
  return (
    <div className="w-full h-full">
      <div className="text-white bg-[#124280] p-4">
      <p className="text-3xl">GLS Tracking</p>
      </div>
      <div className="flex flex-row flex-grow text-black">

        <AccountNav />
         
        <div className="w-full h-full">
        <p className="text-2xl font-semibold p-4">Shipments</p>
        <Packages/>
        </div>
      </div>
    </div>
  );
}
