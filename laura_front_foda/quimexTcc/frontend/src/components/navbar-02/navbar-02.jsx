import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { NavMenu } from "./nav-menu";
import { NavigationSheet } from "./navigation-sheet";
import ThemeToggle from "../../components/themeSwitcher"
import Link from "next/link";

const Navbar02Page = () => {
  return (
    <nav className="h-30 bg-primary border-b fixed top-0 left-0 w-full z-50 shadow-lg text-white">
      <div className="h-full flex items-center justify-between max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-5">
          <Logo />
          <div className="hidden md:block">
            <NavMenu />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login">
          <Button className="bg-accent hover:bg-secondary">Área Restrita</Button>
          </Link>
          <ThemeToggle />
          <div className="md:hidden">
            <NavigationSheet />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar02Page;
