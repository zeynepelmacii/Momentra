export type CounterType = "countdown" | "countup";

export type Counter = {
  id: string;
  type: CounterType;
  title: string;
  icon?: string;
  targetDate: string;
  createdAt: string;
};