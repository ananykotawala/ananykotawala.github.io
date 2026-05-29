import Link from "next/link";

export const metadata = {
  title: "Publications — Anany Kotawala",
};

export default function Publications() {
  return (
    <>
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          background: "#fff",
          borderBottom: "1px solid #eee",
          padding: "10px 0",
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "0 16px",
            boxSizing: "border-box",
          }}
        >
          <nav style={{ textAlign: "center", whiteSpace: "nowrap" }}>
            <Link href="/">Home</Link> |{" "}
            <span style={{ fontWeight: "bold", color: "black" }}>
              Publications
            </span>{" "}
            | <Link href="/academics">Academics</Link>
          </nav>
        </div>
      </div>

      <div className="container">
        <section>
          <h2>Publications</h2>
          <ul>
            <li style={{ marginBottom: "1.5em" }}>
              <strong>Title of paper one</strong>
              <br />
              <strong>Anany Kotawala</strong>*, Coauthor One, Coauthor Two
              <br />
              Conference / Workshop 2025{" "}
              <a href="#" target="_blank" rel="noreferrer">
                [arXiv]
              </a>{" "}
              <a href="#" target="_blank" rel="noreferrer">
                [code]
              </a>
            </li>

            <li style={{ marginBottom: "1.5em" }}>
              <strong>Title of paper two</strong>
              <br />
              Coauthor, <strong>Anany Kotawala</strong>, Another Coauthor
              <br />
              Conference / Workshop 2024{" "}
              <a href="#" target="_blank" rel="noreferrer">
                [arXiv]
              </a>
            </li>

            <li style={{ marginBottom: "1.5em" }}>
              <strong>Title of paper three</strong>
              <br />
              <strong>Anany Kotawala</strong>* and Coauthor*
              <br />
              Conference / Workshop 2023{" "}
              <a href="#" target="_blank" rel="noreferrer">
                [arXiv]
              </a>
            </li>
          </ul>
        </section>

        <section>
          <h2>Preprints</h2>
          <ul>
            <li style={{ marginBottom: "1.5em" }}>
              <strong>Title of preprint</strong>
              <br />
              <strong>Anany Kotawala</strong>*, Coauthor
              <br />
              under review, 2026{" "}
              <a href="#" target="_blank" rel="noreferrer">
                [arXiv]
              </a>
            </li>
          </ul>
        </section>

        <footer>
          <p>© 2026 Anany Kotawala</p>
        </footer>
      </div>
    </>
  );
}
