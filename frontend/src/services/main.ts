import ProductService from '@/services/product'

export default class MainService {
  _setAppRoot: (main: MainService) => void
  product: ProductService

  constructor(setAppRoot: (appRoot: MainService) => void) {
    this._setAppRoot = setAppRoot
    this.product = new ProductService(this)
  }

  async setAppRoot() {
    await this._setAppRoot(this)
  }
}
