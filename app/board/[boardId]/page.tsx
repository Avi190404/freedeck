import { db } from "@/lib/db";
import { BoardContent } from "@/components/board-content";

interface BoardIdPageProps {
  params: Promise<{ boardId: string }>;
}

const BoardIdPage = async ({
  params,
}: BoardIdPageProps) => {
  const { boardId } = await params;

  const lists = await db.list.findMany({
    where: {
      boardId: boardId,
    },
    include: {
      cards: {
        orderBy: {
          order: "asc",
        },
      },
    },
    orderBy: {
      order: "asc",
    },
  });

  return (
    <BoardContent
      boardId={boardId}
      data={lists}
    />
  );
};

export default BoardIdPage;