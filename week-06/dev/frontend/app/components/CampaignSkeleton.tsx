export default function CampaignSkeleton() {
  return (
    <div className="project-card skeleton-card">
      <div className="skeleton-img" />
      <div className="card-body">
        <div className="skeleton-line skeleton-line--short" />
        <div className="skeleton-line skeleton-line--title" />
        <div className="skeleton-line" />
        <div className="skeleton-line" />
        <div className="skeleton-line skeleton-line--half" />
        <div className="skeleton-progress" />
        <div className="skeleton-line skeleton-line--short" style={{ marginTop: "12px" }} />
      </div>
    </div>
  );
}
