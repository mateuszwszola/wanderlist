import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";
import { useToast } from "~/components/ui/use-toast";

export function VisitPlace({
  placeId,
  isVisited,
}: {
  placeId: string;
  isVisited: boolean;
}) {
  const visitPlace = useFetcher();
  const { toast } = useToast();

  let visited = isVisited;

  if (visitPlace.formData) {
    visited = visitPlace.formData.get("visited") === "yes";
  }

  useEffect(() => {
    if (visitPlace.state === "idle" && visitPlace.data && !visitPlace.data.ok) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    }
  }, [toast, visitPlace.data, visitPlace.state]);

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
