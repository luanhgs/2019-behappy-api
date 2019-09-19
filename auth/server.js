const Hapi = require("@hapi/hapi");
const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");

const people = require("./users");
const tokens = require("./tokens");

const basic_validation = async (request, username, password) => {
  user = people.findByUsername(username);

  if (user == undefined) return { credentials: null, isValid: false };

  const isValid = bcrypt.compareSync(password, user.password);
  const token = tokens.add(user);
  const credentials = { id: user.id, name: user.name, token: token };
  return { isValid, credentials };
};

const jwt_validate = async (user, request) => {
  token = tokens.findByUser(user);
  if (token == undefined) {
    return { credentials: null, isValid: false };
  } else {
    const credentials = { id: user.id, name: user.name, token: token };
    return { credentials, isValid: true };
  }
};

const init = async () => {
  const server = new Hapi.Server({ port: 8000 });
  await server.register([require("@hapi/basic"), require("hapi-auth-jwt2")]);

  server.auth.strategy("simple", "basic", { validate: basic_validation });
  server.auth.strategy("jwt", "jwt", {
    key: tokens.secret, // Never Share your secret key
    validate: jwt_validate, // validate function defined above
    verifyOptions: { algorithms: ["HS256"] } // pick a strong algorithm
  });

  server.auth.default("jwt");

  server.route([
    {
      method: "GET",
      path: "/",
      config: { auth: false },
      handler: (request, reply) =>
        reply.response({ text: "Token not required" })
    },
    {
      method: "GET",
      path: "/users",
      config: { auth: false },
      handler: (request, reply) => reply.response(people.json())
    },
    {
      method: "POST",
      path: "/users",
      options: {
        auth: false,
        validate: {
          payload: Joi.object({
            name: Joi.string().required(),
            nickname: Joi.string().required(),
            password: Joi.string().required(),
            email: Joi.string().required()
          })
        }
      },
      handler: (request, reply) => {
        const user = {
          name: request.payload.name,
          nickname: request.payload.nickname,
          password: request.payload.password,
          email: request.payload.email
        };
        people.add(user);
        return reply.response({ text: "user created!" }).code(201);
      }
    },
    {
      method: "POST",
      path: "/auth",
      config: { auth: "simple" },
      handler: (request, reply) => reply.response(request.auth.credentials)
    },
    {
      method: "GET",
      path: "/restricted",
      config: { auth: "jwt" },
      handler: (request, reply) =>
        reply
          .response({ text: "You used a Token!" })
          .header("Authorization", request.headers.authorization)
    }
  ]);
  await server.start();
  return server;
};

init()
  .then(server => {
    console.log("Server running at:", server.info.uri);
  })
  .catch(error => {
    console.log(error);
  });
