"use client";

import { useEffect, useState, useTransition, useRef, ElementRef, useCallback } from "react";
import { useCardModal } from "@/hooks/use-card-modal";
import { getCard } from "@/actions/get-card";
import { updateCard } from "@/actions/update-card";
import { deleteCard } from "@/actions/delete-card";
import { fetchAuditLogs } from "@/actions/fetch-audit-logs"; 
import { toast } from "sonner";
import { Layout, AlignLeft, Trash, Calendar as CalendarIcon, Clock } from "lucide-react";
import { format, isBefore, startOfDay } from "date-fns";
import { AuditLog } from "@prisma/client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ActivityList } from "@/components/activity-list";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export const CardModal = () => {
  const id = useCardModal((state) => state.id);
  const isOpen = useCardModal((state) => state.isOpen);
  const onClose = useCardModal((state) => state.onClose);

  const [card, setCard] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isDueOpen, setIsDueOpen] = useState(false);

  const [isUpdatePending, startUpdateTransition] = useTransition();
  const [isDeletePending, startDeleteTransition] = useTransition();
  
  const titleFormRef = useRef<ElementRef<"form">>(null);
  const titleInputRef = useRef<ElementRef<"input">>(null);

  const refreshLogs = useCallback(() => {
    if (id) {
        fetchAuditLogs(id).then((data) => {
            setAuditLogs(data);
        });
    }
  }, [id]);

  useEffect(() => {
    if (id) {
        getCard(id).then((data) => {
            setCard(data);
            setStartDate(data?.startDate ? new Date(data.startDate) : undefined);
            setDueDate(data?.dueDate ? new Date(data.dueDate) : undefined);
        });
        refreshLogs();
    }
  }, [id, refreshLogs]);

  const onUpdate = (formData: FormData) => {
    const boardId = card?.list?.boardId;
    if (!boardId) return;

    const formTitle = formData.get("title") as string;
    const formDesc = formData.get("description") as string;

    const title = formData.has("title") ? formTitle : card.title;
    const description = formData.has("description") ? formDesc : (card.description || "");

    const payload = new FormData();
    payload.append("title", title);
    payload.append("description", description);
    if (startDate) payload.append("startDate", startDate.toISOString());
    if (dueDate) payload.append("dueDate", dueDate.toISOString());

    startUpdateTransition(() => {
        updateCard(boardId, card.id, payload)
            .then(() => {
                toast.success("Saved");
                getCard(card.id).then((data) => setCard(data));
                refreshLogs();
                if (formData.has("title")) {
                    titleInputRef.current?.blur();
                }
            })
            .catch(() => toast.error("Failed to update"));
    });
  };

  const executeDateUpdate = (field: "startDate" | "dueDate", date: Date | undefined) => {
      if (!card || !card.list) return;

      const boardId = card.list.boardId;
      const payload = new FormData();
      
      payload.append("title", card.title);
      payload.append("description", card.description || "");
      
      const newStart = field === "startDate" ? date : startDate;
      const newDue = field === "dueDate" ? date : dueDate;

      if (newStart) payload.append("startDate", newStart.toISOString());
      if (newDue) payload.append("dueDate", newDue.toISOString());

      startUpdateTransition(() => {
          updateCard(boardId, card.id, payload)
              .then(() => {
                  toast.success("Date updated");
                  getCard(card.id).then((data) => setCard(data));
                  refreshLogs();
              })
              .catch(() => toast.error("Failed to update"));
      });
  };

  const onDelete = () => {
    const boardId = card?.list?.boardId;
    if (!boardId) return;

    startDeleteTransition(() => {
        deleteCard(boardId, card.id)
            .then(() => {
                toast.success("Card deleted");
                onClose();
            })
            .catch(() => toast.error("Failed to delete"));
    });
  };

  const onTitleBlur = () => {
     titleFormRef.current?.requestSubmit();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* Width Logic:
        - Mobile: w-full (takes full width)
        - Desktop: min-w-[75%] sm:max-w-[75%] (takes 75% width)
      */}
      <DialogContent className="w-full min-w-[75%] sm:max-w-[75%] h-[90vh] p-0 flex flex-col overflow-hidden bg-background">
        <DialogTitle className="sr-only">Card Details</DialogTitle>
        <DialogDescription className="sr-only">Edit card details.</DialogDescription>

        {!card ? (
             <div className="p-6 space-y-4">
                <div className="h-6 bg-muted w-1/2 rounded animate-pulse" />
                <div className="h-24 bg-muted w-full rounded animate-pulse" />
             </div>
        ) : (
            <>
            {/* --- HEADER (Fixed) --- */}
            <div className="flex-none p-6 pb-2 border-b-0">
                <div className="flex items-start gap-x-3">
                    <Layout className="h-5 w-5 mt-1 text-muted-foreground" />
                    <div className="w-full">
                        <form ref={titleFormRef} action={onUpdate}>
                            <Input
                                ref={titleInputRef}
                                id="title"
                                name="title"
                                defaultValue={card.title}
                                onBlur={onTitleBlur}
                                className="font-semibold text-xl px-1 bg-transparent border-transparent focus-visible:bg-secondary focus-visible:border-input mb-0.5 truncate w-full"
                            />
                            <button type="submit" hidden />
                        </form>
                        <p className="text-sm text-muted-foreground px-1">
                            in list <span className="underline">{card.list.title}</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* --- BODY --- 
                FIX: Added `overflow-y-auto md:overflow-hidden`
                - Mobile: Whole body scrolls
                - Desktop: Body is fixed, internal columns scroll
            */}
            <div className="flex-1 min-h-0 overflow-y-auto md:overflow-hidden grid grid-cols-1 md:grid-cols-4 gap-6 p-6 pt-2">
                
                {/* LEFT COL: Description + Activity */}
                <div className="md:col-span-3 flex flex-col gap-y-6 md:h-full md:overflow-hidden">
                    
                    {/* Description */}
                    <div className="flex-none w-full">
                        <div className="flex items-start gap-x-3 w-full">
                            <AlignLeft className="h-5 w-5 mt-0.5 text-muted-foreground" />
                            <div className="w-full">
                                <p className="font-semibold text-neutral-700 dark:text-neutral-200 mb-2">
                                    Description
                                </p>
                                <form id="card-description-form" action={onUpdate} className="space-y-2">
                                    <Textarea
                                        id="description"
                                        name="description"
                                        defaultValue={card.description || ""}
                                        placeholder="Add a more detailed description..."
                                        className="w-full min-h-[100px] bg-neutral-100 dark:bg-neutral-800 border-none focus-visible:ring-1 focus-visible:ring-primary"
                                    />
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Activity 
                        FIX: Removed h-full force. 
                        - Mobile: h-auto (grows naturally)
                        - Desktop: flex-1 (fills remaining space)
                    */}
                    <div className="w-full md:flex-1 md:min-h-0 md:overflow-hidden">
                         <ActivityList 
                             cardId={card.id} 
                             items={auditLogs} 
                             onCommentAdded={refreshLogs} 
                         />
                    </div>
                </div>

                {/* RIGHT COL: Actions */}
                <div className="md:col-span-1 space-y-6 md:overflow-y-auto">
                    <div className="space-y-2">
                         <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                            Timeline
                         </p>
                         
                         <Popover open={isStartOpen} onOpenChange={setIsStartOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="secondary"
                                    className={cn(
                                        "w-full justify-start text-left font-normal px-2 h-auto py-2",
                                        !startDate && "text-muted-foreground"
                                    )}
                                >
                                    <Clock className="mr-2 h-4 w-4" />
                                    <div className="flex flex-col text-xs truncate">
                                        <span className="font-semibold">Start</span>
                                        <span>{startDate ? format(startDate, "MMM d") : "None"}</span>
                                    </div>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="end">
                                <Calendar
                                    mode="single"
                                    selected={startDate}
                                    onSelect={(date) => {
                                        setStartDate(date);
                                        setIsStartOpen(false);
                                        executeDateUpdate("startDate", date);
                                    }}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>

                        <Popover open={isDueOpen} onOpenChange={setIsDueOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="secondary"
                                    className={cn(
                                        "w-full justify-start text-left font-normal px-2 h-auto py-2",
                                        !dueDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    <div className="flex flex-col text-xs truncate">
                                        <span className="font-semibold">Due</span>
                                        <span>{dueDate ? format(dueDate, "MMM d") : "None"}</span>
                                    </div>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="end">
                                <Calendar
                                    mode="single"
                                    selected={dueDate}
                                    onSelect={(date) => {
                                        setDueDate(date);
                                        setIsDueOpen(false);
                                        executeDateUpdate("dueDate", date);
                                    }}
                                    disabled={(date) => {
                                        if (startDate) {
                                            return isBefore(date, startOfDay(startDate));
                                        }
                                        return false;
                                    }}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                            Actions
                        </p>
                        <Button
                            onClick={onDelete}
                            disabled={isDeletePending} 
                            variant="secondary"
                            className="w-full justify-start bg-red-50 dark:bg-red-950/30 text-red-600 hover:bg-red-100 hover:text-red-700"
                        >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                        </Button>
                    </div>
                </div>
            </div>

            {/* --- FOOTER (Sticky) --- */}
            <div className="flex-none p-4 border-t bg-background flex items-center justify-end gap-x-2">
                 <Button
                    variant="outline"
                    onClick={onClose}
                    disabled={isUpdatePending}
                 >
                    Cancel
                 </Button>
                 <Button
                    type="submit"
                    form="card-description-form"
                    disabled={isUpdatePending}
                 >
                    {isUpdatePending ? "Saving..." : "Save"}
                 </Button>
            </div>
            </>
        )}
      </DialogContent>
    </Dialog>
  );
};