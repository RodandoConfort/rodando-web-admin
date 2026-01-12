import { Injectable } from '@angular/core';
import { VehicleCategory } from '../models/vehicle-category.model';
import { Observable } from 'rxjs';
import { BaseApiService, RequestOptions } from '../../../../core/api/base-api.service';
import { PaginatedResult } from '../../../../core/api/api-response.model';
import { VehicleCategoryQuery } from '../models/vehicel-category-query.model';

@Injectable({ providedIn: 'root' })
export class VehicleCategoryApiService extends BaseApiService {
  private readonly resource = 'vehicle-categories';

 listPaged(
    query: VehicleCategoryQuery = {},
  ): Observable<PaginatedResult<VehicleCategory>> {
    const options: RequestOptions = { params: query };
    return this.getPaginated<VehicleCategory>(this.resource, options);
  }

  // extras si los necesitas
  getOne(id: string): Observable<VehicleCategory> {
    return this.getData<VehicleCategory>(`${this.resource}/${id}`);
  }

  create(dto: Omit<VehicleCategory, 'id'>): Observable<VehicleCategory> {
    return this.postData<Omit<VehicleCategory, 'id'>, VehicleCategory>(this.resource, dto);
  }

  update(id: string, dto: Partial<Omit<VehicleCategory, 'id'>>): Observable<VehicleCategory> {
    return this.patchData<Partial<Omit<VehicleCategory, 'id'>>, VehicleCategory>(
      `${this.resource}/${id}`,
      dto,
    );
  }

  delete(id: string): Observable<void> {
    return this.deleteData<void>(`${this.resource}/${id}`);
  }
}
