import { useState, useEffect } from "react";
import type { OjiCard } from "../types/card";

export function useCards() {
  const [wordCards, setWordCards] = useState<OjiCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await fetch("http://localhost:3000/random?count=5");

        if (!res.ok) {
          throw new Error("単語の取得に失敗しました");
        }

        const json = await res.json();

        const data: OjiCard[] = json.words.map(
          (word: { id: number; content: string }) => ({
            id: word.id,
            phrase: word.content,
          })
        );

        setWordCards(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "不明なエラー");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCards();
  }, []);

  return { wordCards, isLoading, error };
}