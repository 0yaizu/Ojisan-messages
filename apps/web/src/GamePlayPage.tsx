import { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import type { DropResult } from "@hello-pangea/dnd"
import "./GamePlayPage.css"

// ファイル内で直接型を定義（インポートエラー防止）
type OjiCard = {
  id: number;
  phrase: string;
  category: "word" | "base";
};

type GamePlayPageProps = {
  onBackToHome: () => void;
};

export default function GamePlayPage({ onBackToHome }: GamePlayPageProps) {
  const [selectedCards, setSelectedCards] = useState<{ id: string; text: string }[]>([])

  // 📋 フロント用の固定カードデータ（デザイン調整用）
  const wordCards: OjiCard[] = [
    { id: 1, phrase: "ちゃんと寝れたカナ？", category: "word" },
    { id: 2, phrase: "心配です😅", category: "word" },
    { id: 3, phrase: "今何シテル の〜？", category: "word" },
    { id: 4, phrase: "お仕事お疲れ様😌", category: "word" },
    { id: 5, phrase: "ご飯でもどう？🍴", category: "word" },
  ]

  const baseCards: OjiCard[] = [
    { id: 101, phrase: "今日", category: "base" },
    { id: 102, phrase: "昨日", category: "base" },
    { id: 103, phrase: "こんにちは", category: "base" },
    { id: 104, phrase: "おじさん", category: "base" },
    { id: 105, phrase: "〇〇ちゃん", category: "base" },
  ]

  // カードをタップして上部に追加
  const handleCardClick = (phrase: string) => {
    const uniqueId = `${Date.now()}-${Math.random()}`
    setSelectedCards([...selectedCards, { id: uniqueId, text: phrase }])
  }

  // 直近に追加したパーツを1つ削除（バックスペース）
  const handleBackspace = () => {
    setSelectedCards(selectedCards.slice(0, -1))
  }

  // 上の吹き出しの中でドラッグ＆ドロップが完了した時の並び替え
  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return
    const items = Array.from(selectedCards)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    setSelectedCards(items)
  }

  const getFullText = () => selectedCards.map(c => c.text).join("")

  // 🛠️ 送信ボタンを押しても「何も起きない（機能しない）」ように関数を空にします
  const handleSendText = () => {
    // コミット範囲をゲーム画面のみに絞るため、ここでは何も処理を行いません。
  }

  return (
    <div className="oji-game-wrapper">
      <div className="line-container">
        {/* LINE風 ヘッダーバー */}
        <div className="line-header">
          <div className="user-info">
            <div className="avatar">お</div>
            <div className="user-text">
              <span className="user-name">〇〇ちゃん応援おじさん</span>
            </div>
          </div>
          <button className="btn btn-outline-white btn-sm" onClick={onBackToHome}>戻る</button>
        </div>

        {/* 1. トーク履歴エリア（ドラッグ＆ドロップ対応のプレビュー吹き出し） */}
        <div className="line-content">
          <div className="message-list">
            {selectedCards.length > 0 ? (
              <div className="message-item">
                <div className="mini-avatar">お</div>
                
                <DragDropContext onDragEnd={handleOnDragEnd}>
                  <Droppable droppableId="selected-preview" direction="horizontal">
                    {(provided) => (
                      <div className="bubble-preview-draggable" {...provided.droppableProps} ref={provided.innerRef}>
                        {selectedCards.map((card, index) => (
                          <Draggable key={card.id} draggableId={card.id} index={index}>
                            {(provided) => (
                              <span 
                                className="phrase-badge-draggable"
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                {card.text}
                              </span>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            ) : (
              <p className="guide-text">👇 下のカードをタップして文章を作ってネ！</p>
            )}
          </div>
        </div>

        {/* 2. 送信確認・文字入力のダミーバー */}
        <div className="line-footer">
          <div className="input-placeholder-text">
            {getFullText() || "メッセージを入力..."}
          </div>
          {selectedCards.length > 0 && (
            <button className="btn-backspace" onClick={handleBackspace}>⌫</button>
          )}
          {/* 送信ボタンの見た目とホバーエフェクトは維持しつつ、処理は走りません */}
          <button className="btn btn-green btn-md" onClick={handleSendText} disabled={selectedCards.length === 0}>
            送信
          </button>
        </div>

        {/* 3. 下部フリック風カード選択デッキ */}
        <div className="keyboard-section">
          <div className="keyboard-row-label">📋 単語カード（ランダム）</div>
          <div className="card-deck">
            {wordCards.map(card => (
              <button key={card.id} className="oji-deck-card word-card" onClick={() => handleCardClick(card.phrase)}>
                {card.phrase}
              </button>
            ))}
          </div>

          <div className="keyboard-row-label">⚙️ 基本カード（固定）</div>
          <div className="card-deck">
            {baseCards.map(card => (
              <button key={card.id} className="oji-deck-card base-card" onClick={() => handleCardClick(card.phrase)}>
                {card.phrase}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}