export interface FormProps<T> {
  isDirty: boolean
  errors: Record<keyof T, string>
  hasErrors: boolean
  processing: boolean
  original: T
  data(): T
  reset(...fields: (keyof T)[]): this
  clearErrors(...fields: (keyof T)[]): this
  setError(field: keyof T, value: string): this
  setError(errors: Record<keyof T, string>): this
  submit<T>(method: string, url: string): Promise<T>
  get<T>(url: string): Promise<T>
  post<T>(url: string): Promise<T>
  put<T>(url: string): Promise<T>
  patch<T>(url: string): Promise<T>
  delete<T>(url: string): Promise<T>
}

export type Form<T> = T & FormProps<T>
export declare function useForm<T>(data: T): Form<T>
