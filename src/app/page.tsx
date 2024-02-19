import AccountNav from "../app/components/AccountNav"
import Packages from "../app/components/Packages"

function getPreviousBusinessDay() {
  const date = new Date();
  const dayOfWeek = date.getDay();
  
  if (dayOfWeek === 0) {
      date.setDate(date.getDate() - 2); 
  } else if (dayOfWeek === 1) {
      date.setDate(date.getDate() - 3); 
  } else {
      date.setDate(date.getDate() - 1); 
  }

  const month = date.getMonth() + 1; 
  const day = date.getDate();
  const year = date.getFullYear();

  const formattedDate = `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;

  return formattedDate;
}

export default function Home() {
  const previousBusinessDay = getPreviousBusinessDay(); 
  return (
      <div className="w-full h-full">
          <div className="text-white bg-[#124280] p-4">
              <p className="text-3xl">GLS Tracking</p>
          </div>
          <div className="flex flex-row flex-grow text-black">
              <AccountNav />
              <div className="w-full h-full">
                  <Packages shipmentDate={previousBusinessDay} />
              </div>
          </div>
      </div>
  );
}
