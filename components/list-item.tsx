"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

import { ListWithCards } from "../types"; 
import { CardForm } from "./card-form";
import { CardItem } from "./card-item";

interface ListItemProps {
  data: ListWithCards;
  index: number;
}

export const ListItem = ({
  data,
  index,
}: ListItemProps) => {
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

  if (isDragging) {
    return (
      <div 
        ref={setNodeRef} 
        style={style} 
        className="w-72 shrink-0 h-full p-2 bg-black/10 rounded-md opacity-50" 
      />
    );
  }

  // CHANGE: Switched from <li> to <div> to remove the bullet point
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="shrink-0 h-full w-72 select-none"
    >
      <div 
        {...listeners} 
        className="w-full rounded-md bg-secondary pb-2 shadow-sm"
      >
        <div className="pt-2 px-2 text-sm font-semibold flex justify-between items-start gap-x-2">
          <div className="w-full text-sm px-2.5 py-1 h-7 font-medium border-transparent truncate">
            {data.title}
          </div>
        </div>

        <SortableContext 
           items={data.cards.map(card => card.id)} 
           strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-y-2 px-2 py-0.5 mx-1 mt-2 min-h-[10px]">
              {data.cards.map((card, index) => (
                  <CardItem 
                    index={index} 
                    key={card.id} 
                    data={card} 
                  />
              ))}
          </div>
        </SortableContext>

        <CardForm listId={data.id} boardId={data.boardId} />
      </div>
    </div>
  );
};