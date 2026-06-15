import { ThemeToggle } from "@/components/ThemeToggle";
import { Cardioid } from "@/components/Cardioid";
import Hero from "@/components/ui/animated-shader-hero";
import { KeyboardKey } from "@/components/ui/keyboard-key-button";

/* eslint-disable @typescript-eslint/no-unused-vars */

function LinkedinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="currentColor"
      aria-hidden="true"
      className="icon-inline"
    >
      <path d="M20.45 20.45h-3.55v-5.56c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.95v5.65H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="currentColor"
      aria-hidden="true"
      className="icon-inline"
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.07c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.27-1.68-1.27-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.76 2.69 1.25 3.34.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.77.11 3.06.73.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.26 5.68.41.36.78 1.06.78 2.13v3.15c0 .31.21.67.8.56C20.22 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

function ScholarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="currentColor"
      aria-hidden="true"
      className="icon-inline"
    >
      <path d="M12 1 0 9l4 2.18v6L12 22l8-4.82v-6L24 9 12 1Zm0 2.36L20.5 9 12 14.64 3.5 9 12 3.36ZM6 12.46l6 3.94 6-3.94v3.36L12 19.5l-6-3.18v-3.86Z" />
    </svg>
  );
}

function CvIcon() {
  return (
    <svg
      viewBox="0 0 14 16"
      width="14"
      height="16"
      fill="currentColor"
      aria-hidden="true"
      className="icon-inline"
    >
      <path d="M9 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V5L9 1Zm0 1.4L11.6 5H9V2.4ZM3 6h4v1H3V6Zm0 3h8v1H3V9Zm0 3h8v1H3v-1Z" />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      <KeyboardKey letter="A" />
      <ThemeToggle />

      <Hero
        headline={{
          line1: "Hey, I'm Anany.",
          line2: "I like exploring inflection points.",
        }}
        subtitle=""
        buttons={{
          primary: {
            text: "View Work",
            href: "#portfolio",
          },
          secondary: {
            text: "Get in Touch",
            href: "mailto:akotawala@princeton.edu",
          },
        }}
      />

      <div id="page-wrap" style={{ scrollMarginTop: 0 }}>
        <span id="portfolio" />
        <h1 className="name">Anany Kotawala</h1>

        <div className="info" style={{ textAlign: "center" }}>
          <LinkedinIcon /> LinkedIn:{" "}
          <a
            className="tt"
            href="https://www.linkedin.com/in/ananykotawala/"
            target="_blank"
            rel="noreferrer"
          >
            ananykotawala
          </a>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <ScholarIcon /> Google Scholar:{" "}
          <a
            className="tt"
            href="https://scholar.google.com/citations?user=84UFQ6MAAAAJ&hl=en&oi=ao"
            target="_blank"
            rel="noreferrer"
          >
            link
          </a>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <GithubIcon /> GitHub:{" "}
          <a
            className="tt"
            href="https://github.com/ananykotawala"
            target="_blank"
            rel="noreferrer"
          >
            ananykotawala
          </a>
        </div>

        <div id="pic-wrap">
          <img
            className="borderedpicture"
            src="/profile.jpg"
            alt="Anany Kotawala"
          />
        </div>

        <div id="objective">
          <p style={{ marginTop: 23, marginBottom: 22 }}>
            Hi! I&rsquo;m Anany, a senior at Princeton University studying
            Financial Engineering, with minors in computer science,
            optimization, and cognitive science.
          </p>
          <p style={{ marginBottom: 22 }}>
            These days I spend most of my time on reinforcement learning,
            strategic games, and markets, and what they share: decisions made
            fast, under uncertainty, against other decision-makers. I love
            problems where reasoning and coordination either snap into place
            or fall apart.
          </p>
          <p style={{ marginBottom: 22 }}>
            A lot of what I&rsquo;m working on now sits on the AI safety side
            of RL: whether reward signals measure what you wanted, whether
            behavior holds up outside training. The metrics we trust most are
            often the ones that have failed in ways we haven&rsquo;t seen
            yet, and that&rsquo;s where I want to spend more time.
          </p>
          <p style={{ marginBottom: 8 }}>
            <strong>Currently:</strong>
          </p>
          <ul>
            <li>
              Cooperative multi-agent RL in SocialJax: adapting
              distributed-systems scalability models (Universal Scalability
              Law) to learned-team performance across sizes 2&ndash;10,
              comparing how RL agents scale against human teams on the same
              environments.
            </li>
            <li>
              Connect 4 as a clean RL testbed for genuine strategic structure
              versus local pattern-matching: training self-play DQN and
              tabular Q-learning agents, then probing their value functions
              across 63 diagnostic positions to localize where policies and
              humans transition between local heuristics and global structure.
            </li>
            <li>
              Lucky CoT: developing a step-level faithfulness metric and
              diagnostic benchmark for chain-of-thought reasoning, quantifying
              when frontier models do the multi-step work versus when they
              land on the right answer by accident.
            </li>
          </ul>
          <p style={{ marginBottom: 20 }}>
            Always up for a conversation, especially with people thinking from
            angles I haven&rsquo;t. Reach me at{" "}
            <a className="tt" href="mailto:akotawala@princeton.edu">
              akotawala[at]princeton.edu
            </a>
            .
          </p>
        </div>

        <div style={{ clear: "both", paddingTop: 40 }}>
          <h2 style={{ marginTop: 30 }}>Papers</h2>
          <ol className="papers">
            <li>
              <span className="paper-title">
                GENSTRAT: Toward a Science of Strategic Reasoning in Large
                Language Models
              </span>
              <span className="paper-authors">
                Vartan Shadarevian, Kia Ghods, Alex Kenich,{" "}
                <strong>Anany Kotawala</strong>
              </span>
              <span className="paper-venue">
                Under Review · 2026 [
                <a
                  href="https://arxiv.org/abs/2605.23238"
                  target="_blank"
                  rel="noreferrer"
                >
                  arXiv
                </a>
                ]
              </span>
            </li>

            <li>
              <span className="paper-title">
                NumLeak: Public Numeric Benchmarks as Latent Labels in
                Foundation Models
              </span>
              <span className="paper-authors">
                <strong>Anany Kotawala</strong>
              </span>
              <span className="paper-venue">
                2nd Workshop on the Impact of Memorization on Trustworthy
                Foundation Models (MemFM) at ICML · 2026 [
                <a
                  href="https://arxiv.org/abs/2605.30393"
                  target="_blank"
                  rel="noreferrer"
                >
                  arXiv
                </a>
                ]
              </span>
            </li>

            <li>
              <span className="paper-title">
                Resolution Diagnostics for Paired LLM Evaluation
              </span>
              <span className="paper-authors">
                <strong>Anany Kotawala</strong>
              </span>
              <span className="paper-venue">
                Accepted, ICML 2026 Workshop on Hypothesis Testing · Seoul,
                South Korea [
                <a
                  href="https://arxiv.org/abs/2605.30315"
                  target="_blank"
                  rel="noreferrer"
                >
                  arXiv
                </a>
                ]
              </span>
            </li>

            <li>
              <span className="paper-title">
                Locally Coherent, Globally Incoherent: Bounding Compositional
                Incoherence in Multi-Component LLM Agents
              </span>
              <span className="paper-authors">
                <strong>Anany Kotawala</strong>
              </span>
              <span className="paper-venue">
                Preliminary versions to appear at ICML 2026 Workshops on
                Combining Theory and Benchmarks (CTB), Statistical Frameworks
                for Uncertainty in Agentic Systems (AgenticUQ), and Failure
                Modes of Agentic AI (FAGEN) [
                <a
                  href="https://arxiv.org/abs/2605.30335"
                  target="_blank"
                  rel="noreferrer"
                >
                  arXiv
                </a>
                ]
              </span>
            </li>
          </ol>

          <h2 style={{ marginTop: 50 }}>Academic Service</h2>
          <ol className="service">
            <li>
              Reviewer, <em>The Impact of Memorization on Trustworthy
              Foundation Models</em> @ ICML 2026
            </li>
            <li>
              Reviewer, <em>Philosophy Meets Machine Learning</em> @ ICML 2026
            </li>
          </ol>
        </div>
      </div>

      <a
        href="https://en.wikipedia.org/wiki/Cardioid"
        target="_blank"
        rel="noreferrer"
        aria-label="Times-Table Cardioid — Wikipedia"
        className="cardioid-link"
      >
        <Cardioid />
      </a>
      <p className="cardioid-caption">Times-Table Cardioid</p>
    </>
  );
}
