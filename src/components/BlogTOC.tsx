import { useEffect, useState } from 'react';
import { List } from 'lucide-react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface BlogTOCProps {
  items: TOCItem[];
}

export function BlogTOC({ items }: BlogTOCProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observerOptions = {
      rootMargin: '-10% 0% -80% 0%',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    }, observerOptions);

    items.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav className="sticky top-24 hidden lg:block w-64 text-sm">
      <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 shadow-lg">
        <div className="flex items-center space-x-2 mb-4">
          <List className="w-4 h-4 text-primary" />
          <p className="font-semibold text-foreground">Contenido</p>
        </div>
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id} className={item.level === 3 ? 'ml-4' : ''}>
              <a
                href={`#${item.id}`}
                className={`block py-1 px-2 rounded text-sm transition-all duration-200 animated-underline ${
                  activeId === item.id
                    ? 'text-primary font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}