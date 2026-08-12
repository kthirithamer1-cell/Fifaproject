import Link from "next/link";

interface LogoProps {
  className?: string;
  imgClassName?: string;
  width?: number | string;
  height?: number | string;
}

export function Logo({
  className = "",
  imgClassName = "",
  width,
  height,
}: LogoProps) {
  return (
    <Link
      href="/"
      className={`logo inline-flex items-center group cursor-pointer ${className}`}
      aria-label="Flawless Home"
      suppressHydrationWarning
    >
      <img
        src="/images/logo.webp"
        alt="Flawless Logo"
        style={{
          width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
          height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
        }}
        className={`w-auto h-10 sm:h-12 md:h-14 max-h-16 object-contain object-left transition-transform duration-300 group-hover:scale-105 ${imgClassName}`}
      />
    </Link>
  );
}
