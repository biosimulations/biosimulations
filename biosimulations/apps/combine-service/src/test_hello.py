from hello import HelloFactory
import unittest


class HelloTest(unittest.TestCase):
    def test_message(self):
        try:
            hello = HelloFactory(user="Human")
            self.assertEqual(hello.user, 'Hello Human')
        except Exception as e:
            print('Error: {}'.format(str(e)))
            self.assertTrue(False)


if __name__ == '__main__':
    unittest.main()
