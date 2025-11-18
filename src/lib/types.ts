export type Question = {
  id: number;
  question: string;
  options: Record<string, string>;
};

export type Answers = Record<string, string>;

export type Recommendation = {
  model: string;
  reason: string;
  error?: string;
};
