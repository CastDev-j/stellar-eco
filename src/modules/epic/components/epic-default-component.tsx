import { useRef } from "react";
import { Title } from "@/components/ui/title";
import { Paragraph } from "@/components/ui/paragraph";
import { IoMdImages } from "react-icons/io";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const EPICDefaultComponent = () => {
  const iconRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      iconRef.current,
      {
        scale: 0,
        rotation: -180,
        opacity: 0,
      },
      {
        scale: 1,
        rotation: 0,
        opacity: 1,
        duration: 0.8,
        ease: "back.out(1.7)",
      }
    );

    tl.fromTo(
      titleRef.current,
      {
        y: 30,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
      },
      "-=0.3"
    );

    gsap.to(iconRef.current, {
      y: -10,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });
  }, []);

  return (
    <div className="flex flex-col justify-center items-center min-h-128 text-center gap-6">
      <div ref={iconRef} className="flex justify-center">
        <div className="w-24 h-24 rounded-full flex items-center justify-center">
          <IoMdImages className="size-16 text-indigo-600" />
        </div>
      </div>

      <div ref={titleRef} className="space-y-3">
        <Title variant="h2" align="center">
          Explora las Imágenes EPIC
        </Title>
        <Paragraph
          size="lg"
          align="center"
          className="max-w-3xl text-stone-600"
        >
          Usa los filtros arriba para buscar imágenes de la Tierra tomadas por
          el satélite DSCOVR.
        </Paragraph>
      </div>

      <div className="mt-2">
        <Paragraph size="sm" className="text-stone-500">
          Sugerencias: <span className="font-medium">2024-01-15</span>,{" "}
          <span className="font-medium">Año: 2023</span>,{" "}
          <span className="font-medium">Mes: 12</span>
        </Paragraph>
      </div>
    </div>
  );
};

export default EPICDefaultComponent;
