import e from "express";

type base = {
  success: boolean;
  status?: number;
  data?: any;
  message?: string;
  errors?: any;
};

export function success(data: any): base {
  return {
    success: true,
    data,
    errors: 0,
    message: "The task is completed.",
    status: 200,
  };
}

export function created(data: any, name_created: string): base {
  return {
    success: true,
    data,
    errors: 0,
    message: `${name_created} created susscessfully!`,
    status: 201,
  };
}

export function unauthorized(data: any, message = "Unauthorized!"): base {
  return {
    success: false,
    data,
    errors: 1,
    message,
    status: 401,
  };
}

export function forbaseidden(data: any, message = "Not found"): base {
  return {
    success: false,
    data,
    errors: 1,
    message,
    status: 403,
  };
}

export function notFound(data: any, message: string = "Unauthorized!"): base {
  return {
    success: false,
    data,
    errors: 1,
    message,
    status: 404,
  };
}

export function badRequest(
  data: any,
  message = "Bad request",
  errors?: any
): base {
  return {
    success: false,
    data,
    errors,
    message,
    status: 400,
  };
}

export function serverError(
  data: any,
  message = "Internal server error",
  errors?: any
): base {
  return {
    success: false,
    data,
    errors,
    message,
    status: 500,
  };
}
