export type CounterType = "countdown" | "countup";

export type Counter = {
  id: string;
  type: CounterType;
  title: string;
  targetDate: string;
  createdAt: string;
};