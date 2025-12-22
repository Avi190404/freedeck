import { format } from "date-fns";
import { AuditLog } from "@prisma/client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

interface ActivityItemProps {
  data: AuditLog;
}

export const ActivityItem = ({ data }: ActivityItemProps) => {
  return (
    <li className="flex items-start gap-x-3 w-full">
      <Avatar className="h-8 w-8 mt-0.5">
        <AvatarImage src={data.userImage} />
      </Avatar>
      <div className="flex flex-col space-y-0.5 w-full">
        <div className="text-sm text-muted-foreground">
          <span className="font-semibold text-neutral-700 dark:text-neutral-200 mr-1">
            {data.userName}
          </span>
          {data.action === "COMMENT" ? (
             <span>commented</span>
          ) : (
             <span>{data.action.toLowerCase()}d {data.entityType.toLowerCase()} "{data.entityTitle}"</span>
          )}
        </div>
        
        {/* UPDATED: Added w-full and break-words so long comments look good */}
        {data.action === "COMMENT" && (
            <div className="text-sm bg-neutral-100 dark:bg-neutral-800 p-3 rounded-md text-neutral-800 dark:text-neutral-200 mt-1 w-full break-words whitespace-pre-wrap">
                {data.message}
            </div>
        )}
        
        <p className="text-xs text-muted-foreground">
          {format(new Date(data.createdAt), "MMM d, yyyy 'at' h:mm a")}
        </p>
      </div>
    </li>
  );
};