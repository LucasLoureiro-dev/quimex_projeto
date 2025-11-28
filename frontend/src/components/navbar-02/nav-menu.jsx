"use client"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import React from "react";
import ReactDOM from "react-dom";

import {
  Link,
  DirectLink,
  Element,
  Events,
  animateScroll,
  scrollSpy,
  scroller
} from "react-scroll";

import { useState } from "react";

export const NavMenu = (props) => {

  const durationFn = function(deltaTop) {
    return deltaTop;
  };
  
  const  scrollToTop = () => {
    animateScroll.scrollToTop()
  }
  const scrollTo = (offset) => {
    scroller.scrollTo("scroll-to-element", {
      duration: 800,
      delay: 0,
      smooth: "easeInOutQuart",
      offset: offset
    });
  }
  const scrollToWithContainer= () =>{
    let goToContainer = new Promise((resolve, reject) => {
      Events.scrollEvent.register("end", () => {
        resolve(true);
        Events.scrollEvent.remove("end");
      });
  
      scroller.scrollTo("scroll-container", {
        duration: 800,
        delay: 0,
        smooth: "easeInOutQuart"
      });
    });
  
    goToContainer.then(() =>
      scroller.scrollTo("scroll-container-second-element", {
        duration: 800,
        delay: 0,
        smooth: "easeInOutQuart",
        containerId: "scroll-container",
        offset: 50
      })
    );
  }
  

  return (
    <NavigationMenu {...props}>
      <NavigationMenuList
        className="gap-0 md:gap-3 space-x-0 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start data-[orientation=vertical]:justify-start">
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link className="cursor-pointer" to="o-que-fazemos" spy={true} smooth={true} offset={-70} duration={500}>O Que Fazemos</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link className="cursor-pointer text-base" to="quem-somos" spy={true} smooth={true} offset={-70} duration={500}>Quem Somos</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link className="cursor-pointer" to="setores-produtos" spy={true} smooth={true} offset={-30} duration={500}>Produtos</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link className="cursor-pointer" to="parcerias" spy={true} smooth={true} offset={-100} duration={500}>Parcerias</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link className="cursor-pointer" to="contato" spy={true} smooth={true} offset={-20} duration={500}>Contato</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
  
