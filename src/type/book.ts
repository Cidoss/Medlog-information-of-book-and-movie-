export interface Book {
  key: string;
  title: string;
  description?: string | { type: string; value: string };
  covers?: number[];
  cover_i?: number;
  first_publish_date?: string;
  subjects?: string[];
  subject_places?: string[];
}