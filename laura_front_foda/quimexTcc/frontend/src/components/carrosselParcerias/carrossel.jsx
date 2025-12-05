"use client";

import React, { useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "../ui/button";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function EmblaCarousel() {
  const [parcerias, setParcerias] = useState([]);

  useEffect(() => {
    fetch("/parcerias.json")
      .then((res) => res.json())
      .then((data) => setParcerias(data))
      .catch((error) => console.error("Error fetching partnerships:", error));
  }, []);

  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );
  const [emblaRef] = useEmblaCarousel({ loop: false }, [Autoplay()]);

  return (
    <div className="flex flex-col gap-10 ">
      <Carousel plugins={[plugin.current]} ref={emblaRef}>
        <CarouselContent className="-ml-4" ref={emblaRef}>
          {" "}
          {/* Apply emblaRef to CarouselContent */}
          {parcerias.length > 0 ? (
            parcerias.map((p) => (
              <CarouselItem
                key={p.id}
                className="pl-4 basis-full md:basis-1/3 lg:basis-1/5"
              >
                <div className="p-1">
                  <Card className="flex items-center justify-center h-full w-full bg-[#f5f5f4]">
                    <CardContent className="flex items-center justify-center p-3 h-[100px] w-full">
                      {" "}
                      <img
                        src={p.logo}
                        alt={p.companyName}
                        className="object-contain max-h-full max-w-full"
                      />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))
          ) : (
            <CarouselItem className="pl-4 basis-full">
              <div className="p-1">
                <Card>
                  <CardContent className="flex items-center justify-center p-6 text-gray-500">
                    Nenhum parceiro cadastrado ainda.
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          )}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
