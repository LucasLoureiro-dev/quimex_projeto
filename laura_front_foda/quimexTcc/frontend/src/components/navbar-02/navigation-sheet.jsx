import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Logo } from "./logo";
import { NavMenu } from "./nav-menu";
import Image from "next/image";

export const NavigationSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="default" size="icon">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="px-4 py-2 w-64 sm:w-72">
      <SheetHeader>
        <SheetTitle>
          <Image
            src="/logo/logotipo.png"
            alt="Logotipo Quimex"
            width={200}
            height={80}
          />
        </SheetTitle>
      </SheetHeader>
        <NavMenu orientation="vertical" className="mt-6 space-y-4" />
      </SheetContent>
    </Sheet>
  );
};
