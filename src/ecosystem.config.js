module.exports = {
  apps : [{
    script: 'index.ts',
    cwd: '/root/startergroup-backend/src',
    instances : "max",
    exec_mode: 'cluster',
    watch: true,
    ignore_watch: [".git/index.lock", "logs", "public", "node_modules", "[\\/\\\\]\\./","pids", ".git", ".idea"],
  }]
};
