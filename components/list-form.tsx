"use client";

import { useState, useRef } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createList } from "@/actions/create-list";
import { toast } from "sonner"; // Optional: if you install sonner later, for now we just use console

interface ListFormProps {
  boardId: string;
}

export const ListForm = ({ boardId }: ListFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const onSubmit = async (formData: FormData) => {
    const title = formData.get("title") as string;
    
    // Optimistic check
    if (!title) return disableEditing();

    await createList(formData);
    
    // Reset form
    formRef.current?.reset();
    disableEditing();
  };

  if (isEditing) {
    return (
      <div className="w-72 shrink-0 h-full p-3 bg-secondary rounded-md shadow-sm transition">
        <form
          action={onSubmit}
          ref={formRef}
          className="space-y-4"
        >
          <input
            ref={inputRef}
            id="title"
            name="title"
            placeholder="Enter list title..."
            className="text-sm px-2 py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition w-full rounded-sm bg-background text-foreground"
          />
          <input hidden value={boardId} name="boardId" readOnly />
          
          <div className="flex items-center gap-x-1">
            <Button type="submit" size="sm" variant="default">
              Add List
            </Button>
            <Button onClick={disableEditing} size="sm" variant="ghost">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="w-72 shrink-0">
      <button
        onClick={enableEditing}
        className="w-full rounded-md bg-secondary/50 hover:bg-secondary transition p-3 flex items-center font-medium text-sm"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add a list
      </button>
    </div>
  );
};