class User
  include DataMapper::Resource
  property :id, Serial
  property :email, Text, :unique => true, :required => true
  property :username, Text, :unique => true, :required => true
  property :display_name, Text, :required => true
  property :passhash, BCryptHash, :required => true
  property :admin,  Boolean, :default => false

  def admin?
    return admin
  end

  def password=(pass)
    @password = pass
    self.passhash = BCrypt::Password.create(@password, :cost => 10)
  end

  def email=(new_email)
    raise ArgumentError, "Invalid email address." unless new_email.match(/^[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,4}$/i)
    super
  end

  def self.authenticate(email, pass)
    user = User.first(:email => email)
    return nil if user.nil?
    return user if BCrypt::Password.new(user.passhash) == pass
  end

end
