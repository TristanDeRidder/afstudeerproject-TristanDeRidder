import { Outlet, useLocation } from "@remix-run/react";
import Footer from "../components/design/Footer/Footer";
import Navigation from "../components/design/Nav/Navigation";

export default function PublicLayout() {
  const location = useLocation();

  return (
    <div>
      <header>
        <Navigation />
      </header>
      <main className={location.pathname !== "/" ? "px-5 lg:px-32 overflow-hidden" : "overflow-hidden"}>
        <Outlet />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}
