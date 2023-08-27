import { useFetcher } from "@remix-run/react";

export function VisitPlace({
  placeId,
  isVisited,
}: {
  placeId: string;
  isVisited: boolean;
}) {
  const visitPlace = useFetcher();

  let visited = isVisited;

  if (visitPlace.formData) {
    visited = visitPlace.formData.get('visited') === 'yes';
  }

  return (
    <visitPlace.Form method="POST">
      <input type="hidden" name="placeId" value={placeId} />
      <input type="hidden" name="visited" value={visited ? "no" : "yes"} />
      <button
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        {visited ? (
          <span aria-label="Remove visited status">📌</span>
        ) : (
          <span className="opacity-25" aria-label="Mark as visited">
            📌
          </span>
        )}
      </button>
    </visitPlace.Form>
  );
}
