# Pixel Cards NFT


## Install

```bash
yarn
```

Execute Ganache and import the private key of an account on the ETH_PRIVATE_KEY in the .env file.

## Deploy Smart contract

```bash
yarn compile
yarn deploy --network ganache
```

## Prepopulate database

set `DATABASE_URL` on the `.env` file. I am using PostgreSQL.

```bash
npx prisma db push
npx prisma db seed
```

## Testing

```bash
yarn test
```

## Execute frontend

```bash
yarn dev
```
