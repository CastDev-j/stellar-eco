"use client";

import gsap from "gsap";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { Title } from "@/components/ui/title";
import { Paragraph } from "@/components/ui/paragraph";

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(MorphSVGPlugin);

const fillColor = "oklch(58.5% 0.233 277.117)";

export default function Loading() {
  const startRef = useRef<SVGPathElement>(null!);
  const endRef = useRef<SVGPathElement>(null!);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const morphTl = gsap.timeline({
      repeat: -1,
      yoyo: true,
    });

    morphTl.to(startRef.current, {
      duration: 1.2,
      morphSVG: endRef.current,
      ease: "expo.inOut",
    });

    const entryTl = gsap.timeline();

    entryTl.fromTo(
      containerRef.current,
      {
        scale: 0,
        rotation: -180,
        opacity: 0,
      },
      {
        scale: 1,
        rotation: 0,
        opacity: 1,
        duration: 1,
        ease: "back.out(1.7)",
      }
    );

    entryTl.fromTo(
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
      "-=0.4"
    );

    entryTl.fromTo(
      subtitleRef.current,
      {
        y: 20,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      },
      "-=0.3"
    );

    gsap.to(containerRef.current, {
      scale: 1.05,
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 1.2,
    });
  });

  return (
    <div className="flex flex-col justify-center items-center sm:min-h-152 min-h-168 text-center gap-6 px-4">
      <div ref={containerRef} className="flex size-56 opacity-0">
        <svg viewBox="0 0 501 480" fill="none">
          <path
            d="M250.727 80.4357L257.258 103.987L263.789 127.539L270.32 151.09L276.851 174.641C280.038 186.137 281.632 191.885 284.778 196.584C287.561 200.742 291.213 204.286 295.496 206.99C300.335 210.044 306.255 211.592 318.094 214.687L342.35 221.028L366.606 227.369L390.862 233.711L415.118 240.052L390.862 246.393L366.606 252.734L342.35 259.075L318.094 265.417C306.255 268.511 300.335 270.06 295.496 273.114C291.213 275.816 287.561 279.362 284.778 283.521C281.632 288.219 280.038 293.967 276.851 305.463L270.32 329.014L263.789 352.565L257.258 376.117L250.727 399.668L244.196 376.117L237.665 352.565L231.134 329.014L224.604 305.463C221.416 293.967 219.822 288.219 216.676 283.521C213.892 279.362 210.241 275.816 205.959 273.114C201.119 270.06 195.2 268.511 183.36 265.417L159.104 259.075L134.848 252.734L110.592 246.393L86.3364 240.052L110.592 233.711L134.848 227.369L159.104 221.028L183.36 214.687C195.2 211.592 201.119 210.044 205.959 206.99C210.241 204.286 213.892 200.742 216.676 196.584C219.822 191.885 221.416 186.137 224.604 174.641L231.134 151.09L237.665 127.539L244.196 103.987L250.727 80.4357Z"
            ref={startRef}
            stroke={fillColor}
            strokeWidth="30"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M236.332 89.4456C241.164 79.058 243.582 73.8642 246.947 72.2648C249.869 70.8752 253.301 70.8752 256.223 72.2648C259.589 73.8642 262.006 79.058 266.838 89.4456L305.332 172.184C306.762 175.255 307.476 176.79 308.582 177.966C309.559 179.007 310.755 179.839 312.089 180.408C313.598 181.052 315.344 181.229 318.834 181.582L412.861 191.09C424.666 192.283 430.567 192.88 433.195 195.452C435.477 197.686 436.538 200.814 436.062 203.907C435.515 207.467 431.106 211.273 422.288 218.887L352.05 279.531C349.445 281.781 348.14 282.907 347.316 284.277C346.585 285.491 346.128 286.837 345.976 288.229C345.802 289.803 346.166 291.447 346.894 294.737L366.512 383.351C368.976 394.477 370.207 400.039 368.466 403.227C366.953 405.999 364.176 407.931 360.96 408.453C357.256 409.053 352.115 406.213 341.832 400.531L259.929 355.271C256.889 353.591 255.37 352.753 253.754 352.423C252.324 352.133 250.846 352.133 249.416 352.423C247.8 352.753 246.281 353.591 243.241 355.271L161.339 400.531C151.056 406.213 145.915 409.053 142.211 408.453C138.994 407.931 136.217 405.999 134.705 403.227C132.964 400.039 134.196 394.477 136.659 383.351L156.276 294.737C157.004 291.447 157.368 289.803 157.195 288.229C157.042 286.837 156.586 285.491 155.855 284.277C155.03 282.907 153.726 281.781 151.12 279.531L80.8831 218.887C72.0653 211.273 67.6563 207.467 67.1081 203.907C66.6321 200.814 67.6928 197.686 69.9753 195.452C72.603 192.88 78.5054 192.283 90.3102 191.09L184.337 181.582C187.827 181.229 189.572 181.052 191.081 180.408C192.416 179.839 193.611 179.007 194.589 177.966C195.695 176.79 196.409 175.255 197.838 172.184L236.332 89.4456Z"
            ref={endRef}
            visibility="hidden"
            stroke={fillColor}
            strokeWidth="30"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div ref={titleRef} className="space-y-2 opacity-0">
        <Title variant="h3" align="center">
          Cargando contenido
        </Title>
      </div>

      <div ref={subtitleRef} className="opacity-0">
        <Paragraph
          size="base"
          align="center"
          className="max-w-md text-stone-600"
        >
          Estamos preparando todo para ti...
        </Paragraph>
      </div>
    </div>
  );
}
