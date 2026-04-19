module.exports = {
  apps: [
    {
      name: 'productlogik-frontend',
      script: 'npx',
      args: 'serve -s dist -l 3001',
      cwd: './frontend',
      env: {
        NODE_ENV: 'production'
      },
      max_memory_restart: '250M',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      error_file: '../frontend-error.log',
      out_file: '../frontend-out.log'
    },
    {
      name: 'productlogik-backend',
      script: 'venv/bin/uvicorn',
      args: 'main:app --host 127.0.0.1 --port 8081',
      cwd: './backend',
      interpreter: 'none',
      env: {
        PYTHONUNBUFFERED: '1'
      },
      max_memory_restart: '300M',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      error_file: '../backend-error.log',
      out_file: '../backend-out.log'
    }
  ]
};
