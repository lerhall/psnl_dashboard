import { ArtworkFigure } from "@/components/artwork";
import { Card, Empty } from "@/components/ui";
import { getDailyArt } from "@/lib/art";
import { getToday } from "@/lib/today";

/** Today's first art pick. The Art page shows the rest. */
export async function ArtWidget() {
  const { today } = await getToday();
  const [art] = await getDailyArt(today);

  return (
    <Card title="Art of the day" href="/art">
      {art ? <ArtworkFigure art={art} sizes="(min-width: 1024px) 33vw, 100vw" /> : <Empty>The museums aren&apos;t responding right now.</Empty>}
    </Card>
  );
}
