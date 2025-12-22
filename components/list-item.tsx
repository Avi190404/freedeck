"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

import { ListWithCards } from "@/types"; 
import { CardForm } from "./card-form";
import { CardItem } from "./card-item";
import { ListHeader } from "./list-header";

interface ListItemProps {
  data: ListWithCards;
  index: number;
}

export const ListItem = ({
  data,
  index,
}: ListItemProps) => {
  const [isEditing, setIsEditing] = useState(false);

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
      type: "List",
      list: data,
      index,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const enableEditing = () => {
    setIsEditing(true);
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  if (isDragging) {
    return (
      <div 
        ref={setNodeRef} 
        style={style} 
        className="w-72 shrink-0 h-full p-2 bg-black/10 rounded-md opacity-50" 
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      // FIX 3: 'max-h-full' ensures the list doesn't grow taller than the screen
      className="shrink-0 h-full w-72 select-none max-h-full"
    >
      <div 
        {...listeners} 
        // FIX 4: 'flex flex-col max-h-full' enables the column layout
        className="w-full rounded-md bg-[#f1f2f4] dark:bg-neutral-900 shadow-sm flex flex-col max-h-full"
      >
        {/* Header - Stays at top */}
        <ListHeader 
            onAddCard={enableEditing} 
            data={data} 
        />

        {/* FIX 5: 'overflow-y-auto' enables scrolling ONLY for cards */}
        <div className="flex-1 overflow-y-auto px-2 py-0.5 mx-1 flex flex-col gap-y-2 min-h-0">
            <SortableContext 
              items={data.cards.map(card => card.id)} 
              strategy={verticalListSortingStrategy}
            >
                  {data.cards.map((card, index) => (
                      <CardItem 
                        index={index} 
                        key={card.id} 
                        data={card} 
                      />
                  ))}
            </SortableContext>
        </div>

        {/* Footer - Stays at bottom */}
        <CardForm 
            listId={data.id} 
            boardId={data.boardId} 
            isEditing={isEditing}
            enableEditing={enableEditing}
            disableEditing={disableEditing}
        />
      </div>
    </div>
  );
};