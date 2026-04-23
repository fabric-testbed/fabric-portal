import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "50vh" }}>
      <h2>Page Not Found</h2>
      <p className="text-muted">The page you are looking for does not exist.</p>
      <Link href="/" className="btn btn-outline-primary mt-3">
        Go Home
      </Link>
    </div>
  );
}
