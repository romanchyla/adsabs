from .views import buggyme_blueprint as blueprint, is_message_dismissed
from flask import flash, session, g

def setup(app):
    
    # register a context processor that will be called with each request
    # we'll add flash messages to every page (unless the message has 
    # been already seen and dismissed by the user)        
    def new_context_processor():
        
        # this sucks because there is now way (that i know off) how to 
        # dynamically register data/messages; and saving the message
        # into a text file is the same as saving it here. As far as I 
        # can tell, there is no permanent storage available to 
        # blueprints (yes, exactly, this is the argument in the discussion
        # between Django and Flask)
        msg = 'ADS is looking for a new web developer. Help us help you! <a href="http://cfa.harvard.edu">details here</a>'
        cat = 'info'
        if not is_message_dismissed(msg, cat):
            flash(msg, cat)
            
            # I am unable to find *something* that would allow me
            # to simply register includes for the page. And I am
            # already looking for almost one hour...
            # What I'd expect is that there is a way for blueprints
            # to register values that should be send back with 
            # every page; for the moment, I'll leave the code 
            # in the layout.html template
            
            # TODO - call something to insert this block into the 
            # template
            
            #$(document).ready(function() {
            #      $('button.close').click(
            #     function(){
            #        $.get('/buggyme',{msg: $(this).parent().find('span').html(), });
            #     });
            #  });
            
        return {}
    
    app.template_context_processors[None].append(new_context_processor)
