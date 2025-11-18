"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Car, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import QuestionCard from "@/components/question-card";
import RecommendationCard from "@/components/recommendation-card";
import { getRecommendation } from "@/app/actions";
import questionsData from "./data/questions.json";
import type { Question, Answers, Recommendation } from "@/lib/types";

type QuizState = "welcome" | "quiz" | "loading" | "result";

export default function Home() {
  const [appState, setAppState] = useState<QuizState>("welcome");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const { questions }: { questions: Question[] } = questionsData;
  const [direction, setDirection] = useState(1);

  const handleAnswer = useCallback((questionId: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  }, []);

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setDirection(1);
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setDirection(-1);
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setAppState("loading");
    const result = await getRecommendation(answers);
    setRecommendation(result);
    setAppState("result");
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setRecommendation(null);
    setAppState("welcome");
  };

  const progressValue = useMemo(
    () => ((currentQuestionIndex + 1) / questions.length) * 100,
    [currentQuestionIndex, questions.length]
  );
  
  const isCurrentQuestionAnswered = useMemo(() => {
    const currentQuestion = questions[currentQuestionIndex];
    return currentQuestion && answers.hasOwnProperty(currentQuestion.id);
  }, [answers, currentQuestionIndex, questions]);


  const cardVariants = {
    hidden: (direction: number) => ({
      opacity: 0,
      x: direction > 0 ? 100 : -100,
    }),
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
    exit: (direction: number) => ({
      opacity: 0,
      x: direction < 0 ? 100 : -100,
      transition: {
        duration: 0.2
      }
    }),
  };

  // Preload images
  useEffect(() => {
    questions.forEach((_, index) => {
      const img = new Image();
      img.src = `https://picsum.photos/seed/${index + 10}/600/400`;
    });
  }, [questions]);


  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 bg-background">
      <div className="w-full max-w-2xl mx-auto">
        <header className="mb-8 text-center">
          <div className="flex justify-center items-center gap-3 mb-2">
            <Car className="w-8 h-8 text-primary" />
            <h1 className="text-3xl sm:text-4xl font-headline font-bold text-primary">
              Mercedes-Benz AI Configurator
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Find your perfect match.
          </p>
        </header>

        <AnimatePresence mode="wait">
          {appState === "welcome" && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <p className="text-xl mb-8 text-foreground">
                Answer a few questions to discover the Mercedes-Benz model that's tailored to your lifestyle.
              </p>
              <Button size="lg" onClick={() => setAppState("quiz")}>
                Start Quiz
              </Button>
            </motion.div>
          )}

          {appState === "quiz" && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <Progress value={progressValue} className="mb-4 h-2" />
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentQuestionIndex}
                  custom={direction}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <QuestionCard
                    question={questions[currentQuestionIndex]}
                    onAnswer={handleAnswer}
                    selectedOption={answers[questions[currentQuestionIndex].id]}
                  />
                </motion.div>
              </AnimatePresence>
              <div className="flex justify-between mt-6">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentQuestionIndex === 0}
                >
                  Back
                </Button>
                {currentQuestionIndex < questions.length - 1 ? (
                  <Button onClick={handleNext} disabled={!isCurrentQuestionAnswered}>
                    Next
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={!isCurrentQuestionAnswered} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    Get Recommendation
                  </Button>
                )}
              </div>
            </motion.div>
          )}
          
          {appState === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center gap-4 py-16"
            >
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-xl font-medium text-foreground">Crafting your perfect drive...</p>
            </motion.div>
          )}

          {appState === "result" && recommendation && (
             <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <RecommendationCard
                recommendation={recommendation}
                onReset={handleReset}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
