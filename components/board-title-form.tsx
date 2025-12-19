"use client";

import { ElementRef, useRef, useState } from "react";
import { Board } from "@prisma/client";
import { toast } from "sonner";
import { updateBoard } from "@/actions/update-board";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BoardTitleFormProps {
  data: Board;
}

export const BoardTitleForm = ({
  data,
}: BoardTitleFormProps) => {
  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

  const [title, setTitle] = useState(data.title);
  const [isEditing, setIsEditing] = useState(false);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;
    
    if (title === data.title) {
        return disableEditing();
    }

    updateBoard(data.id, title)
      .then(() => {
        toast.success(`Board renamed to "${title}"`);
        setTitle(title);
        disableEditing();
      })
      .catch(() => {
        toast.error("Failed to rename board");
      });
  };

  const onBlur = () => {
    formRef.current?.requestSubmit();
  };

  if (isEditing) {
    return (
      <form ref={formRef} action={onSubmit} className="flex items-center gap-x-2">
        <Input
          ref={inputRef}
          id="title"
          name="title"
          onBlur={onBlur}
          defaultValue={title}
          className="text-lg font-bold px-[7px] py-1 h-7 bg-transparent focus-visible:outline-none focus-visible:ring-transparent border-none"
        />
      </form>
    );
  }

  return (
    <Button
      onClick={enableEditing}
      variant="ghost"
      className="font-bold text-lg h-auto w-auto p-1 px-2"
    >
      {title}
    </Button>
  );
};