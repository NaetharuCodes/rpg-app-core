import styles from "./FantasySection.module.css";

export function FantasySection() {
  const scenes = [
    {
      id: "1",
      name: "Ancient Bloodlines",
      imageUrl:
        "https://imagedelivery.net/eg6Xqa-jIrYvZBm8oCXnhg/c9c4e80d-70ed-42db-77ff-af6f63d07600/XLPortrait",
    },
    {
      id: "2",
      name: "Places of Power",
      imageUrl:
        "https://imagedelivery.net/eg6Xqa-jIrYvZBm8oCXnhg/fe146ae9-8c78-4479-0aee-0ddfc24cd700/XLPortrait",
    },
    {
      id: "3",
      name: "Wild Lands",
      imageUrl:
        "https://imagedelivery.net/eg6Xqa-jIrYvZBm8oCXnhg/e21fd3c1-2fd1-4ea4-ed8c-86992c4f3900/XLPortrait",
    },
  ];

  return (
    <section className={styles.fantasySection}>
      <div className={styles.mistOverlay} />

      <div className={styles.content}>
        <h2 className={styles.title}>Honor the Old Ways</h2>

        <div className={styles.sceneGrid}>
          {scenes.map((scene, index) => (
            <div
              key={scene.id}
              className={styles.sceneCard}
              style={{ animationDelay: `${index * 0.2}s` }}
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
