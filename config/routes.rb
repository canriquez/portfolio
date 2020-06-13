Rails.application.routes.draw do
root to: "welcome#index"

get "welcome/download_resume"

resources :welcome, only: [:index]
resources :contact, only: [:create]


end
