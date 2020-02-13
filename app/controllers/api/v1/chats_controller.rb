class Api::V1::ChatsController < Api::ApiController
  def index
    render json: Chat.all
  end

  def show
    # binding.pry
    @chat = Chat.find(params[:id])
    @user = current_user

    @messages = @chat.messages.map do |message|
      # binding.pry
      data = {
        message: message,
        user: message.user
      }
    end

# binding.pry
    render json: {
      info: @chat,
      messages: @messages,
      user: @user
    }
  end
end
