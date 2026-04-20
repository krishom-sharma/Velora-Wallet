import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-jwt-secret";
process.env.CLIENT_URL = "http://localhost:5173";
process.env.CARD_ENCRYPTION_KEY =
  "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
process.env.MONGO_URI = "mongodb://127.0.0.1:27017/placeholder";

const { default: app } = await import("../src/app.js");
const { User } = await import("../src/models/User.js");
const { Transaction } = await import("../src/models/Transaction.js");

let mongoServer;

const ioMock = {
  to() {
    return {
      emit() {
        return undefined;
      }
    };
  }
};

const getCsrfToken = async (agent) => {
  const response = await agent.get("/api/auth/csrf-token");
  return response.body.csrfToken;
};

describe("Velora API", () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.disconnect();
    await mongoose.connect(mongoServer.getUri());
    app.set("io", ioMock);
  });

  beforeEach(async () => {
    await Promise.all([User.deleteMany({}), Transaction.deleteMany({})]);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it("registers and authenticates a user", async () => {
    const agent = request.agent(app);
    const csrfToken = await getCsrfToken(agent);

    const registerResponse = await agent
      .post("/api/auth/register")
      .set("X-CSRF-Token", csrfToken)
      .send({
        name: "Avery Quinn",
        username: "avery",
        email: "avery@example.com",
        password: "Velora123!"
      });

    expect(registerResponse.statusCode).toBe(201);
    expect(registerResponse.body.user.email).toBe("avery@example.com");

    const meResponse = await agent.get("/api/auth/me");
    expect(meResponse.statusCode).toBe(200);
    expect(meResponse.body.user.username).toBe("avery");
  });

  it("sends money between two users and updates balances", async () => {
    const sender = await User.create({
      name: "Avery",
      username: "avery",
      email: "avery@example.com",
      password: "Velora123!",
      balance: 500
    });
    const receiver = await User.create({
      name: "Mila",
      username: "mila",
      email: "mila@example.com",
      password: "Velora123!",
      balance: 100
    });

    const agent = request.agent(app);
    let csrfToken = await getCsrfToken(agent);

    await agent
      .post("/api/auth/login")
      .set("X-CSRF-Token", csrfToken)
      .send({
        email: "avery@example.com",
        password: "Velora123!"
      });

    csrfToken = await getCsrfToken(agent);

    const sendResponse = await agent
      .post("/api/transactions/send")
      .set("X-CSRF-Token", csrfToken)
      .send({
        recipient: receiver.username,
        amount: 75,
        category: "food",
        note: "Brunch"
      });

    expect(sendResponse.statusCode).toBe(201);
    expect(sendResponse.body.transaction.amount).toBe(75);

    const refreshedSender = await User.findById(sender.id);
    const refreshedReceiver = await User.findById(receiver.id);

    expect(refreshedSender.balance).toBe(425);
    expect(refreshedReceiver.balance).toBe(175);
  });
});
