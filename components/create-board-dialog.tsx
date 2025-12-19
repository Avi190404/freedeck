"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { createBoard } from "@/actions/create-board";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const CreateBoardDialog = () => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleOpen = () => {
    console.log("Button Clicked! Opening Dialog...");
    setOpen(true);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = formData.get("title") as string;

    if (!title) return toast.error("Please enter a title");

    startTransition(() => {
        createBoard(formData)
            .then(() => {
                setOpen(false);
                toast.success("Board created!");
            })
            .catch(() => toast.error("Failed to create board."));
    });
  };

  return (
    <>
      {/* 1. The Button with explicit cursor-pointer */}
      <Button 
        onClick={handleOpen} 
        className="cursor-pointer" // <--- Forces the hand icon
        size="sm" // Optional: Makes it look slightly sharper
      >
        <Plus className="h-4 w-4 mr-2" />
        New Board
      </Button>

      {/* 2. The Dialog (Controlled Manually) */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create board</DialogTitle>
            <DialogDescription>
              Add a new board to organize your tasks.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                  <input
                      id="title"
                      name="title"
                      required
                      disabled={isPending}
                      placeholder="Enter board name..."
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
              </div>
              
              <DialogFooter>
                  <Button 
                    type="button" 
                    variant="secondary" 
                    disabled={isPending}
                    onClick={() => setOpen(false)} 
                    className="cursor-pointer"
                  >
                      Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isPending}
                    className="cursor-pointer"
                  >
                      {isPending ? "Creating..." : "Create"}
                  </Button>
              </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};