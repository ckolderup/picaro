require 'cgi'

def logged_in?
  session[:u_id] != nil
end

def current_user
  return User.first :id => session[:u_id]
end

get '/logout' do
  session[:u_id] = nil
  flash[:notice] = "You have been logged out."
  redirect '/login'
end

get '/login' do
  haml :login
end

post '/login' do
  if user = User.authenticate(params[:email], params[:password])
    session[:u_id] = user.id
    next_page = '/account'
    next_page = CGI.unescape(params[:next]) unless params[:next].nil?
    redirect next_page, 303
  else
    flash[:warning] = "Incorrect email address or password"
    redirect '/login', 303
  end
end

get '/account' do
  unless logged_in?
    flash[:error] = "You must be logged in to do that."
    redirect "/login?next=#{CGI.escape('/account')}"
  end

  @u = current_user
  
  haml :account
end

post '/account' do
  unless logged_in?
    flash[:error] = "You must be logged in to do that."
    redirect "/login?next=#{CGI.escape('/account')}", 303
  end

  @u = current_user

  begin
    @u.email = params[:email] unless params[:email].nil?
    unless params[:password] == params[:password2]
      raise ArgumentError, "Passwords did not match. Try again"
    end

  rescue ArgumentError => e
    flash[:warning] = e.message
    redirect '/account', 303
  end

  error 400 unless @u.valid?
  error 422 unless @u.save

  flash[:notice] = "Account updated!"
  redirect '/account', 303
end

get '/signup' do
  if logged_in?
    flash[:error] = "Already logged in!"

    redirect '/account'
  end

  haml :signup
end

post '/signup' do
  @u = User.new

  begin
    @u.email = params[:email]
    @u.username = params[:username]
    @u.display_name = params[:display_name]
    unless params[:password] == params[:password2]
      raise ArgumentError, "Passwords did not match. Try again."
    end
    @u.password = params[:password]

  rescue ArgumentError => e
    flash[:warning] = e.message
    redirect '/signup', 303
  end

  error 400 unless @u.valid?
  error 422 unless @u.save

  session[:u_id] = @u.id
  redirect '/account', 303
end

get '/confirm' do
  haml :confirm_check, :email => params[:email], :token => params[:token]
end

post '/confirm' do
  error 400 if params[:email].nil? or params[:token].nil?

  @u = User.first(:email => params[:email])

  error 422 if @u.nil? or @u.confirmed?

  if @u.confirm_token == params[:token]
    @u.confirm
    flash[:notice] = "Confirmed!"
  else
    flash[:warning] = "Unable to confirm email address."
  end
  redirect '/', 303
end
