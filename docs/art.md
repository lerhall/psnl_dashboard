# Daily art

Each day the dashboard picks one painting from each of:

| Museum | API | Pool |
| --- | --- | --- |
| Art Institute of Chicago | `api.artic.edu` (free, no key) | Public-domain paintings (first 1,000 search results) |
| The Met | `collectionapi.metmuseum.org` v1.1 (free, no key) | Highlighted paintings (~840) |

The pick is a hash of the date (`daySeed` in `lib/art/index.ts`), so it stays
the same all day on every device, changes at midnight, and is cached for the
day. The Art page also shows the previous 6 days.

## Tweaking the selection

- **AIC:** change the search in `pickFromAic`. Useful filters:
  `artwork_type_id` (1 = Painting, 18 = Print, 14 = Drawing…), `style_title`,
  `place_of_origin`, `artist_title`. Explore at
  https://api.artic.edu/docs/.
- **The Met:** change `q=painting` / `isHighlight=true` in `pickFromMet`, or add
  `departmentId=` (11 = European Paintings, 6 = Asian Art, 21 = Modern and
  Contemporary Art). Departments list:
  `https://collectionapi.metmuseum.org/public/collection/v1/departments`.

## Other free sources you could add

| Source | Notes |
| --- | --- |
| [Cleveland Museum of Art Open Access](https://openaccess-api.clevelandart.org/) | No key, CC0 images |
| [Rijksmuseum](https://data.rijksmuseum.nl/) | Dutch Golden Age; check the current API docs |
| [Harvard Art Museums](https://harvardartmuseums.org/collections/api) | Free key required |
| [Europeana](https://pro.europeana.eu/page/apis) | Huge EU aggregator; free key |
| [Wikimedia Commons "Picture of the day"](https://commons.wikimedia.org/wiki/Commons:Picture_of_the_day) | Not just art, but often beautiful |

To add one: write a `pickFromX(day)` returning an `Artwork`, and add it to the
`Promise.allSettled([...])` in `getDailyArt`.

## Your favourites

Keep a running list of pieces/artists you liked here:

- …
