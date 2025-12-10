"use client";

import Image from "next/image";
import { Link } from 'react-scroll';

import Navbar02Page from "@/components/navbar-02/navbar-02";
import Footer03Page from "@/components/footer-03/footer-03";
import QuimexMap from "@/components/MapaQuimex/mapaQuimex";
import EmblaCarousel from "@/components/carrosselParcerias/carrossel";
import Contato from "@/components/contatoForm/contatoForm";

import { Button } from "../components/ui/button";
import { ArrowRight, PhoneCall, Mail, Clock4 } from "lucide-react";

export default function Home() {
  return (
    <>
      <Navbar02Page></Navbar02Page>
      <section id="hero" className="hero flex flex-row items-center justify-center text-white text-center my-5 py-[8rem]">
        <div className="flex flex-col w-3/4 items-center justify-center gap-5 h-[15rem]">
          <h1 className="text-3xl">
            Inovação e Sustentabilidade em Soluções Químicas
          </h1>
          <p className="lead">
            Transformando derivados de refinarias em compostos de alto valor,
            impulsionando a indústria com parcerias estratégicas e produtos de
            excelência.
          </p>
          <Button className="bg-accent btn-lg py-2 px-2">
            <Link to="o-que-fazemos" smooth={true} duration={500} spy={true} offset={-70} >Saiba Mais Sobre Nós</Link>
          </Button>
        </div>
      </section>

      {/* O Que Fazemos / Vendemos Section */}
      <section id="o-que-fazemos" className="o-que-fazemos flex flex-col items-center justify-center w-full px-6 py-10 md:py-16">
        <div className="flex flex-col items-center justify-center max-w-6xl w-full">
          <div className="flex flex-row gap-3 bg-accent p-2 items-center rounded-md mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path
                fillRule="evenodd"
                d="M10.5 3.798v5.02a3 3 0 0 1-.879 2.121l-2.377 2.377a9.845 9.845 0 0 1 5.091 1.013 8.315 8.315 0 0 0 5.713.636l.285-.071-3.954-3.955a3 3 0 0 1-.879-2.121v-5.02a23.614 23.614 0 0 0-3 0Zm4.5.138a.75.75 0 0 0 .093-1.495A24.837 24.837 0 0 0 12 2.25a25.048 25.048 0 0 0-3.093.191A.75.75 0 0 0 9 3.936v4.882a1.5 1.5 0 0 1-.44 1.06l-6.293 6.294c-1.62 1.621-.903 4.475 1.471 4.88 2.686.46 5.447.698 8.262.698 2.816 0 5.576-.239 8.262-.697 2.373-.406 3.092-3.26 1.47-4.881L15.44 9.879A1.5 1.5 0 0 1 15 8.818V3.936Z"
                clipRule="evenodd"
              />
            </svg>
            <p className="m-0 font-semibold">O que nós entregamos</p>
          </div>

          <h2 className="text-center text-2xl md:text-3xl font-bold mb-10">
            Criando as Ligações Essenciais para o seu Sucesso
          </h2>

          <div className="flex flex-col md:flex-row md:flex-wrap gap-6 justify-center md:items-stretch w-full items-center">
           
            <div className="flex-1 min-w-[250px] max-w-sm bg-secondary-foreground border border-accent rounded-md shadow-sm p-6 text-center transition-transform duration-300 hover:scale-105 text-black">
              <Image
                className="p-1 mx-auto"
                src="/icones/icon-confiavel.svg"
                alt="ícone confiável"
                width={50}
                height={50}
              />
              <h3 className="font-bold mt-3">Confiável</h3>
              <p className="text-sm mt-2">
                Cumprimos o que prometemos, com consistência e transparência.
              </p>
            </div>

  
            <div className="flex-1 min-w-[250px] max-w-sm bg-secondary-foreground border border-accent rounded-md shadow-sm p-6 text-center transition-transform duration-300 hover:scale-105 text-black">
              <Image
                className="p-1 mx-auto"
                src="/icones/icon-inovadora.svg"
                alt="ícone inovadora"
                width={65}
                height={65}
              />
              <h3 className="font-bold mt-3">Inovadora</h3>
              <p className="text-sm mt-2">
                Estamos sempre à frente, pesquisando novas tecnologias que redefinem o mercado.
              </p>
            </div>

        
            <div className="flex-1 min-w-[250px] max-w-sm bg-secondary-foreground border border-accent rounded-md shadow-sm p-6 text-center transition-transform duration-300 hover:scale-105 text-black">
              <Image
                className="p-1 mx-auto"
                src="/icones/icon-parceria.svg"
                alt="ícone parceria"
                width={65}
                height={65}
              />
              <h3 className="font-bold mt-3">Parceira</h3>
              <p className="text-sm mt-2">
                Colaboramos ativamente para alcançar os melhores resultados.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quem Somos Section */}
      <section
        id="quem-somos"
        className="quem-somos flex flex-row items-center justify-center "
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-0 p-10">
          <div className="flex flex-col gap-4 w-full md:w-1/2 items-left">
            <h1 className="font-bold text-primary">Sobre Nós</h1>
            <div className="bg-primary h-1 w-48 mt-3"></div>

            <div className="flex flex-col gap-7 pt-5 pb-5">
              <h2 className="text-2xl font-bold leading-none ">
                Descubra a diferença que a Quimex pode te oferecer.
              </h2>
              <p className="hidden md:flex">
                Nascemos da visão de inovar o setor químico, atuando como uma
                empresa dinâmica que transforma derivados de refinarias em uma
                vasta gama de soluções especializadas. Nossa jornada é pautada
                na pesquisa e desenvolvimento, com um compromisso absoluto com a
                qualidade, segurança e eficiência. Acima de tudo, construímos
                relações colaborativas duradouras, garantindo que cada produto
                atenda sempre aos mais altos padrões da indústria.
              </p>
              <div className="flex md:hidden">
                <p>
                  Nascemos para inovar. Transformamos derivados químicos em
                  soluções de alta performance, unindo pesquisa de ponta,
                  segurança e eficiência. Mais que produtos, construímos
                  parcerias duradouras, garantindo a mais alta qualidade para a
                  sua indústria.
                </p>
              </div>
            </div>
            <Button variant={"default"} className="w-40">
              <Link to="parcerias" smooth={true} duration={500} spy={true} offset={-100} href="#parcerias" className="btn btn-outline-secondary">
                Nossos Parceiros
              </Link>
            </Button>
          </div>

          <div className="hidden md:flex w-lg h-lg">
            <img
              src="/profissional-industria.png"
              // Deixe apenas o w-full. A altura será automática.
              className="rounded img-profissional w-full"
              alt="Nossa Equipe e Laboratório"
            />
          </div>
        </div>
      </section>

      {/* Setores de Produtos Químicos Section */}
      <section id="setores-produtos" className="setores-produtos flex flex-col items-center justify-center w-full px-6 py-10 md:py-16">
        <div className="flex flex-col items-center justify-center max-w-6xl w-full gap-7">
          <h2 className="text-4xl text-center font-bold">
            Setores de Produtos Químicos que Atendemos
          </h2>
          <div className="flex flex-col md:flex-row md:flex-wrap gap-6 justify-center md:items-stretch w-full items-center">
            <div className="product-sector-card flex flex-col justify-center items-center text-center text-white transition-all duration-300 ease-in-out">
              <div className="card-side rounded-xl card-frente card-agro flex flex-col justify-center h-full w-full absolute top-0 left-0 hover:rotate-y-180 rotate-y-none">
                <h3 className="fw-bold text-3xl">Agroindústria</h3>
              </div>
              <div className="card-side card-fundo rounded-xl flex flex-col justify-center h-full w-full bg-primary absolute top-0 left-0 backface-hidden rotate-y-[-180deg] hover:rotate-y-none">
                <p className="card-text">
                  Soluções para otimização de colheitas, fertilizantes e
                  proteção de cultivos.
                </p>
              </div>
            </div>
            <div className="product-sector-card flex flex-col justify-center items-center text-center text-white transition-all duration-300 ease-in-out">
              <div className="card-side card-frente rounded-xl card-industria flex flex-col justify-center h-full w-full absolute top-0 left-0 hover:rotate-y-180 rotate-y-none">
                <h3 className="fw-bold text-3xl">
                  Indústria e Transformação
                </h3>
              </div>
              <div className="card-side card-fundo rounded-xl flex flex-col justify-center h-full w-full bg-primary absolute top-0 left-0 backface-hidden rotate-y-[-180deg] hover:rotate-y-none">
                <p className="card-text">
                  Químicos para processos industriais, polímeros e
                  revestimentos.
                </p>
              </div>
            </div>
            <div className="product-sector-card flex flex-col justify-center items-center text-center text-white transition-all duration-300 ease-in-out">
              <div className="card-side card-frente rounded-xl card-farmacia flex flex-col justify-center h-full w-full absolute top-0 left-0 hover:rotate-y-180 rotate-y-none">
                <h3 className="fw-bold text-3xl">Farmacêutica e Cosmética</h3>
              </div>
              <div className="card-side card-fundo rounded-xl flex flex-col justify-center h-full w-full bg-primary absolute top-0 left-0 backface-hidden rotate-y-[-180deg] hover:rotate-y-none ">
                <p className="card-text">
                  Ingredientes de alta pureza para medicamentos e produtos de
                  beleza.
                </p>
              </div>
            </div> 
            <div className="product-sector-card flex flex-col justify-center items-center text-center text-white transition-all duration-300 ease-in-out">
              <div className="card-side card-frente rounded-xl card-limpeza flex flex-col justify-center h-full w-full absolute top-0 left-0 hover:rotate-y-180 rotate-y-none">
                <h3 className="fw-bold text-3xl">Limpeza e Saneamento</h3>
              </div>

              <div className="card-side card-fundo rounded-xl flex flex-col justify-center h-full w-full bg-primary absolute top-0 left-0 backface-hidden rotate-y-[-180deg] hover:rotate-y-none transition-transform duration-300 ease-in-out">
                <p className="card-text">
                  Compostos para produtos de limpeza domésticos e industriais,
                  tratamento de água.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Marcas de Parceria Section */}
      <section id="parcerias" className="parcerias flex flex-col justify-center items-center h-full m-10  overflow-hidden">
        <div className="flex flex-col h-full w-full max-w-6xl bg-accent p-10 gap-4 items-center justify-center">
          <h2 className="text-3xl text-center">Nossas Marcas Parceiras</h2>
          <div className="w-full max-w-7xl mx-auto px-4">
            <EmblaCarousel />
          </div>
        </div>
      </section>
      <div className="w-full bg-primary flex flex-row items-center justify-center">
      </div>

      <section id="contato" className="flex flex-col md:flex-row items-center justify-center h-full m-10 gap-5">
        <div className="flex flex-col w-full md:w-1/2 gap-3">
          <h2 className="text-primary font-bold">Entre em Contato</h2>
            <p>
              Estamos ansiosos para ouvir você e explorar novas oportunidades de
              parceria.
            </p>
            <div className="flex flex-row items-center gap-2">
              <Mail className="text-secondary h-5 w-5" />
              <p>quimex05@gmail.com</p>
            </div>
            <div className="flex flex-row items-center gap-2"> 
              <PhoneCall className="text-secondary h-5 w-5" />
            <p>11 2345-5643</p>
            </div>
            <div className="flex flex-row items-center gap-2">
            <Clock4 className="text-secondary h-5 w-5" />          
            <small>Disponível para contato de <span className="font-bold text-secondary"> Segunda a Sexta, 9h - 17h (BRT)</span></small>
            </div>
            <div className="flex flex-col items-center">
              {/* <h1 className="font-bold text-primary">Filiais da Quimex</h1> */}
            <QuimexMap />
            </div>
        </div> 
        <div className="flex flex-row px-4 pb-10 w-full md:w-md h-full bg-accent rounded-lg ">
           <Contato />
        </div>
      </section>
      

      {/* Footer */}
      <Footer03Page></Footer03Page>
    </>
  );
}
