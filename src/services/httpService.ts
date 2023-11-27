import apiClient from "./apiClient";

interface IEntity {
  id: number;
}

class HttpService {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  getAll<T>() {
    const controller = new AbortController();
    const request = apiClient.get<T[]>(this.endpoint, {
      signal: controller.signal,
    });

    return { request, cancel: () => controller.abort() };
  }

  delete(id: number) {
    return apiClient.delete(`${this.endpoint}/${id}`);
  }

  add<T>(entity: T) {
    return apiClient.post(this.endpoint, entity);
  }

  update<T extends IEntity>(entity: T) {
    return apiClient.put(`${this.endpoint}/${entity.id}`, entity);
  }
}

const create = (endpoint: string) => new HttpService(endpoint);

export default create;

