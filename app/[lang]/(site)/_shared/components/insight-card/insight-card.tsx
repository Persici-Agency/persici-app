'use client';

import React from 'react';
import { ContentCard, type ContentCardProps, type ContentCardItem } from '../content-card';

export type InsightCardItem = ContentCardItem;
export type InsightCardProps = ContentCardProps;

/**
 * InsightCard
 * Standalone card for insights, articles, and client stories.
 * Displays category tag with contextual icon, headline, thin divider line, and publication date.
 * Features smooth elevation on hover, crimson accent highlights, and full RTL support.
 */
export function InsightCard(props: InsightCardProps) {
  return <ContentCard {...props} />;
}

// Reusable aliases
export const ArticleCard = InsightCard;
export type ArticleCardProps = InsightCardProps;
export const InsightArticleCard = InsightCard;
export type InsightArticleCardProps = InsightCardProps;
