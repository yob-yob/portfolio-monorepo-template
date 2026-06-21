// biome-ignore lint/correctness/noUnresolvedImports: Bun Has RedisClient...
import { RedisClient } from "bun";

const redis = new RedisClient();

interface config {
  client: RedisClient;
  keyPrefix: string;
}

function redisStorage(config: config) {
  const { client, keyPrefix = "better-auth:" } = config;

  const prefixKey = (key = ""): string => `${keyPrefix}${key}`;

  return {
    async get(key: string) {
      return await client.get(prefixKey(key));
    },
    async getAndDelete(key: string) {
      await client.getdel(prefixKey(key));
    },
    async set(
      key: string,
      value: string,
      ttl: number | undefined
    ): Promise<void> {
      if (ttl && ttl > 0) {
        await client.setex(prefixKey(key), ttl, value);
      } else {
        await client.set(prefixKey(key), value);
      }
    },
    async delete(key: string) {
      await client.del(prefixKey(key));
    },
    async listKeys() {
      return (await client.keys(prefixKey("*"))).map((key) =>
        key.replace(prefixKey(""), "")
      );
    },
    async clear() {
      const keys = await client.keys(prefixKey("*"));

      if (keys.length === 0) {
        console.log(`No keys to clear in secondary storage: ${prefixKey("*")}`);
        return Promise.resolve();
      }

      await client.del(...keys);
    },
  };
}

export default redisStorage({
  client: redis,
  keyPrefix:
    process.env.AUTH_SECONDARY_STORAGE_KEY_PREFIX ??
    "template:auth:secondary-storage:",
});
