# PNT-Leaderboard

Note that this repo contains the entire code for this and the application creates its own data and is served on just one instance for demonstration purposes

## How it should work

![](/images/diagram.png)

## Roles

- Player : Send their money and token data via sockets to a loadbalancer, which is distributed among message brokers, which decode the data to get the user id and writes a [id, money] data to a stream in the Elasticache instance. Also connects to the ec2 instance to get leaderboard related data.
- Loadbalancer: Distributes incoming money data to an autoscaling message broker group, which writes that data to the stream in Elasticache instance.
- Message broker autoscaling group: Decodes user token and saves [id, money] data in the stream.
- Consumer autoscaling group: Reads the data in the stream and updates related data in prizepool, user profile (in Elasticache), and leaderboard.
- EC2 instance: Generates leaderboard data to display, along with user login to generate user related ranking data. Also periodically resets the leaderboard, distributes prizes and backs up money data in the database.
- Elasticache : Contains User profile (username, name, country, money), prizepool and leaderboard along with a stream for incoimng money data.
- MongoDB : Contains user related data, provides user id.

## Logic behind it

- For each incoming data multiple fields in redis is updated. If we try to update them as soon as the data comes in via the same instance, because of the 1/3 ratio, failures may occure and new data may not be received.
- Alternatively redis pub/sub mechanism could be used, but it's a "fire and forget" mechanism, so in case of any failures there would be no access to the data thar was sent during the time until recovery. By keeping the data in a queue we prevent data loss.
- By keeping data generator and distributor on another instance, we prevent multiple distributions and additional back up functions occuring on the reset event.
- By keeping redis in Elasticache instead of instances' own memory, we have access to a shared data.
- By using a loadbalancer in front of message broker, we prevent same data written to the stream by different instances in the same group.
- By emitting token info from the client, we either generate additional user-related information to display or not and prevent additional sockets for that purpose.
