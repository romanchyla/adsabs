'''
Created on Nov 26, 2012

@author: jluker
'''

import os
import sys
import nose

test_dir = os.path.abspath(os.path.dirname(__file__))
selenium_dir = os.path.join(test_dir, 'selenium_tests')

sys.path = [test_dir, selenium_dir] + sys.path

argv = sys.argv[:] + ['-v']
nose.main(argv=argv)
