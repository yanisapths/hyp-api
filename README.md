#  Senior Project Backend
This app works with both the following frontend apps:
- https://github.com/yanisapths/project-customer
- https://github.com/yanisapths/daycare-portal
## Configuration

### Set up a MongoDB database

Set up a MongoDB database either locally or with [MongoDB Atlas for free](https://mongodb.com/atlas).

### Set up environment variables

Set each variable on `config.env`:

- `ATLAS_URI` - Your MongoDB connection string. If you are using [MongoDB Atlas](https://mongodb.com/atlas) you can find this by clicking the "Connect" button for your cluster.

### Run

```bash
npm install
npm run start
```

Your app should be up and running on [http://localhost:5000](http://localhost:5000)!
