import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/braceria")({
  beforeLoad: ({ search }) => {
    throw redirect({ to: "/agriturismo", search, replace: true });
  },
  component: () => null,
});
