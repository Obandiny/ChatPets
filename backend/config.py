import os

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "secret-dev")
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:SQL#pass2000@localhost/sys'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "jwr-secret")