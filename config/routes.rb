Rails.application.routes.draw do
  root 'homes#index'

  # possibly needed for ActionCable
  # mount ActionCable.server => '/cable'

  devise_for :users

  devise_scope :user do
    get "users/sign_out" => "devise/sessions#destroy"
  end

  get "chats/:id" => "homes#index"

  resources :users, only: [:index, :destroy]

  namespace :api do
    namespace :v1 do
      resources :messages, only: [:create]
      get "users/current" => "users#current"
    end
  end 

end
