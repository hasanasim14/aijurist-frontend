"use client";

import { useState } from "react";
import { X } from "lucide-react";

const NotificationBar = () => {
  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    console.log("Notification bar closed");
    // sessionStorage.setItem("NotificationBar", "close");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="sticky top-0 w-full p-2 border-b shadow-sm z-20">
      <div className="flex items-center justify-center relative">
        <div className="text-sm font-medium text-foreground">
          Free Plan Active -{" "}
          <a href="/#" className="underline text-primary hover:text-primary/80">
            Upgrade Plan Now
          </a>
        </div>
        <button
          onClick={handleClose}
          className="absolute right-0 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default NotificationBar;
