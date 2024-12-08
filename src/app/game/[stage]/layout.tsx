export default function GameLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return children;
  }
  
  export function generateStaticParams() {
    return [
      { stage: '1' },
      { stage: '2' },
      { stage: '3' },
      { stage: '4' }
    ]
  }