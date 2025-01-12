import { BaseService } from '@/components/core/services/base-service'
export default class AuthService extends BaseService {
  getController(): string {
    return 'Auth'
  }
  async login(account: unknown) {
    return await this.post(account, 'login')
  }
  async register(account: unknown) {
    return await this.post(account, 'register')
  }
  async logout() {
    return await this.get('logout')
  }
}
