export interface PageResultModel<T> {
  'hydra:member': T[];
  'hydra:totalItems': number;
}
