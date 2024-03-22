import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
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

export function getElementById<T>(
  element: ComponentFixture<T> | DebugElement,
  id: string
): DebugElement {
  if (element instanceof ComponentFixture) {
    return element.debugElement.query(By.css(`[data-testid="${id}"]`));
  }

  return element.query(By.css(`[data-testid="${id}"]`));
}
