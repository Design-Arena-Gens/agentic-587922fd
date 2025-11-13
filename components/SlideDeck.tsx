"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

type Slide = {
  title: string;
  bullets: string[];
  highlight: string;
};

const slides: Slide[] = [
  {
    title: "Interpreting People",
    highlight: "Analytical empathy sharpens workplace relationships",
    bullets: [
      "Literary analysis teaches us to read between the lines of conversations.",
      "Complex characters mirror diverse personalities we meet daily.",
      "Recognizing tone and subtext reduces miscommunication.",
    ],
  },
  {
    title: "Critical Thinking",
    highlight: "Argument evaluation prepares us for fast decisions",
    bullets: [
      "Plot reasoning trains us to spot faulty assumptions and bias.",
      "Comparing themes builds structured problem-solving habits.",
      "Evidence-driven interpretations transfer to data-driven roles.",
    ],
  },
  {
    title: "Communication Skills",
    highlight: "Vocabulary depth boosts clarity and persuasion",
    bullets: [
      "Exposure to nuanced diction expands expressive range.",
      "Narrative cadence inspires engaging presentations and emails.",
      "Metaphors and storytelling make technical ideas memorable.",
    ],
  },
  {
    title: "Cultural Intelligence",
    highlight: "Stories cultivate respect for global perspectives",
    bullets: [
      "Historical contexts explain modern social dynamics.",
      "Diverse voices highlight unseen assumptions in teams.",
      "Empathy with distant lives powers inclusive leadership.",
    ],
  },
  {
    title: "Personal Resilience",
    highlight: "Character journeys model resilience strategies",
    bullets: [
      "Literary conflicts normalize setbacks and adaptations.",
      "Reflective reading builds emotional vocabulary for stress.",
      "Role models from fiction inspire purposeful growth.",
    ],
  },
];

export default function SlideDeck() {
  const deckRef = useRef<HTMLDivElement | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const chunkedSlides = useMemo(() => {
    return slides.map((slide, index) => ({
      ...slide,
      id: `slide-${index + 1}`,
    }));
  }, []);

  const handleExport = useCallback(async () => {
    if (!deckRef.current) return;
    setIsExporting(true);

    try {
      const pdf = new jsPDF("landscape", "pt", [842, 595]);

      for (let i = 0; i < deckRef.current.children.length; i += 1) {
        const slideElement = deckRef.current.children[
          i
        ] as HTMLDivElement | null;
        if (!slideElement) continue;

        const canvas = await html2canvas(slideElement, {
          backgroundColor: "#ffffff",
          scale: 2,
          useCORS: true,
        });
        const imgData = canvas.toDataURL("image/png");

        if (i > 0) {
          pdf.addPage();
        }

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
      }

      pdf.save("english-literature-benefits.pdf");
    } finally {
      setIsExporting(false);
    }
  }, []);

  return (
    <div className="deck-wrapper">
      <header className="deck-header">
        <div>
          <h1>English Literature in Practical Life</h1>
          <p>Five concise slides illustrating everyday benefits.</p>
        </div>
        <button
          type="button"
          className="export-button"
          onClick={handleExport}
          disabled={isExporting}
        >
          {isExporting ? "Preparing PDF…" : "Download PDF"}
        </button>
      </header>
      <div className="slides-grid" ref={deckRef}>
        {chunkedSlides.map((slide) => (
          <article key={slide.id} className="slide-card">
            <div className="slide-pattern" />
            <div className="slide-content">
              <span className="slide-number">{slide.id.replace("slide-", "#")}</span>
              <h2>{slide.title}</h2>
              <p className="slide-highlight">{slide.highlight}</p>
              <ul>
                {slide.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
