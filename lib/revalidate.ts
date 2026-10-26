import 'server-only';
import { revalidatePath } from 'next/cache';

/**
 * Revalidates Next.js pre-rendered pages on demand across both English and Arabic.
 * This ensures content saved in the dashboard appears on the live website immediately
 * without requiring any code rebuilds or server restarts.
 */
export function revalidatePageContent(slug?: string): { success: boolean } {
  try {
    if (!slug || slug === 'home' || slug === 'shared-contact' || slug === 'contact-section') {
      revalidatePath('/[lang]', 'page');
      revalidatePath('/en');
      revalidatePath('/ar');
      revalidatePath('/[lang]', 'layout');
    } else if (slug.startsWith('solutions-')) {
      const featureSlug = slug.replace(/^solutions-/, '');
      revalidatePath('/[lang]/solutions/[slug]', 'page');
      revalidatePath(`/en/solutions/${featureSlug}`);
      revalidatePath(`/ar/solutions/${featureSlug}`);
      revalidatePath('/[lang]/solutions', 'page');
      revalidatePath('/en/solutions');
      revalidatePath('/ar/solutions');
    } else if (slug.startsWith('industries-')) {
      const featureSlug = slug.replace(/^industries-/, '');
      revalidatePath('/[lang]/industries/[slug]', 'page');
      revalidatePath(`/en/industries/${featureSlug}`);
      revalidatePath(`/ar/industries/${featureSlug}`);
      revalidatePath('/[lang]/industries', 'page');
      revalidatePath('/en/industries');
      revalidatePath('/ar/industries');
    } else if (slug.startsWith('how-we-do-it-')) {
      const featureSlug = slug.replace(/^how-we-do-it-/, '');
      revalidatePath('/[lang]/how-we-do-it/[slug]', 'page');
      revalidatePath(`/en/how-we-do-it/${featureSlug}`);
      revalidatePath(`/ar/how-we-do-it/${featureSlug}`);
      revalidatePath('/[lang]/how-we-do-it', 'page');
      revalidatePath('/en/how-we-do-it');
      revalidatePath('/ar/how-we-do-it');
    } else {
      revalidatePath(`/[lang]/${slug}`, 'page');
      revalidatePath(`/en/${slug}`);
      revalidatePath(`/ar/${slug}`);
      if (slug === 'solutions') {
        revalidatePath('/[lang]/solutions/[slug]', 'page');
      }
      if (slug === 'industries') {
        revalidatePath('/[lang]/industries/[slug]', 'page');
      }
      if (slug === 'how-we-do-it') {
        revalidatePath('/[lang]/how-we-do-it/[slug]', 'page');
      }
      if (slug === 'careers') {
        revalidatePath('/[lang]/careers/[slug]', 'page');
      }
      if (slug === 'insights') {
        revalidatePath('/[lang]/insights/[slug]', 'page');
        revalidatePath('/[lang]/solutions', 'page');
        revalidatePath('/[lang]/solutions/[slug]', 'page');
        revalidatePath('/[lang]/industries', 'page');
        revalidatePath('/[lang]/industries/[slug]', 'page');
      }
      if (slug === 'client-stories' || slug === 'projects' || slug === 'work') {
        revalidatePath('/[lang]/client-stories/[slug]', 'page');
        revalidatePath('/[lang]/client-stories', 'page');
        revalidatePath('/en/client-stories');
        revalidatePath('/ar/client-stories');
        revalidatePath('/[lang]/work', 'page');
        revalidatePath('/en/work');
        revalidatePath('/ar/work');
        revalidatePath('/[lang]/solutions', 'page');
        revalidatePath('/[lang]/solutions/[slug]', 'page');
        revalidatePath('/en/solutions');
        revalidatePath('/ar/solutions');
        revalidatePath('/[lang]/industries', 'page');
        revalidatePath('/[lang]/industries/[slug]', 'page');
        revalidatePath('/en/industries');
        revalidatePath('/ar/industries');
        revalidatePath('/[lang]/how-we-do-it', 'page');
        revalidatePath('/[lang]/how-we-do-it/[slug]', 'page');
        revalidatePath('/en/how-we-do-it');
        revalidatePath('/ar/how-we-do-it');
      }
    }

    // Also revalidate layout to refresh header/footer navigation if needed
    revalidatePath('/[lang]', 'layout');
    return { success: true };
  } catch (err) {
    console.warn('[revalidatePageContent] Cache revalidation notice:', err);
    return { success: false };
  }
}
