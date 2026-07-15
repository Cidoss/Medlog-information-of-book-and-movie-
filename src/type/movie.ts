export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path?: string;
  vote_average: number;
  vote_count?: number;
  release_date: string;
  runtime?: number;
  tagline?: string;
  budget?: number;
  revenue?: number;
  status?: string;
  genres?: { id: number; name: string }[];
  production_companies?: { id: number; name: string; logo_path: string | null }[];
  overview?: string;
}