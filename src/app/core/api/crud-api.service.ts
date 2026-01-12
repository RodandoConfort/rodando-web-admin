import { BaseApiService, RequestOptions } from './base-api.service';
import { Observable } from 'rxjs';

export abstract class CrudApiService<
  TModel,
  TCreate = Partial<TModel>,
  TUpdate = Partial<TModel>,
> extends BaseApiService {
  /** Ej: 'admin/users' o 'admin/vehicles' */
  protected abstract readonly resourcePath: string;

  protected get resourceUrl(): string {
    return this.resourcePath;
  }

  list(options?: RequestOptions): Observable<TModel[]> {
    return this.getData<TModel[]>(this.resourceUrl, options);
  }

  getOne(id: string | number): Observable<TModel> {
    return this.getData<TModel>(`${this.resourceUrl}/${id}`);
  }

  create(dto: TCreate): Observable<TModel> {
    return this.postData<TCreate, TModel>(this.resourceUrl, dto);
  }

  update(id: string | number, dto: TUpdate): Observable<TModel> {
    return this.patchData<TUpdate, TModel>(
      `${this.resourceUrl}/${id}`,
      dto,
    );
  }

  remove(id: string | number): Observable<void> {
    return this.deleteData<void>(`${this.resourceUrl}/${id}`);
  }
}
