import Link from 'next/link';

function Nav() {
  return (
    <nav className='bg-gray-50 h-full'>
      <ul>
        <li>
          Todays Shipments 
        </li>
        <li>
          Track Shipment
        </li>
        <li>
          Find
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
