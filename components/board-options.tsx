"use client";

import { toast } from "sonner";
import { MoreHorizontal, Trash2, X } from "lucide-react";
import { deleteBoard } from "@/actions/delete-board";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

// 1. Update the Interface
interface BoardOptionsProps {
  id: string;
  isOwner?: boolean; 
}

export const BoardOptions = ({ 
  id,
  isOwner 
}: BoardOptionsProps) => {
  
  const onDelete = async () => {
    const result = await deleteBoard(id);

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Board deleted");
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-auto w-auto p-2" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="px-0 pt-3 pb-3" side="bottom" align="start">
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
          Board actions
        </div>
        <PopoverClose asChild>
          <Button 
            className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600" 
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>
        
        {/* 2. Check isOwner before showing Delete */}
        {isOwner ? (
          <Button
            variant="ghost"
            onClick={onDelete}
            className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm text-red-600 hover:text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete this board
          </Button>
        ) : (
          <div className="px-5 py-2 text-xs text-neutral-500 italic text-center">
             You are a member of this board.
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};