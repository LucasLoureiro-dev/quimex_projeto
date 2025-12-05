"use client"
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 flex">
        <div className="w-1/2 h-full relative">
          <Image
            src="/vendedor/mulher1.png"
            alt="lab-left"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-green-900 opacity-60" />
        </div>
        <div className="w-1/2 h-full relative">
          <Image
            src="/vendedor/mulher2.png"
            alt="lab-right"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-green-900 opacity-60" />
        </div>
      </div>

      <div
        className="absolute inset-0 bg-gradient-to-r 
        from-transparent 
        via-black/80 
        to-transparent
        pointer-events-none"
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center pl-24 text-white">
        <div className="flex items-center ">
          {/* Logo */}
          <div>
            <Image
              src="/logo/logo.png"
              alt="logo Quimex"
              width={180}
              height={180}
              className="object-contain"
            />
          </div>

          <div>
            <h1 className="text-6xl font-bold">Quimex</h1>
            <p className="text-2xl mt-1">Excelência que transforma.</p>
          </div>
        </div>

        <Link
          href="/vendedor/loginVendedor"
          className="mt-5 ml-5 bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-4 rounded-full shadow-lg w-fit inline-block"
        >
          Acesse aqui!
        </Link>

      </div>
    </div>
  );
}
