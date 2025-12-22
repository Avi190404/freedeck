import { Board } from "@prisma/client";
import { BoardTitleForm } from "./board-title-form";
import { BoardOptions } from "./board-options";

interface BoardNavbarProps {
  data: Board;
}

export const BoardNavbar = async ({
  data
}: BoardNavbarProps) => {
  return (
    <div className="w-full h-14 px-6 flex items-center justify-between gap-x-4 text-foreground bg-background/50 backdrop-blur-sm border-b">
      <BoardTitleForm data={data} />
      
      <div className="flex items-center gap-x-2">
         <BoardOptions id={data.id} />
      </div>
    </div>
  );
};