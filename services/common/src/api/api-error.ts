export class ApiError extends Error {
  public status: number;
  public name: string;

  constructor(
    message: string | undefined = undefined,
    status: number = 500,
    errorName: string = 'InternalServerError'
  ) {
    super(message);
    this.status = status;
    this.name = errorName;
  }

  public static asApiError(error: Error) {
    if (error instanceof ApiError) return error;

    const apiError = new ApiError(error.message, (error as any).status ?? 500, error.name);
    apiError.stack = error.stack;

    return apiError;
  }

  public toJson() {
    return {
      code: this.status,
      type: this.name,
      message: this.message || 'Internal server error',
    };
  }
}
