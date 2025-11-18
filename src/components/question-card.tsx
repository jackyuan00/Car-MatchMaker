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
    <Card className="w-full shadow-lg border bg-background/30 backdrop-blur-md border-white/10 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-2xl font-headline text-center text-foreground">
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
                  ? "bg-blue-500/20 border-blue-500 ring-2 ring-blue-400 text-white"
                  : "border-white/20 hover:bg-white/10 text-neutral-300"
              }`}
            >
              <RadioGroupItem value={key} id={`${question.id}-${key}`} className="border-neutral-400 text-blue-400 focus:ring-blue-400" />
              <span className="font-normal text-lg">{value}</span>
            </Label>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
