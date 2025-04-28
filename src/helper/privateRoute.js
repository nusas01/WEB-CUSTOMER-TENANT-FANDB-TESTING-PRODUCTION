import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRouteCustomer() {
  const { loggedIn } = useSelector((state) => state.persisted.loginStatusCustomer);

  return loggedIn ? <Outlet /> : <Navigate to="/access" />;
}