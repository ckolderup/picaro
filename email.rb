def confirm_email(user)
  send_email(
    :to => user.email,
    :subject => "Please confirm your email address",
    :body => haml(:confirm_email, :user => user)
  ) 
end

def send_email(options)
  return false unless options[:to] && options[:subject] && options[:body]
  Pony.mail :to => options[:to],
            :from => "no-reply@#{ENV['EMAIL_DOMAIN']}", 
            :subject => options[:subject],
            :body => options[:body],
            :via => :smtp,
            :via_options => {
              :address => 'smtp.gmail.com',
              :port => 587,
              :enable_starttls_auto => true,
              :user_name => ENV['EMAIL_USER'],
              :password => ENV['EMAIL_PASS'],
              :authentication => :plain,
              :domain => ENV['EMAIL_DOMAIN']
            }
  return true
end
  
