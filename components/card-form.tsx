"use client";

import { forwardRef, useRef, ElementRef, KeyboardEventHandler } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createCard } from "@/actions/create-card";
import { toast } from "sonner"; 

interface CardFormProps {
  listId: string;
  boardId: string;
  isEditing: boolean;
  enableEditing: () => void;
  disableEditing: () => void;
}

export const CardForm = forwardRef<HTMLTextAreaElement, CardFormProps>(({
  listId,
  boardId,
  isEditing,
  enableEditing,
  disableEditing,
}, ref) => {
  const formRef = useRef<ElementRef<"form">>(null);

  const onSubmit = async (formData: FormData) => {
    const title = formData.get("title") as string;
    
    if (!title) {
      return disableEditing();
    }

    try {
      // FIX: Pass 'formData' directly.
      // Your createCard action expects FormData, not an object.
      await createCard(formData);
      
      toast.success("Card created");
      formRef.current?.reset();
    } catch (error) {
      toast.error("Failed to create card");
    }
  };

  const onTextareakeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
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
          onKeyDown={onTextareakeyDown}
          ref={ref}
          placeholder="Enter a title for this card..."
          className="w-full resize-none bg-background text-foreground shadow-sm rounded-md border p-2 focus:outline-none focus:ring-1 focus:ring-ring"
          rows={3}
        />
        {/* Hidden inputs ensure these values are inside the formData */}
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
});

CardForm.displayName = "CardForm";