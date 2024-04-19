"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDocuments = void 0;
async function GetDocuments(request, reply) {
    return reply.status(200).send({ status: "ok" });
}
exports.GetDocuments = GetDocuments;
