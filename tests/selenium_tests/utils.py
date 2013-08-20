import unittest2 as unittest
from selenium import webdriver
from selenium.webdriver.firefox.firefox_binary import FirefoxBinary
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities

from pyvirtualdisplay import Display

from config.test_config import test_config

def case_ins_contains(s):
    """
    lower-case() is only avialable in xslt 2.0, so we need to use this dumb hack
    """
    translate = "translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')"
    return "contains(%s, %s)" % (translate, s)

class TestContext(object):
    
    def open_browser(self):

#         if test_config.SELENIUM_USE_REMOTE:
#             dc = getattr(DesiredCapabilities, self.driver.upper())
#             dc['name'] = test_config.SELENIUM_TEST_NAME
#             cmd_exec = test_config.SELENIUM_REMOTE_CMD_EXEC
#             self.browser = webdriver.Remote(desired_capabilities=dc, command_executor=cmd_exec)

        if test_config.SELENIUM_USE_VIRTUALDISPLAY:
            self.virtualdisplay = Display(backend=test_config.SELENIUM_VIRTUALDISPLAY_BACKEND, size=(600, 800)).start()

        self.browser = webdriver.Firefox(firefox_binary=FirefoxBinary(test_config.SELENIUM_FIREFOX_PATH))
        self.browser.implicitly_wait(test_config.SELENIUM_PAGE_WAIT)
        
    def close(self):
        self.browser.quit()
        if hasattr(self, 'virtualdisplay'):
            self.virtualdisplay.stop()
            
    def get(self, url):
        self.browser.get(url)
        self.url = url

class BaseSeleniumTestCase(unittest.TestCase):
    
    def setUp(self):
        unittest.TestCase.setUp(self)
        self.tc = TestContext()
        self.tc.open_browser()
        
    def tearDown(self):
        self.tc.close()