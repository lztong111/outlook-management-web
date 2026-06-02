import { Moon, Sun, Monitor, Menu } from 'lucide-react';
import { useThemeStore } from '../../stores/theme';

interface Props {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: Props) {
  const { theme, setTheme } = useThemeStore();

  const cycleTheme = () => {
    const next = theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark';
    setTheme(next);
  };

  const ThemeIcon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor;
  const themeLabel = theme === 'dark' ? '暗色' : theme === 'light' ? '亮色' : '跟随系统';

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card/80 backdrop-blur-sm px-4 md:px-6">
      <button
        onClick={onMenuClick}
        className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-secondary transition-colors"
      >
        <Menu className="h-4 w-4 text-muted-foreground" />
      </button>
      <div className="hidden md:block" />
      <button
        onClick={cycleTheme}
        className="flex items-center gap-2 h-8 px-3 rounded-lg border border-border hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
        title={`当前: ${themeLabel}`}
      >
        <ThemeIcon className="h-3.5 w-3.5" />
        <span className="text-xs hidden sm:inline">{themeLabel}</span>
      </button>
    </header>
  );
}
