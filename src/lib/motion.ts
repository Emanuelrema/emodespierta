export const transitionFast = { duration: 0.15, ease: "easeOut" };
export const transitionNormal = { duration: 0.25, ease: [0.16, 1, 0.3, 1] }; // custom elegant easeOutExpo
export const transitionSlow = { duration: 0.4, ease: [0.16, 1, 0.3, 1] };

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transitionNormal },
};

export const fadeInUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: transitionNormal },
};

export const fadeInDown = {
  hidden: { opacity: 0, y: -15 },
  visible: { opacity: 1, y: 0, transition: transitionNormal },
};

export const scaleUp = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: transitionNormal },
};

export const slideInLeft = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: transitionNormal },
};

export const slideInRight = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: transitionNormal },
};

export const staggerContainer = (staggerChildren = 0.05, delayChildren = 0) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});
