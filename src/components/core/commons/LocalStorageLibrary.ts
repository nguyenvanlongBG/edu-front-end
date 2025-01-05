class LocalStorageLibrary {
  // Phương thức lấy giá trị từ localStorage bằng key
  getValueByKey<T>(key: string): T | null {
    try {
      const value = localStorage.getItem(key)
      if (value) {
        return JSON.parse(value) as T
      }
      return null // Trả về null nếu không tìm thấy
    } catch (error) {
      console.error(`Failed to parse value for key "${key}"`, error)
      return null // Trả về null nếu có lỗi
    }
  }

  // Phương thức lưu giá trị vào localStorage
  setValue(key: string, data: unknown): void {
    try {
      const jsonData = JSON.stringify(data)
      localStorage.setItem(key, jsonData)
      console.log(`Successfully set value for key "${key}"`)
    } catch (error) {
      console.error(`Failed to set value for key "${key}"`, error)
    }
  }
}
const localStorageLibrary = new LocalStorageLibrary()
export default localStorageLibrary
