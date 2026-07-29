'use client'

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
    <div className={`logo inline-flex items-center ${className}`} aria-label="Flawless" suppressHydrationWarning>
      <img
        src="/images/logo.webp"
        alt="Flawless Logo"
        style={{
          width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
          height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
        }}
        className={`w-auto h-10 sm:h-12 md:h-14 max-h-16 object-contain object-left transition-transform duration-300 hover:scale-105 ${imgClassName}`}
      />
    </div>
  );
}
