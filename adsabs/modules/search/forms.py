'''
Created on Sep 19, 2012

@author: jluker
'''
import re
from flask.ext.wtf import Form #@UnresolvedImport
from wtforms import (TextField, SelectField, IntegerField, BooleanField, #HiddenField, #SubmitField, RadioField, #@UnresolvedImport
                          validators) #@UnresolvedImport
from wtforms.validators import (required, optional, length)
from werkzeug.datastructures import ImmutableMultiDict, MultiDict


__all__ = ["QueryForm", "AdvancedQueryForm"]

class MultiFacetSelectField(SelectField):

    """
    custom field that is able to correctly validate input coming from multi-facet selection.
    e.g., a user selects both "astronomy" and "phyiscs" database in facets; value of db_f
    field would be '("astronomy" AND "physics")'
    """
    def pre_validate(self, form):
        if not len(self.data):
            return
        values = re.split("(?:OR|AND)", self.data)
        values = map(lambda x: x.strip(' "()'), values)
        choices = [x[0] for x in self.choices]
        for v in values:
            if v not in choices:
                raise ValueError("Not a valid choice")
        
class QueryForm(Form):
    
    default_if_missing = MultiDict([('db_f', ''), ])

    @classmethod
    def init_with_defaults(cls, request_values):
        """Function that given a form object and a set of parameters coming from the request
        populate the parameters with the default values of the form if they are not in the request"""
        
        #I convert the ImmutableMultiDict into MultiDict
        request_values = MultiDict(request_values)
        defaults = cls.default_if_missing

        for field in defaults.keys():
            if not request_values.has_key(field):
                for elem in defaults.getlist(field):
                    request_values.add(field, elem)

        params = ImmutableMultiDict(request_values)
        return cls(params, csrf_enabled=False)
        
    """Form for the basic search"""
    q = TextField(u'Query', [required(), length(min=1, max=2048)], description=u"Query the ADS database")

    db_f =  MultiFacetSelectField(u'Database', choices=[('astronomy', 'astronomy'), ('physics', 'physics'), ('general', 'general'), ('', 'all') ], description=u'Database')
    
    month_from = IntegerField(u'Month From', [optional(), validators.NumberRange(min=1, max=12, message='Starting month not valid: allowed values from 01 to 12')])
    month_to = IntegerField(u'Month To', [optional(), validators.NumberRange(min=1, max=12, message='Ending month not valid: allowed values from 01 to 12')])
    year_from = IntegerField(u'Year From', [optional(), validators.NumberRange(min=1, max=2500, message='Starting year not valid')])
    year_to = IntegerField(u'Year To', [optional(), validators.NumberRange(min=1, max=2500, message='Ending year not valid')])
    article = BooleanField(u'Articles', description=u'Articles only')
    nr = SelectField(u'Number to view in page', [optional()], choices=[('', 'default results'), 
                                                        ('20', '20 results'), ('50', '50 results'), ('100', '100 results'), 
                                                        ('200', '200 results')] )
    topn = IntegerField(u'Return top N results', [optional(), validators.NumberRange(min=1, message='TopN must be an integer bigger than 1')])
    no_ft = BooleanField(u'Disable full text', description=u'Disable fulltext')
    
   
class AdvancedQueryForm(QueryForm):
    pass
