
interface RosanaWidget {
  open: () => void;
  close: () => void;
}

declare global {
  interface Window {
    Rosana?: RosanaWidget;
  }
}

export {};
