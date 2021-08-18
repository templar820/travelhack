import React from 'react';
import Router from '@/Router';
import NetworkService from '@/services/NetworkService';
import RequestService from '@/services/RequestService';
import { StoresNames } from '@/services/common/constDictionary';
import { Provider } from 'mobx-react';
import LoaderStore from '@/stores/LoaderStore';
import ErrorWindow from '@/components/System/ErrorWindow';
import Loader from '@/components/System/Loader';
import RecommendationStore from '@/stores/RecommendationStore';
import FilterStore from "./stores/FilterStore";

class App extends React.Component {
  constructor(props) {
    super(props);
    const endpoint = "http://localhost:8080"
    this.loaderStore = new LoaderStore();
    this.recommendationStore = new RecommendationStore();
    this.filterStore = new FilterStore();
    this.networkService = new NetworkService({ endpoint, loaderStore: this.loaderStore });
    this.requestService = new RequestService(this.networkService, this.recommendationStore, this.filterStore);

    this.networkService.setToken(localStorage.token || 'token');

    this.stores = {
      [StoresNames.LoaderStore]: this.loaderStore,
      [StoresNames.RecommendationStore]: this.recommendationStore,
      [StoresNames.RecommendationStore]: this.recommendationStore,
      [StoresNames.FilterStore]: this.filterStore,
      [StoresNames.URL]: endpoint,
    };

    this.services = {
      networkService: this.networkService,
      requestService: this.requestService,
    };
  }

  render() {
    return (
      <Provider {...this.stores} services={this.services}>
        <ErrorWindow>
          <Loader />
          <Router />
        </ErrorWindow>
      </Provider>
    );
  }
}

export default App;
