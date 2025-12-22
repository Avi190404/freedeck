"use client";

import { MoreHorizontal, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteList } from "@/actions/delete-list";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { List } from "@prisma/client";

interface ListOptionsProps {
  data: List;
  onAddCard: () => void;
}

export const ListOptions = ({
  data,
  onAddCard,
}: ListOptionsProps) => {
  const onDelete = () => {
    deleteList(data.boardId, data.id)
      .then(() => toast.success("List deleted"))
      .catch(() => toast.error("Failed to delete list"));
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
          List Actions
        </div>
        <PopoverClose asChild>
           <Button className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600" variant="ghost">
             X
           </Button>
        </PopoverClose>
        <Button
          onClick={onDelete}
          className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm hover:bg-red-50 hover:text-red-600 text-red-600"
          variant="ghost"
        >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete this list
        </Button>
      </PopoverContent>
    </Popover>
  );
};