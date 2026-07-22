import Image from "next/image";

export function FifaCard() {
  return (
    <div className="relative w-[360px]">
      <Image
        src="/images/alui.png"
        alt="Snoop Dogg FIFA Card"
        width={360}
        height={540}
        className="h-auto w-full object-contain"
        priority
      />
    </div>
  );
}