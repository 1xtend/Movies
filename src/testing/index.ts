import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { IFilters } from '@app/shared/models/filters.interface';
import { MediaType } from '@app/shared/models/media.type';

export const errorResponse = {
  statusText: 'Not found',
  status: 404,
};

export const mockFilters: IFilters = {
  page: 2,
  include_adult: true,
};

export const mockImgData = {
  src: 'https://picsum.photos/200',
  alt: 'test alt',
};

export function expectError(err: HttpErrorResponse): void {
  expect(err.statusText).toBe(errorResponse.statusText);
  expect(err.status).toBe(errorResponse.status);
}

export function getUrl(
  url: string,
  type: MediaType,
  filters: IFilters
): string {
  const params = new HttpParams({
    fromObject: { ...filters },
  });

  return url + `/${type}?${params}`;
}
