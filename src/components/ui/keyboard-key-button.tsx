"use client";

export function KeyboardKey({ letter = "A" }: { letter?: string }) {
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="kbd-key-wrap">
      <button
        type="button"
        onClick={handleClick}
        aria-label="Back to top"
        className="kbd-key"
      >
        <span className="kbd-key-letter">{letter}</span>
      </button>
    </div>
  );
}
