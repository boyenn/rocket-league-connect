# Installation

Make sure you have git, nodejs and npm installed on your machine.

```bash
git clone https://github.com/boyenn/rocket-league-connect.git
cd rocket-league-connect
npm install
```

## API Tokens
After cloning, create a new folder called "tokens".
In Tokens, create 2 empty files without a filetype with names discordtoken and rlstoken


### Getting the discord bot token
* Go to https://discordapp.com/developers and create an account.
* Create an application there.
* Add a bot user to the account.
* Copy the bot user token into the file discordtoken

### Getting the rls token
* Go to developers.rocketleaguestats.com and request a token.
* Copy the token into the file rlstoken

# Running 

```bash
node index.js
```