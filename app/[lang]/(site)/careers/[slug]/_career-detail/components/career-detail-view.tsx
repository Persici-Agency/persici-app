import { CareerDetailHeaderSection } from './career-detail-header-section';

export type CareerDetailViewProps = {
  slug: string;
};

export function CareerDetailView({ slug }: CareerDetailViewProps) {
  return (
    <div>
      <CareerDetailHeaderSection slug={slug} />
    </div>
  );
}
