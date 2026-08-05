import React from 'react';
import { Bell, Plus, ChevronDown } from 'lucide-react';

interface TopBarProps {
  organization: {
    name: string;
    logo?: string | null;
  };
  onCreateEvent?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ organization, onCreateEvent }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-end gap-4">
      <button 
        onClick={onCreateEvent}
        className="flex items-center gap-2 bg-[#0F6E56] hover:bg-[#0A5240] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        <Plus className="h-4 w-4" />
        Create event
      </button>
      
      <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>

      <button className="relative text-gray-500 hover:text-gray-700 transition-colors bg-gray-50 border border-gray-200 p-2 rounded-lg">
        <Bell className="h-5 w-5" />
        <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-[#F59E0B] rounded-full border-2 border-white"></span>
      </button>

      <button className="h-9 w-9 rounded-full bg-[#0F6E56] text-white flex items-center justify-center font-bold text-sm">
        LL
      </button>
    </header>
  );
};

export default TopBar;








// import React from 'react';
// import { Bell, ChevronDown, User } from 'lucide-react';

// interface TopBarProps {
//   organization: {
//     name: string;
//     logo?: string | null;
//   };
// }

// const TopBar: React.FC<TopBarProps> = ({ organization }) => {
//   return (
//     <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
//       <div className="flex items-center gap-3">
//         <span className="font-semibold text-gray-800">{organization?.name}</span>
//         <ChevronDown className="h-4 w-4 text-gray-400" />
//       </div>
//       <div className="flex items-center gap-4">
//         <button className="relative text-gray-500 hover:text-gray-700">
//           <Bell className="h-6 w-6" />
//           <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
//         </button>
//         <div className="flex items-center gap-2">
//           <div className="h-8 w-8 rounded-full bg-[#0F6E56] text-white flex items-center justify-center font-bold">
//             <User className="h-4 w-4" />
//           </div>
//           <ChevronDown className="h-4 w-4 text-gray-400" />
//         </div>
//       </div>
//     </header>
//   );
// };

// export default TopBar;