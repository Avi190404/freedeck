"use client";

import { Plus, X } from "lucide-react";
import { useState, useRef, ElementRef, RefObject } from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createList } from "@/actions/create-list";

interface ListFormProps {
  boardId: string;
}

export const ListForm = ({
  boardId,
}: ListFormProps) => {
  const router = useRouter();
  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

  const [isEditing, setIsEditing] = useState(false);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      disableEditing();
    }
  };

  useEventListener("keydown", onKeyDown);
  
  useOnClickOutside(formRef as RefObject<HTMLElement>, disableEditing);

  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;
    
    // FIX: Pass a single object containing both title and boardId
    // This matches the action signature: createList(data: { title, boardId } | FormData)
    createList({ title, boardId })
      .then((data) => {
        if (data.error) {
            toast.error(data.error);
        } else {
            toast.success(`List "${title}" created`);
            disableEditing();
            router.refresh();
        }
      })
      .catch((error) => {
        toast.error("Something went wrong");
      });
  }

  if (isEditing) {
    return (
      <div className="shrink-0 w-72 h-full select-none mr-4">
        <form
          ref={formRef}
          action={onSubmit}
          className="w-full p-3 rounded-md bg-white dark:bg-neutral-900 space-y-4 shadow-md"
        >
          <Input
            ref={inputRef}
            id="title"
            name="title"
            className="text-sm px-2 py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition bg-transparent dark:text-white dark:placeholder:text-neutral-400"
            placeholder="Enter list title..."
          />
          {/* Note: We don't need a hidden input here because we are constructing the object manually in onSubmit */}
          <div className="flex items-center gap-x-1">
            <Button 
                type="submit" 
                size="sm"
                variant="default" 
            >
              Add list
            </Button>
            <Button onClick={disableEditing} size="sm" variant="ghost">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="shrink-0 w-72 select-none mr-4">
      <Button
        onClick={enableEditing}
        className="w-full rounded-md bg-white/50 hover:bg-white/80 dark:bg-black/40 dark:hover:bg-black/60 transition p-3 flex items-center font-medium text-sm text-black dark:text-white"
        variant="ghost"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add a list
      </Button>
    </div>
  );
};