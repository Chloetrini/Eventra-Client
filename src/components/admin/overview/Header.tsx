interface HeaderProps {
  itemsCount: number;
}

export default function Header({ itemsCount }: HeaderProps) {
  return (
    <div>
      <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
        Control Room
      </p>
      <h1 className="mt-1 font-heading text-2xl font-semibold text-foreground">
        Overview
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {itemsCount} items need your attention across the platform.
      </p>
    </div>
  );
}