// Nos creamos este tipo de dato enum para decirle que este string
// solo se puede comportar de esta forma.. Role.USER, Role.ENUM

// Lo pasamos a la carpeta common (comunes), porque lo pueden usar varios moduluos
// en nuestro caso users y los guards
export enum Role{
  USER = 'user',
  ADMIN = 'admin',
}