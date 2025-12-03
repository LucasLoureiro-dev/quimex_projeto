"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  DribbbleIcon,
  GithubIcon,
  TwitchIcon,
  TwitterIcon,
} from "lucide-react";

import Image from "next/image";

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

const footerSections = [
  {
    title: "Seções",
    links: [
      {
        title: "O Que Fazemos",
        href: "o-que-fazemos",
      },
      {
        title: "Quem Somos",
        href: "quem-somos",
      },
      {
        title: "Nossos Produtos",
        href: "setores-produtos",
      },
      {
        title: "Parcerias",
        href: "parcerias",
      },
      {
        title: "Contato",
        href: "contato",
      },
    ],
  },
];

const Footer03Page = () => {

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
    <div className="flex flex-col">
      <footer className=" px-5 md:px-10 pb-5 ">
        <div className="bg-primary text-white rounded-xl max-w-(--breakpoint-xl) mx-auto shadow-xl/20">
          <div className="py-16 flex flex-col md:flex-row gap-30 px-6 items-center">
            <div className="col-span-full xl:col-span-2">
              <Image
                src="/logo/logotipo-branca.png"
                alt="Logotipo Quimex"
                width={200}
                height={80}
              />

              <p className="mt-4">
                Inovação, Qualidade e Parceria, Liderando o futuro da química.
              </p>
            </div>

            {footerSections.map(({ title, links }) => (
              <div key={title}className="flex flex-col gap-5" >
                <h1 className="font-bold">{title}</h1>
                <ul className="space-y-4 flex flex-col md:flex-row gap-4">
                  {links.map(({ title, href }) => (
                    <li key={title} >
                      <Link
                      to={href} spy={true} smooth={true} offset={-70} duration={500} className="hover:text-accent cursor-pointer"
                      >
                        {title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <Separator />
          <div className="py-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-x-2 gap-y-5 px-6">
            {/* Copyright */}
            <span className="">
              &copy; {new Date().getFullYear()}{" "}
              <Link href="/" target="_blank">
                Quimex
              </Link>
              .Todos os direitos reservados.
            </span>

            <div className="text-primary flex items-center gap-5">
             
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer03Page;
