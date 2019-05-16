"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = __importDefault(require("child_process"));
var CloudFunctionService = /** @class */ (function () {
    function CloudFunctionService(opts) {
        this.defaultMessage = { type: 'DEFAULT', body: {} };
        this.funcName = '';
        if (opts) {
            this.funcName = opts.funcName;
        }
    }
    CloudFunctionService.prototype.parsePubsubEventData = function (event) {
        var pubsubMessage = event.data;
        var message = this.defaultMessage;
        if (!pubsubMessage.data) {
            console.error(new Error('event.data.data is required. Return default message.'));
            return this.defaultMessage;
        }
        console.log('pubsubMessage: ', pubsubMessage);
        try {
            message = JSON.parse(Buffer.from(pubsubMessage.data, 'base64').toString());
            console.log('message:', message);
            return message;
        }
        catch (error) {
            console.error('JSON parse message failed.');
            console.error(error);
        }
        return message;
    };
    CloudFunctionService.prototype.serializePubsubEventData = function (message) {
        var dataBuffer = Buffer.from(JSON.stringify(message)).toString('base64');
        return JSON.stringify({ data: dataBuffer });
    };
    CloudFunctionService.prototype.validateMessage = function (message, type) {
        if (!message) {
            console.error(new Error('message is required'));
            return false;
        }
        if (type) {
            if (!message.type) {
                console.error(new Error('message.type is required'));
                return false;
            }
            if (message.type !== type) {
                return false;
            }
        }
        if (!message.body) {
            console.error(new Error('message.body is required'));
            return false;
        }
        return true;
    };
    CloudFunctionService.prototype.invoke = function (message, base64) {
        if (base64 === void 0) { base64 = true; }
        if (this.funcName) {
            var jsonString = base64 ? this.serializePubsubEventData(message) : JSON.stringify(message);
            return child_process_1.default.execSync("gcloud beta functions call " + this.funcName + " --data '" + jsonString + "'").toString();
        }
        return '';
    };
    return CloudFunctionService;
}());
exports.CloudFunctionService = CloudFunctionService;
