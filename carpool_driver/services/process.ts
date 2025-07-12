import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";

/**
 * Lớp quản lý tác vụ nền
 */
export class BackgroundTaskManager {
  /**
   * Đăng ký một tác vụ nền mới
   * @param taskName - Tên định danh của tác vụ
   * @param callback - Hàm callback sẽ được gọi khi tác vụ chạy
   * @param options - Tùy chọn cấu hình cho tác vụ nền
   * @returns Promise<void>
   */
  static async registerTask(
    taskName: string,
    callback: () => Promise<any>,
    options: {
      minimumInterval?: number;
      stopOnTerminate?: boolean;
      startOnBoot?: boolean;
    } = {}
  ): Promise<void> {
    if (!taskName) {
      throw new Error("Tên tác vụ không được để trống");
    }

    // Kiểm tra xem tác vụ đã được đăng ký chưa
    const isTaskRegistered = await TaskManager.isTaskRegisteredAsync(taskName);
    if (isTaskRegistered) {
      console.log(`Tác vụ ${taskName} đã được đăng ký trước đó`);
      return;
    }

    // Định nghĩa tác vụ với xử lý lỗi và ghi log đầy đủ
    TaskManager.defineTask(taskName, async () => {
      try {
        console.log(`Đang chạy tác vụ ${taskName} trong nền...`);
        const result = await callback();
        console.log(`Tác vụ ${taskName} hoàn thành thành công`);
        return result
          ? BackgroundFetch.BackgroundFetchResult.NewData
          : BackgroundFetch.BackgroundFetchResult.NoData;
      } catch (error) {
        console.error(`Lỗi khi thực hiện tác vụ ${taskName}:`, error);
        this.unregisterTask(taskName);
        return BackgroundFetch.BackgroundFetchResult.Failed;
      }
    });

    // Cấu hình mặc định cho tác vụ nền
    const defaultOptions = {
      minimumInterval: 60 * 15, // 15 phút
      stopOnTerminate: false,
      startOnBoot: true,
    };

    // Kết hợp tùy chọn mặc định với tùy chọn do người dùng cung cấp
    const taskOptions = { ...defaultOptions, ...options };

    // Đăng ký tác vụ nền với các tùy chọn đã kết hợp
    await BackgroundFetch.registerTaskAsync(taskName, taskOptions);
    console.log(
      `Tác vụ ${taskName} đã được đăng ký thành công với cấu hình:`,
      taskOptions
    );
  }

  /**
   * Hủy đăng ký một tác vụ nền
   * @param taskName - Tên định danh của tác vụ cần hủy
   * @returns Promise<boolean> - true nếu hủy thành công
   */
  static async unregisterTask(taskName: string): Promise<boolean> {
    try {
      const isRegistered = await TaskManager.isTaskRegisteredAsync(taskName);
      if (!isRegistered) {
        console.log(`Tác vụ ${taskName} chưa được đăng ký`);
        return false;
      }

      await BackgroundFetch.unregisterTaskAsync(taskName);
      console.log(`Đã hủy đăng ký tác vụ ${taskName} thành công`);
      return true;
    } catch (error) {
      console.error(`Lỗi khi hủy đăng ký tác vụ ${taskName}:`, error);
      throw error;
    }
  }

  /**
   * Kiểm tra trạng thái của một tác vụ
   * @param taskName - Tên định danh của tác vụ cần kiểm tra
   * @returns Promise<boolean> - true nếu tác vụ đã được đăng ký
   */
  static async isTaskRegistered(taskName: string): Promise<boolean> {
    return await TaskManager.isTaskRegisteredAsync(taskName);
  }

  /**
   * Lấy danh sách tất cả các tác vụ đã đăng ký
   * @returns Promise<string[]> - Mảng chứa tên các tác vụ đã đăng ký
   */
  static async getRegisteredTasks(): Promise<string[]> {
    const tasks = await TaskManager.getRegisteredTasksAsync();
    return tasks.map((task) => task.taskName);
  }
}
