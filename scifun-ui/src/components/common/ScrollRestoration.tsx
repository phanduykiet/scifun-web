import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollRestoration = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const scrollToLessons = () => {
      const lessonsEl = document.getElementById("lessons-section");
      if (lessonsEl) {
        const y = lessonsEl.getBoundingClientRect().top + window.scrollY - 60;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    };

    // đợi DOM render xong
    const timer = setTimeout(scrollToLessons, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
};

export default ScrollRestoration;
