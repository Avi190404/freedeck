"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  closestCorners,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { toast } from "sonner";
import { Card } from "@prisma/client";

import { ListItem } from "./list-item";
import { CardItem } from "./card-item";
import { ListForm } from "./list-form";
import { updateListOrder } from "@/actions/update-list-order";
import { updateCardOrder } from "@/actions/update-card-order";
import { ListWithCards } from "@/types";

interface BoardContentProps {
  boardId: string;
  data: ListWithCards[];
}

export const BoardContent = ({
  boardId,
  data,
}: BoardContentProps) => {
  const [lists, setLists] = useState(data);
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [activeList, setActiveList] = useState<ListWithCards | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  useEffect(() => {
    setIsMounted(true);
    setLists(data);
  }, [data]);

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "List") {
      setActiveList(event.active.data.current.list);
      return;
    }
    if (event.active.data.current?.type === "Card") {
      setActiveCard(event.active.data.current.card);
      return;
    }
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;

    const isActiveACard = active.data.current?.type === "Card";
    const isOverACard = over.data.current?.type === "Card";

    if (!isActiveACard) return;

    if (isActiveACard && isOverACard) {
      setLists((prev) => {
        const activeListIndex = prev.findIndex((list) =>
          list.cards.find((card) => card.id === activeId)
        );
        const overListIndex = prev.findIndex((list) =>
          list.cards.find((card) => card.id === overId)
        );

        if (activeListIndex < 0 || overListIndex < 0) return prev;

        const activeList = prev[activeListIndex];
        const overList = prev[overListIndex];
        const activeCardIndex = activeList.cards.findIndex((card) => card.id === activeId);
        const overCardIndex = overList.cards.findIndex((card) => card.id === overId);

        let newLists;

        if (activeListIndex === overListIndex) {
          const newCards = arrayMove(activeList.cards, activeCardIndex, overCardIndex);
          const newActiveList = { ...activeList, cards: newCards };
          newLists = [...prev];
          newLists[activeListIndex] = newActiveList;
        } else {
          const newActiveList = { ...activeList, cards: [...activeList.cards] };
          const newOverList = { ...overList, cards: [...overList.cards] };
          const [movedCard] = newActiveList.cards.splice(activeCardIndex, 1);
          movedCard.listId = newOverList.id;

          let newIndex;
          const isBelowOverItem = over && active.rect.current.translated && active.rect.current.translated.top > over.rect.top + over.rect.height;
          const modifier = isBelowOverItem ? 1 : 0;
          newIndex = overCardIndex >= 0 ? overCardIndex + modifier : overList.cards.length + 1;

          newOverList.cards.splice(newIndex, 0, movedCard);
          newLists = [...prev];
          newLists[activeListIndex] = newActiveList;
          newLists[overListIndex] = newOverList;
        }
        return newLists;
      });
    }

    const isOverAList = over.data.current?.type === "List";
    if (isActiveACard && isOverAList) {
      setLists((prev) => {
        const activeListIndex = prev.findIndex((list) =>
          list.cards.find((card) => card.id === activeId)
        );
        const overListIndex = prev.findIndex((list) => list.id === overId);

        if (activeListIndex < 0 || overListIndex < 0) return prev;
        if (activeListIndex === overListIndex) return prev;

        const activeList = prev[activeListIndex];
        const overList = prev[overListIndex];
        const activeCardIndex = activeList.cards.findIndex((card) => card.id === activeId);

        const newActiveList = { ...activeList, cards: [...activeList.cards] };
        const newOverList = { ...overList, cards: [...overList.cards] };

        const [movedCard] = newActiveList.cards.splice(activeCardIndex, 1);
        movedCard.listId = newOverList.id;
        newOverList.cards.push(movedCard);

        const newLists = [...prev];
        newLists[activeListIndex] = newActiveList;
        newLists[overListIndex] = newOverList;
        return newLists;
      });
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const activeId = active.id;
    const overId = over?.id;

    if (!over) {
      setActiveCard(null);
      setActiveList(null);
      return;
    }

    if (active.data.current?.type === "List") {
      const oldIndex = lists.findIndex((item) => item.id === activeId);
      const newIndex = lists.findIndex((item) => item.id === overId);
      const reorderedList = arrayMove(lists, oldIndex, newIndex).map((item, index) => ({
        ...item,
        order: index,
      }));
      setLists(reorderedList);
      updateListOrder(reorderedList, boardId).catch(() => toast.error("Failed to reorder lists"));
    }

    if (active.data.current?.type === "Card") {
      const activeListIndex = lists.findIndex((list) => list.cards.find((card) => card.id === activeId));
      if (activeListIndex >= 0) {
        const list = lists[activeListIndex];
        const reorderedCards = list.cards.map((card, index) => ({ ...card, order: index }));
        updateCardOrder(reorderedCards, boardId).catch(() => toast.error("Failed to reorder cards"));
      }
    }

    setActiveCard(null);
    setActiveList(null);
  };

  if (!isMounted) return null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <div className="absolute inset-0 overflow-x-auto overflow-y-hidden select-none">
        <div className="flex h-full gap-x-4 px-4 pt-4 pb-4">
          <SortableContext
            items={lists.map(l => l.id)}
            strategy={horizontalListSortingStrategy}
          >
            {lists.map((list, index) => (
              <ListItem
                key={list.id}
                index={index}
                data={list}
              />
            ))}
          </SortableContext>

          <ListForm boardId={boardId} />

          <div className="flex-shrink-0 w-1" />
        </div>
        
      </div>

      <DragOverlay dropAnimation={{
        sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: "0.5" } } }),
      }}>
        {activeList && (<ListItem index={0} data={activeList} />)}
        {activeCard && (<CardItem index={0} data={activeCard} />)}
      </DragOverlay>

    </DndContext>
  );
};