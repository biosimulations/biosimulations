import os
import pkgutil
import inspect
import unittest

# Add *all* subdirectories to this module's path
__path__ = [os.path.dirname(__file__)]


def load_tests(loader, suite, pattern):
    for imp, module_name, _ in pkgutil.walk_packages(__path__):
        if module_name.startswith('test'):
            module = imp.find_module(module_name).load_module(module_name)
            for _, member in inspect.getmembers(module):
                if inspect.isclass(member):
                    if issubclass(member, unittest.TestCase):
                        for test in loader.loadTestsFromTestCase(member):
                            suite.addTest(test)
    return suite
