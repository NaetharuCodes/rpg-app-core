import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function ScrollHomePage() {
  const [typewriterText, setTypewriterText] = useState("");
  const [showMoonScene, setShowMoonScene] = useState(false);

  // Typewriter effect
  useEffect(() => {
    if (!showMoonScene) return;

    const text = "Adventure through worlds beyond imagination";
    let index = 0;

    const timer = setInterval(() => {
      setTypewriterText(text.slice(0, index + 1));
      index++;

      if (index >= text.length) {
        clearInterval(timer);
      }
    }, 80);

    return () => clearInterval(timer);
  }, [showMoonScene]);

  return (
    <div className="relative">
      {/* Content sections that trigger animations */}
      <div className="relative z-10">
        {/* Section 1: RPG Core fade in */}
        <motion.div
          className="h-screen w-full"
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.8 }}
        >
          <motion.div
            className="fixed inset-0 bg-black flex items-center justify-center z-50 pointer-events-none"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 },
            }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold text-white">
              RPG Core
            </h1>
          </motion.div>
        </motion.div>

        {/* Section 2: RPG Core moves up and away */}
        <motion.div
          className="h-screen w-full"
          initial="static"
          whileInView="moveUp"
          viewport={{ amount: 0.5 }}
        >
          <motion.div
            className="fixed inset-0 bg-black flex items-center justify-center z-50 pointer-events-none"
            variants={{
              static: { y: "0vh", opacity: 1 },
              moveUp: { y: "-100vh", opacity: 1 },
            }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            <h1 className="text-6xl md:text-8xl font-bold text-white">
              RPG Core
            </h1>
          </motion.div>
        </motion.div>

        {/* Section 3: Moon scene appears */}
        <motion.div
          className="h-screen w-full relative"
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ amount: 0.8 }}
          onViewportEnter={() => setShowMoonScene(true)}
        >
          <motion.div
            className="fixed inset-0 bg-black z-40 pointer-events-none"
            variants={{
              offscreen: { scale: 1.5, opacity: 0 },
              onscreen: { scale: 1, opacity: 1 },
            }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Stars */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(2px 2px at 20px 30px, #fff, transparent),
                              radial-gradient(2px 2px at 40px 70px, #fff, transparent),
                              radial-gradient(1px 1px at 90px 40px, #fff, transparent),
                              radial-gradient(1px 1px at 130px 80px, #fff, transparent),
                              radial-gradient(2px 2px at 160px 30px, #fff, transparent)`,
                backgroundRepeat: "repeat",
                backgroundSize: "200px 100px",
              }}
            />

            {/* Earth */}
            <motion.div
              className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-gradient-to-br from-blue-400 via-green-400 to-blue-600 shadow-2xl"
              variants={{
                offscreen: { scale: 0, rotate: -180 },
                onscreen: { scale: 1, rotate: 0 },
              }}
              transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
            >
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-300 via-green-300 to-blue-500 opacity-80"></div>
            </motion.div>

            {/* Moon surface */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-400 via-gray-300 to-gray-200"
              variants={{
                offscreen: { y: 100 },
                onscreen: { y: 0 },
              }}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            />

            {/* Typewriter text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.h2
                className="text-4xl md:text-6xl font-bold text-white text-center max-w-4xl px-8"
                variants={{
                  offscreen: { opacity: 0 },
                  onscreen: { opacity: 1 },
                }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                {typewriterText}
                {typewriterText.length > 0 && (
                  <motion.span
                    className="inline-block"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    |
                  </motion.span>
                )}
              </motion.h2>
            </div>
          </motion.div>
        </motion.div>

        {/* Final content */}
        <motion.div
          className="relative bg-background min-h-screen p-8"
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ amount: 0.3 }}
        >
          <motion.div
            className="max-w-4xl mx-auto"
            variants={{
              offscreen: { y: 50, opacity: 0 },
              onscreen: { y: 0, opacity: 1 },
            }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold mb-6">Welcome to RPG Core</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Making it easier than ever to get into tabletop gaming. Built by
              the community, for the community.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Ready-to-Run Adventures",
                  desc: "Well-tested adventures that actually work at the table.",
                },
                {
                  title: "Asset Library",
                  desc: "Build your collection of characters, creatures, items, and locations.",
                },
                {
                  title: "Campaign Tools",
                  desc: "Connect your adventures and assets into cohesive campaigns.",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="p-6 border border-border rounded-lg"
                  variants={{
                    offscreen: { y: 30, opacity: 0 },
                    onscreen: { y: 0, opacity: 1 },
                  }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                >
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
