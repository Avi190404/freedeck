import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-service";
import { BoardTitleForm } from "./board-title-form";
import { BoardOptions } from "./board-options";
import { BoardInvite } from "@/components/board-invite";

export const BoardNavbar = async ({ data }: { data: any }) => {
  const user = await getSession();
  
  // Check if current user is the owner
  const isOwner = user?.id === data.ownerId;

  return (
    <div className="w-full h-14 px-6 flex items-center justify-between gap-x-4 ...">
      {/* Disable Title Editing if not owner */}
      <BoardTitleForm data={data} isOwner={isOwner} /> 
      
      <div className="flex items-center gap-x-2">
         {/* Only show Invite button if Owner (optional, up to you) */}
         {isOwner && <BoardInvite boardId={data.id} />}
         
         {/* Pass isOwner to Options */}
         <BoardOptions id={data.id} isOwner={isOwner} />
      </div>
    </div>
  );
};