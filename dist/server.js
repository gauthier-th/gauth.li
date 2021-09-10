"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = void 0;
const fastify_1 = __importDefault(require("fastify"));
const routes_1 = __importDefault(require("./routes"));
const fastify_multipart_1 = __importDefault(require("fastify-multipart"));
const fastify_postgres_1 = __importDefault(require("fastify-postgres"));
const server = fastify_1.default({
    logger: process.env.NODE_ENV !== 'production'
});
server.register(fastify_multipart_1.default);
server.register(fastify_postgres_1.default, {
    connectionString: process.env.CONNECTION_STRING
});
async function start() {
    try {
        registerRoutes();
        const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
        await server.listen(port);
        console.log('Server listening on port ' + port);
    }
    catch (err) {
        server.log.error(err);
        process.exit(1);
    }
}
exports.start = start;
function registerRoutes() {
    for (let route of routes_1.default) {
        server.route(route);
    }
}
//# sourceMappingURL=server.js.map