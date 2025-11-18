"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Car, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import QuestionCard from "@/components/question-card";
import RecommendationCard from "@/components/recommendation-card";
import type { Question, Answers, Recommendation } from "@/lib/types";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useToast } from "@/hooks/use-toast";

type QuizState = "welcome" | "quiz" | "loading" | "result";

export default function Home() {
  const { toast } = useToast();
  const [appState, setAppState] = useState<QuizState>("welcome");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [direction, setDirection] = useState(1);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);

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
    try {
      // Format answers as an array for the backend
      const answersArray = Object.entries(answers).map(([questionId, answer]) => ({
        questionId: parseInt(questionId),
        answer: answer
      }));

      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers: answersArray }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result: Recommendation = await response.json();
      
      const carImage = PlaceHolderImages.find((img) => img.id === result.model);
      
      if (!carImage) {
        console.warn(`Backend recommended an unknown model: "${result.model}". Falling back to C-Class.`);
        setRecommendation({
          model: 'C-Class',
          reason: `While we couldn't match the specific recommendation, the C-Class is a versatile choice that blends luxury and performance.`,
        });
      } else {
        setRecommendation(result);
      }

    } catch (error) {
      console.error("Failed to get recommendation:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not fetch recommendation. Please try again later.",
      });
      // Provide a fallback recommendation on error
      setRecommendation({
        model: 'C-Class',
        reason: 'A versatile and popular choice for a refined driving experience. We encountered an issue generating your custom recommendation.',
        error: 'Failed to get a recommendation.'
      });
    } finally {
      setAppState("result");
    }
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
    PlaceHolderImages.forEach((p) => {
      const img = new window.Image();
      img.src = p.imageUrl;
    });
  }, []);

  // Fetch questions from backend
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoadingQuestions(true);
        const response = await fetch('/api/questions');
        
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }
        
        const data = await response.json();
        setQuestions(data.questions || []);
      } catch (error) {
        console.error('Error fetching questions:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not load questions. Using fallback questions.",
        });
        // Fallback to empty array - the API route will handle fallback
      } finally {
        setIsLoadingQuestions(false);
      }
    };

    fetchQuestions();
  }, [toast]);


  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 bg-background overflow-hidden font-body">
       <div className="absolute inset-0 z-0">
        <Image 
          src="https://images.unsplash.com/photo-1614209523202-a372c35593f6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Silver sports car on a dark background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
      </div>
      <div className="w-full max-w-2xl mx-auto z-10">
        <header className="mb-8 text-center">
          <div className="flex justify-center items-center gap-3 mb-2">
           <svg
              className="w-10 h-10 text-primary-foreground"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2ZM4 12a8 8 0 1 1 16 0 8 8 0 0 1-16 0Zm7-5.025a.75.75 0 0 1 .75.75v3.55l3.243 1.872a.75.75 0 0 1-.75 1.299l-3.5-2.022a.75.75 0 0 1-.375-.65V7.725a.75.75 0 0 1 .75-.75Zm-2.75 5.05a6.5 6.5 0 0 0 11.258 4.092l-4.103-7.106-2.528 4.378-1.5-2.598-3.127 5.234Z"
              />
            </svg>
            <h1 className="text-3xl sm:text-4xl font-headline font-bold text-primary-foreground tracking-tight">
              Car MatchMaker
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
              className="text-center bg-background/30 backdrop-blur-md border border-white/10 rounded-xl p-8 shadow-2xl"
            >
              {isLoadingQuestions ? (
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
                  <p className="text-xl text-foreground">Loading questions...</p>
                </div>
              ) : (
                <>
                  <p className="text-xl mb-8 text-foreground">
                    Answer a few questions to discover the car model that's tailored for you.
                  </p>
                  <Button size="lg" onClick={() => setAppState("quiz")} disabled={questions.length === 0} className="bg-blue-600 hover:bg-blue-500 text-white">
                    Start Quiz
                  </Button>
                </>
              )}
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
              {questions.length > 0 && (
                <>
                  <Progress value={progressValue} className="mb-4 h-2 bg-white/20" />
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
                      className="bg-transparent border-white/50 text-white hover:bg-white/10 hover:text-white"
                    >
                      Back
                    </Button>
                    {currentQuestionIndex < questions.length - 1 ? (
                      <Button onClick={handleNext} disabled={!isCurrentQuestionAnswered} className="bg-blue-600 hover:bg-blue-500 text-white">
                        Next
                      </Button>
                    ) : (
                      <Button onClick={handleSubmit} disabled={!isCurrentQuestionAnswered} className="bg-blue-600 hover:bg-blue-500 text-white">
                        Get Recommendation
                      </Button>
                    )}
                  </div>
                </>
              )}
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
              <Loader2 className="h-12 w-12 animate-spin text-blue-400" />
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
