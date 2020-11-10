# Change these
server '18.233.156.156', port: 22, roles: [:web, :app, :db], primary: true

set :repo_url,        'git@github.com:canriquez/portfolio.git'
set :application,     'portfolio'
set :user,            'ubuntu'
set :puma_threads,    [4, 16]
set :puma_workers,    0

#after generating certificate:

#set :enable_ssl,      true

# Don't change these unless you know what you're doing

set :pty,             true
set :use_sudo,        false
set :stage,           :production
set :deploy_via,      :remote_cache
set :deploy_to,       "/home/#{fetch(:user)}/apps/#{fetch(:application)}"
set :puma_bind,       "unix://#{shared_path}/tmp/sockets/#{fetch(:application)}-puma.sock"
#set :puma_bind, "tcp://0.0.0.0:3000"
set :puma_state,      "#{shared_path}/tmp/pids/puma.state"
set :puma_pid,        "#{shared_path}/tmp/pids/puma.pid"
set :puma_access_log, "#{release_path}/log/puma.error.log"
set :puma_error_log,  "#{release_path}/log/puma.access.log"
set :ssh_options,     { forward_agent: true, user: fetch(:user), keys: %w(~/.ssh/id_rsa.pub) }
set :puma_preload_app, true
set :puma_worker_timeout, nil
set :puma_init_active_record, true  # Change to false when not using ActiveRecord

set :pg_password, ENV['PORTFOLIO_DATABASE_PASSWORD']
set :pg_ask_for_password, true

#set :default_shell, "/bin/bash -l"
set :rvm_type, :system
append :linked_files, "config/master.key"
append :linked_files, "config/secrets.yml.key"
append :linkef_files, "config/credentials.yml.enc"
append :linked_files, "config/.env.production"

## Defaults:
# set :scm,           :git
# set :branch,        :master
# set :format,        :pretty
# set :log_level,     :debug
# set :keep_releases, 5

## Linked Files & Directories (Default None):
# set :linked_files, %w{config/database.yml}
# set :linked_dirs,  %w{bin log tmp/pids tmp/cache tmp/sockets vendor/bundle public/system}

namespace :puma do
  desc 'Create Directories for Puma Pids and Socket'
  task :make_dirs do
    on roles(:app) do
      execute "mkdir #{shared_path}/tmp/sockets -p"
      execute "mkdir #{shared_path}/tmp/pids -p"
    end
  end

  before :start, :make_dirs
end

namespace :deploy do
  desc "Make sure local git is in sync with remote."
  task :check_revision do
    on roles(:app) do
      unless `git rev-parse HEAD` == `git rev-parse origin/master`
        puts "WARNING: HEAD is not the same as origin/master"
        puts "Run `git push` to sync changes."
        exit
      end
    end
  end

  desc 'Initial Deploy'
  task :initial do
    on roles(:app) do
      before 'deploy:restart', 'puma:start'
      invoke 'deploy'
    end
  end

  desc 'Restart application'
  task :restart do
    on roles(:app), in: :sequence, wait: 5 do
      invoke 'puma:restart'
    end
  end

  before :starting,     :check_revision
  after  :finishing,    :compile_assets
  after  :finishing,    :cleanup
  after  :finishing,    :restart
end



# ps aux | grep puma    # Get puma pid
# kill -s SIGUSR2 pid   # Restart puma
# kill -s SIGTERM pid   # Stop puma

namespace :rails do
  desc "Remote console"
  task :console, :roles => :app do
    run_interactively "bundle exec rails console #{rails_env}"
  end

  desc "Remote dbconsole"
  task :dbconsole, :roles => :app do
    run_interactively "bundle exec rails dbconsole #{rails_env}"
  end
end

def run_interactively(command)
  server ||= find_servers_for_task(current_task).first
  exec %Q(ssh #{user}@#{myproductionhost} -t '#{command}')
end