"use client";

import { useState, useRef, ElementRef } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createCard } from "@/actions/create-card";

interface CardFormProps {
  listId: string;
  boardId: string;
}

export const CardForm = ({
  listId,
  boardId,
}: CardFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef<ElementRef<"form">>(null);

  const enableEditing = () => {
    setIsEditing(true);
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const onSubmit = async (formData: FormData) => {
    const title = formData.get("title") as string;
    
    if (!title) return disableEditing();

    await createCard(formData);
    
    formRef.current?.reset();
    // Don't disable editing automatically so you can add multiple cards fast!
  };

  if (isEditing) {
    return (
      <form
        ref={formRef}
        action={onSubmit}
        className="m-1 py-0.5 px-1 space-y-4"
      >
        <textarea
          id="title"
          name="title"
          placeholder="Enter a title for this card..."
          className="w-full resize-none bg-background text-foreground shadow-sm rounded-md border p-2 focus:outline-none focus:ring-1 focus:ring-ring"
          rows={3}
          onKeyDown={(e) => {
            // Allow "Enter" to submit
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              formRef.current?.requestSubmit();
            }
          }}
        />
        <input hidden id="listId" name="listId" value={listId} readOnly />
        <input hidden id="boardId" name="boardId" value={boardId} readOnly />

        <div className="flex items-center gap-x-1">
          <Button type="submit" variant="default" size="sm">
            Add Card
          </Button>
          <Button onClick={disableEditing} size="sm" variant="ghost">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </form>
    );
  }

  return (
    <div className="pt-2 px-2 pb-2">
      <Button
        onClick={enableEditing}
        className="h-auto px-2 py-1.5 w-full justify-start text-muted-foreground text-sm"
        size="sm"
        variant="ghost"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add a card
      </Button>
    </div>
  );
};