"use client";

import { useState } from "react";
import { toast } from "sonner";
import { UserPlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { inviteUser } from "@/actions/invite-user";

interface BoardInviteProps {
  boardId: string;
}

export const BoardInvite = ({ boardId }: BoardInviteProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (formData: FormData) => {
    setIsLoading(true);
    // Add boardId to the form data hiddenly
    formData.append("boardId", boardId);
    
    const result = await inviteUser(formData);
    
    setIsLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(result.success);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto">
          <UserPlus className="h-4 w-4 mr-2" />
          Invite
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
        <div className="text-sm font-medium mb-2 text-neutral-600">
          Invite to board
        </div>
        <form action={onSubmit} className="flex flex-col gap-y-4">
          <Input 
            name="email" 
            placeholder="Email address" 
            type="email"
            required
            disabled={isLoading}
          />
          <Button disabled={isLoading} size="sm" className="w-full">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Invite"}
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
};