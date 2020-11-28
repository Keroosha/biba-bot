# biba-bot

## Config

Create config at root directory of biba-bot-web

```json
{
  "token": "replaceme",
  "randomOrgToken": "replaceme",
  "database": {
    "host": "db",
    "user": "postgres",
    "password": "postgres",
    "database": "bibabot"
  },
  "autoAssign": {
    "groups": [
      "🟊🟊 Random"
    ]
  },
  "pidorBot": {
    "resetInterval": "24",
    "command": "!pidor-today",
    "userChannel": "pidor-today",
    "assignRole": "rolename"
  }
}
```
