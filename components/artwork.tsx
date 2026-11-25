import Image from "next/image";
import type { Artwork } from "@/lib/art";

/** One artwork with its caption, linking to the museum page. */
export function ArtworkFigure({ art, sizes, priority = false }: { art: Artwork; sizes: string; priority?: boolean }) {
  return (
    <figure className="group">
      <a href={art.pageUrl} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-xl bg-surface-muted">
        {/* unoptimized: the museums already serve web-sized images, and it saves the Pi's CPU */}
        <Image
          src={art.imageUrl}
          alt={art.altText}
          width={843}
          height={843}
          sizes={sizes}
          unoptimized
          priority={priority}
          className="h-auto w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </a>
      <figcaption className="mt-2 text-sm">
        <p className="font-medium italic">{art.title}</p>
        <p className="text-muted">
          {art.artist}
          {art.date && `, ${art.date}`}
        </p>
        <p className="text-xs text-muted">{art.museum}</p>
      </figcaption>
    </figure>
  );
}
