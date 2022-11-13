export interface Service {
  hostname: string
  prefix: string
  routes: Routes[]
}

export interface Routes {
  [name: string]: Route
}

export interface Route {
  method: 'GET'|'POST'|'PUT'|'PATCH'|'DELETE'
  path: string
  params?: RouteParam
}

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
  },
  "profile": {
    "hostname": "http://localhost:3333",
    "routes": {
      "update-user-general-information": {
        "method": ["PATCH"],
        "path": "/update-user-general-information"
      },
      "photo": {
        "method": ["GET"],
        "path": "/{path}",
        "params": {
          "path": {
            "required": true,
          },
        },
      },
      "remove-profile-photo": {
        "method": ["DELETE"],
        "path": "/remove-profile-photo",
      },
      "update-user-password": {
        "method": ["PATCH"],
        "path": "/update-user-password",
      },
    },
  },
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
  },
}

export type ServiceNames = keyof typeof services

const background = typeof queueMicrotask === 'function' ? queueMicrotask : setTimeout
const sanitize = (url: string) => {
  return url.replace(/\/+/g, '/').replace(/^\/|\/$/g, '').replace(/(http|https):\//, '$1://')
}

export function route(service: ServiceNames, route: string, params?: any) {
  const error = (key: string) => background(() => {
    throw Error(`missing parameter [${key}] on [${service}][${route}]`)
  })

  const hostname = services[service].hostname
  const prefix = services[service].prefix || '/'
  const routes = services[service].routes
  const base = `${hostname}/${prefix}`

  if (routes.hasOwnProperty(route)) {
    const match = routes[route]
    let path = match.path
    const availableParams = match.params
    const args = {} as { [name: string]: any }

    if (availableParams && Object.keys(availableParams).length > 0) {
      Object.keys(availableParams).forEach((key: string) => {
        const param = availableParams[key]
        
        if (param.required) {
          if (typeof params !== 'undefined' && params !== null) {
            if (Object.keys(availableParams).length === 1  && typeof params !== 'object') {
              args[key] = params
            } else {
              if (typeof params === 'object' && params.hasOwnProperty(key)) {
                args[key] = params[key]
              } else {
                error(key)
              }
            }
          } else {
            error(key)
          }
        } else {
          if (typeof params !== 'undefined' && params !== null) {
            if (Object.keys(availableParams).length === 1  && typeof params !== 'object') {
              args[key] = params
            } else {
              if (typeof params === 'object' && params.hasOwnProperty(key)) {
                args[key] = params[key]
              }
            }
          }
        }
      })
    }

    if (typeof params !== 'undefined' && params !== null) {
      if (Array.isArray(params)) {
        params.forEach((value: any, key: number) => {
          if (!args.hasOwnProperty(key)) {
            args[key] = value
          }
        })
      } else {
        Object.keys(params).forEach((key) => {
          if (!args.hasOwnProperty(key)) {
            args[key] = params[key]
          }
        })
      }
    }

    const matches = path.match(/\{([\w\d]+)\}/g)
    const solved = [] as string[]

    if (matches) {
      matches.forEach((match: string) => {
        const key = match.substring(1, match.length - 1)
        const value = args[key]
        path = path.replace(new RegExp(match, 'g'), value)

        if (!solved.includes(key)) {
          solved.push(key)
        }
      })
    }

    const query = {} as { [name: string]: any }
    Object.keys(args).filter(key => !solved.includes(key)).forEach(key => query[key] = args[key])
    path = path.replace(/\/+/g, '/').replace(/^\/|\/$/g, '')

    if (Object.keys(query).length > 0) {
      path += '?' + new URLSearchParams(query).toString()
    }

    return sanitize(`${base}/${path}`)
  } else {
    background(() => {
      throw Error(`route [${route}] not exists on service [${service}]`)
    })
  }
}

export default services
