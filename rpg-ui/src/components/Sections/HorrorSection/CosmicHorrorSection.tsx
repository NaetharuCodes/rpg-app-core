import styles from "./CosmicHorrorSection.module.css";
import { TypewriterText } from "@/components/TypewriterText/TypewriterText";

interface HorrorCard {
  id: string;
  name: string;
  imageUrl: string;
  description?: string;
}

export function CosmicHorrorSection() {
  // Placeholder scenes - replace with your custom art
  const defaultScenes: HorrorCard[] = [
    {
      id: "1",
      name: "A Hidden World",
      imageUrl:
        "https://imagedelivery.net/eg6Xqa-jIrYvZBm8oCXnhg/20b66525-a3d9-40f9-75bf-0a9067751100/BigBanner",
    },
    {
      id: "2",
      name: "Forbidden Knowledge",
      imageUrl:
        "https://imagedelivery.net/eg6Xqa-jIrYvZBm8oCXnhg/bb4311cf-4f8f-449b-8355-dce940c98d00/BigBanner",
    },
    {
      id: "3",
      name: "Secrets Better Not Known",
      imageUrl:
        "https://imagedelivery.net/eg6Xqa-jIrYvZBm8oCXnhg/2efbe10c-14ba-401b-2d62-15b77a948d00/BigBanner",
    },
  ];

  const displayScenes = defaultScenes;

  return (
    <section className={styles.cosmicHorrorSection}>
      <div className={styles.voidBackground} />
      <div className={styles.floatingSymbols}>
        <div className={styles.symbol}>☿</div> {/* Mercury */}
        <div className={styles.symbol}>♅</div> {/* Uranus */}
        <div className={styles.symbol}>⚹</div> {/* Quintessence */}
        <div className={styles.symbol}>🜃</div> {/* Earth */}
        <div className={styles.symbol}>🜂</div> {/* Fire */}
        <div className={styles.symbol}>🜁</div> {/* Water */}
        <div className={styles.symbol}>🜄</div> {/* Sulphur */}
        <div className={styles.symbol}>🜆</div> {/* Salt */}
        <div className={styles.symbol}>🜊</div> {/* Copper */}
        <div className={styles.symbol}>🜎</div> {/* Gold */}
        <div className={styles.symbol}>☾</div> {/* Crescent Moon */}
        <div className={styles.symbol}>♇</div> {/* Pluto */}
        <div className={styles.symbol}>♆</div> {/* Neptune */}
        <div className={styles.symbol}>☌</div> {/* Conjunction */}
      </div>

      <div className={styles.content}>
        <TypewriterText
          text="Uncover Forbidden Knowledge"
          theme="horror"
          fontSize="3.5rem"
          speed={180}
        />

        <div className={styles.sceneGrid}>
          {displayScenes.map((scene, index) => (
            <div
              key={scene.id}
              className={styles.sceneCard}
              style={{ animationDelay: `${index * 0.3}s` }}
            >
              <img
                src={scene.imageUrl}
                alt={scene.name}
                className={styles.sceneImage}
              />
              <div className={styles.sceneOverlay}>
                <span className={styles.sceneName}>{scene.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
