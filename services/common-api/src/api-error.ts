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

  public static asApiError(error: Error, defaultStatus: number = 500, errorName?: string) {
    if (error instanceof ApiError) return error;

    const apiError = new ApiError(error.message, (error as any).status ?? defaultStatus, errorName || error.name);
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

  public static createApiErrorType(status: number, errorName: string): typeof ApiError {
    return class extends ApiError {
      constructor(message: string) {
        super(message, status, errorName);
      }
    };
  }
}

export namespace ApiError {
  export const Forbidden = ApiError.createApiErrorType(403, 'Forbidden');
  export const Internal = ApiError.createApiErrorType(500, 'InternalServerError');
}
