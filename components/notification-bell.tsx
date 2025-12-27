"use client";

import { useState, useEffect } from "react";
import { Bell, Check, X, Mail } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { respondInvite } from "@/actions/respond-invite";
import { getNotifications } from "@/actions/get-notifications"; 

interface NotificationType {
    id: string;
    senderName: string;
    entityTitle: string;
    createdAt: Date;
}

export const NotificationBell = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch notifications when popover opens
  useEffect(() => {
    if (isOpen) {
        setIsLoading(true);
        getNotifications().then((data) => {
            setNotifications(data);
            setIsLoading(false);
        });
    }
  }, [isOpen]);

  const onRespond = async (id: string, accept: boolean) => {
    // Optimistic update: remove from list immediately
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    
    const result = await respondInvite(id, accept);
    if (result.error) {
        toast.error(result.error);
    } else {
        toast.success(result.success);
        router.refresh(); 
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-neutral-600 dark:text-neutral-200">
          <Bell className="h-5 w-5" />
          {notifications.length > 0 && (
             <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-600 animate-pulse" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end" sideOffset={10}>
        <div className="p-4 font-medium border-b text-sm flex items-center gap-x-2">
            <Mail className="h-4 w-4" />
            Notifications
        </div>
        <div className="flex flex-col max-h-[300px] overflow-y-auto">
           {isLoading && <div className="p-4 text-center text-xs text-muted-foreground">Checking for invites...</div>}
           
           {!isLoading && notifications.length === 0 && (
              <div className="p-8 text-center text-xs text-muted-foreground flex flex-col items-center gap-y-2">
                 <Bell className="h-8 w-8 opacity-20" />
                 No new notifications
              </div>
           )}

           {notifications.map((n) => (
             <div key={n.id} className="p-4 border-b last:border-0 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition">
                <p className="text-sm mb-3">
                   <span className="font-bold">{n.senderName}</span> invited you to join <span className="font-bold text-indigo-600">{n.entityTitle}</span>
                </p>
                <div className="flex items-center gap-x-2">
                   <Button 
                      onClick={() => onRespond(n.id, true)}
                      size="sm" 
                      className="w-full bg-green-600 hover:bg-green-700 text-white h-8"
                   >
                      <Check className="h-4 w-4 mr-1" /> Accept
                   </Button>
                   <Button 
                      onClick={() => onRespond(n.id, false)}
                      size="sm" 
                      variant="outline" 
                      className="w-full h-8"
                   >
                      <X className="h-4 w-4 mr-1" /> Decline
                   </Button>
                </div>
             </div>
           ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};