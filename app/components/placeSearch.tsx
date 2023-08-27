import { Form, useNavigation } from "@remix-run/react";
import type { InputProps } from "~/components/ui/input";
import { Input } from "~/components/ui/input";

interface PlaceSearchInputProps extends InputProps {}

export function PlaceSearchInput(props: PlaceSearchInputProps) {
  const navigation = useNavigation();

  const isBusy = navigation.state === "loading";

  return (
    <Form>
      <Input
        disabled={isBusy}
        type="search"
        name="q"
        placeholder="Search for a place"
        className="bg-white border-none rounded-none h-10"
        {...props}
      />
    </Form>
  );
}
