import type { Dictionary } from '@dictionaries';
import { ContactHeroSection } from './contact-hero-section';
import { ContactFormSection } from './contact-form-section';

export type ContactViewProps = {
  lang: string;
  dict: Dictionary;
};

export function ContactView({ dict }: ContactViewProps) {
  return (
    <div>
      <ContactHeroSection dict={dict} />
      <ContactFormSection dict={dict} />
    </div>
  );
}
