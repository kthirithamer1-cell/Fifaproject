'use client'

type SectionTitleProps = {
  children: React.ReactNode;
  className?: string;
};

export function SectionTitle({ children, className = "" }: SectionTitleProps) {
  return <div className={`sec-title ${className}`}>{children}</div>;
}
