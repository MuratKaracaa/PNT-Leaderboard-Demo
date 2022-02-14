import { connect } from "mongoose";
import { config } from "dotenv";

config();

const { DB_STRING } = process.env;

// The DB_SRING is one for a 1 Primary 2 Secondaries replica set. (mongodb://host1:port1,host2:port2,host3:port3) . The secondaries follow the primary' oplogs and
// conduct the operations themselves in an async manner. In case of a primary shutdown one of the other replicas become the primary. Alternatively, 1 Primary 1 Replica
// and 1 Arbiter may also be used, the Arbiter not being a replicator but a voter that the Primary is not responsive. Replica sets allow for read/write splitting but
// because of the async nature of replication it may cause misreads, although not too drastically.

connect(
  DB_STRING!,
  {
    keepAlive: true,
    retryReads: true,
    retryWrites: true,
    replicaSet: "test",
    // readPreference: "secondary",
  },
  () => console.log("DB Connected")
);
