"use client";

import { useEffect, useState, useTransition } from "react";
import { useCardModal } from "@/hooks/use-card-modal";
import { getCard } from "@/actions/get-card";
import { updateCard } from "@/actions/update-card";
import { deleteCard } from "@/actions/delete-card";
import { toast } from "sonner";
import { Layout, AlignLeft, Trash } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export const CardModal = () => {
  const id = useCardModal((state) => state.id);
  const isOpen = useCardModal((state) => state.isOpen);
  const onClose = useCardModal((state) => state.onClose);

  const [card, setCard] = useState<any>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (id) {
        getCard(id).then((data) => setCard(data));
    }
  }, [id]);

  const onUpdate = (formData: FormData) => {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const boardId = card?.list?.boardId;

    if (!boardId) return;

    startTransition(() => {
        updateCard(boardId, card.id, formData)
            .then(() => {
                toast.success("Card updated!");
                getCard(card.id).then((data) => setCard(data));
            })
            .catch(() => toast.error("Failed to update"));
    });
  };

  const onDelete = () => {
    const boardId = card?.list?.boardId;
    if (!boardId) return;

    startTransition(() => {
        deleteCard(boardId, card.id)
            .then(() => {
                toast.success("Card deleted");
                onClose();
            })
            .catch(() => toast.error("Failed to delete"));
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* FIX 1: Changed 'bg-white' to 'bg-card' so it adapts to dark mode */}
      <DialogContent className="max-w-3xl w-full p-0 overflow-hidden bg-card text-card-foreground">
        
        <DialogTitle className="sr-only">Card Details</DialogTitle>
        <DialogDescription className="sr-only">
            Edit card details, description, and settings.
        </DialogDescription>

        {!card ? (
            <div className="p-6">Loading...</div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6">
                
                {/* LEFT SIDE */}
                <div className="md:col-span-3 space-y-6">
                    
                    {/* Title Section */}
                    <div className="flex items-start gap-x-3 w-full">
                        {/* FIX 2: Dynamic text colors */}
                        <Layout className="h-5 w-5 mt-1 text-muted-foreground" />
                        <div className="w-full">
                            <form action={onUpdate}>
                                <Input
                                    id="title"
                                    name="title"
                                    defaultValue={card.title}
                                    className="font-semibold text-xl px-1 bg-transparent border-transparent focus-visible:bg-background focus-visible:border-input mb-2 truncate w-full text-foreground"
                                />
                                <div className="text-sm text-muted-foreground px-1">
                                    in list <span className="underline">{card.list.title}</span>
                                </div>
                                <button type="submit" hidden />
                            </form>
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="flex items-start gap-x-3 w-full">
                        <AlignLeft className="h-5 w-5 mt-1 text-muted-foreground" />
                        <div className="w-full">
                            <p className="font-semibold text-foreground mb-2">Description</p>
                            <form action={onUpdate} className="space-y-2">
                                <Textarea
                                    id="description"
                                    name="description"
                                    defaultValue={card.description || ""}
                                    placeholder="Add a more detailed description..."
                                    className="w-full mt-2 min-h-[100px] bg-background text-foreground"
                                />
                                <div className="flex items-center gap-x-2">
                                    <Button disabled={isPending} type="submit">
                                        Save
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>

                </div>

                {/* RIGHT SIDE */}
                <div className="md:col-span-1 space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">
                        Actions
                    </p>
                    <Button 
                        onClick={onDelete}
                        disabled={isPending}
                        variant="destructive"
                        className="w-full justify-start"
                        size="sm"
                    >
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                    </Button>
                </div>

            </div>
        )}
      </DialogContent>
    </Dialog>
  );
};