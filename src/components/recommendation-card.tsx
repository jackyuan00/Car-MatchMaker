"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import type { Recommendation } from "@/lib/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

interface RecommendationCardProps {
  recommendation: Recommendation;
  onReset: () => void;
}

export default function RecommendationCard({
  recommendation,
  onReset,
}: RecommendationCardProps) {
  const carImage =
    PlaceHolderImages.find((img) => img.id === recommendation.model) ||
    PlaceHolderImages.find((img) => img.id === "fallback");

  return (
    <Card className="w-full overflow-hidden shadow-2xl bg-background/30 backdrop-blur-md border border-white/10">
      <CardHeader className="p-0">
        {carImage && (
          <div className="aspect-video relative w-full">
            <Image
              src={carImage.imageUrl}
              alt={recommendation.model}
              fill
              className="object-cover"
              data-ai-hint={carImage.imageHint}
              priority
            />
          </div>
        )}
      </CardHeader>
      <CardContent className="p-6">
        <CardTitle className="text-4xl font-headline text-primary-foreground mb-2">
          Your Recommendation: {recommendation.model}
        </CardTitle>
        <CardDescription className="text-lg text-foreground/80">
          {recommendation.reason}
        </CardDescription>

        {recommendation.error && (
          <Alert variant="destructive" className="mt-4 bg-red-900/50 border-red-500/50 text-red-200">
            <Terminal className="h-4 w-4 text-red-300" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {recommendation.error} A default recommendation has been provided.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button size="lg" onClick={onReset} className="w-full bg-blue-600 hover:bg-blue-500 text-white">
          Start Over
        </Button>
      </CardFooter>
    </Card>
  );
}
