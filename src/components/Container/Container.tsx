import type { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
}

export default function Container({ children }: ContainerProps) {
  return (
    <div
      className={`mx-auto my-16 flex max-w-6xl flex-col items-center gap-6 rounded-2xl bg-gray-700 py-16`}
    >
      {children}
    </div>
  );
}
