import { useState, useEffect } from "react";
import type { OjiCard } from "../types/card";

export function useCards() {
  const [wordCards, setWordCards] = useState<OjiCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        // APIできたらこっちに切り替える
        // const res = await fetch("/get-cards");
        // const data: OjiCard[] = await res.json();

        // ダミーデータ
        await new Promise((r) => setTimeout(r, 500));
        const data: OjiCard[] = [
          { id: 1, phrase: "ちゃんと寝れたカナ？" },
          { id: 2, phrase: "心配です😅" },
          { id: 3, phrase: "今何シテル の〜？" },
        ];
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