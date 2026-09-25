export interface ReviewDto {
  id: string;
  themeId: string;
  authorName: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
  isDemo: boolean;
}
