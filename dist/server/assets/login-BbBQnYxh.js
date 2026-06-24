import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
function Login() {
  const nav = useNavigate();
  useEffect(() => {
    nav({
      to: "/"
    });
  }, [nav]);
  return null;
}
export {
  Login as component
};
