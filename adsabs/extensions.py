# -*- coding: utf-8 -*-

from config import config

# For import *
__all__ = ['login_manager', 'mongodb', 'pushrod', 'mail', 'cache']

#from flask.ext.sqlalchemy import SQLAlchemy #@UnresolvedImport
#db = SQLAlchemy()

#from flask.ext.mail import Mail #@UnresolvedImport
#mail = Mail()

#from flask.ext.cache import Cache #@UnresolvedImport
#cache = Cache()



from flask.ext.login import LoginManager #@UnresolvedImport
login_manager = LoginManager()

from flask.ext.mongoalchemy import MongoAlchemy #@UnresolvedImport
mongodb = MongoAlchemy()

from flask.ext.pushrod import Pushrod #@UnresolvedImport
pushrod = Pushrod(default_renderer=config.API_DEFAULT_RESPONSE_FORMAT)

from flask.ext.mail import Mail #@UnresolvedImport
mail = Mail()

from flask.ext.cache import Cache   #@UnresolvedImport
cache = Cache()

from flask.ext.solrquery import FlaskSolrQuery #@UnresolvedImport
solr = FlaskSolrQuery()

from flask.ext.adsdata import FlaskAdsdata #@UnresolvedImport
adsdata = FlaskAdsdata()