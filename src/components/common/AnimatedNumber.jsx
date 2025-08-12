import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

const AnimatedNumber = ({ value, duration = 1.5, formatValue, style }) => {
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    duration,
    ease: "easeOut",
  });

  const rounded = useTransform(springValue, latest =>
    Math.round(latest)
  );

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  return (
    <motion.span
      style={style}
    >
      {formatValue
        ? rounded.get().toLocaleString("en-US")
        : rounded.get()}
    </motion.span>
  );
};

export default AnimatedNumber;