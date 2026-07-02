import { useState } from "react"
import GamePlayPage from "./GamePlayPage" // 👈 ゲーム画面をインポート
import "./HomePage.css"

type HomePageProps = {
  onStartGame: () => void;
};

export default function HomePage({ onStartGame }: HomePageProps) {
  // 💡 HomePage 自体の中で、ゲーム画面に切り替えるための State を用意
  const [isGameStarted, setIsGameStarted] = useState(false)

  // 💡 ボタンが押されたら、このコンポーネント内でフラグを true にする
  const handleLocalStart = () => {
    setIsGameStarted(true)
    // もし親（App.tsx）側にも通知したければ残し、不要なら下の1行は消してもOKです
    onStartGame() 
  }

  // 💡 フラグが true になったら、HomePage の中身ではなく GamePlayPage を直接レンダリングして返す
  if (isGameStarted) {
    return <GamePlayPage onBackToHome={() => setIsGameStarted(false)} />
  }

  return (
    <div className="home-card oji-title-screen">
      <h1 className="home-title">
        おじさん構文バトル
        <span className="title-edition">（入力＆編集編）</span>
      </h1>

      <div className="oji-bubble-container">
        <div className="oji-speech-bubble">
          <p className="home-description">
            手元のカードをタップして文章を作り、<br />
            上の吹き出しの中でドラッグして順番を自由に並び替えろ❗
          </p>
        </div>
      </div>

      {/* 🛠️ ボタンの onClick を新しく作った handleLocalStart に書き換え */}
      <div className="action-area">
        <button className="btn btn-green btn-lg btn-pulse" onClick={handleLocalStart}>
          ゲームを始める ✉️
        </button>
      </div>
    </div>
  )
}