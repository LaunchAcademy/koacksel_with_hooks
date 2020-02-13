class Api::V1::MessagesController < Api::ApiController
  def create
    # binding.pry
    @chat = Chat.find(params[:chatId])

    @message = Message.create(body: params[:message], user_id: params[:user][:id], chat: @chat)

    render json: {
      message: @message,
      user: @message.user
    }
  end
end
