import "./HomePage.css"

type HomePageProps = {
  onStartGame: () => void;
};

export default function HomePage({ onStartGame }: HomePageProps) {
  return (
    <div className="home-card oji-title-screen">
      {/* メインタイトル */}
      <h1 className="home-title">
        <span className="title-sub">最高のおじさん構文を作れ！</span>
        おじさん構文バトル
      </h1>

      {/* LINEの吹き出し風ルール説明 */}
      <div className="oji-bubble-container">
        <div className="oji-speech-bubble">
          <p className="home-description">
            手元のカードをタップして文章を作り、<br />
            上の吹き出しの中でドラッグして順番を自由に並び替えろ❗
          </p>
        </div>
      </div>

      {/* ボタンエリア */}
      <div className="action-area">
        <button className="btn btn-green btn-lg btn-pulse" onClick={onStartGame}>
          ゲームを始める ✉️
        </button>
      </div>
    </div>
  )
}