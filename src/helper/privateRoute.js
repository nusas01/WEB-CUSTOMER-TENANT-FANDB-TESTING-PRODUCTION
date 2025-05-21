import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export const PrivateRouteCustomer = () => {
  const { loggedIn } = useSelector((state) => state.persisted.loginStatusCustomer);

  return loggedIn ? <Outlet /> : <Navigate to="/access" />;
}

export const PrivateRouteInternal = () => {
  const { loggedIn } = useSelector((state) => state.persisted.loginStatusInternal);

  return loggedIn ? <Outlet /> : <Navigate to="/access" />;
}