module.exports = {
  apps : [{
    script: './node_modules/.bin/ts-node',
    args: '-P ./tsconfig.json ./src/index.ts',
    watch: true,
    ignore_watch: [".git/index.lock", "logs", "public", "node_modules", "[\\/\\\\]\\./","pids", ".git", ".idea"],
    env: {
      NODE_ENV: "production"
    }
  }]
};
