import { Fragment } from "react";

import { overlay, useOverlayStore } from "./overlay.store";

/** Ilova ildizida bir marta qo'yiladi (AppProviders). */
export function OverlayHost() {
  const stack = useOverlayStore((s) => s.stack);
  return (
    <>
      {stack.map((entry) => (
        <Fragment key={entry.id}>
          {entry.render({ open: entry.open, close: () => overlay.close(entry.id) })}
        </Fragment>
      ))}
    </>
  );
}
