export const ENDING_CONFIG = {
  texts: {
    typewriterLines: [
      "Hay personas...",
      "que llegan a nuestra vida.",
      "Y hay personas...",
      "que dejan recuerdos para siempre.",
      "Hoy, varias personas quisieron reunirse para decirte algo muy especial."
    ],
    birthdayTitle: "🎉 Feliz Cumpleaños Emily 🎉",
    birthdaySubtitle: "Esperamos que disfrutes este pequeño regalo hecho con mucho cariño.",
    buttonLabel: "💌 Abrir tu regalo"
  },
  assets: {
    // Background music track URL (fade-in enabled). Customizable by the user.
    musicUrl: "/audio/ending_theme.mp3",
    sfx: {
      firework: "/audio/sfx_firework.mp3",
      cake: "/audio/sfx_cake.mp3",
      confetti: "/audio/sfx_confetti.mp3",
      click: "/audio/sfx_click.mp3",
      transition: "/audio/sfx_transition.mp3"
    },
    // Customize with real cake image path if desired.
    // If left blank, a beautiful animated SVG/CSS pixel-art style cake renders.
    cakeImageUrl: ""
  },
  theme: {
    backgroundGradient: "linear-gradient(to bottom, #020205, #08071e, #0d0a2d)",
    titleColor: "#ffffff",
    subtitleColor: "rgba(255, 255, 255, 0.7)",
    buttonBgColor: "#ff003c",
    buttonGlowColor: "rgba(255, 0, 60, 0.5)"
  }
};
