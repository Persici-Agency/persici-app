import 'server-only';
import { revalidatePath } from 'next/cache';

/**
 * Revalidates Next.js pre-rendered pages on demand across both English and Arabic.
 * This ensures content saved in the dashboard appears on the live website immediately
 * without requiring any code rebuilds or server restarts.
 */
export function revalidatePageContent(slug?: string): { success: boolean } {
  try {
    if (!slug || slug === 'home') {
      revalidatePath('/[lang]', 'page');
      revalidatePath('/en');
      revalidatePath('/ar');
    } else {
      revalidatePath(`/[lang]/${slug}`, 'page');
      revalidatePath(`/en/${slug}`);
      revalidatePath(`/ar/${slug}`);
    }

    // Also revalidate layout to refresh header/footer navigation if needed
    revalidatePath('/[lang]', 'layout');
    return { success: true };
  } catch (err) {
    console.warn('[revalidatePageContent] Cache revalidation notice:', err);
    return { success: false };
  }
}
