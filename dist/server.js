"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = void 0;
const fastify_1 = __importDefault(require("fastify"));
const routes_1 = __importDefault(require("./routes"));
const server = fastify_1.default({
    logger: process.env.NODE_ENV !== 'production'
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