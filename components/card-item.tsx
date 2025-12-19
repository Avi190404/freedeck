"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@prisma/client";
import { useCardModal } from "@/hooks/use-card-modal"; // <--- Import the hook

interface CardItemProps {
  data: Card;
  index: number;
}

export const CardItem = ({
  data,
  index,
}: CardItemProps) => {
  const cardModal = useCardModal(); // <--- Initialize the hook

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: data.id,
    data: {
      type: "Card",
      card: data,
      index,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div 
        ref={setNodeRef} 
        style={style}
        className="bg-primary/10 h-[36px] rounded-md border border-primary/20"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => cardModal.onOpen(data.id)} // <--- Add the Click Handler
      className="bg-background p-2 rounded-md shadow-sm border border-transparent hover:border-black/50 cursor-pointer transition text-sm"
    >
      {data.title}
    </div>
  );
};