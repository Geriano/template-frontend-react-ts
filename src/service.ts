export interface Service<T> {
  hostname: string
  prefix?: string
  routes: Routes<T>
}

export type Routes<T> = {
  [name in T as string]: Route
}
export interface Route {
  methods: Method[]
  path: string
  params?: RouteParam
}

export type Method = 'GET'|'POST'|'PUT'|'PATCH'|'DELETE'

export interface RouteParam {
  [name: string]: {
    required: boolean
  }
}

export const services = {
  "authentication": {
    "hostname": "http://localhost:3333",
    "routes": {
      "login": {
        "methods": ["POST"],
        "path": "login",
      },
      "register": {
        "methods": ["POST"],
        "path": "register",
      },
      "logout": {
        "methods": ["DELETE"],
        "path": "logout",
      },
      "user": {
        "methods": ["GET"],
        "path": "user",
      },
    },
  } as Service<'login'|'register'|'logout'|'user'>,
  "profile": {
    "hostname": "http://localhost:3333",
    "routes": {
      "update-user-general-information": {
        "methods": ["PATCH"],
        "path": "/update-user-general-information"
      },
      "photo": {
        "methods": ["GET"],
        "path": "/{path}",
        "params": {
          "path": {
            "required": true,
          },
        },
      },
      "remove-profile-photo": {
        "methods": ["DELETE"],
        "path": "/remove-profile-photo",
      },
      "update-user-password": {
        "methods": ["PATCH"],
        "path": "/update-user-password",
      },
    },
  } as Service<'update-user-general-information'|'photo'|'remove-profile-photo'|'update-user-password'>,
  "permission": {
    "hostname": "http://localhost:3333",
    "prefix": "/permission",
    "routes": {
      "all": {
        "methods": ["GET"],
        "path": "/all",
      },
      "store": {
        "methods": ["POST"],
        "path": "/",
      },
      "update": {
        "methods": ["PUT", "PATCH"],
        "path": "/{id}",
        "params": {
          "id": {
            "required": true,
          },
        },
      },
      "destroy": {
        "methods": ["DELETE"],
        "path": "/{id}",
        "params": {
          "id": {
            "required": true,
          },
        },
      },
    },
  } as Service<'all'|'store'|'update'|'destroy'>,
}

export type ServiceNames = keyof typeof services

export default services
