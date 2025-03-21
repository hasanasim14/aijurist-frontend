// "use client";

// import { useState, useEffect } from "react";
// import type { User } from "@/lib/utils";
// import { Globe, Lightbulb, BookOpen } from "lucide-react";
// import { Card, CardContent } from "@/components/ui/card";

// const icons = [Globe, Lightbulb, BookOpen];

// export default function Header() {
//   const [user, setUser] = useState<User | null>(null);

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const userData = sessionStorage.getItem("user");
//       setUser(userData ? JSON.parse(userData) : null);
//     }
//   }, []);

//   return (
//     <>
//       <div className="w-full max-w-7xl mx-auto pt-12 pb-8 px-4">
//         <div className="text-center flex flex-col items-center justify-center mb-10">
//           <h1 className="text-4xl md:text-5xl font-bold mb-2">
//             <span>
//               Hi there,{" "}
//               <span className="text-purple-600">
//                 {user?.firstName || "User"}
//               </span>
//             </span>
//           </h1>
//           <h2 className="text-3xl md:text-4xl font-bold mb-4">
//             <span>
//               What would you{" "}
//               <span className="text-blue-600">like to know?</span>
//             </span>
//           </h2>
//           <p className="text-gray-500 text-lg max-w-2xl mx-auto">
//             Use one of the most common prompts below or use your own to begin
//           </p>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
//           {[1, 2, 3].map((item, index) => {
//             const Icon = icons[index % icons.length];
//             return (
//               <Card
//                 key={item}
//                 className="flex flex-col items-center p-6 shadow-sm rounded-xl bg-white hover:shadow-md transition-shadow duration-200 cursor-pointer border border-gray-100"
//               >
//                 <div className="mb-4">
//                   <Icon
//                     size={40}
//                     className="text-gray-700"
//                     aria-label={`Icon for Card ${item}`}
//                   />
//                 </div>
//                 <CardContent className="text-center p-0 w-full">
//                   <h3 className="text-xl font-semibold mb-2">Card {item}</h3>
//                   <p className="text-gray-500">
//                     This is a sample text for card {item}.
//                   </p>
//                 </CardContent>
//               </Card>
//             );
//           })}
//         </div>
//       </div>
//     </>
//   );
// }

import type React from "react";

interface HeaderProps {
  user?: {
    firstName?: string;
  };
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  return (
    <div className="w-full max-w-5xl mx-auto pt-8 pb-6 px-4">
      <div className="text-center flex flex-col items-center justify-center mb-8">
        <h1 className="text-3xl md:text-5xl font-bold mb-2">
          <span>
            Hi there,{" "}
            <span className="text-purple-600">{user?.firstName || "User"}</span>
          </span>
        </h1>
        <h2 className="text-2xl md:text-4xl font-bold mb-3">
          <span>
            What would you <span className="text-blue-600">like to know?</span>
          </span>
        </h2>
        <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
          Use one of the most common prompts below or use your own to begin
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {/* Prompts will be rendered here */}
      </div>
    </div>
  );
};

export default Header;
