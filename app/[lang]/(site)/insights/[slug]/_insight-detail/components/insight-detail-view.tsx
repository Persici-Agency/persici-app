import { InsightDetailHeaderSection } from './insight-detail-header-section';

export type InsightDetailViewProps = {
  slug: string;
};

export function InsightDetailView({ slug }: InsightDetailViewProps) {
  return (
    <div>
      <InsightDetailHeaderSection slug={slug} />
    </div>
  );
}
