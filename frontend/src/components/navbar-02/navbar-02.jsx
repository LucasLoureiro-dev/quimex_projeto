import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { NavMenu } from "./nav-menu";
import { NavigationSheet } from "./navigation-sheet";
import { SunIcon } from "lucide-react";
import Link from "next/link";

const Navbar02Page = () => {
  return (
    <nav className="h-25 bg-background border-b fixed top-0 left-0 w-full z-50 shadow-lg">
      <div className="h-full flex items-center justify-between max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-5">
          <Logo />
          <div className="hidden md:block">
            <NavMenu />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login">
          <Button>Área Restrita</Button>
          </Link>

          <div className="md:hidden">
            <NavigationSheet />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar02Page;
