require 'cgi'

def logged_in?
  session[:u_id] != nil
end

def current_user
  return User.first :id => session[:u_id]
end

def force_login(option={})
  nextpage = CGI.escape(option[:next] || '/account')
  unless logged_in?
    flash[:error] = "You must be logged in to do that."
    redirect "/login?next=#{nextpage}", 303
  end
end

get '/logout' do
  session[:u_id] = nil
  flash[:notice] = "You have been logged out."
  redirect '/login'
end

get '/login' do
  if logged_in?
    flash[:error] = "Already logged in!"
    redirect '/account'
  end

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
  force_login

  haml :account, :locals => { :user => current_user }
end

def create_update_user(user, params)
  blank = (params[:password].nil? && params[:password2].nil) ||
          (params[:password].empty? && params[:password2].empty?)
  same = (params[:password] == params[:password2])

  if !blank
    if same
      user.password = params[:password]
    else
      flash[:warning] = "Passwords did not match. Try again."
      return nil
    end
  end
  user.email = params[:email] unless params[:email].nil?
  user.username = params[:username] unless params[:username].nil?
  user.display_name = params[:display_name] unless params[:display_name].nil?

  error 400 unless user.valid?
  error 422 unless user.save
  return user
end

post '/account' do
  force_login
  flash[:notice] = "Account updated!" unless create_update_user(current_user, params).nil?
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
  u = User.new
  create_update_user(u, params)
  session[:u_id] = u.id
  redirect '/account', 303
end
