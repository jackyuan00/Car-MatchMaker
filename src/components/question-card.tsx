"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Question } from "@/lib/types";

interface QuestionCardProps {
  question: Question;
  onAnswer: (questionId: number, answer: string) => void;
  selectedOption: string | undefined;
}

export default function QuestionCard({
  question,
  onAnswer,
  selectedOption,
}: QuestionCardProps) {
  const handleValueChange = (value: string) => {
    onAnswer(question.id, value);
  };

  return (
    <Card className="w-full shadow-lg border-2 bg-background/50 border-border transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-2xl font-headline text-center">
          {question.question}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedOption}
          onValueChange={handleValueChange}
          className="space-y-4"
        >
          {Object.entries(question.options).map(([key, value]) => (
            <Label
              key={key}
              htmlFor={`${question.id}-${key}`}
              className={`flex items-center space-x-4 rounded-lg border p-4 cursor-pointer transition-colors duration-200 ${
                selectedOption === key
                  ? "bg-primary/10 border-blue-500 ring-2 ring-blue-500"
                  : "hover:bg-muted/50 border-border"
              }`}
            >
              <RadioGroupItem value={key} id={`${question.id}-${key}`} />
              <span className="font-normal text-lg text-foreground">{value}</span>
            </Label>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
