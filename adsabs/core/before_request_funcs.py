'''
Created on Apr 24, 2013

@author: dimilia
'''

import uuid
from flask import request, g, session
from flask.ext.login import current_user #@UnresolvedImport
from config import config

def set_user_cookie_id():
    """
    Sets the user id in the global object if nothing is there 
    before each request
    This function works together with set_user_cookie in the after requests
    """
    #new fresh user
    if not request.cookies.get(config.COOKIE_ADSABS2_NAME):
        if current_user.is_anonymous():
            g.user_cookie_id = unicode(uuid.uuid4())
        else:
            g.user_cookie_id = current_user.get_id()
    #the user has already visited the web site
    else:
        if current_user.is_anonymous():
            g.user_cookie_id = request.cookies.get(config.COOKIE_ADSABS2_NAME)
        else:
            g.user_cookie_id = current_user.get_id()
        

def configure_before_request_funcs(app):
    """
    Function to configure all the "before request" functions 
    I want to attach to the application at the global level.
    """
    @app.before_request
    def conf_set_user_cookie_id():
        return set_user_cookie_id()
    
#     @app.before_request
#     def print_session():
#         print session
#         print request.cookies.get(config.COOKIE_ADSABS2_NAME)