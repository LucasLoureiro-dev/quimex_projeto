import Image from "next/image";

export const Logo = () => (
  <div className="flex flex-row gap-2 h-20 items-center justify-center">
   <Image
    className="p-1"
    src="/logotipo.png"
    alt="ícone de escudo com"
    width={180}
    height={70}
  /> 
  {/* <h3 className="text-primary">
    Quimex
  </h3> */}
  </div>
  
);
