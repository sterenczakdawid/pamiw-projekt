export interface Movie {
  id: number;
  title: string;
  director: Director;
  yearOfRelease: number;
  posterUrl: string;
}

export interface Director {
  id: number;
  name: string;
  surname: string;
}
