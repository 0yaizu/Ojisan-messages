import { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import type { DropResult } from "@hello-pangea/dnd"
import "./GamePlayPage.css"

// 型定義から未使用の category フィールドを削除
type OjiCard = {
  id: number;
  phrase: string;
};

type GamePlayPageProps = {
  onBackToHome: () => void;
};

// 📋 フロント用の固定カードデータ（category フィールドを整理）
const wordCards: OjiCard[] = [
  { id: 1, phrase: "ちゃんと寝れたカナ？" },
  { id: 2, phrase: "心配です😅" },
  { id: 3, phrase: "今何シテル の〜？" },
  { id: 4, phrase: "お仕事お疲れ様😌" },
  { id: 5, phrase: "ご飯でもどう？🍴" },
]

const baseCards: OjiCard[] = [
  { id: 101, phrase: "今日" },
  { id: 102, phrase: "昨日" },
  { id: 103, phrase: "こんにちは" },
  { id: 104, phrase: "おじさん" },
  { id: 105, phrase: "〇〇ちゃん" },
]

// 🛠️ レイアウト崩れを防ぐための最大選択カード数
const MAX_CARD_COUNT = 15;

export default function GamePlayPage({ onBackToHome }: GamePlayPageProps) {
  const [selectedCards, setSelectedCards] = useState<{ id: string; text: string }[]>([])

  // 関数形式の updater を使用し、最大件数のガード処理を追加
  const handleCardClick = (phrase: string) => {
    const uniqueId = `${Date.now()}-${Math.random()}`
    setSelectedCards(prev => {
      if (prev.length >= MAX_CARD_COUNT) return prev // 💡 上限に達している場合は追加しない
      return [...prev, { id: uniqueId, text: phrase }]
    })
  }

  // 関数形式の updater を使用し、連続削除時の動作を安全化
  const handleBackspace = () => {
    setSelectedCards(prev => prev.slice(0, -1))
  }

  // 上の吹き出しの中でドラッグ＆ドロップが完了した時の並び替え
  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return
    
    // 💡 指摘③を反映：移動前と移動後の位置が全く同じ場合は、早期 return して無駄な再描画を防ぐ
    if (result.source.index === result.destination.index) return

    const items = Array.from(selectedCards)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    setSelectedCards(items)
  }

  const getFullText = () => selectedCards.map(c => c.text).join("")

  // 送信ボタンを押しても「何も起きない（機能しない）」ように関数を空にする
  const handleSendText = () => {
    // コミット範囲をゲーム画面のみに絞るため、ここでは何も処理を行わない。
  }

  // 💡 上限に達しているかどうかの判定フラグ
  const isMaxReached = selectedCards.length >= MAX_CARD_COUNT;

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
          {/* 現在のカード枚数を視覚的に表示（例: 5/15） */}
          <span className="card-counter" style={{ fontSize: "12px", color: isMaxReached ? "#e11d48" : "#888", marginRight: "8px" }}>
            {selectedCards.length}/{MAX_CARD_COUNT}
          </span>
          {selectedCards.length > 0 && (
            <button className="btn-backspace" onClick={handleBackspace}>⌫</button>
          )}
          <button className="btn btn-green btn-md" onClick={handleSendText} disabled={selectedCards.length === 0}>
            送信
          </button>
        </div>

        {/* 3. 下部フリック風カード選択デッキ */}
        <div className="keyboard-section">
          {/* 💡 指摘⑤を反映：上限に達した場合は disabled={isMaxReached} でボタンを無効化 */}
          <div className="keyboard-row-label">📋 単語カード（ランダム）</div>
          <div className="card-deck">
            {wordCards.map(card => (
              <button 
                key={card.id} 
                className="oji-deck-card word-card" 
                onClick={() => handleCardClick(card.phrase)}
                disabled={isMaxReached}
              >
                {card.phrase}
              </button>
            ))}
          </div>

          <div className="keyboard-row-label">⚙️ 基本カード（固定）</div>
          <div className="card-deck">
            {baseCards.map(card => (
              <button 
                key={card.id} 
                className="oji-deck-card base-card" 
                onClick={() => handleCardClick(card.phrase)}
                disabled={isMaxReached}
              >
                {card.phrase}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}