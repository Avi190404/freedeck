"use client";

import { useEffect, useState, useTransition, useRef, ElementRef } from "react";
import { useCardModal } from "@/hooks/use-card-modal";
import { getCard } from "@/actions/get-card";
import { updateCard } from "@/actions/update-card";
import { deleteCard } from "@/actions/delete-card";
import { toast } from "sonner";
import { Layout, AlignLeft, Trash, Calendar as CalendarIcon, Clock } from "lucide-react";
import { format, isBefore, startOfDay } from "date-fns";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

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
  
  // Date States
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isDueOpen, setIsDueOpen] = useState(false);

  // --- FIX: Separate transitions for Update and Delete ---
  const [isUpdatePending, startUpdateTransition] = useTransition();
  const [isDeletePending, startDeleteTransition] = useTransition();
  
  const titleFormRef = useRef<ElementRef<"form">>(null);
  const titleInputRef = useRef<ElementRef<"input">>(null);

  useEffect(() => {
    if (id) {
        getCard(id).then((data) => {
            setCard(data);
            setStartDate(data?.startDate ? new Date(data.startDate) : undefined);
            setDueDate(data?.dueDate ? new Date(data.dueDate) : undefined);
        });
    }
  }, [id]);

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

    // Use Update Transition
    startUpdateTransition(() => {
        updateCard(boardId, card.id, payload)
            .then(() => {
                toast.success("Saved");
                getCard(card.id).then((data) => setCard(data));
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

      // Use Update Transition
      startUpdateTransition(() => {
          updateCard(boardId, card.id, payload)
              .then(() => {
                  toast.success("Date updated");
                  getCard(card.id).then((data) => setCard(data));
              })
              .catch(() => toast.error("Failed to update"));
      });
  };

  const onDelete = () => {
    const boardId = card?.list?.boardId;
    if (!boardId) return;

    // Use Delete Transition
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
      <DialogContent className="max-w-3xl w-full p-0 overflow-hidden bg-background">
        <DialogTitle className="sr-only">Card Details</DialogTitle>
        <DialogDescription className="sr-only">Edit card details.</DialogDescription>

        {!card ? (
             <div className="p-6 space-y-4">
                <div className="h-6 bg-muted w-1/2 rounded animate-pulse" />
                <div className="h-24 bg-muted w-full rounded animate-pulse" />
             </div>
        ) : (
            <>
            {/* HEADER */}
            <div className="flex items-start gap-x-3 mb-6 p-6 pb-0">
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

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 pt-0">
                
                {/* CONTENT */}
                <div className="md:col-span-3 space-y-6">
                    <div className="flex items-start gap-x-3 w-full">
                        <AlignLeft className="h-5 w-5 mt-0.5 text-muted-foreground" />
                        <div className="w-full">
                            <p className="font-semibold text-neutral-700 dark:text-neutral-200 mb-2">
                                Description
                            </p>
                            <form action={onUpdate} className="space-y-2">
                                <Textarea
                                    id="description"
                                    name="description"
                                    defaultValue={card.description || ""}
                                    placeholder="Add a more detailed description..."
                                    className="w-full min-h-[120px] bg-neutral-100 dark:bg-neutral-800 border-none focus-visible:ring-1 focus-visible:ring-primary"
                                />
                                <div className="flex items-center gap-x-2">
                                    <Button disabled={isUpdatePending} type="submit">
                                        Save
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* SIDEBAR */}
                <div className="md:col-span-1 space-y-6">
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
                            // --- KEY FIX: Only disable if DELETE is pending, not Update ---
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
            </>
        )}
      </DialogContent>
    </Dialog>
  );
};