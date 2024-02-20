

function AccountNav() {
  return (
    <nav className='account-nav h-full'>
      <div className='flex flex-col gap-4 w-full h-full'>
        <div>
          Overview
        </div>
        <div className="font-bold">
          Recent Shipments
        </div>
        <div>
          Find
        </div>
      </div>
    </nav>
  );
};

export default AccountNav;
