"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_proxy_middleware_1 = require("http-proxy-middleware");
const amqplib_1 = __importDefault(require("amqplib"));
const app = (0, express_1.default)();
// Setup RabbitMQ
const rabbitMqUrl = 'amqp://localhost';
function setupRabbitMQ() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const conn = yield amqplib_1.default.connect(rabbitMqUrl);
            console.log('Connected to RabbitMQ');
            yield conn.close();
        }
        catch (error) {
            console.error('RabbitMQ connection error:', error);
        }
    });
}
setupRabbitMQ();
// Cart Service
app.use('/cart', (0, http_proxy_middleware_1.createProxyMiddleware)({
    target: 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: { '^/cart': '' }
}));
// Order Service
app.use('/order', (0, http_proxy_middleware_1.createProxyMiddleware)({
    target: 'http://localhost:3002',
    changeOrigin: true,
    pathRewrite: { '^/order': '' }
}));
// Product Service
app.use('product', (0, http_proxy_middleware_1.createProxyMiddleware)({
    target: 'http://localhost:3003',
    changeOrigin: true,
    pathRewrite: { '^/product': '' }
}));
// User Service
app.use('/user', (0, http_proxy_middleware_1.createProxyMiddleware)({
    target: 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: { '^/user': '' }
}));
app.listen(3000, () => {
    console.log(`API Gateway running at http://localhost:3000`);
});
exports.default = app;
