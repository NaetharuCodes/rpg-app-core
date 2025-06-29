import { SlideText } from "@/components/SlideText/SlideText";
import { MatrixRain } from "@/components/MatrixRain/MatrixRain";
import styles from "./CyberpunkSection.module.css";

interface CharacterCard {
  id: string;
  name: string;
  imageUrl: string;
  description?: string;
}

interface CyberpunkSectionProps {
  characters?: CharacterCard[];
  backgroundImage?: string;
}

export function CyberpunkSection({
  characters = [],
  backgroundImage,
}: CyberpunkSectionProps) {
  // Placeholder characters with your CF image
  const defaultCharacters: CharacterCard[] = [
    {
      id: "1",
      name: "Underground Rebellions",
      imageUrl:
        "https://imagedelivery.net/eg6Xqa-jIrYvZBm8oCXnhg/01098d81-d42d-4b9e-dab9-52682bad2600/XLLandscape",
    },
    {
      id: "2",
      name: "A Fallen World",
      imageUrl:
        "https://imagedelivery.net/eg6Xqa-jIrYvZBm8oCXnhg/74402772-9dd2-412d-ddaf-e64ede892e00/XLLandscape",
    },
    {
      id: "3",
      name: "The Rise of Machines",
      imageUrl:
        "https://imagedelivery.net/eg6Xqa-jIrYvZBm8oCXnhg/02869f1c-c4ac-496f-8128-d29b3f738400/XLLandscape",
    },
  ];

  const displayCharacters =
    characters.length > 0 ? characters : defaultCharacters;

  return (
    <section className={styles.cyberpunkSection}>
      <MatrixRain />

      {backgroundImage && (
        <div
          className={styles.backgroundOverlay}
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      <div className={styles.backgroundOverlay} />

      <div className={styles.content}>
        <SlideText
          text="Enter the Neon Streets"
          theme="cyberpunk"
          fontSize="4rem"
          animationDuration="8s"
        />

        <div className={styles.characterGrid}>
          {displayCharacters.map((character) => (
            <div key={character.id} className={styles.characterCard}>
              <img
                src={character.imageUrl}
                alt={character.name}
                className={styles.characterImage}
              />
              <div className={styles.characterOverlay}>{character.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
