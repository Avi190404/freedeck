"use client";

import { ActivityIcon, Send } from "lucide-react";
import { AuditLog } from "@prisma/client";
import { useRef, ElementRef } from "react";
import { toast } from "sonner";
import { useParams } from "next/navigation";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ActivityItem } from "./activity-item";
import { createComment } from "@/actions/create-comment";

interface ActivityListProps {
  cardId: string;
  items: AuditLog[];
  onCommentAdded: () => void;
}

export const ActivityList = ({
  cardId,
  items,
  onCommentAdded,
}: ActivityListProps) => {
  const params = useParams();
  const textareaRef = useRef<ElementRef<"textarea">>(null);

  const onSubmit = (formData: FormData) => {
    const message = formData.get("message") as string;
    const boardId = params.boardId as string;

    if (!message.trim()) return;

    createComment(boardId, cardId, message)
      .then((data) => {
        if (data.error) {
            toast.error(data.error);
        } else {
            if (textareaRef.current) {
              textareaRef.current.value = "";
            }
            onCommentAdded();
        }
      })
      .catch(() => toast.error("Failed to add comment"));
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        e.currentTarget.closest("form")?.requestSubmit();
    }
  };

  return (
    // UPDATED: h-full and flex-col to fill the container
    <div className="flex items-start gap-x-3 w-full h-full flex-col">
      <div className="flex items-center gap-x-3 mb-2">
         <ActivityIcon className="h-5 w-5 mt-0.5 text-neutral-700 dark:text-neutral-200" />
         <p className="font-semibold text-neutral-700 dark:text-neutral-200">Activity</p>
      </div>

      <div className="w-full flex flex-col flex-1 min-h-0">
        <div className="mb-4">
             <form action={onSubmit} className="relative">
                <Textarea
                    ref={textareaRef}
                    id="message"
                    name="message"
                    placeholder="Write a comment..."
                    onKeyDown={onKeyDown}
                    className="w-full resize-none bg-neutral-100 dark:bg-neutral-800 focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 focus:ring-0 outline-none border-none pr-10 min-h-[56px] py-3 overflow-hidden rounded-md"
                    style={{ height: "auto" }}
                />
                <Button 
                    type="submit" 
                    size="icon" 
                    variant="ghost" 
                    className="absolute right-1 top-2 h-8 w-8 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                >
                    <Send className="h-4 w-4" />
                </Button>
             </form>
        </div>

        {/* UPDATED: overflow-y-auto is HERE. This makes ONLY the list scroll. */}
        <ol className="mt-2 space-y-4 overflow-y-auto flex-1 pr-2 custom-scrollbar">
          {items.map((item) => (
            <ActivityItem key={item.id} data={item} />
          ))}
        </ol>
      </div>
    </div>
  );
};

ActivityList.Skeleton = function ActivityListSkeleton() {
  return (
    <div className="flex items-start gap-x-3 w-full">
      <Skeleton className="h-6 w-6 bg-neutral-200" />
      <div className="w-full">
        <Skeleton className="w-24 h-6 mb-2 bg-neutral-200" />
        <Skeleton className="w-full h-10 bg-neutral-200" />
      </div>
    </div>
  );
};