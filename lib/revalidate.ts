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
    } else {
      revalidatePath(`/[lang]/${slug}`, 'page');
      revalidatePath(`/en/${slug}`);
      revalidatePath(`/ar/${slug}`);
      if (slug === 'solutions') {
        revalidatePath('/[lang]/solutions/[slug]', 'page');
      }
      if (slug === 'careers') {
        revalidatePath('/[lang]/careers/[slug]', 'page');
      }
      if (slug === 'insights') {
        revalidatePath('/[lang]/insights/[slug]', 'page');
        revalidatePath('/[lang]/solutions', 'page');
        revalidatePath('/[lang]/solutions/[slug]', 'page');
      }
      if (slug === 'client-stories' || slug === 'projects') {
        revalidatePath('/[lang]/client-stories/[slug]', 'page');
        revalidatePath('/[lang]/solutions', 'page');
        revalidatePath('/[lang]/solutions/[slug]', 'page');
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
