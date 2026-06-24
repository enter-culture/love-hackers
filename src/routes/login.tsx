import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const nav = useNavigate();
  useEffect(() => {
    nav({ to: "/" });
  }, [nav]);
  return null;
}
