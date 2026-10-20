


import { useState } from "react";
import "./App.css";

const STORAGE_KEY = "unisolve-reports";

const categories = [
  {
    name: "Electricity",
    description: "Lights, fans and power-related issues.",
    icon: "electricity",
  },
  {
    name: "Cleanliness",
    description: "Waste, litter and campus hygiene.",
    icon: "cleanliness",
  },
  {
    name: "Water",
    description: "Water supply, leakage and drinking water.",
    icon: "water",
  },
  {
    name: "Infrastructure",
    description: "Classrooms, furniture and damaged facilities.",
    icon: "infrastructure",
  },
];

function CategoryIcon({ type }) {
  const common = {
    width: 30,
    height: 30,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  switch (type) {
    case "electricity":
      return (
        <svg {...common}>
          <path d="M13 2 4 14h7l-1 8 10-13h-7l0-7Z" />
        </svg>
      );
    case "cleanliness":
      return (
        <svg {...common}>
          <path d="M3 6h18" />
          <path d="m8 6 1 14h6l1-14" />
          <path d="M9 6V3h6v3" />
          <path d="M10 10v6M14 10v6" />
        </svg>
      );
    case "water":
      return (
        <svg {...common}>
          <path d="M12 2s7 8 7 13a7 7 0 0 1-14 0c0-5 7-13 7-13Z" />
          <path d="M9 16a3 3 0 0 0 3 3" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M3 21h18" />
          <path d="M5 21V7l7-4 7 4v14" />
          <path d="M9 21v-6h6v6" />
          <path d="M9 9h.01M15 9h.01" />
        </svg>
      );
  }
}

function getSavedReports() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function App() {
  const [reports, setReports] = useState(getSavedReports);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [submittedReport, setSubmittedReport] = useState(null);
  const [formError, setFormError] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [reportSearch, setReportSearch] = useState("");
  const [reportFilter, setReportFilter] = useState("All");

  const filteredReports = reports.filter((report) => {
    const searchText = reportSearch.trim().toLowerCase();
    const matchesSearch =
      !searchText ||
      [report.title, report.category, report.location, report.id]
        .some((value) => String(value || "").toLowerCase().includes(searchText));
    const matchesStatus =
      reportFilter === "All" ||
      (report.status || "Submitted") === reportFilter;
    return matchesSearch && matchesStatus;
  });

  const submittedCount = reports.filter(
    (report) => (report.status || "Submitted") === "Submitted"
  ).length;
  const inProgressCount = reports.filter(
    (report) => report.status === "In Progress"
  ).length;
  const resolvedCount = reports.filter(
    (report) => report.status === "Resolved"
  ).length;

  const [form, setForm] = useState({
    title: "",
    category: "Electricity",
    location: "",
    description: "",
    image: "",
  });

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFormError("Please select an image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 1024 * 1024) {
      setFormError("Please choose an image smaller than 1 MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const image = String(reader.result || "");
      setImagePreview(image);
      setForm((current) => ({ ...current, image }));
      setFormError("");
    };

    reader.onerror = () => {
      setFormError("The image could not be loaded. Please try again.");
    };

    reader.readAsDataURL(file);
  }

  function openReportForm() {
    setSubmittedReport(null);
    setFormError("");
    setIsFormOpen(true);
  }

  function closeReportForm() {
    setIsFormOpen(false);
    setSubmittedReport(null);
    setFormError("");
    setImagePreview("");
    setForm({
      title: "",
      category: "Electricity",
      location: "",
      description: "",
      image: "",
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    const report = {
      id: `UNI-${Date.now().toString().slice(-8)}`,
      title: form.title.trim(),
      category: form.category,
      location: form.location.trim(),
      description: form.description.trim(),
      image: form.image,
      status: "Submitted",
      date: new Date().toLocaleDateString("en-IN"),
    };

    const updatedReports = [report, ...reports];

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReports));
      setReports(updatedReports);
      setSubmittedReport(report);
    } catch {
      setFormError(
        "The report could not be saved in this browser. Try removing the image or using a smaller one."
      );
    }
  }

  function scrollToSection(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <main className="site">
      <nav className="navbar">
        <a
          className="brand"
          href="#home"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          
          <span>UniSolve</span>
        </a>

        <div className="nav-links">
          <button onClick={() => scrollToSection("categories")}>
            Categories
          </button>
          <button onClick={() => scrollToSection("my-reports")}>My Reports</button>
          <button onClick={() => scrollToSection("about")}>About</button>
        </div>

        <button className="nav-cta" onClick={openReportForm}>
          Report an Issue <span aria-hidden="true">↗</span>
        </button>
      </nav>

      <section className="hero" id="home">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            YOUR CAMPUS, YOUR VOICE
          </div>

          <h1>
            A better
            <br />
            campus,
            <br />
            <span>starts with you.</span>
          </h1>

          <p className="hero-description">
            See something that needs fixing? Let’s make campus life better,
            one report at a time.
          </p>

          <div className="hero-actions">
            <button className="primary-button" onClick={openReportForm}>
              Report an issue <span aria-hidden="true">↗</span>
            </button>
            <button
              className="text-button"
              onClick={() => scrollToSection("categories")}
            >
              Explore categories <span aria-hidden="true">↓</span>
            </button>
          </div>

          <div className="hero-note">
            <span className="note-check">✓</span>
            Small reports. Meaningful change.
          </div>
        </div>

        <div className="floating-scene" aria-label="See it, fix it, report it">
          <div className="solve-word" aria-hidden="true">
            SOLVE
          </div>

          <div className="float-card card-see">
            <span className="card-icon sparkle-icon" aria-hidden="true">
              ✳
            </span>
            <span className="float-card-label">See It.</span>
          </div>

          <div className="float-card card-fix">
            <span className="card-icon check-icon" aria-hidden="true">
              ✓
            </span>
            <span className="float-card-label">Fix It.</span>
          </div>

          <div className="float-card card-report">
            <span className="card-icon arrow-icon" aria-hidden="true">
              ↗
            </span>
            <span className="float-card-label">Report It.</span>
          </div>

          <div className="scene-sparkle sparkle-one" aria-hidden="true">
            ✳
          </div>
          <div className="scene-sparkle sparkle-two" aria-hidden="true">
            +
          </div>
        </div>

        <div className="hero-bottom">
          <span>MADE FOR CAMPUS LIFE</span>
          <span className="hero-bottom-line" />
          <span>NOTICE IT. REPORT IT. IMPROVE IT.</span>
        </div>
      </section>

      <section className="categories-section section-pad" id="categories">
        <div className="section-heading">
          <div>
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              WHAT NEEDS ATTENTION?
            </div>
            <h2>
              Every issue
              <br />
              <span>has a place.</span>
            </h2>
          </div>

          <p>
            Choose a category that matches the problem and help us understand
            what needs attention on campus.
          </p>
        </div>

        <div className="category-grid">
          {categories.map((category, index) => (
            <button
              className={`category-card category-${index + 1}`}
              key={category.name}
              onClick={() => {
                setForm((current) => ({
                  ...current,
                  category: category.name,
                }));
                openReportForm();
              }}
            >
              <div className="category-card-top">
                <span className="category-icon">
                  <CategoryIcon type={category.icon} />
                </span>
                <span className="category-number">0{index + 1}</span>
              </div>
              <h3>{category.name}</h3>
              <p>{category.description}</p>
              <span className="category-arrow" aria-hidden="true">
                ↗
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="my-reports-section section-pad" id="my-reports">
        <div className="section-heading reports-heading">
          <div>
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              YOUR CAMPUS ACTIVITY
            </div>
            <h2>
              My <span>reports.</span>
            </h2>
          </div>
          <button className="primary-button reports-new-button" onClick={openReportForm}>
            Report an issue <span aria-hidden="true">↗</span>
          </button>
        </div>

        <div className="report-stats" aria-label="Report summary">
          <div className="report-stat">
            <span className="report-stat-label">TOTAL REPORTS</span>
            <strong>{reports.length}</strong>
          </div>
          <div className="report-stat">
            <span className="report-stat-label">SUBMITTED</span>
            <strong>{submittedCount}</strong>
          </div>
          <div className="report-stat">
            <span className="report-stat-label">IN PROGRESS</span>
            <strong>{inProgressCount}</strong>
          </div>
          <div className="report-stat">
            <span className="report-stat-label">RESOLVED</span>
            <strong>{resolvedCount}</strong>
          </div>
        </div>

        <div className="reports-tools">
          <label className="reports-search">
            <span className="sr-only">Search reports</span>
            <span className="reports-search-icon" aria-hidden="true">⌕</span>
            <input
              type="search"
              value={reportSearch}
              onChange={(event) => setReportSearch(event.target.value)}
              placeholder="Search title, category, location or ID"
            />
          </label>
          <label className="reports-filter">
            <span>STATUS</span>
            <select
              value={reportFilter}
              onChange={(event) => setReportFilter(event.target.value)}
            >
              <option value="All">All reports</option>
              <option value="Submitted">Submitted</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </label>
        </div>

        {filteredReports.length > 0 ? (
          <div className="reports-list">
            {filteredReports.map((report) => {
              const status = report.status || "Submitted";
              const statusClass = status.toLowerCase().replaceAll(" ", "-");

              return (
                <article className="report-item" key={report.id}>
                  {report.image ? (
                    <img className="report-item-image" src={report.image} alt="" />
                  ) : (
                    <div className="report-item-icon" aria-hidden="true">
                      <CategoryIcon
                        type={
                          categories.find((category) => category.name === report.category)?.icon ||
                          "infrastructure"
                        }
                      />
                    </div>
                  )}

                  <div className="report-item-main">
                    <div className="report-item-topline">
                      <span className="report-category">{report.category || "Other"}</span>
                      <span className={`report-status-pill status-${statusClass}`}>
                        <span className="status-dot" />
                        {status}
                      </span>
                    </div>
                    <h3>{report.title || "Untitled report"}</h3>
                    <p className="report-item-description">
                      {report.description || "No description provided."}
                    </p>
                    <div className="report-item-meta">
                      <span><span aria-hidden="true">⌖</span> {report.location || "Location not provided"}</span>
                      <span><span aria-hidden="true">◷</span> {report.date || "Date not available"}</span>
                    </div>
                    <span className="report-item-id">REPORT ID: {report.id}</span>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="reports-empty">
            <div className="reports-empty-icon" aria-hidden="true">↗</div>
            <h3>{reports.length === 0 ? "Your reports will appear here." : "No matching reports."}</h3>
            <p>
              {reports.length === 0
                ? "When you report a campus issue, you can find its location, date and status here."
                : "Try another search term or change the status filter."}
            </p>
            {reports.length === 0 ? (
              <button className="primary-button" onClick={openReportForm}>
                Create your first report <span aria-hidden="true">↗</span>
              </button>
            ) : (
              <button
                className="text-button reports-reset"
                onClick={() => {
                  setReportSearch("");
                  setReportFilter("All");
                }}
              >
                Clear search and filters
              </button>
            )}
          </div>
        )}

        <p className="reports-storage-note">
          <span aria-hidden="true">ⓘ</span> Demo version: these reports are saved only in this browser.
        </p>
      </section>

      <section className="about-section section-pad" id="about">
        <div className="about-sticker" aria-hidden="true">
          <span>YOUR</span>
          <strong>CAMPUS</strong>
          <span>MATTERS ✳</span>
        </div>

        <div className="about-copy">
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            ABOUT UNISOLVE
          </div>
          <h2>
            Better spaces
            <br />
            begin with <span>us.</span>
          </h2>
          <p>
            UniSolve gives students a simple way to report campus issues.
            From broken facilities to everyday maintenance problems, every
            report can help bring attention to something that matters.
          </p>
          <button className="primary-button" onClick={openReportForm}>
            Make a report <span aria-hidden="true">↗</span>
          </button>
        </div>
      </section>

      <section className="report-cta section-pad">
        <div>
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            SEEN SOMETHING?
          </div>
          <h2>Don’t just walk past it.</h2>
          <p>Help make your campus a better place for everyone.</p>
        </div>
        <button className="dark-button" onClick={openReportForm}>
          Report an issue <span aria-hidden="true">↗</span>
        </button>
      </section>

      <footer className="footer">
        <a className="brand footer-brand" href="#home">
          
          <span>UniSolve</span>
        </a>
        <p>Small reports. Meaningful change.</p>
        <span className="footer-copy">© {new Date().getFullYear()} UniSolve</span>
      </footer>

      {isFormOpen && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeReportForm();
          }}
        >
          <section
            className="report-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="report-modal-title"
          >
            <button
              className="modal-close"
              onClick={closeReportForm}
              aria-label="Close report form"
            >
              ×
            </button>

            {submittedReport ? (
              <div className="success-content">
                <div className="success-icon">✓</div>
                <div className="eyebrow">REPORT SAVED</div>
                <h2 id="report-modal-title">Nice one!</h2>
                <p>
                  Your report has been saved in this browser for this demo.
                </p>
                <div className="report-reference">
                  <span>YOUR REPORT ID</span>
                  <strong>{submittedReport.id}</strong>
                  <span className="report-status">
                    {submittedReport.status}
                  </span>
                </div>
                <button
                  className="primary-button modal-submit"
                  onClick={closeReportForm}
                >
                  Done <span aria-hidden="true">✓</span>
                </button>
              </div>
            ) : (
              <>
                <div className="eyebrow">
                  <span className="eyebrow-dot" />
                  MAKE A DIFFERENCE
                </div>
                <h2 id="report-modal-title">Report an issue.</h2>
                <p className="modal-intro">
                  Tell us what’s happening on your campus.
                </p>

                <form className="report-form" onSubmit={handleSubmit}>
                  <label>
                    Issue title
                    <input
                      name="title"
                      value={form.title}
                      onChange={updateField}
                      placeholder="e.g. Broken classroom fan"
                      required
                      maxLength={100}
                    />
                  </label>

                  <label>
                    Category
                    <select
                      name="category"
                      value={form.category}
                      onChange={updateField}
                      required
                    >
                      {categories.map((category) => (
                        <option key={category.name} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                      <option value="Other">Other</option>
                    </select>
                  </label>

                  <label>
                    Location on campus
                    <input
                      name="location"
                      value={form.location}
                      onChange={updateField}
                      placeholder="e.g. Main block, Room 204"
                      required
                      maxLength={120}
                    />
                  </label>

                  <label>
                    Describe the issue
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={updateField}
                      placeholder="What happened? Add any useful details..."
                      required
                      rows={4}
                      maxLength={1000}
                    />
                  </label>

                  <label>
                    Add a photo <span className="optional-label">(optional, max 1 MB)</span>
                    <input
                      className="file-input"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>

                  {imagePreview && (
                    <div className="image-preview-wrap">
                      <img
                        className="image-preview"
                        src={imagePreview}
                        alt="Preview of the selected issue"
                      />
                      <button
                        className="remove-image"
                        type="button"
                        onClick={() => {
                          setImagePreview("");
                          setForm((current) => ({ ...current, image: "" }));
                        }}
                      >
                        Remove photo
                      </button>
                    </div>
                  )}

                  {formError && (
                    <p className="form-error" role="alert">
                      {formError}
                    </p>
                  )}

                  <button className="primary-button modal-submit" type="submit">
                    Submit report <span aria-hidden="true">↗</span>
                  </button>
                  <p className="privacy-note">
                    Demo version: reports are stored only in this browser.
                  </p>
                </form>
              </>
            )}
          </section>
        </div>
      )}
    </main>
  );
}

export default App;
