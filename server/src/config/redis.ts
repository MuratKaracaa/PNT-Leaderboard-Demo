import Redis from "ioredis";
import { config } from "dotenv";

config();

// Initially I wanted to set up a Redis Cluster to utilize the FAILOVER mechanism but I had CROSSLOTS error while reading from the stream,
// which apparently is due to the spreading of stream values accross all hashslots in the Cluster. I tried to solve it by using hashed
// ids with ({hash_param} + rest_of_id) but I couldn't find an optimal way to generate custom IDs.
// I wanted to use explicit ID generation syntax as well (custom_id-*) but on the documentation it says redis version 7.0 or above.
// So I decided to use the 1 Master-2 Slaves-3 Sentinel setup with a quorum of 2. The slaves are asyncronously updated with the master. The health status of each node is monitored
// by the sentinels. When 2 of the sentinels agree that the master is non-responsive for a pre-determined period of time (in the .conf file), leader sentinel elects a new master.
// The commands during the disconnection and promotion are kept in an offline queue (I'm not sure if this an npm ioredis specific feature or redis in general
// because the only place this is ever referred is in the ioredis documentation.) After the promotion the offline queue commands are fed to the master and
// operations keep going. When the previous master gets back online it is ranked as a slave and proceeds with replication.
// In this setup I imagine 3 instances, each containing a master/slave and a sentinel. That way when the master goes down the other nodes can keep up the operation, so the hosts
// of consecutive nodes and sentinels would be the same

const {
  REDIS_MASTER_HOST,
  REDIS_MASTER_PORT,
  REDIS_SLAVE_1_HOST,
  REDIS_SLAVE_1_PORT,
  REDIS_SLAVE_2_HOST,
  REDIS_SLAVE_2_PORT,
  REDIS_SENTINEL_1_HOST,
  REDIS_SENTINEL_1_PORT,
  REDIS_SENTINEL_2_HOST,
  REDIS_SENTINEL_2_PORT,
  REDIS_SENTINEL_3_HOST,
  REDIS_SENTINEL_3_PORT,
} = process.env;

const client = new Redis(+REDIS_MASTER_PORT!, REDIS_MASTER_HOST!, {
  name: "master",
  preferredSlaves: [
    {
      ip: REDIS_SLAVE_1_HOST!,
      port: REDIS_SLAVE_1_PORT!,
      prio: 1,
    },
    {
      ip: REDIS_SLAVE_2_HOST!,
      port: REDIS_SLAVE_2_PORT!,
      prio: 2,
    },
  ],
  sentinels: [
    {
      host: REDIS_SENTINEL_1_HOST!,
      port: +REDIS_SENTINEL_1_PORT!,
    },
    {
      host: REDIS_SENTINEL_2_HOST!,
      port: +REDIS_SENTINEL_2_PORT!,
    },
    {
      host: REDIS_SENTINEL_3_HOST!,
      port: +REDIS_SENTINEL_3_PORT!,
    },
  ],
});

export default client;
