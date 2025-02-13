import Footer from "../components/design/Footer/Footer";
import Navigation from "../components/design/Nav/Navigation";
import { Outlet } from "@remix-run/react";

export default function PublicLayout() {
  return (
    <div>
      <header>
        <Navigation />
      </header>
      <main>
        <Outlet />
      </main>
        <footer>
            <Footer />
        </footer>
    </div>
  );
}