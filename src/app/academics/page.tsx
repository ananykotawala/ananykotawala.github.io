import Link from "next/link";

export const metadata = {
  title: "Academics — Anany Kotawala",
};

export default function Academics() {
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
            <Link href="/publications">Publications</Link> |{" "}
            <span style={{ fontWeight: "bold", color: "black" }}>
              Academics
            </span>
          </nav>
        </div>
      </div>

      <div className="container">
        <section>
          <h2>Honours</h2>
          <ul>
            <li>
              <span style={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                Award / scholarship one
              </span>
            </li>
            <li>
              <span style={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                Award / scholarship two
              </span>
            </li>
            <li>
              <span style={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                Reviewer, Conference / Journal
              </span>
            </li>
          </ul>
        </section>

        <section>
          <h2>Courses</h2>
          * indicates graduate coursework

          <h3>Reinforcement Learning &amp; Machine Learning</h3>
          <ul>
            <li>
              <strong>
                <span className="course-code">CODE 001*</span> Course name
              </strong>{" "}
              <em>taught by Instructor</em>
            </li>
            <li>
              <strong>
                <span className="course-code">CODE 002</span> Course name
              </strong>{" "}
              <em>taught by Instructor</em>
            </li>
            <li>
              <strong>
                <span className="course-code">CODE 003</span> Course name
              </strong>{" "}
              <em>taught by Instructor</em>
            </li>
          </ul>

          <h3>Quantitative &amp; Financial Methods</h3>
          <ul>
            <li>
              <strong>
                <span className="course-code">CODE 100</span> Course name
              </strong>{" "}
              <em>taught by Instructor</em>
            </li>
            <li>
              <strong>
                <span className="course-code">CODE 101</span> Course name
              </strong>{" "}
              <em>taught by Instructor</em>
            </li>
          </ul>

          <h3>Mathematics &amp; Statistics</h3>
          <ul>
            <li>
              <strong>
                <span className="course-code">CODE 200</span> Course name
              </strong>{" "}
              <em>taught by Instructor</em>
            </li>
            <li>
              <strong>
                <span className="course-code">CODE 201</span> Course name
              </strong>{" "}
              <em>taught by Instructor</em>
            </li>
          </ul>
        </section>

        <section>
          <h2>Teaching Experience</h2>
          <ul>
            <li>
              <strong>
                <span className="course-code">CODE 000</span> Course name
              </strong>{" "}
              (Term Year)
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
