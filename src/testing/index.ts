import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { IFilters } from '@app/shared/models/filters.interface';
import { MediaType } from '@app/shared/models/media.type';

export const errorResponse = {
  statusText: 'Not found',
  status: 404,
};

export const mockFilters: IFilters = {
  include_adult: true,
  page: 2,
};

export function expectError(err: HttpErrorResponse): void {
  expect(err.statusText).toBe(errorResponse.statusText);
  expect(err.status).toBe(errorResponse.status);
}

export function getSearchUrl(
  url: string,
  type: MediaType,
  filters: IFilters
): string {
  const params = new HttpParams({
    fromObject: { ...filters },
  });

  return url + `/${type}?${params}`;
}
