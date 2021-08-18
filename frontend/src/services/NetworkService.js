import MyError from '@/services/MyError';

export default class NetworkService {
  constructor({ endpoint, loaderStore, handleTokenErrors }) {
    this.endpoint = `${endpoint}/api/`;
    this.loaderStore = loaderStore;
    this.handleTokenErrors = handleTokenErrors;
  }

  setToken(token) {
    this.token = token;
  }

  async checkResponse(res) {
    let response;
    this.loaderStore.setLoader(null);

    if (res.status === 500) {
      response = new MyError({ detail: 'Внутренняя ошибка сервера' });
    } else if (res instanceof Error) {
      response = new MyError({ detail: res.message });
    } else {
      response = await res.json();
      return response;
      //response = (response.success) ? response.result : new MyError(response.error);
    }

    return response;
  }

  /**
   * Общий запрос ко всем методам StaticService
   * @param {String} alias - метод в сваггере
   * @param {Object} parameters
   * @param {Object} extra - экстра параметры file, multipart
   */
  fetch = (alias, parameters, type = 'POST') => {
    // this.loaderStore.setIsBlocked(true);
    this.options = {
      method: type,
      headers: this.buildHeaders(),
    };

    if (parameters) this.options.body = JSON.stringify(parameters);
    this.loaderStore.startLoader();
    return fetch(`${this.endpoint}${alias}`, this.options)
      .then(response => this.checkResponse(response))
      .catch(err => this.checkResponse(err));
  }

  buildHeaders = () => ({
    'Content-Type': 'application/json',
    ...(this.token ? { Authorization: `Token ${this.token}` } : {})
  })
}
